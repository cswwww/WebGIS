/**
*设置图层信息
*/
var td_vec;
var td_cva;
var td_img;
var td_cia;
var osm;
var bingMap;
var vectorLayer;
function layerSet(){
     td_vec = new ol.layer.Tile({
        title: "天地图矢量图层注记",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=0a5eb6c7a016c54112aafab4b0a274ee",
            attributions: "使用天地图",
            wrapX: false
        }),
        preload: Infinity
    });
     td_cva = new ol.layer.Tile({
        title: "天地图矢量图层",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=0a5eb6c7a016c54112aafab4b0a274ee",
            wrapX: false
        }),
        preload: Infinity
    });
     td_img = new ol.layer.Tile({
        name: "天地图影像图层",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=0a5eb6c7a016c54112aafab4b0a274ee",
            wrapX: false
        })
    });
     td_cia = new ol.layer.Tile({
        name: "天地图影像注记图层",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=0a5eb6c7a016c54112aafab4b0a274ee",
            wrapX: false
        })
    });


     osm = new ol.layer.Tile({
                source: new ol.source.OSM()
            });
     bingMap = new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: '略',    // 自行到Bing Map官网申请key
                    imagerySet: 'Aerial'
                }),
                visible: false
            });
};
var styleFunction = function (feature, resolution) {
    //根据要素类型设置几何要素的样式
    return styles[feature.getGeometry().getType()];
};


function loadVectData() {
    //实例化矢量数据源，用GeoJSON格式的类解析
    var vectorSource = new ol.source.Vector({
        url: "data/中华人民共和国 .json",
        format: new ol.format.GeoJSON()
    });
    vectorLayer = new ol.layer.Vector({
        //矢量数据源
        source: vectorSource,
        //样式设置
        style: styleFunction
    });
};