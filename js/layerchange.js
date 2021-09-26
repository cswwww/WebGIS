function tiandituO(){
    map1.removeLayer(osm);
    map1.removeLayer(stamen);
    map1.addLayer(td_cva);
    map1.addLayer(td_vec);
    map1.addLayer(td_img);
    map1.addLayer(td_cia);
    document.getElementById('basemap0').style.background = 'url(/img/tianditu.png) no-repeat right'
  };
  function osmO(){
    layer.msg('您好！开放街道地图(OSM)是国外地图数据源，加载可能需要一定时间');
    map1.removeLayer(stamen);
    map1.removeLayer(td_cva);
    map1.removeLayer(td_vec);
    map1.removeLayer(td_img);
    map1.removeLayer(td_cia);
    map1.addLayer(osm);
    document.getElementById('basemap0').style.background = 'url(/img/osm.png) no-repeat right'
  };
  function stamenO(){
    layer.msg('您好！Stamen是国外地图数据源，加载可能需要一定时间');

    map1.removeLayer(osm);
    map1.removeLayer(gaode);
    map1.removeLayer(td_cva);
    map1.removeLayer(td_vec);
    map1.removeLayer(td_img);
    map1.removeLayer(td_cia);
    map1.addLayer(stamen);
    document.getElementById('basemap0').style.background = 'url(/img/stamen.png) no-repeat right'
  };
  function gaodeO(){
    map1.removeLayer(osm);
    map1.removeLayer(stamen);
    map1.removeLayer(td_cva);
    map1.removeLayer(td_vec);
    map1.removeLayer(td_img);
    map1.removeLayer(td_cia);
    map1.addLayer(gaode);
    document.getElementById('basemap0').style.background = 'url(/img/gaode.png) no-repeat right'
  };
  
  
  