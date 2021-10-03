//===============================调用wms
var wmsLayer = new ol.layer.Image({
    visible: true,
    source: new ol.source.ImageWMS({
    ratio: 1,
    url: "http://www.csw.ink:8080/geoserver/webgis/wms",
    params: {
     'FORMAT': 'image/png',
     'VERSION': '1.1.0',
     'LAYERS': 'webgis:gdut',
     'STYLES': '',
 }
})
});

// var wmsLayer = new ol.layer.Tile({
//     visible: true,
//     source: new ol.source.TileWMS({
//         url: "http://www.csw.ink:8080/geoserver/webgis/wms",
//         params: {
//             'FORMAT': 'image/png',
//             'VERSION': '1.1.0',
//             'tiled': true,
//             'LAYERS': 'webgis:gdut',
//             'STYLES': '',
            
//         }
//     })
// });

//===============================调用wmts
      // 首先设置好WMTS瓦片地图的投影坐标系
      let projectiona = ol.proj.get('EPSG:900913');          // 获取web墨卡托投影坐标系
      let projectionExtent = projectiona.getExtent();      // web墨卡托投影坐标系的四至
      let width = ol.extent.getWidth(projectionExtent);   // web墨卡托投影坐标系的水平宽度，单位米
      let resolutions = [];                               // 瓦片分辨率
      let matrixIds = [];
      for(let z = 1; z < 18; z++){
          resolutions[z] = width / (256 * Math.pow(2, z)); 
          matrixIds[z] = z;
      }
      let wmtsTileGrid = new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent), // 原点（左上角）
          resolutions: resolutions,                       // 分辨率数组
          matrixIds: matrixIds                            // 矩阵ID，就是瓦片坐标系z维度各个层级的标识
      }); 

       // WMTS数据源与地图
       let wmtsSource = new ol.source.WMTS({
        url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=0a5eb6c7a016c54112aafab4b0a274ee",  // 天地图key去官网很容易申请
        layer: 'img',                  // 图层名
        version: '1.0.0',                   // WMTS版本
        // 投影坐标系矩阵集，一定要和WMTS capabilities文档中一致，否则会加载失败
        matrixSet: 'w',          
        format: 'tiles',                // 图片格式
        projection: projectiona,             // 投影坐标系
        requestEncoding: 'KVP',             // 请求的编码方式，默认就是'KVP'   
        // 在WMTS capabilities文档中对应的样式名，一定要写，否则会加载失败  
        style: 'default',                   
        tileGrid: wmtsTileGrid              // 投影坐标系
    });
    let wmtsLayer = new ol.layer.Tile({
        source: wmtsSource
    });




        // 矩阵标识列表，与地图级数保持一致
        var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
        //切片大小（分辨率）
        var resolutionsb = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
        var wmtsLayer2 =new ol.layer.Tile({
            source: new ol.source.WMTS({
                //服务地址
                url: 'http://csw.ink:8080/geoserver/gwc/service/wmts',
                layer: 'webgis:gdut',
                matrixSet: 'EPSG:4326',
                format: 'image/png',
                projection: ol.proj.get('EPSG:4326'),
                //切片策略
                tileGrid: new ol.tilegrid.WMTS({
                    tileSize: [256, 256],
                    extent: [-180.0, -90.0, 180.0, 90.0],//范围
                    origin: [-180.0, 90.0],
                    resolutions: resolutionsb,  //分辨率
                    matrixIds: gridNames,    //层级标识列表
                }),
                wrapX: false
            }),
          
        });
    
//===============================调用WFS
        //实例化矢量图层数据源对象（使用ajax请求WFS服务）
        var wfsVectorSource = new ol.source.Vector({
            loader: function (extent, resolution, projection) {
                //WFS的GetFeature接口访问地址，指定服务回调方法
                var url = 'http://www.csw.ink:8080/geoserver/webgis/ows?service=WFS&' +
                    'version=1.0.0&request=GetFeature&typeName=webgis%3Agdut&' +
                    'maxFeatures=50&outputFormat=text%2Fjavascript';
                //使用jQuery的ajax方法进行请求，使用jsonp方式，设置jsonp参数为false防止jQuery添加“callback”回调方法
                $.ajax({ url: url, dataType: 'jsonp', jsonp: false });
            },
            //加载策略设置
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                maxZoom: 19
            }))
        });
/**
        * JSONP WFS 的回调方法（callback）
        * @param {Object} response 响应对象
        */
        window.loadFeatures = function (response) {
            //解析WFS GetFeature接口的响应结果，将解析得到的矢量要素添加到数据源中
            wfsVectorSource.addFeatures(geojsonFormat.readFeatures(response));
        };
        //实例化ol.layer.Vector对象加载WFS要素
        wfsLayer = new ol.layer.Vector({
            //数据源（W FS的矢量要素）
            source: wfsVectorSource,
            //矢量要素样式
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                })
            })
        });