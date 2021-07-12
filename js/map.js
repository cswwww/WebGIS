var map1;

var scaleLine;
var fullScream;
var zoomToExtent;
var mousePositionControl;
var dragRotateAndZoom;
function controlSet(){
    scaleLine = new ol.control.ScaleLine({units: "metric" });
    fullScream = new ol.control.FullScreen();
    dragRotateAndZoom = new ol.interaction.DragRotateAndZoom()
    zoomToExtent = new ol.control.ZoomToExtent({
    // 使用伪墨卡托投影EPSG:3857 
    extent: [
    12621260.628405089,2636330.454794517,
    12623641.264403043,2637313.087100964
    ]});
    mousePositionControl = new ol.control.MousePosition({
        //坐标格式,将坐标保留4位小数位，并转换为字符串
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:3857',
        //坐标信息显示样式类名，默认是'ol-mouse-position'
        className: 'custom-mouse-position',
        //显示鼠标位置信息的目标容器(将控件渲染在该DOM元素中)
        target: document.getElementById('mouse-position'),
        undefinedHTML: '请将鼠标放到地图上'
    });
}

function map(){
    controlSet()
    layerSet()
map1 = new ol.Map({
    target: 'map', //地图容器div的id
    loadTilesWhileInteracting: true,
    layers: [],
    view: new ol.View({
        center: [0, 0], //地图初始中心点
        zoom: 3  //地图初始显示级别
    })
});

map1.addLayer(td_cva);
map1.addLayer(td_vec);
map1.addLayer(td_img);
map1.addLayer(td_cia);
map1.addControl(zoomToExtent);
map1.addInteraction(dragRotateAndZoom);




}


function remove (controlName){
    map1.removeControl(controlName);
}
function add (controlName){
    map1.addControl(controlName);
}

function layerCheck(checkbox,ele){
    if ( checkbox.checked == true){
    map1.addLayer(ele);
    }else{
    map1.removeLayer(ele);
    }
    }
    

