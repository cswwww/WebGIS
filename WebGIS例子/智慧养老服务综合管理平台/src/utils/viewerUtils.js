// import * as Cesium from 'cesium/Build/Cesium/Cesium'

import * as Cesium from 'cesium/Cesium'
import * as SERVICE from '../utils/service/serviceUtils'
import { Notification } from 'element-ui' //导入Element-UI：Notification 通知组件
import Store from '../store/index'
import * as MapUtils from './utils/mapUtils.js'
import websocket from '../utils/utils/webSocket'
import DrawHeatMap from '../utils/heatmap/drawHeatMap'
import axios from 'axios'
import kriging from '../utils/kriging/kriging'

/*******************全局静态变量**************************/
export const staticParams = {
        viewer: undefined,
        buildingsCollection: [], //存储建筑群体图层
        poiEntittCollection: [], //存储所有的信息点实体
        warnPOICollection: [], //存储所有的报警点实体
        hospitalCollection: [], //医院点
        servicePointCollection: [], //家政服务中心点
        // serviceCenterCollection: {
        //     hospitalCollection: [], //医院点
        //     servicePointCollection: [], //家政服务中心点
        // }, //存储所有的服务中心点实体
        dataSourcePromise: undefined, //记录矢量行政区域数据源
        weatherInstance: {
            //天气实例
            rain: undefined, //雨
            snow: undefined, //雪
            fog: undefined, //雾
            night: undefined, //黑夜
        },
        temporaryLayers: {
            //临时图层
            markerColls: [], //临时标注
            jsonColls: [], //临时json（矢量）图层
        },
        tdAnalysisLayers: {
            //3D分析图层
            heatMapColls: [], //热力图图层
            krigingColls: [], //克里金插值结果图层
        },
    }
    /*******************全局静态变量**************************/

/********************重置状态值**************************/
Store.dispatch('setIsShowHoverOverAsync', false) //隐藏Hoverover组件
Store.dispatch('setIsShowPopUpOverAsync', false) //隐藏PopupOver组件
    /********************重置状态值**************************/

websocket.onopen()
console.log(kriging)
    /********************测试代码*************************/
SERVICE.getWarnInfoForHeatMapByDomainName('中站区').then((res) => {
        console.log(res)
    })
    // SERVICE.getHospitalPOILists().then((res) => {
    //         console.log(res)
    //     })
    //  lng=113.18099&lat=35.2248
    //lng=113.18099&lat=35.2248&distance=2000
    /********************测试代码*************************/

/**
 * 初始化三维视图
 * @param {Viewer对应的容器} _viewerId
 */
export function initViewer(_viewerId) {
    Cesium.Ion.defaultAccessToken =
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2VlZjI5MC0xMDZhLTRhMGQtOGM3NS0yZTczYWYxNzk0N2UiLCJpZCI6NTIzNzQsImlhdCI6MTYxODU2NTAwMn0.hSaADqKUhy3azmrauo9-9OHEEhg2Cplm4x8aFzEpO4Q'
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2VlZjI5MC0xMDZhLTRhMGQtOGM3NS0yZTczYWYxNzk0N2UiLCJpZCI6NTIzNzQsImlhdCI6MTYxODU2NTAwMn0.hSaADqKUhy3azmrauo9-9OHEEhg2Cplm4x8aFzEpO4Q'
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyODYxNzdlNy03ZGEwLTQxMjYtODM2Yi02NDM3NDAyYjI2YjEiLCJpZCI6NTIzNzQsImlhdCI6MTYxODU2NDE4MH0.c4FfJpXlMGnFWU6w3TFPnb29Pvbf6yp9yGMZF4Rqwzw'
    staticParams.viewer = new Cesium.Viewer(_viewerId, {
            // imageryProvider: staticParams.layers[0],
            // imageryProvider: new Cesium.SingleTileImageryProvider({
            //     // url: "./Assets/img/base/world.jpg"
            //     url: "./Assets/img/base/darkWorld.jpg"
            // }),
            // imageryProvider: Cesium.createOpenStreetMapImageryProvider({
            //     url: '//a.tile.openstreetmap.org/'
            // }),

            animation: false, //是否创建动画小器件，左下角仪表
            baseLayerPicker: false, //是否显示图层选择器
            fullscreenButton: false, //是否显示全屏按钮
            geocoder: false, //是否显示geocoder小器件，右上角查询按钮
            homeButton: false, //是否显示Home按钮
            infoBox: false, //是否显示信息框
            sceneModePicker: false, //是否显示3D/2D选择器
            selectionIndicator: false, //是否显示选取指示器组件
            timeline: false, //是否显示时间轴
            navigationHelpButton: false, //是否显示右上角的帮助按钮
            scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            //加载天地图卫星底图
            imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=825fe12904c410012af61f3da2784af1',
                layer: 'img',
                style: 'default',
                tileMatrixSetID: 'w',
                format: 'tiles',
                maximumLevel: 18,
            }),
            //创建三维地形
            terrainProvider: Cesium.createWorldTerrain(),
            //基于太阳位置开启地形照明
            requestVertexNormals: true,
            //启用水体效果
            requestWaterMask: true,
        })
        //加载焦作市矢量底图
    loadDataSource(
        staticParams.viewer,
        require('../../static/json/jiaozuoshi.json')
    )
    staticParams.viewer.scene.debugShowFramesPerSecond = true
        //去除底部的商标（版权）信息
    staticParams.viewer.cesiumWidget.creditContainer.style.display = 'none'
        //不显示主页按钮
        //飞到目标区域
    staticParams.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                113.2609138954192,
                35.190953503678095,
                8000.0
            ),
            //设置相机朝向：俯仰角、倾角
            orientation: {
                heading: Cesium.Math.toRadians(350),
                pitch: Cesium.Math.toRadians(-50),
                roll: 0.0,
            },
        })
        //     //初始化用户信息点
    initClientUserInfo(staticParams.viewer)
        //初始化报警点
    initWarnPointInfo(staticParams.viewer)
        //初始化服务中心点
    initServiceCenters(staticParams.viewer)
        // monitorCameraPos(staticParams.viewer)
        //为信息点添加鼠标悬停事件
    addMouseHoverFireForEntityPOI(staticParams.viewer)
        //添加滚轮监听事件
    addMouseWheelFireForViewer(staticParams.viewer)
        //为信息点添加点击事件
    addMouseClickFireForEntityPOI(staticParams.viewer)
        //     //设置Cesium ion token

    // loadBuildings(staticParams.viewer) //加载建筑群
    //     // staticParams.weatherInstance.snow.enabled = true //控制是否执行雨雪效果
    //     // staticParams.viewer.shadows = true //开启日照阴影
    initWeatherEffect(staticParams.viewer, true)
        //加载geoserver服务
        // loadGeoServerServe(staticParams.viewer, '')
        // init3dTilesBuildingsSet(staticParams.viewer, '')
}

