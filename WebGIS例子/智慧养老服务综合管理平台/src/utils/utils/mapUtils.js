import 'ol/ol.css'
import Map from 'ol/Map'
// import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import Overlay from 'ol/Overlay'
import View from 'ol/View'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { fromLonLat, transform } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import XYZ from 'ol/source/XYZ'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
// import KeyValueMathUtil from '../utils/KeyValueMathUtil'

/****************全局静态变量*******************/
export const staticMapParams = {
        map2d: undefined, //二维地图实例
        markerLayer: undefined, //地图标记实例
    }
    // console.log(
    //     new KeyValueMathUtil([
    //         { name: '2019-05-20 15:01:28', value: -1 },
    //         { name: '2019-10-04 00:46:16', value: 1 },
    //         { name: '2019-08-15 04:12:19', value: 5 },
    //         { name: '2019-11-18 09:35:01', value: 1 },
    //         { name: '2019-08-05 04:11:03', value: 1 },
    //     ]).getMaxValue()
    // )
    // console.log(
    //         new KeyValueMathUtil([
    //             { name: '2019-05-20 15:01:28', value: 1 },
    //             { name: '2019-10-04 00:46:16', value: 1 },
    //             { name: '2019-08-15 04:12:19', value: 1 },
    //             { name: '2019-11-18 09:35:01', value: 1 },
    //             { name: '2019-08-05 04:11:03', value: 1 },
    //         ]).getMinValue()
    //     )
    /****************全局静态变量*******************/

/**
 *
 * @param {二维地图容器的id值} _mapId
 * @param {中心经度} _lon
 * @param {中心纬度} _lat
 */
export function initMap(_mapId = 'map', _lon, _lat) {
    var map = new Map({
        layers: [
            new TileLayer({
                // source: new OSM(),
                source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
                    // url:"http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                }),
            }),
        ],
        target: _mapId,
        view: new View({
            center: fromLonLat([_lon, _lat]),
            zoom: 15,
        }),
    })
    staticMapParams.map2d = map
        //返回地图实例
    return staticMapParams.map2d
}

/**
 * 初始化地图图标
 * @param {map地图实例} _map
 * @param {标记位置的经度} _lon
 * @param {标记位置的纬度} _lat
 * 图标路径：D:\GIS_BSSJ\BSProV2\webapp\static\imgs\popupwindow\location.png
 */
export function initMarker(_map, _lon, _lat) {
    console.log('初始化标记点')
        //创建Feature要素
    let iconFeature = new Feature()
        //设置要素类型
    let geoPoint = new Point(fromLonLat([_lon, _lat]))
    iconFeature.setGeometry(geoPoint)
        //设置样式
    let iconStyle = new Style({
        image: new Icon({
            anchor: [0.5, 0.5], //default value
            scale: 0.8,
            src: require('../../../static/imgs/popupwindow/location.png'), //资源路径
        }),
    })
    iconFeature.setStyle(iconStyle)
        //创建矢量源source
    let iconVectorSource = new VectorSource({
            features: [iconFeature],
        })
        //创建矢量图层layer
    let iconVectorLayer = new VectorLayer({
            source: iconVectorSource,
        })
        //添加矢量图层layer到map地图中显示
    _map.addLayer(iconVectorLayer)
        // staticMapParams.markerLayer=iconVectorLayer
}

/**
 * 初始化信息弹出窗口
 * @param {map地图实例} _map
 * @param {popup信息窗口的经度值} _lon
 * @param {popup信息窗口的纬度值} _lat
 */
export function initPopUpInfo(_map, _lon, _lat) {
    //获取弹出窗口对应的dom元素
    var container = document.getElementById('popup')
    var content = document.getElementById('popup-content')
    var closer = document.getElementById('popup-closer')

    //设置content内容
    content.innerHTML = '<p>location Info:</p><code>' + [_lon, _lat] + '</code>'
        //     //创建Overlay实例,绑定container到overlay实例
        // let overlay = new Overlay({
        //         element: container, //dom元素
        //         autoPan: true,
        //         autoPanAnimation: {
        //             duration: 250,
        //         },
        //     })
        //为closer绑定点击关闭信息窗口事件
    closer.addEventListener('click', function() {
        // overlay.setPosition(undefined) //取消位置
        // closer.blur()
        console.log('点击')
        container.style.display = 'none'
        return false
    })
    _map.on('singleclick', function(evt) {
            var coordinate = evt.coordinate
            console.log(evt)
            console.log(coordinate)
            console.log(_map.hasFeatureAtPixel(evt.pixel))
                //判断鼠标点击的位置是否存在Feature实例
            if (_map.hasFeatureAtPixel(evt.pixel)) {
                //获取位置坐标
                // let featureAtPixel = _map.getEventPixel(evt.originalEvent)
                // console.log(featureAtPixel)
                //显示信息窗口
                container.style.display = 'inline-block'
            }
        })
        //     //设置overlay的位置
        // overlay.setPosition(fromLonLat[(_lon, _lat)])
        //     //添加overlay实例到map中
        // _map.addOverlay(overlay)
        //     //修改显示样式
        // document.getElementsByClassName('ol-overlay-container')[0].style.display =
        //     'inline-block'
}