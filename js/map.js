var map1;
var projection = ol.proj.get('EPSG:3857');

/*  
*   控件设置
*/
let 
scaleLine,
fullScream, 
zoomToExtent,zoomSlide,
mousePositionControl,
overView,
dragRotateAndZoom;

function controlSet(){
    // 比例尺控件
    scaleLine = new ol.control.ScaleLine({
      units: "metric"      //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
    });
    // 全屏控件
    fullScream = new ol.control.FullScreen();
    // 鹰眼控件
    // var overviewMapControl = new ol.control.OverviewMap(); //默认样式鹰眼控件
    overView = new ol.control.OverviewMap({       //自定义样式的鹰眼控件
        // className: 'ol-overviewmap ol-custom-overviewmap',
        //鹰眼中加载同坐标系下不同数据源的图层（要求在同一投影坐標系下的）
        layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
        collapseLabel: '\u00BB',    //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
        label: '\u00AB',            //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
        collapsed: false            //初始为展开显示方式
    });
    //按键Shift加上鼠标拖拽来围绕中心点旋转和缩放地图的功能
    dragRotateAndZoom = new ol.interaction.DragRotateAndZoom()
    //缩放
    zoomSlide = new ol.control.ZoomSlider();
    zoomToExtent = new ol.control.ZoomToExtent({extent: [12621260.628405089,2636330.454794517,12623641.264403043,2637313.087100964]});
    mousePositionControl = new ol.control.MousePosition({
        //坐标格式,将坐标保留4位小数位，并转换为字符串
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',       /*4326|3857*/
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
map1 = new ol.Map({
    target: 'map', //地图容器div的id
    loadTilesWhileInteracting: true,
    layers: [],
    view: new ol.View({
        center: [12622513, 2636878], //地图初始中心点
        // center: ol.proj.fromLonLat([-109, 46.5]),    //使用投影函数设置中心
        // projection: 'EPSG:3857',
        projection: projection,
        zoom: 15,  //地图初始显示级别
        // minZoom: 1,
        maxZoom: 18
    }),
    controls: ol.control.defaults({attribution:false,zoom:false}).extend([])
});

map1.addLayer(td_cva);
map1.addLayer(td_vec);
map1.addLayer(td_img);
map1.addLayer(td_cia);
map1.addControl(scaleLine);
map1.addControl(zoomToExtent);
map1.addInteraction(dragRotateAndZoom);

//获取地图视图
// var view = map1.getView();
// //平移地图
// view.setCenter([12536865.056410152, 3635008.742201894]);
// //地图缩放
// view.setZoom(6);
};

