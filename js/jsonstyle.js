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
                color: 'rgba(255, 255, 0, 0.1)'
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