/**
 * 加载建筑群3dTiles服务
 * @param {三维视图实例} _viewer
 * @param {建筑群IIS服务地址} _serveUrl
 */
export function init3dTilesBuildingsSet(_viewer, _serveUrl) {
    // 高度设为10米
    function changeHeight(tileset, height) {
        height = Number(height)
        if (isNaN(height)) {
            return
        }
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        )
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        )
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            height
        )
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        )
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
    }

    //添加3dTIles图层???贴地显示
    let builds = new Cesium.Cesium3DTileset({
            url: 'http://192.168.124.70:8016/tileset.json',
            // url: 'http://192.168.124.70:8012/tileset.json',
            //变换矩阵[4*4]
            // modelMatrix: Cesium.Matrix4.fromArray([
            //     1,
            //     0,
            //     0,
            //     0,
            //     0,
            //     1,
            //     0,
            //     0,
            //     0,
            //     0,
            //     1,
            //     0,
            //     0,
            //     0,
            //     0,
            //     1,
            // ]),
            show: true, //默认不显示建筑群
            // classificationType: Cesium.ClassificationType.TERRAIN, //贴地显示
        })
        //记录当前3dTils建筑群到全局变量中去
    staticParams.buildingsCollection.push(builds)
        //以primitive形式添加建筑群
    var tileset = _viewer.scene.primitives.add(builds)
        //修改贴地高度

    var heightOffset = -64
    tileset.readyPromise.then(function(tileset) {
            // Position tileset
            var boundingSphere = tileset.boundingSphere
            var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center)
            var surface = Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                0.0
            )
            var offset = Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                heightOffset
            )
            var translation = Cesium.Cartesian3.subtract(
                offset,
                surface,
                new Cesium.Cartesian3()
            )
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        })
        // changeHeight(tileset, -800)
        //切换到建筑群的位置
    _viewer.flyTo(tileset)
        // tileset.readyPromise
        //     .then(function(tileset) {
        //         _viewer.scene.primitives.add(tileset)
        //         _viewer.zoomTo(
        //             tileset,
        //             new Cesium.HeadingPitchRange(
        //                 0.5, -0.2,
        //                 tileset.boundingSphere.radius * 1.0
        //             )
        //         )
        //         changeHeight(tileset, -10) //修改高度
        //         console.log(tileset)
        //             //创建平移矩阵方法二
        //             // var translation=Cesium.Cartesian3.fromArray([0, 0, -2000]);
        //             // m= Cesium.Matrix4.fromTranslation(translation);
        //             //
        //             // //生效
        //             // tileset._modelMatrix = m;
        //     })
        //     .otherwise(function(error) {
        //         console.log(error)
        //     })
        //以primitive形式加载3DTiles建筑群

    //控制3dTiles贴地显示

    // let height = Number(0)
    // if (isNaN(height)) {
    //     return
    // }

    // var cartographic = Cesium.Cartographic.fromCartesian(
    //     tileset.boundingSphere.center
    // )
    // var surface = Cesium.Cartesian3.fromRadians(
    //     cartographic.longitude,
    //     cartographic.latitude,
    //     cartographic.height
    // )
    // var offset = Cesium.Cartesian3.fromRadians(
    //     cartographic.longitude,
    //     cartographic.latitude,
    //     height
    // )
    // var translation = Cesium.Cartesian3.subtract(
    //     offset,
    //     surface,
    //     new Cesium.Cartesian3()
    // )
    // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
}

/**
 * 控制3dTiles建筑群的显隐
 * @param {显隐true/false} _value
 */
export function show3dTilesBuildingsLayers(_value) {
    let len = staticParams.buildingsCollection.length - 1
    while (len >= 0) {
        console.log(staticParams.buildingsCollection[len])
        staticParams.buildingsCollection[len]._show = _value
        len--
    }
}

/**
 * 加载GeoServer服务
 * @param {三维视图实例} viewer
 * @param {GeoServer服务访问路径} serveUrl
 */
export function loadGeoServerServe(viewer, serveUrl) {
    axios
        .get(
            'http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test:jiaozuo&maxFeatures=50&outputFormat=application%2Fjson'
        )
        .then((res) => {
            console.log(res)
            let data = res.data
                //加载数据源
            let promise = Cesium.GeoJsonDataSource.load(
                data,
                /*'http://localhost:8088/springboot-bysj/temp.json'*/
                {
                    // 可选项：设置样式
                    stroke: Cesium.Color.HOTPINK,
                    fill: Cesium.Color.RED.withAlpha(0.5),
                    strokeWidth: 3,
                    markerSymbol: '?',
                }
            )
            viewer.dataSources.add(promise)
            viewer.zoomTo(promise)
        })
        .catch((err) => {
            console.log(err)
        })
}

/**
 * 绘制热力图的方法
 * @param {热力图画布实例} _canvas
 * @param {县区名称} _domain
 * @param {绘制模式：1-忽略_domain参数；非1：使用_domain参数} _mode
 */
