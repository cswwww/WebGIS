import * as Cesium from 'cesium/Cesium';
import { unByKey as olObservableUnByKey } from 'ol/Observable.js';
import { getTransform } from 'ol/proj.js';

class olcs {
    constructor(scene, map) {
        this.scene_ = scene;
        this.map_ = map;
        this.cam_ = scene.camera;
        this.view_ = null;
        this.viewListenKey_ = null;
        this.toLonLat_ = olcs.identityProjection;
        this.fromLonLat_ = olcs.identityProjection;
        this.tilt_ = 0;
        this.distance_ = 0;
        this.lastCameraViewMatrix_ = null;
        this.viewUpdateInProgress_ = false;
        this.map_.on('change:view', e => {
            this.setView_(this.map_.getView());
        })
        this.setView_(this.map_.getView());
        this.renderId_ = undefined;
        this.targetFrameRate_ = Number.POSITIVE_INFINITY;
        this.lastFrameTime_ = 0;
        this.time_ = function () {
            return Cesium.JulianDate.now();
        };
    }

    static identityProjection(input, opt_output, opt_dimension) {
        const dim = opt_dimension || input.length;
        if (opt_output) {
            for (let i = 0; i < dim; ++i) {
                opt_output[i] = input[i];
            }
        }
        return input;
    }

    setView_(view) {
        if (this.view_) {
            olObservableUnByKey(this.viewListenKey_);
            this.viewListenKey_ = null;
        }

        this.view_ = view;
        if (view) {
            const toLonLat = getTransform(view.getProjection(), 'EPSG:4326');
            const fromLonLat = getTransform('EPSG:4326', view.getProjection());
            console.assert(toLonLat && fromLonLat);

            this.toLonLat_ = toLonLat;
            this.fromLonLat_ = fromLonLat;

            this.viewListenKey_ = view.on('propertychange', e => this.handleViewEvent_(e));

            this.readFromView();
        } else {
            this.toLonLat_ = olcs.identityProjection;
            this.fromLonLat_ = olcs.identityProjection;
        }
    }

    handleViewEvent_(e) {
        if (!this.viewUpdateInProgress_) {
            this.readFromView();
        }
    }

    readFromView() {
        if (!this.view_ || !this.toLonLat_) {
            return;
        }
        const center = this.view_.getCenter();
        if (center === undefined || center === null) {
            return;
        }
        const ll = this.toLonLat_(center);
        console.assert(ll);

        const resolution = this.view_.getResolution();
        this.distance_ = this.calcDistanceForResolution(
            resolution || 0, this.toRadians(ll[1]));

        this.updateCamera_();
        this.render_();
    }

    updateCamera_() {
        if (!this.view_ || !this.toLonLat_) {
            return;
        }
        const center = this.view_.getCenter();
        if (!center) {
            return;
        }
        const ll = this.toLonLat_(center);
        console.assert(ll);

        const carto = new Cesium.Cartographic(this.toRadians(ll[0]),
            this.toRadians(ll[1]));
        if (this.scene_.globe) {
            const height = this.scene_.globe.getHeight(carto);//获取制图的高度，如果找不到则未定义。
            carto.height = height || 0;//只要height不是0，就将height结果返回
        }
        const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

        /** @type {Cesium.optionsOrientation} */
        const orientation = {
            pitch: this.tilt_ - Cesium.Math.PI_OVER_TWO,
            heading: -this.view_.getRotation(),
            roll: undefined
        };
        this.cam_.setView({
            destination,
            orientation
        });

        this.cam_.moveBackward(this.distance_);

        this.checkCameraChange(true);
    }

    checkCameraChange(opt_dontSync) {
        const old = this.lastCameraViewMatrix_;
        const current = this.cam_.viewMatrix;

        if (!old || !Cesium.Matrix4.equalsEpsilon(old, current, 1e-5)) {
            this.lastCameraViewMatrix_ = current.clone();
            if (opt_dontSync !== true) {
                this.updateView();
            }
        }
    }

