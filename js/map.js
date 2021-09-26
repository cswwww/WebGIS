/*  
*   设置图层信息
*/

var map1;
let td_vec, td_cva, td_img, td_cia;
let osm;
let bingMap;
let vectorLayer;
let stamen;
let gaode;
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
    stamen = new ol.layer.Tile({
        source: new ol.source.Stamen({ layer: 'watercolor' }),
    });
    gaode = new ol.layer.Tile({
        title: "高德地图",
        source: new ol.source.XYZ({
            url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
            wrapX: false
        })
    });
    // bingMap = new ol.layer.Tile({
    //             source: new ol.source.BingMaps({
    //                 key: '略',    // 自行到Bing Map官网申请key
    //                 imagerySet: 'Aerial'
    //             }),
    //             visible: false
    //         });  
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


/*  
*   控件设置
*/
let 
scaleLine,
fullScream,
zoomToExtent,
mousePositionControl,
zoom,
dragRotateAndZoom;
function controlSet(){
    scaleLine = new ol.control.ScaleLine({units: "metric" });
    fullScream = new ol.control.FullScreen();
    dragRotateAndZoom = new ol.interaction.DragRotateAndZoom()
    zoomToExtent = new ol.control.ZoomToExtent({extent: [12621260.628405089,2636330.454794517,12623641.264403043,2637313.087100964]});
    mousePositionControl = new ol.control.MousePosition({
        //坐标格式,将坐标保留4位小数位，并转换为字符串
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:3857',       /*4326|3857*/
        //坐标信息显示样式类名，默认是'ol-mouse-position'
        className: 'custom-mouse-position',
        //显示鼠标位置信息的目标容器(将控件渲染在该DOM元素中)
        target: document.getElementById('mouse-position'),
        undefinedHTML: '请将鼠标放到地图上'
    });
}
function checkwindow(){
    var cc = document.getElementById("setwindow");
    if (cc.style.display !== "block" ){
      cc.style.display = "block";
    } else {
      cc.style.display = "none";
    }
  }
function checkControls(checkbox,ele){
    if ( checkbox.checked == true){
            map1.addControl(ele);
        }else{
            map1.removeControl(ele);
        }
}

/*  
*   主图设置
*/
function map(){
  controlSet()
  layerSet()
  loadVectData()
map1 = new ol.Map({
    target: 'map', //地图容器div的id
    loadTilesWhileInteracting: true,
    layers: [],
    view: new ol.View({
        center: [12622513, 2636878], //地图初始中心点
        // center: ol.proj.fromLonLat([-109, 46.5]),    //使用投影函数设置中心
        zoom: 15  //地图初始显示级别
    }),
    controls: ol.control.defaults({attribution:false}).extend([])
});
map1.addLayer(td_cva);
map1.addLayer(td_vec);
map1.addLayer(td_img);
map1.addLayer(td_cia);
map1.addControl(scaleLine);
map1.addControl(zoomToExtent);
map1.addInteraction(dragRotateAndZoom);


};