export function drawHeatMapInViewer(_canvas, _domain, _mode = 1) {
    //请求热力图边界数据
    if (_mode == 1) {
        //获取全焦作市插值边界数据
        SERVICE.getJiaoZuoBoundsJsonArray().then((res) => {
                let data = res.data
                let entity = staticParams.viewer.entities.add(
                        new Cesium.Entity({
                            name: 'heatmap',
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArray(data),
                                material: new Cesium.ImageMaterialProperty({
                                    image: _canvas,
                                    transparent: true,
                                }),
                                classificationType: Cesium.ClassificationType.TERRAIN, //控制贴地显示
                            },
                        })
                    )
                    //记录被添加的实体
                staticParams.tdAnalysisLayers.heatMapColls.push(entity)
                staticParams.viewer.zoomTo(entity)
            })
            // SERVICE.getHeatMapJsonFileContent().then((res) => {
            //     // console.log(res)
            //     let data = res.data

        // })
    } else {
        //获取焦作市某一个区县插值边界数据
        SERVICE.getCityBoundsJsonArray(_domain).then((res) => {
                let data = res.data
                let entity = staticParams.viewer.entities.add(
                        new Cesium.Entity({
                            name: 'heatmap',
                            polygon: {
                                hierarchy: Cesium.Cartesian3.fromDegreesArray(data),
                                material: new Cesium.ImageMaterialProperty({
                                    image: _canvas,
                                    transparent: true,
                                }),
                                classificationType: Cesium.ClassificationType.TERRAIN, //控制贴地显示
                            },
                        })
                    )
                    //记录被添加的实体
                staticParams.tdAnalysisLayers.heatMapColls.push(entity)
                staticParams.viewer.zoomTo(entity)
            })
            // SERVICE.getHeatMapJsonFileContentByDomain(_domain).then((res) => {
            //     // console.log(res)
            //     let data = res.data

        // })
    }
}

/**克里金插值分析方法 */
/**
 * @param {纬度数组} lats
 * @param {经度数组} lngs
 * @param {值数组} values
 * @param {经纬度数组，用于构建Cesium的Polygon多边形实例} coords
 * @param {最小外接矩形坐标数组} coord
 * @param {克里金插值模型： ① gaussian（高斯模型）；② exponential（指数模型，默认）； ③ spherical（球面模型）} mode
 */
export function drawKriging(
    viewer,
    lats,
    lngs,
    values,
    coords,
    coord,
    mode = 'exponential'
) {
    console.log(mode)
    let colors = [
        '#006837',
        '#1a9850',
        '#66bd63',
        '#a6d96a',
        '#d9ef8b',
        '#ffffbf',
        '#fee08b',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
    ]
    if (values.length > 3) {
        //构造面，方便计算范围
        let extent = Cesium.PolygonGeometry.computeRectangle({
                id: 'extend',
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    Cesium.Cartesian3.fromDegreesArray(coords)
                ),
            }) //范围（弧度）
        let minx = Cesium.Math.toDegrees(extent.west) //转换为经纬度
        let miny = Cesium.Math.toDegrees(extent.south)
        let maxx = Cesium.Math.toDegrees(extent.east)
        let maxy = Cesium.Math.toDegrees(extent.north)
        let newex = [
                [
                    [minx, maxy],
                    [maxx, maxy],
                    [maxx, miny],
                    [minx, miny],
                    [minx, maxy],
                ],
            ]
            //创建画布实例
        let canvas = null //画布
            //1.用克里金训练一个variogram对象
            // console.log(lngs)
            // console.log(lats)
        let variogram = kriging.train(values, lngs, lats, mode, 0, 100)
            //2.使用刚才的variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值；
            //let grid = kriging.grid ( ex, variogram, (maxy - miny) / 500 );    //以多边形为面
        let grid = kriging.grid(newex, variogram, (maxy - miny) / 500) //以矩形为面
        canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 800
        canvas.style.display = 'block'
        canvas.getContext('2d').globalAlpha = 0.75 //设置透明度
            //3.将得到的格网预测值渲染到canvas画布上
        kriging.plot(canvas, grid, [minx, maxx], [miny, maxy], colors)
        if (canvas != null) {
            let addedEntity = viewer.entities.add({
                    polygon: {
                        hierarchy: {
                            // positions: Cesium.Cartesian3.fromDegreesArray(coord)//绘制外接矩形
                            positions: Cesium.Cartesian3.fromDegreesArray(coords), //绘制多边形矩形
                        },
                        material: new Cesium.ImageMaterialProperty({
                            image: canvas, //使用贴图的方式将结果贴到面上
                        }),
                        outline: true,
                        outlineColor: Cesium.Color.RED,
                        classificationType: Cesium.ClassificationType.TERRAIN, //贴地显示
                    },
                })
                //记录插值结果
            staticParams.tdAnalysisLayers.krigingColls.push(addedEntity)
            viewer.zoomTo(addedEntity)
                //flyTo(117.315375, 40.181212,8000);
                //var center=Cesium.polygon.center()
                //获取中心点
                //   var points = Cesium.Cartesian3.fromDegreesArray(coord)
                //   var polyCenter = Cesium.BoundingSphere.fromPoints(points).center
                //   polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter)
                //   //将世界坐标转换为经纬度坐标
                //   var ellipsoid = viewer.scene.globe.ellipsoid
                //   var cartesian3 = new Cesium.Cartesian3(
                //     polyCenter.x,
                //     polyCenter.y,
                //     polyCenter.z
                //   )
                //   var cartographic = ellipsoid.cartesianToCartographic(cartesian3)
                //   var lat = Cesium.Math.toDegrees(cartographic.latitude)
                //   var lng = Cesium.Math.toDegrees(cartographic.longitude)
                //   flyTo(lng, lat, 8000)
        }
    }
}

/**
 * 计算最小外接矩形的方法
 * @param data 数据集，数据格式：[ { x:valuex,y:valuey,value:valuev}...]
 * @returns 最小外接矩形对应的数组（四个坐标点位，无需闭合）
 */
export function getMinExtentOfData(data) {
    let minLon = data[0].x,
        maxLon = data[0].x,
        minLat = data[0].y,
        maxLat = data[0].y,
        point = []
    for (var i = 1; i < data.length; i++) {
        if (minLon > data[i].x) minLon = data[i].x
        if (maxLon < data[i].x) maxLon = data[i].x
        if (minLat > data[i].y) minLat = data[i].y
        if (maxLat < data[i].y) maxLat = data[i].y
    }
    point = [minLon, maxLat, maxLon, maxLat, maxLon, minLat, minLon, minLat] //最小外接矩形四个角点的坐标值
        // console.log(point);
    return point
}

