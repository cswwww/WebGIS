/*  
*   设置图层信息
*/
let td_vec, td_cva, td_img, td_cia;
let osm,stamen;
let bingMap;
let ChinaOnlineStreetPurplishBlue ;
let gaode,googleMap;
function layerSet(){
     td_vec = new ol.layer.Tile({
        title: "天地图矢量图层注记",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=0a5eb6c7a016c54112aafab4b0a274ee",
            attributions: "使用天地图",
            wrapX: false
        }),
        // visible: false,      // 隐藏该图层
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
        title: "开发街道地图",
        source: new ol.source.OSM()
    });
    stamen = new ol.layer.Tile({
        title: "Stamen地图",
        source: new ol.source.Stamen({ layer: 'watercolor' }),
    });
    
    gaode = new ol.layer.Tile({
        // 使用火星坐标系
        title: "高德地图",
        source: new ol.source.XYZ({
            url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
            wrapX: false
        })
    });
    ChinaOnlineStreetPurplishBlue = new ol.layer.Tile({
        // 使用火星坐标系
        //http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer
        title: "蓝黑地图",
        source: new ol.source.XYZ({
            url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            wrapX: false
        })
    });
    googleMap = new ol.layer.Tile({
        // 使用火星坐标系
        title: "谷歌地图",
        source: new ol.source.XYZ({
            url: "http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z} ",
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

