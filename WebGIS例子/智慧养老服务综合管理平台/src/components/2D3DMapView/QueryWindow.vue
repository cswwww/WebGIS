<template>
  <div class="querywinwrap" v-show="this.$store.state.isShowQueryWindow">
    <i class="el-icon-s-help back-icon" @click="closeWindow"></i>
    <!-- <div id="map2d" class="map2d"></div> -->
    <div id="map3d" class="map3d"></div>
  </div>
</template>
<script>
import * as Cesium from 'cesium/Cesium'
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { fromLonLat, transform } from 'ol/proj'
import olcsES from '../../utils/utils/ol-cesium-es'
export default {
  data() {
    return {
      map2d: undefined, //二维地图
      map3d: undefined, //三维地图
      ols: undefined, //二三维联动效果
    }
  },
  mounted() {
    // this.$nextTick(() => {
    // })
    if (!this.map3d) {
      this.map3d = new Cesium.Viewer('map3d', {
        animation: false, //是否创建动画小器件，左下角仪表
        baseLayerPicker: false, //是否显示图层选择器
        fullscreenButton: false, //是否显示全屏按钮
        geocoder: false, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false, //是否显示Home按钮
        infoBox: false, //是否显示信息框
        sceneModePicker: false, //是否显示3D/2D选择器
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: false, //是否显示时间轴
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        //加载天地图卫星底图
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.gov.cn/img_w/wmts?tk=825fe12904c410012af61f3da2784af1',
          layer: 'img',
          style: 'default',
          tileMatrixSetID: 'w',
          format: 'tiles',
          maximumLevel: 18,
        }),
      })
      this.map3d.scene.debugShowFramesPerSecond = true
      //去除底部的商标（版权）信息
      this.map3d.cesiumWidget.creditContainer.style.display = 'none'
      //{ lng: row.lon, lat: row.lat })
      //定位到中国区域
      this.map3d.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 15500000),
        orientation: {
          heading: Cesium.Math.toRadians(348.4202942851978),
          pitch: Cesium.Math.toRadians(-89.74026687972041),
          roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
          // 定位完成之后的回调函数
        },
      })
    }
  },
  computed: {
    onServicePtCoord() {
      return this.$store.state.servicePtCoord
    },
    onQueryWindowState() {
      return this.$store.state.isShowQueryWindow
    },
  },
  watch: {
    onServicePtCoord(value) {
      console.log(value)
    },
    onQueryWindowState(value) {
      let _this = this
      if (value) {
        // _this.init2DMap()
        _this.init3DMap()
        // _this.initOls()
        // _this.ols.readFromView()
      }
    },
  },
  methods: {
    /**
     * 关闭窗口
     */
    closeWindow() {
      console.log('关闭窗口')
      this.$store.dispatch('setServicePtCoord', undefined) //置空全局变量
      this.$store.dispatch('setIsShowQueryWindow', false)
    },
    init2DMap() {
      this.map2d = new Map({
        layers: [
          new TileLayer({
            // source: new OSM(),
            source: new XYZ({
              crossOrigin: 'anonymous',
              url:
                'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
              // url:"http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            }),
          }),
        ],
        target: 'map2d',
        view: new View({
          // center: fromLonLat([113.24192, 35.215595]),
          // zoom: 9,
        }),
      })
    },
    //初始化三维球
    init3DMap() {
      //先移除所有的实体
      this.map3d.entities.removeAll()
      //添加entity
      let entity = new Cesium.Entity({
        //地理位置属性(经纬度转Cesium世界坐标)
        position: Cesium.Cartesian3.fromDegrees(
          this.$store.state.servicePtCoord.lng, //经度
          this.$store.state.servicePtCoord.lat, //纬度
          0.0 //height:default value
        ),
        //图标
        billboard: {
          //图标
          image: require('../../../static/imgs/home/yellowMarker.png'),
          width: 24,
          height: 24,
        },
        name: 'xinxidian',
        show: true, //是否显示实体
      })
      this.map3d.entities.add(entity)
      this.map3d.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          this.$store.state.servicePtCoord.lng,
          this.$store.state.servicePtCoord.lat,
          500.0
        ),
      })
      // this.map3d.zoomTo(entity)
    },
    initOls() {
      this.ols = new olcsES(this.map3d.scene, this.map2d)
    },
  },
}
</script>
<style lang="less" scoped>
.querywinwrap {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  //返回图标
  .back-icon {
    position: absolute;
    right: -15px;
    top: -15px;
    font-size: 24px;
    color: #fff;
  }
  // .map2d {
  //   float: left;
  //   width: 50%;
  //   height: 100%;
  //   background-color: lavender;
  // }
  .map3d {
    float: right;
    width: 100%;
    height: 100%;
    background-color: lavender;
  }
}
</style>