/**
 * 销毁3D分析图层
 */
export function destoryTDAnalysisLayers() {
    //热力图图层销毁
    let len = staticParams.tdAnalysisLayers.heatMapColls.length - 1
    while (len >= 0) {
        staticParams.viewer.entities.remove(
            staticParams.tdAnalysisLayers.heatMapColls[len--]
        )
    }
    //置空热力图图层
    staticParams.tdAnalysisLayers.heatMapColls = []

    //克里金插值结果图层销毁
    let len_kriging = staticParams.tdAnalysisLayers.krigingColls.length - 1
    while (len_kriging >= 0) {
        staticParams.viewer.entities.remove(
            staticParams.tdAnalysisLayers.krigingColls[len_kriging--]
        )
    }
    //置空克里金插值结果图层
    staticParams.tdAnalysisLayers.krigingColls = []
}

/**
 * 添加雪花特效
 * @param {三维视图实例} viewer
 * @param {标志位，是否显示雪花效果} _flag
 */
export function initWeatherEffect(viewer, _flag) {
    console.log(_flag)
        //初始化雪花特效
        // if (staticParams.weatherInstance.snow)
        //     viewer.scene.postProcessStages.remove(staticParams.weatherInstance.snow)
    staticParams.weatherInstance.snow = new Cesium.PostProcessStage({
            name: 'czm_snow',
            fragmentShader: '\n\
          uniform sampler2D colorTexture;\n\
          varying vec2 v_textureCoordinates;\n\
          float snow(vec2 uv,float scale)\n\
          {\n\
          float time = czm_frameNumber / 60.0;\n\
           float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
           uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
            uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
            p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
           k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
          return k*w;\n\
          }\n\
          void main(void){\n\
           vec2 resolution = czm_viewport.zw;\n\
           vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
           vec3 finalColor=vec3(0);\n\
             float c = 0.0;\n\
            c+=snow(uv,30.)*.0;\n\
            c+=snow(uv,20.)*.0;\n\
           c+=snow(uv,15.)*.0;\n\
           c+=snow(uv,10.);\n\
           c+=snow(uv,8.);\n\
            c+=snow(uv,6.);\n\
           c+=snow(uv,5.);\n\
            finalColor=(vec3(c)); \n\
          gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\
          }',
        })
        //2-初始化下雨特效
        // if (staticParams.weatherInstance.rain)
        //     viewer.scene.postProcessStages.remove(staticParams.weatherInstance.rain)
        //创建新的实例
        // staticParams.weatherInstance.rain = new Cesium.PostProcessStage({
        //         name: 'czm_rain',
        //         fragmentShader: '\n\
        //     uniform sampler2D colorTexture;\n\
        //       varying vec2 v_textureCoordinates;\n\
        //       float hash(float x)\n\
        //       {\n\
        //        return fract(sin(x*133.3)*13.13);\n\
        //       }\n\
        //       void main(void){\n\
        //         float time = czm_frameNumber / 60.0;\n\
        //        vec2 resolution = czm_viewport.zw;\n\
        //         vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
        //         vec3 c=vec3(.6,.7,.8);\n\
        //         float a=-.4;\n\
        //       float si=sin(a),co=cos(a);\n\
        //       uv*=mat2(co,-si,si,co);\n\
        //       uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
        //        float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
        //       float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
        //       c*=v*b;\n\
        //       gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);\n\
        //       }',
        //     })
        //3-获取黑夜实例
        // if (!staticParams.weatherInstance.night)
        //     staticParams.weatherInstance.night = viewer.scene.globe
        //     //4-获取云雾实例
        // if (!staticParams.weatherInstance.fog)
        //     staticParams.weatherInstance.fog = staticParams.viewer.scene.fog

    //默认控制不显示天气效果
    // staticParams.weatherInstance.rain.enabled = false //下雨
    // staticParams.weatherInstance.snow.enabled = false //下雪

    //添加天气效果到三维场景中
    // viewer.scene.postProcessStages.add(staticParams.weatherInstance.rain)
    viewer.postProcessStages.add(staticParams.weatherInstance.snow)
    staticParams.weatherInstance.snow.enabled = _flag
        // console.log(staticParams.weatherInstance.rain)
}

/**
 * 加载建筑物模型
 * @param {三维视图实例} _viewer
 */
