
/**
*矢量几何要素的样式
*/
var image = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 1 })
});

var styles = {
    'Point': [
        new ol.style.Style({
            //点样式
            image: image
        })
    ],
    'LineString': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //线的边界样式
                color: 'green',
                width: 1
            })
        })
    ],
    'MultiLineString': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //多线的边界样式
                color: 'green',
                width: 1
            })
        })
    ],
    'MultiPoint': [
        new ol.style.Style({
            //多点的点样式
            image: image
        })
    ],
    'MultiPolygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //多区的边界样式
                color: 'yellow',
                width: 1
            }),
            fill: new ol.style.Fill({
                //多区的填充样式
                color: 'rgba(255, 255, 0, 0.4)'
            })
        })
    ],
    'Polygon': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //区的边界样式
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                //区的填充样式
                color: 'rgba(0, 0, 255, 0.1)'
            })
        })
    ],
    'GeometryCollection': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //集合要素的边界样式
                color: 'magenta',
                width: 2
            }),
            fill: new ol.style.Fill({
                //集合要素的填充样式
                color: 'magenta'
            }),
            image: new ol.style.Circle({
                //集合要素的点样式
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({
                    color: 'magenta'
                })
            })
        })
    ],
    'Circle': [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                //圆的边界样式
                color: 'red',
                width: 2
            }),
            fill: new ol.style.Fill({
                //圆的填充样式
                color: 'rgba(255,0,0,0.2)'
            })
        })
    ]
};


var styleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return styles[feature.getGeometry().getType()];
};


/**
* 将矢量几何要素显示到地图中
* @param {String} type 数据类型
* @param {String} data 数据的url地址
*/
//矢量数据图层
let vectorLayer;
var GuangzhouVector = new ol.source.Vector({
    url: "/data/广州市.json",
    format: new ol.format.GeoJSON()
});

function loadVectData() {
    map();
    //实例化矢量数据源，用GeoJSON格式的类解析
    vectorLayer = new ol.layer.Vector({
        //矢量数据源
        source: GuangzhouVector,
        //样式设置
        style: styleFunction
    });
    //将矢量图层加载到地图中
    map1.addLayer(gaode);

    map1.addLayer(vectorLayer);



}
