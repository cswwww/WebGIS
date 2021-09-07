import * as Cesium from 'cesium/Cesium'

/**绘制几何图形的工具类 */
export default class DrawGraphicUtils {
    //_pointsArr
    // * @param {点数组} _pointsArr

    /**
     * 构造函数-经纬度坐标传值
     * @param {三维视图实例} _viewer
     */
    constructor(_viewer) {
        //三维视图实例
        this.viewer = _viewer
            //以经纬度对象形式记录当前几何对象的顶点坐标
        this.lonlatCollection = []
            //以entity实体形式记录点线面要素
        this.vertexCollection = [] //顶点集合
        this.lineCollection = [] //线集合
        this.graphicsCollection = [] //多边形集合
        this.entityCollection = [] //所有实体集合
            //viewer事件处理句柄
            //获取viewer事件处理句柄
        this.handlerDrawRectangle = new Cesium.ScreenSpaceEventHandler(
                this.viewer.scene.canvas //画布实例
            )
            //注册鼠标左键点击事件
        this.handlerDrawPolygon = new Cesium.ScreenSpaceEventHandler(
            this.viewer.scene.canvas
        )
    }

    /**
     * 根据经纬度坐标绘制单个点
     * @param {经度} _lon
     * @param {纬度} _lat
     */
    addPoint(_lon, _lat) {
        let addedEntity = this.viewer.entities.add(
                new Cesium.Entity({
                    position: Cesium.Cartesian3.fromDegrees(
                        _lon, //经度
                        _lat, //纬度
                        0.0 //height:default value
                    ),
                    point: {
                        color: Cesium.Color.RED, //颜色
                        pixelSize: 15, //尺寸
                        show: true, //是否显示
                    },
                })
            )
            //记录被添加的实体
        this.vertexCollection.push(addedEntity)
        this.entityCollection.push(addedEntity)
    }