export function loadBuildings(_viewer) {
    var promise = Cesium.IonResource.fromAssetId(461398)
        .then(function(resource) {
            return Cesium.KmlDataSource.load(resource, {
                camera: _viewer.scene.camera,
                canvas: _viewer.scene.canvas,
            })
        })
        .then(function(dataSource) {
            return _viewer.dataSources.add(dataSource)
        })
        .then(function(dataSource) {
            //获取存储单个建筑模型实例的数组
            let entities = dataSource.entities.values
                //遍历单个建筑实例
            let len = entities.length - 1
            while (len >= 0) {
                console.log(entities[len--])
            }
            return _viewer.zoomTo(dataSource)
        })
        .otherwise(function(error) {
            console.log(error)
        })
    promise.then(function() {
        viewer.zoomTo(
            promise,
            new Cesium.HeadingPitchRange(
                0.0, -0.5,
                promise.boundingSphere.radius / 4.0
            )
        )
    })

    _viewer.zoomTo(promise)
    console.log(promise)
        //添加点击事件
    let canvas = _viewer.scene.canvas
    let infoHandler = new Cesium.ScreenSpaceEventHandler(canvas)
    infoHandler.setInputAction(function(click) {
        //根据Cartesian2坐标-窗口坐标值（click.position），获取被点击的要素实例
        let pickedFeature = _viewer.scene.pick(click.position)
            //判断当前要素实例是否已经定义
        if (!Cesium.defined(pickedFeature)) {
            // nothing picked
            console.log('未定义返回')
            return false
        }

        console.log(pickedFeature)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

/**
 * 初始化用户信息点
 * (以聚合点形式添加)
 * @param {视图实例} _viewer
 */
export function initClientUserInfo(_viewer) {
    SERVICE.getAllClientUserList().then((res) => {
        if (res.status == 200) {
            console.log(res)
            let data = res.data
                //解析数据
            Notification.success({
                    title: 'Loading Success...',
                    message: '正在缓存用户信息点,请稍等!',
                    duration: 5000,
                })
                //倒序遍历数组元素
                //倒序（数组最优遍历方式）
            var i = data.length - 1
            console.log(data[i].nurselevel)
            while (i >= 0) {
                createSingleEntityPOI(staticParams.viewer, data[i--])
            }
        } else {
            Notification.error({
                title: 'Loading Error',
                message: '用户信息点缓存失败,请刷新重试！',
                duration: 5000,
            })
        }
    })
}

/**
 * 创建单个Entity实例
 * @param {三维视图实例} _viewer
 * @param {POI信息点实例} _poiInfo
 */
export function createSingleEntityPOI(_viewer, _poiInfo) {
    // let imgUrl = require('../../static/imgs/home/mark3.png')
    // console.log(imgUrl)
    //判断护理等级
    let imgUrl = 'greenMarker' //普通-绿

    switch (_poiInfo.nurselevel) {
        case '特护一级':
            {
                imgUrl = 'redMarker' //红
                break
            }
        case '特护一级':
            {
                imgUrl = 'orangeMarker' //橙
                break
            }
        case '特护一级':
            {
                imgUrl = 'yellowMarker' //黄
                break
            }
        case '护理二级':
            {
                imgUrl = 'blueMarker' //蓝
                break
            }
        default:
            {
                imgUrl = 'greenMarker' //绿色
                break
            }
    }
    //创建Cesium.Entity实例
    let entity = new Cesium.Entity({
            //地理位置属性(经纬度转Cesium世界坐标)
            position: Cesium.Cartesian3.fromDegrees(
                _poiInfo.lon, //经度
                _poiInfo.lat, //纬度
                0.0 //height:default value
            ),
            //图标
            billboard: {
                //图标
                image: require('../../static/imgs/home/' + `${imgUrl}` + '.png'),
                width: 24,
                height: 24,
            },
            //标签
            label: {
                // text: _poiInfo.name,
                // backgroundColor: Cesium.Color.TRANSPARENT,
                // font: 'small-caps bold 12px/1 sans-serif',
                // pixelOffset: new Cesium.Cartesian2(10, -15), //偏移
            },
            //信息点
            // point: {
            //     color: Cesium.Color.RED, //颜色
            //     pixelSize: 15, //尺寸
            //     show: true, //是否显示
            // },
            name: _poiInfo.idnum,
            show: false, //是否显示实体
        })
        //记录信息点实体
    staticParams.poiEntittCollection.push(entity)
        //将单个Entity添加到Viewer场景中
    _viewer.entities.add(entity)
}

/**
 *
 * @param {初始化报警点} params
 */
export function initWarnPointInfo(_viewer) {
    //发送数据请求
    SERVICE.getUnResolvedWarnRecords().then((res) => {
        if (res.data && res.data.length != 0) {
            console.log(res)
            let data = res.data
                //解析数据
            Notification.success({
                    title: 'Loading Success...',
                    message: '正在缓存报警点,请稍等!',
                    duration: 5000,
                })
                //倒序遍历数组元素
                //倒序（数组最优遍历方式）
            var i = data.length - 1
            while (i >= 0) {
                createWarnPoint(staticParams.viewer, data[i--])
            }
        } else {
            Notification.error({
                title: 'Loading Error',
                message: '报警点缓存失败,请刷新重试！',
                duration: 5000,
            })
        }
    })
    console.log(staticParams.warnPOICollection)
}

/**
 * 根据经纬度坐标值，创建报警点
 * @param {三维视图实例} _viewer
 * @param {报警点信息} _ptInfo
 */
export function createWarnPoint(
    _viewer,
    _ptInfo,
    imgurl = require('../../static/imgs/home/warn.png')
) {
    /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "id":1,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "idNumber":"410802194305268325",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "name":"许羽希",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "status":0,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "wLat":35.1764,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "wLon":113.197,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "warnAddress":"河南省焦作市解放区王褚街道灵泉陂村",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  "warntime":"2021-05-09 21:08:54"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
    //记录当前点实体的信息
    //创建Cesium.Entity实例
    let entity = new Cesium.Entity({
            //地理位置属性(经纬度转Cesium世界坐标)
            position: Cesium.Cartesian3.fromDegrees(
                _ptInfo.wLon, //经度
                _ptInfo.wLat, //纬度
                0.0 //height:default value
            ),
            //图标
            billboard: {
                //图标
                image: imgurl,
                width: 24,
                height: 24,
            },
            //标签
            label: {
                // text: _poiInfo.name,
                // backgroundColor: Cesium.Color.TRANSPARENT,
                // font: 'small-caps bold 12px/1 sans-serif',
                // pixelOffset: new Cesium.Cartesian2(10, -15), //偏移
            },
            //信息点
            // point: {
            //     color: Cesium.Color.RED, //颜色
            //     pixelSize: 15, //尺寸
            //     show: true, //是否显示
            // },
            name: _ptInfo.idNumber,
            show: false, //是否显示实体
        })
        //记录信息点实体
    staticParams.warnPOICollection.push(entity)
        //将单个Entity添加到Viewer场景中
    _viewer.entities.add(entity)
}

/**
 * 加载临时数据源---temporary datasource
 * @param {经度} _lon
 * @param {纬度} _lat
 */
export function loadTempMarker(_lon, _lat) {
    //创建Cesium.Entity实例
    let entity = new Cesium.Entity({
            //地理位置属性(经纬度转Cesium世界坐标)
            position: Cesium.Cartesian3.fromDegrees(
                _lon, //经度
                _lat, //纬度
                0.0 //height:default value
            ),
            //图标
            billboard: {
                //图标
                image: require('../../static/imgs/home/tempWarn.png'),
                width: 24,
                height: 24,
            },
            name: '报警点',

            show: true, //是否显示实体
        })
        //记录信息点实体
    staticParams.temporaryLayers.markerColls.push(entity)
        //添加实体到Viewer场景中
    staticParams.viewer.entities.add(entity)
        //切换视角
    staticParams.viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(_lon, _lat, 1500.0),
    })
}

/**
 * 使得相机飞到指定位置
 * @param {*} _lon
 * @param {*} _lat
 */
export function makeCemeraFlyTo(_lon, _lat) {
    staticParams.viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(_lon, _lat, 1500.0),
    })
}