    updateView() {
        if (!this.view_ || !this.fromLonLat_) {
            return;
        }
        this.viewUpdateInProgress_ = true;

        // target & distance
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const scene = this.scene_;
        const target = this.pickCenterPoint(scene);

        let bestTarget = target;
        if (!bestTarget) {
            //TODO: how to handle this properly ?
            const globe = scene.globe;
            const carto = this.cam_.positionCartographic.clone();//获取相机的 Cartographic 位置（经度和纬度）以弧度表示，高度以米表示
            const height = globe.getHeight(carto);//获取给定制图上的表面高度
            carto.height = height || 0;//讲高度设置给相机
            bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
        }
        this.distance_ = Cesium.Cartesian3.distance(bestTarget, this.cam_.position);
        const bestTargetCartographic = ellipsoid.cartesianToCartographic(bestTarget);
        this.view_.setCenter(this.fromLonLat_([
            this.toDegrees(bestTargetCartographic.longitude),
            this.toDegrees(bestTargetCartographic.latitude)]));

        // resolution
        this.view_.setResolution(
            this.calcResolutionForDistance(this.distance_,
                bestTargetCartographic ? bestTargetCartographic.latitude : 0));


        /*
         * Since we are positioning the target, the values of heading and tilt
         * need to be calculated _at the target_.
         */
        if (target) {
            const pos = this.cam_.position;

            // normal to the ellipsoid at the target
            const targetNormal = new Cesium.Cartesian3();
            ellipsoid.geocentricSurfaceNormal(target, targetNormal);

            // vector from the target to the camera
            const targetToCamera = new Cesium.Cartesian3();
            Cesium.Cartesian3.subtract(pos, target, targetToCamera);
            Cesium.Cartesian3.normalize(targetToCamera, targetToCamera);


            // HEADING
            const up = this.cam_.up;
            const right = this.cam_.right;
            const normal = new Cesium.Cartesian3(-target.y, target.x, 0); // what is it?
            const heading = Cesium.Cartesian3.angleBetween(right, normal);
            const cross = Cesium.Cartesian3.cross(target, up, new Cesium.Cartesian3());
            const orientation = cross.z;

            this.view_.setRotation((orientation < 0 ? heading : -heading));

            // TILT
            const tiltAngle = Math.acos(
                Cesium.Cartesian3.dot(targetNormal, targetToCamera));
            this.tilt_ = isNaN(tiltAngle) ? 0 : tiltAngle;
        } else {
            // fallback when there is no target
            this.view_.setRotation(this.cam_.heading);
            this.tilt_ = -this.cam_.pitch + Math.PI / 2;
        }

        this.viewUpdateInProgress_ = false;
    }

    render_() {
        // if a call to `requestAnimationFrame` is pending, cancel it
        if (this.renderId_ !== undefined) {
            cancelAnimationFrame(this.renderId_);
            this.renderId_ = undefined;
        }

        // only render if Cesium is enabled/warming and rendering hasn't been blocked
        if (true) {
            this.renderId_ = requestAnimationFrame(this.onAnimationFrame_.bind(this));
        }
    }

    onAnimationFrame_(frameTime) {
        this.renderId_ = undefined;

        // check if a frame was rendered within the target frame rate
        const interval = 1000.0 / this.targetFrameRate_;
        const delta = frameTime - this.lastFrameTime_;
        if (delta < interval) {
            // too soon, don't render yet
            this.render_();
            return;
        }

        // time to render a frame, save the time
        this.lastFrameTime_ = frameTime;

        const julianDate = this.time_();
        this.scene_.initializeFrame();

        // this.scene_.render(julianDate);
        this.checkCameraChange();

        // request the next render call after this one completes to ensure the browser doesn't get backed up
        this.render_();
    }

    pickCenterPoint(scene) {
        const canvas = scene.canvas;
        const center = new Cesium.Cartesian2(
            canvas.clientWidth / 2,
            canvas.clientHeight / 2);
        return this.pickOnTerrainOrEllipsoid(scene, center);
    }

    pickOnTerrainOrEllipsoid(scene, pixel) {
        const ray = scene.camera.getPickRay(pixel);
        const target = scene.globe.pick(ray, scene);
        return target || scene.camera.pickEllipsoid(pixel);
    }

    calcResolutionForDistance(distance, latitude) {
        // See the reverse calculation (calcDistanceForResolution) for details
        const canvas = this.scene_.canvas;
        const fovy = this.cam_.frustum.fovy;
        const metersPerUnit = this.view_.getProjection().getMetersPerUnit();

        const visibleMeters = 2 * distance * Math.tan(fovy / 2);
        const relativeCircumference = Math.cos(Math.abs(latitude));
        const visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
        const resolution = visibleMapUnits / canvas.clientHeight;

        return resolution;
    }

    calcDistanceForResolution(resolution, latitude) {
        const canvas = this.scene_.canvas;
        const fovy = this.cam_.frustum.fovy; // vertical field of view
        console.assert(!isNaN(fovy));
        const metersPerUnit = this.view_.getProjection().getMetersPerUnit();

        const visibleMapUnits = resolution * canvas.clientHeight;

        const relativeCircumference = Math.cos(Math.abs(latitude));

        const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

        const requiredDistance = (visibleMeters / 2) / Math.tan(fovy / 2);

        return requiredDistance;
    }

    toDegrees(angleInRadians) {
        return angleInRadians * 180 / Math.PI;
    }

    toRadians(angleInDegrees) {
        return angleInDegrees * Math.PI / 180;
    }
}

export default olcs;