    /**
     * 根据起始点和终止点绘制线
     * @param {起始点} _pStart
     * @param {终止点} _pEnd
     */
    addLine(_pStart, _pEnd) {
        let addedLineEntity = this.viewer.entities.add(
            new Cesium.Entity({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        _pStart.lon,
                        _pStart.lat,
                        _pEnd.lon,
                        _pEnd.lat,
                    ]),
                    width: 10,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.2,
                        taperPower: 0.5,
                        color: Cesium.Color.CORNFLOWERBLUE,
                    }),
                },
            })
        )
        this.lineCollection.push(addedLineEntity)
        this.entityCollection.push(addedLineEntity)
    }

    /**
     * 根据左下角和右上角的经纬度值绘制矩形
     * @param {左下角经度值} lon1
     * @param {左下角纬度值} lat1
     * @param {右上角经度值} lon2
     * @param {右上角纬度值} lat2
     */
    addRectangle(lon1, lat1, lon2, lat2) {
        let addedRectangle = this.viewer.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(
                        //左下角
                        // 113.18513248747503,
                        // 35.23710870358767,
                        lon1,
                        lat1,
                        //右上角
                        // 113.21458359156097,
                        // 35.255420655816245
                        lon2,
                        lat2
                    ),
                    //outline: true,
                    //outlineColor: Cesium.Color.RED.withAlpha(0.5),
                    //outlineWidth: 4,
                    // stRotation: Cesium.Math.toRadians(45),
                    material: Cesium.Color.RED.withAlpha(0.5),
                },
            })
            //记录当前添加的矩形实体
        this.graphicsCollection.push(addedRectangle)
        this.entityCollection.push(addedRectangle)
        return addedRectangle //返回被添加的实体
    }

    /**
     * 根据顶点坐标绘制多边形
     * @param {顶点坐标} _vertexArr
     */
    addPolygon(_vertexArr) {
        let addedPolygonEntity = this.viewer.entities.add(
            new Cesium.Entity({
                polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(
                        _vertexArr
                        //     [
                        //   -115.0,
                        //   37.0,
                        //   -115.0,
                        //   32.0,
                        //   -107.0,
                        //   33.0,
                        //   -102.0,
                        //   35.0,
                        // ]
                    ),
                    material: Cesium.Color.RED.withAlpha(0.5),
                },
            })
        )
        this.graphicsCollection.push(addedPolygonEntity)
        this.entityCollection.push(addedPolygonEntity)
    }

    /**
     * Cartesian2-屏幕坐标转换为经纬度值
     * @param {Cartesian2坐标值} _cartesian2
     * @detail [1]屏幕坐标转换为世界坐标-->[2]世界坐标转换为经纬度
     */
    cartesian2ToLonLat(_cartesian2) {
        //屏幕坐标转换为世界坐标
        let cartesian3 = this.viewer.scene.globe.pick(
            this.viewer.camera.getPickRay(_cartesian2),
            this.viewer.scene
        )
        let ellipsoid = this.viewer.scene.globe.ellipsoid
            //世界坐标转换为经纬度
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3)
        var latitude = Cesium.Math.toDegrees(cartographic.latitude)
        var longitude = Cesium.Math.toDegrees(cartographic.longitude)
            // var height = cartographic.height;
        return {
            lon: longitude,
            lat: latitude,
        }
    }

    /**
     * 根据左上角和右下角顶点计算——左下角&&右上角坐标点位置
     * 实质：计算最大最小的经纬度坐标值
     * @param {顶点1-经纬度坐标} pL1
     * @param {顶点2-经纬度坐标} pL2
     */
    rectangleParamsByBTPoint(pL1, pL2) {
        //获取最大经度值&&最大纬度值
        let maxLonVal = pL1.lon > pL2.lon ? pL1.lon : pL2.lon,
            maxLatVal = pL1.lat > pL2.lat ? pL1.lat : pL2.lat
            //获取最小经度值&&最小纬度值
        let minLonVal = pL1.lon < pL2.lon ? pL1.lon : pL2.lon,
            minLatVal = pL1.lat < pL2.lat ? pL1.lat : pL2.lat
        return {
            pL1: { lon: minLonVal, lat: minLatVal },
            pL2: { lon: maxLonVal, lat: maxLatVal },
        }
    }

    /**
     * 清除顶点（Point点实体）
     */
    destoryVertexCollection() {
        //清除顶点
        let len = this.vertexCollection.length - 1
        console.log(len)
        while (len >= 0) {
            console.log(this.vertexCollection[len])
            this.viewer.entities.remove(this.vertexCollection[len--])
        }
        this.vertexCollection = [].concat()
    }

    /**
     * 清除线实体集合
     */
    destoryLineCollection() {
        //清除线实体
        let len = this.lineCollection.length - 1
        while (len >= 0) {
            this.viewer.entities.remove(this.lineCollection[len--])
        }
        //置空集合
        this.lineCollection = [].concat()
    }

    /**
     * 清除图形实体（多边形）
     */
    destoryGraphicCollection() {
        //清除多边形实体
        let len = this.graphicsCollection.length - 1
        while (len >= 0) {
            this.viewer.entities.remove(this.graphicsCollection[len--])
        }
        //置空集合
        this.graphicsCollection = [].concat()
    }

    /**
     * 清除所有的实体
     */
    destoryEntityCollection() {
        let len = this.entityCollection.length - 1
        while (len >= 0) {
            this.viewer.entities.remove(this.entityCollection[len--])
        }
        //置空集合
        this.entityCollection = [].concat()
    }

    /**
     * 清除经纬度记录
     */
    destoryLonLatCollection() {
        this.lonlatCollection = [].concat()
    }

    /**
     * 结束Geometry绘制
     */
    destory() {
        this.destoryEntityCollection() //置空实体集合
        this.destoryVertexCollection() //清除点集合
        this.destoryLineCollection() //清除线集合
        this.destoryGraphicCollection() //清除面集合
        this.destoryLonLatCollection() //清除经纬度记录
    }

    /**
     * 获取顶点集合
     */
    getVertexCollection() {
        return this.vertexCollection
    }

    /**
     * 获取线实体集合
     */
    getLineCollection() {
        return this.lineCollection
    }

    /**
     * 获取多边形实体集合
     */
    getGraphicCollection() {
            return this.graphicsCollection
        }
        /**
         * 获取经纬度坐标集合
         */
    getLonlatCollection() {
        return this.lonlatCollection
    }

    /**
     * 清除事件处理句柄
     */
    destoryHandler() {
        //注销-鼠标左键&鼠标右键点击绘制多边形事件
        this.handlerDrawPolygon.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            ) //移除鼠标左键事件
        this.handlerDrawPolygon.removeInputAction(
                Cesium.ScreenSpaceEventType.RIGHT_CLICK
            ) //移除鼠标右键事件
            //注销-鼠标左键点击绘制矩形事件
        this.handlerDrawRectangle.removeInputAction(
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            )
            //清除经纬度记录
        this.lonlatCollection = [].concat()
    }

    /**
     * 绘制多边形（n边形，n>=3）
     */
    drawPolygon() {
        //记录当前this
        let $this = this
            //记录经纬度坐标的数组
        let lonlatArrs = []
            //用于绘制多边形的经纬度数组
        let polygonVertexArr = []
            //添加视图点击事件
        this.handlerDrawPolygon.setInputAction(function(click) {
            console.log('鼠标左键点击')
                //记录鼠标点击位置
            let position = click.position
            let lonlat = $this.cartesian2ToLonLat(position)
            $this.lonlatCollection.push(lonlat)
                //记录经纬度坐标值
            lonlatArrs.push(lonlat)
            polygonVertexArr.push(lonlat.lon)
            polygonVertexArr.push(lonlat.lat)
                //添加点
            $this.addPoint(lonlat.lon, lonlat.lat)
                // console.log($this.vertexCollection.length)
                //判断当前点的个数
            if ($this.vertexCollection.length == 2) {
                //如果点的个数为2，就绘制线
                $this.addLine(
                    lonlatArrs[lonlatArrs.length - 2],
                    lonlatArrs[lonlatArrs.length - 1]
                )
            }
            if ($this.vertexCollection.length >= 3) {
                //如果点的个数大于等于3
                //先移除已经存在的线实体
                $this.viewer.entities.remove(
                    $this.lineCollection[$this.lineCollection.length - 1]
                )
                $this.viewer.entities.remove(
                        $this.graphicsCollection[$this.graphicsCollection.length - 1]
                    )
                    //再重新绘制面实体
                $this.addPolygon(polygonVertexArr)
            }
            //鼠标右键监听事件，点击鼠标右键，（通过事件句柄注销鼠标左键点击事件）停止多边形绘图
            $this.handlerDrawPolygon.setInputAction(function(clickRightt) {
                // 通过事件句柄注销鼠标左键点击事件，停止多边形绘制
                $this.handlerDrawPolygon.removeInputAction(
                        Cesium.ScreenSpaceEventType.LEFT_CLICK
                    ) //移除鼠标左键事件
                $this.handlerDrawPolygon.removeInputAction(
                        Cesium.ScreenSpaceEventType.RIGHT_CLICK
                    ) //移除鼠标右键事件
                console.log($this.entityCollection)
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 绘制矩形
     */
    drawRectangle() {
        //获取this引用
        let $this = this
            //用于记录经纬度坐标值的数组
        let lonlatInsArrs = []

        //注册鼠标左键点击事件
        this.handlerDrawRectangle.setInputAction(function(click) {
            console.log(click)
                //获取屏幕坐标
            let position = click.position
                //屏幕坐标转经纬度
            let lonlatInstance = $this.cartesian2ToLonLat(position)
            $this.lonlatCollection.push(lonlatInstance)
                //记录经纬度坐标值
            lonlatInsArrs.push(lonlatInstance)
                //判断当前点的个数（如果小于等于2，就添加点）
            if ($this.vertexCollection.length < 2) {
                //添加点
                $this.addPoint(lonlatInstance.lon, lonlatInstance.lat)
            }
            //如果顶点集合长度为2
            if ($this.vertexCollection.length == 2) {
                //注销鼠标左键点击事件，停止绘制
                console.log($this.vertexCollection)
                console.log('注销鼠标左键点击事件，停止绘制')
                $this.handlerDrawRectangle.removeInputAction(
                        Cesium.ScreenSpaceEventType.LEFT_CLICK
                    )
                    //根据坐标点计算左下角和右上角坐标
                let resParams = $this.rectangleParamsByBTPoint(
                    lonlatInsArrs[0],
                    lonlatInsArrs[1]
                )
                console.log(resParams)
                    /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    pL1:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        lat: 35.23710870358767
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        lon: 113.18513248747503
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    pL2:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        lat: 35.255420655816245
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        lon: 113.21458359156097
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
                    //绘制矩形
                $this.addRectangle(
                    resParams.pL1.lon,
                    resParams.pL1.lat,
                    resParams.pL2.lon,
                    resParams.pL2.lat
                )
            }
            console.log('当前顶点个数' + $this.vertexCollection.length)
            console.log($this.vertexCollection)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 通过指定范围绘制矩形
     * @param {最北纬度} northLat
     * @param {最东经度} eastLon
     * @param {最南纬度} southLat
     * @param {最西经度} westLon
     */
    drawRectangleByBounds(northLat, eastLon, southLat, westLon) {
        let addedRectangle = this.addRectangle(westLon, southLat, eastLon, northLat)
            //将视图切换到当前实体
        this.viewer.zoomTo(addedRectangle)
    }
}