/**
 * 清除临时marker标记图层
 */
export function removeTempMarkerLayer() {
    let len_marker = staticParams.temporaryLayers.markerColls.length - 1
    while (len_marker >= 0) {
        staticParams.viewer.entities.remove(
            staticParams.temporaryLayers.markerColls[len_marker--]
        )
    }
    staticParams.temporaryLayers.markerColls = []
}

/**
 * 初始化服务中心点
 * @param {三维视图实例} _viewer
 */
export function initServiceCenters(_viewer) {
    /**
     *
     * @param {三维视图实例} _viewer
     * @param {信息点对象} _ptInfo
     * @param {模式：1-加载医院点；2-加载家政服务中心} _mode
     * @param {图片资源路径} imgurl
     */
    function createWarnPoint(_viewer, _ptInfo, _mode, imgurl) {
        //创建Cesium.Entity实例
        let entity = new Cesium.Entity({
                //地理位置属性(经纬度转Cesium世界坐标)
                position: Cesium.Cartesian3.fromDegrees(
                    _ptInfo.lon, //经度
                    _ptInfo.lat, //纬度
                    0.0 //height:default value
                ),
                //图标
                billboard: {
                    //图标
                    image: imgurl,
                    width: 24,
                    height: 24,
                },
                name: _ptInfo.name,
                show: false, //是否显示实体
                label: {
                    text: _ptInfo.name,
                    font: '12px Helvetica',
                    fillColor: Cesium.Color.DEEPSKYBLUE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(15, 5),
                },
            })
            //记录信息点实体
        _mode == 1 ?
            staticParams.hospitalCollection.push(entity) :
            staticParams.servicePointCollection.push(entity)
            //将单个Entity添加到Viewer场景中
        _viewer.entities.add(entity)
    }
    let srcHos = require('../../static/imgs/home/hospital.png'),
        srcCenters = require('../../static/imgs/home/servicecenter.png')

    //加载医院点
    SERVICE.getAllHospital().then((res) => {
            if (res.data && res.data.length != 0) {
                console.log(res)
                let data = res.data
                    //解析数据
                Notification.success({
                        title: 'Loading Success...',
                        message: '正在缓存医院点,请稍等!',
                        duration: 5000,
                    })
                    //倒序遍历数组元素
                    //倒序（数组最优遍历方式）
                var i = data.length - 1
                while (i >= 0) {
                    createWarnPoint(_viewer, data[i--], 1, srcHos)
                }
            } else {
                Notification.error({
                    title: 'Loading Error',
                    message: '医院点缓存失败,请刷新重试！',
                    duration: 5000,
                })
            }
        })
        //加载家政服务中心
    SERVICE.getAllServicePoint().then((res) => {
        if (res.data && res.data.length != 0) {
            console.log(res)
            let data = res.data
                //解析数据
            Notification.success({
                    title: 'Loading Success...',
                    message: '正在缓存援助点,请稍等!',
                    duration: 5000,
                })
                //倒序遍历数组元素
                //倒序（数组最优遍历方式）
            var i = data.length - 1
            while (i >= 0) {
                createWarnPoint(_viewer, data[i--], 2, srcCenters)
            }
        } else {
            Notification.error({
                title: 'Loading Error',
                message: '援助点缓存失败,请刷新重试！',
                duration: 5000,
            })
        }
    })
}

/**
 * 控制信息点的显隐
 * @param {标志位：true/false} _flag
 */
export function showPOIInfoPts(_array, _flag = true) {
    let len = _array.length - 1
    while (len >= 0) {
        _array[len--]._show = _flag
    }
}

/**
 * 为信息点添加鼠标悬停事件
 * 根据用户的身份证号获取用户信息（无需修改）
 * @param {三维视图实例} _viewer
 */
export function addMouseHoverFireForEntityPOI(_viewer) {
    let canvas = _viewer.scene.canvas
    let infoHandler = new Cesium.ScreenSpaceEventHandler(canvas)
    infoHandler.setInputAction(function(click) {
        try {
            //显示底部地理信息
            showFooterInfo(_viewer, click.endPosition)
        } catch (error) {
            console.log(error)
        }
        let pickedFeature = _viewer.scene.pick(click.endPosition)
        if (!Cesium.defined(pickedFeature)) {
            return false
        }
        // wgs84世界坐标转换为window窗口坐标
        if (pickedFeature.id.position._value == undefined) return false
        let transWinPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                _viewer.scene,
                pickedFeature.id.position._value
            )
            //计算组件的显示位置
        let positionInWindow = {
                top: transWinPos.y - 70 - 14 + 'px',
                left: transWinPos.x - 140 + 'px',
            }
            //根据用户的身份证号获取详细信息
        let idnum = pickedFeature.id._name //身份证号
            // console.log(idnum)
        if (!idnum) {
            return false
        }
        SERVICE.getDetailClientUserInfoByIdNum(idnum).then((res) => {
            // console.log(res)
            let data = res.data
            if (data) {
                //修改全局状态值
                Store.dispatch('setHoverOverItemPropertyAsync', {
                    name: data.name,
                    nurseLevel: data.nurseLevel,
                    warnTimes: 12,
                    healthRate: 94.6,
                    positionStyle: positionInWindow,
                })
                Store.dispatch('setIsShowHoverOverAsync', true)
            }
        })
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

/**
 * 为场景添加滚轮缩放监听事件
 * @param {三维视图实例} _viewer
 */
export function addMouseWheelFireForViewer(_viewer) {
    // let canvas = _viewer.scene.canvas
    // let infoHandler = new Cesium.ScreenSpaceEventHandler(canvas)
    // infoHandler.setInputAction(function(click) {
    //     showFooterInfo(_viewer)
    // }, Cesium.ScreenSpaceEventType.WHEEL)
}

/**
 * 显示底部的信息
 * @param {三维视图实例} _viewer
 * @param {鼠标位置-窗口坐标} _position
 */
export function showFooterInfo(_viewer, _position) {
    // console.log(_position)
    //根据鼠标悬停位置，在二维世界坐标系中为创建相机视线
    var windowPosition = _viewer.camera.getPickRay(_position)
        // console.log(windowPosition)
        //计算相机视线与三维地球球面的交点位置（Cartesian3）
    var cartesianCoordinates = _viewer.scene.globe.pick(
            windowPosition,
            _viewer.scene
        )
        // console.log(cartesianCoordinates)
        //将交点所在的二维坐标系转换为相机坐标系-三维世界坐标系
    var cartographic = _viewer.scene.globe.ellipsoid.cartesianToCartographic(
            cartesianCoordinates
        )
        // console.log(cartographic)
        //用三维位置坐标代替当前空间参考信息
    let itemProperty = {
            lng: Cesium.Math.toDegrees(cartographic.longitude).toFixed(6), //经度值
            lat: Cesium.Math.toDegrees(cartographic.latitude).toFixed(6), //纬度值
            // alt: Cesium.Math.toDegrees(cartographic.height).toFixed(6), //高程值(本身为m，无需转换)
            alt: cartographic.height.toFixed(6), //高程值
            dir: Math.floor((_viewer.camera.heading * 180) / Math.PI), //相机方向-弧度转角度
            angle: Math.floor((_viewer.camera.pitch * 180) / Math.PI), //相机俯仰角-弧度转角度
            sceneAlt: _viewer.camera.positionCartographic.height.toFixed(2), //视高-相机高度
        }
        //修改空间参考信息的值
    Store.dispatch('setFooterPropertyAsync', itemProperty)
}

/**
 * 为信息点添加点击事件
 * @param {三维视图实例} _viewer
 * 根据用户的身份证号获取信息，无需修改
 */
export function addMouseClickFireForEntityPOI(_viewer) {
    let canvas = _viewer.scene.canvas
    let infoHandler = new Cesium.ScreenSpaceEventHandler(canvas)
    infoHandler.setInputAction(function(click) {
        //隐藏正在显示的HoverOver组件
        Store.dispatch('setIsShowHoverOverAsync', false)
            //根据Cartesian2坐标-窗口坐标值（click.position），获取被点击的要素实例
        let pickedFeature = _viewer.scene.pick(click.position)
        console.log(pickedFeature)
            //判断当前要素实例是否已经定义
        if (!Cesium.defined(pickedFeature)) {
            // nothing picked
            console.log('未定义返回')
            return false
        }

        //获取窗体中心点坐标
        let positionInWindow = {
                top: document.body.clientHeight / 2 - 270 + 4 + 'px',
                left: document.body.clientWidth / 2 - 140 + 'px',
            }
            //获取身份证号
        let idnum = pickedFeature.id._name
        if (!idnum) {
            return false
        }
        console.log(pickedFeature.id.position._value)
            //根据身份证号信息获取用户的详细信息
        SERVICE.getDetailClientUserInfoByIdNum(idnum).then((res) => {
            if (res.status == 200) {
                console.log(res.data)
                    //先暂时隐藏popupover组件
                Store.dispatch('setIsShowPopUpOverAsync', false)
                    //移动相机位置
                moveCameraToPosition(pickedFeature.id.position._value, _viewer)
                    //显示popupover组件（延迟执行5秒）
                setTimeout(function() {
                    showPopUpOverWindow(res.data, positionInWindow, true)
                }, 3000)
            } else {
                Notification.error({
                    title: 'GET Error',
                    message: '信息查询失败！',
                    duration: 1000,
                })
            }
        })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

/**
 * 移动相机镜头，并显示信息窗口
 * @param {身份证号} _idnum
 * @param {三维视图实例} _viewer
 */
export function moveCameraShowInfoWindow(_idnum, _viewer) {
    //获取窗体中心点坐标
    let positionInWindow = {
            top: document.body.clientHeight / 2 - 270 + 4 + 'px',
            left: document.body.clientWidth / 2 - 140 + 'px',
        }
        //获取用户信息
    SERVICE.getDetailClientUserInfoByIdNum(_idnum).then((res) => {
        if (res.status == 200) {
            console.log(res.data)
                //先暂时隐藏popupover组件
            Store.dispatch('setIsShowPopUpOverAsync', false)
                //移动相机位置
            _viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        res.data.lon,
                        res.data.lat,
                        8000.0
                    ),
                })
                //显示popupover组件（延迟执行5秒）
            setTimeout(function() {
                showPopUpOverWindow(res.data, positionInWindow, true)
            }, 3000)
        } else {
            Notification.error({
                title: 'GET Error',
                message: '信息查询失败！',
                duration: 1000,
            })
        }
    })
}

/**
 *
 * @param {客户信息json实例}} _clientUserInfo
 * @param {popupover组件的对应的视口坐标属性} positionInWindow
 * @param {是否显示popupover组件} payload
 */
export function showPopUpOverWindow(
    _clientUserInfo,
    positionInWindow,
    payload
) {
    //添加位置属性
    _clientUserInfo.positionStyle = positionInWindow
        //修改全局状态值
    Store.dispatch('setPopupOverItemPropertyAsync', _clientUserInfo)
        //再次显示组件
    Store.dispatch('setIsShowPopUpOverAsync', payload)
        /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         示例：
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Store.dispatch('setPopupOverItemPropertyAsync', {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                idNum: '41122419990218281x',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                name: '顾漫',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                nurseLevel: '特护一级',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                healthRate: 0.8,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                sex: '女',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                age: 38,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                occupation: '职业',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                phoneNum: '13333333333',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                address: '河南省焦作市山阳区世纪大道2001号',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //控制控件显示的位置
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                positionStyle: positionInWindow,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //     top: '400px',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //     left: '350px',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                // },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            })
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Store.dispatch('setIsShowPopUpOverAsync', true)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */
}

/**
 * 三维场景相机位置切换
 * @param {WGS84世界坐标} positionWGS84
 * @param {三维视图实例} _viewer
 */
export function moveCameraToPosition(positionWGS84, _viewer) {
    let cartographic = _viewer.scene.globe.ellipsoid.cartesianToCartographic(
        positionWGS84
    )
    let lat = Cesium.Math.toDegrees(cartographic.latitude)
    let lng = Cesium.Math.toDegrees(cartographic.longitude)
        // let alt = cartographic.height
    _viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            Number(lng.toString().match(/^\d+(?:\.\d{0,4})?/)),
            Number(lat.toString().match(/^\d+(?:\.\d{0,4})?/)),
            8000.0
        ),
        //设置相机朝向：俯仰角、倾角
        // orientation: {
        //     heading: Cesium.Math.toRadians(350),
        //     pitch: Cesium.Math.toRadians(-50),
        //     roll: 0.0,
        // },
    })
}

/**
 * 加载数据源---datasource
 * @param {视图对象} _viewer
 * @param {数据源路径} _dataSource
 */
export function loadDataSource(_viewer, _dataSource) {
    // loadTempMarker(113.332, 35.3295)
    //获取被加载的json数据源datasource实例，对应的promise
    let promise = Cesium.GeoJsonDataSource.load(
            _dataSource,
            /*'http://localhost:8088/springboot-bysj/temp.json'*/
            {
                //可选项：设置样式
                // stroke: Cesium.Color.HOTPINK,
                // fill: Cesium.Color.PINK.withAlpha(0.5),
                // strokeWidth: 3,
                // markerSymbol: '?',
            }
        )
        //记录json数据源
    staticParams.dataSourcePromise = promise
        // console.log(promise)
        //通过promise实例，解析数据源【方法回调】
    promise.then(function(datasource) {
        //1-添加数据源datasource
        _viewer.dataSources.add(datasource)
            //2-设置数据源的样式
        let entitiesArr = datasource.entities.values //获取json中包含的entity实体
            //设置颜色表
        let colorHash = {}
            //遍历实体数组，初始化颜色&&高度值
        let len = entitiesArr.length - 1
            // console.log(entitiesArr[0])
        while (len >= 0) {
            let entity = entitiesArr[len--] //获取当前实体
                // console.log(entity)
            let name = entity.name //名称字段
            let color = colorHash[name] //颜色值
            if (!color) {
                //随机设置颜色值
                color = Cesium.Color.fromRandom({
                    alpha: 0.5, //透明度限制
                })
                colorHash[name] = color //设置颜色属性值
            }
            //使用随机色初始化geometry（polygon）的材质material属性
            entity.polygon.material = color
                //取消边界outline显示
            entity.polygon.outline = false
                //默认不显示geometry（polygon）
            entity.polygon.show = false
                //随机显示geometry的高度altitude属性值
            entity.polygon.extrudedHeight = entity.properties.OBJECTID * 100
                //设置文字标注text属性值
                // entity.label = {
                //         text: 'Philadelphia',
                //         font: '24px Helvetica',
                //         fillColor: Cesium.Color.SKYBLUE,
                //         outlineColor: Cesium.Color.BLACK,
                //         outlineWidth: 2,
                //         style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                //     }
                //设置文字颜色
                // entity.label.fillColor = Cesium.Color.BLACK
        }
    })

    // _viewer.zoomTo(dataSource)
}

/**
 * 加载临时数据源---temporary datasource
 * @param {视图对象} _viewer
 * @param {数据源路径} _dataSource
 */
export function loadTempJsonDataSource(_viewer, _lon, _lat, _radius) {
    // loadTempMarker(_lon, _lat)
    //获取被加载的json数据源datasource实例，对应的promise
    let tempLayer = _viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(_lon, _lat), //113.049, 35.2045
            name: 'Red ellipse on surface',
            ellipse: {
                semiMinorAxis: parseFloat(_radius),
                semiMajorAxis: parseFloat(_radius),
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        })
        //记录当前临时图层
    staticParams.temporaryLayers.jsonColls.push(tempLayer)
        //自动缩放至数据源所在的位置
    _viewer.zoomTo(tempLayer)
}

/**
 * 清除临时json图层
 */
export function removeTempJsonLayer() {
    let len = staticParams.temporaryLayers.jsonColls.length - 1
    while (len >= 0) {
        //移除临时图层实体
        staticParams.viewer.entities.remove(
            staticParams.temporaryLayers.jsonColls[len--]
        )
    }
    //置空临时图层数组
    staticParams.temporaryLayers.jsonColls = []
}

/**
 * 是否显示矢量行政区划图
 * @param {标志位} _flag
 */
export function showShpDataSOurce(_flag) {
    staticParams.dataSourcePromise.then((datasource) => {
        let entitiesArr = datasource.entities.values //获取json中包含的entity实体
            //遍历实体数组，设置geometry的显隐状态值
        let len = entitiesArr.length - 1
        while (len >= 0) {
            let entity = entitiesArr[len--] //获取当前实体
            console.log(entity)
                //修改geometry（polygon）的show属性
            entity.polygon.show = _flag
        }
    })
    staticParams.viewer.zoomTo(staticParams.dataSourcePromise)
}

/**
 *
 * @param {视图对象} _viewer
 */
export function monitorCameraPos(_viewer) {
    var handler = new Cesium.ScreenSpaceEventHandler(_viewer.canvas)
    handler.setInputAction(function(event) {
            let viewRectangle = _viewer.camera.computeViewRectangle()
            console.log(viewRectangle)
            computeTilesLevel(viewRectangle)
                // console.log(Cesium.Camera.DEFAULT_VIEW_RECTANGLE)
        }, Cesium.ScreenSpaceEventType.WHEEL)
        // console.log(_viewer.scene.camera)
}

/**
 *
 * @param {视图范围} _viewRectangle
 */
export function computeTilesLevel(_viewRectangle) {
    console.log('计算瓦片层级')
        //max
        //    {
        //        "west": -3.141592653589793,
        //        "south": -1.5707963267948966,
        //        "east": 3.141592653589793,
        //        "north": 1.5707963267948966};

    //        {west: 1.9765744856568515,
    //         south: 0.6149548403106395,
    //         east: 1.9765749639584553,
    //         north: 0.6149551813927299}
    // console.log(
    //     Math.ceil(((_viewRectangle.west - _viewRectangle.east) * 6378137.0) / 1400)
    // )
}