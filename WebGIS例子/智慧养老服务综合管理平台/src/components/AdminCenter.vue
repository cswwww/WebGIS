<template>
  <el-container class="container">
    <!-- 左边部分：功能菜单---begin -->
    <el-aside width="200px">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <!-- 主页 -->
        <el-menu-item index="1">
          <i class="el-icon-s-home"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <!-- 数据中心 -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-coin"></i>
            <span>数据中心</span>
          </template>
          <el-menu-item class="el-submenu-item" index="2-1"
            >客户信息</el-menu-item
          >
          <el-menu-item class="el-submenu-item" index="2-2"
            >健康档案</el-menu-item
          >
          <el-menu-item class="el-submenu-item" index="2-3"
            >POI服务点</el-menu-item
          >
        </el-submenu>

        <!-- 业务管理 -->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>业务管理</span>
          </template>
          <el-menu-item class="el-submenu-item" index="3-1"
            >护理等级变更</el-menu-item
          >
          <el-menu-item class="el-submenu-item" index="3-2"
            >服务消息处理</el-menu-item
          >
        </el-submenu>
        <!-- <el-menu-item index="3">
          <i class="el-icon-coordinate"></i>
          <span slot="title">POI服务点</span>
        </el-menu-item> -->

        <!-- 账户信息 -->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-warning-outline"></i>
            <span>管理员信息</span>
          </template>
          <el-menu-item class="el-submenu-item" index="4-1"
            >登录信息</el-menu-item
          >
          <el-menu-item class="el-submenu-item" index="4-2"
            >操作日志</el-menu-item
          >
          <el-menu-item class="el-submenu-item" index="4-2"
            >修改密码</el-menu-item
          >
        </el-submenu>
        <!-- 报警信息 -->
        <el-menu-item index="5">
          <i class="el-icon-bell"></i>
          <span slot="title">报警信息</span>
        </el-menu-item>
        <!-- 可视化大屏 -->
        <el-menu-item index="6">
          <i class="el-icon-setting"></i>
          <span slot="title">数据集成中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 左边部分：功能菜单---end -->

    <!-- 右边部分---begin -->
    <el-container>
      <!-- 头部区域---begin -->
      <el-header>
        <!-- 系统名称  -->
        <strong class="sysNamepart">智慧养老服务综合管理平台</strong>
        <!-- 用户图标---文字链接 -->
        <div class="userpart">
          <!-- 用户图标部分 -->
          <el-avatar
            class="userimg"
            :size="userImgsize"
            :src="userIconurl"
          ></el-avatar>
          <!-- 文字链接部分 -->
          <el-dropdown class="dropdownpart" @command="handleCommand">
            <span class="el-dropdown-link"
              >{{ userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in userdropdownItems"
                :key="index"
                :command="item"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 头部区域---end -->

      <!-- 主体区域---begin -->
      <el-main>
        <!-- 可切换的面板 -->
        <!-- 地理视图 -->
        <div
          id="mapView"
          class="view"
          v-show="this.$data.showView.showMapView"
        ></div>
        <!-- 数据视图 -->
        <div
          id="dataView"
          class="view"
          v-show="this.$data.showView.showDataView"
        >
          2
        </div>
        <!-- 地理数据视图 -->
        <div
          id="datamapView"
          class="view"
          v-show="this.$data.showView.showDataMapView"
        >
          3
        </div>
        <!-- 控制切换的按钮 -->
        <div class="sliderTool-style">
          <SliderTool
            :itemProperty="controlBtnList"
            @clickItem="clickSliderTool"
          />
        </div>
      </el-main>
      <!-- 主体区域---end -->
    </el-container>
    <!-- 右边部分---end -->
  </el-container>
</template>

<script>
import SliderTool from '../components/Controls/SliderTool'
import * as MapUtils from '../utils/utils/mapUtils'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import Map from 'ol/Map'
import { fromLonLat, transform } from 'ol/proj'
import XYZ from 'ol/source/XYZ'
export default {
  components: {
    SliderTool,
  },
  data() {
    return {
      userIconurl: require('../../static/imgs/admincenter/user.png'),
      userImgsize: 'medium', //用户图标尺寸
      // , "medium", "small"
      userName: 'Unknown', //用户名
      userdropdownItems: ['个人中心', '返回上级', '退出登录'],
      showView: {
        showMapView: true, //地理视图
        showDataView: false, //数据视图
        showDataMapView: false, //地理数据视图
      },
      // 控制按钮列表
      controlBtnList: [
        {
          imgUrl: require('../../static/imgs/admincenter/mapview.png'),
          name: '地理视图',
        },
        {
          imgUrl: require('../../static/imgs/admincenter/dataview.png'),
          name: '数据视图',
        },
        {
          imgUrl: require('../../static/imgs/admincenter/mixedview.png'),
          name: '混合视图',
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(function () {
      //初始化地图
      // var map = new Map({
      //   layers: [
      //     new TileLayer({
      //       // source: new OSM(),
      //       source: new XYZ({
      //         crossOrigin: 'anonymous',
      //         url:
      //           'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
      //         // url:"http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      //       }),
      //     }),
      //   ],
      //   target: 'mapView',
      //   view: new View({
      //     center: fromLonLat([113.16965, 35.2351]),
      //     zoom: 10,
      //   }),
      // })
      MapUtils.initMap('mapView', 113.16965, 35.2351)
      //   var baseUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
      //   var params = {
      //     REQUEST: 'GetTile',
      //     SERVICE: 'WMTS',
      //     VERSION: '1.0.0',
      //     LAYER: 'test:jiaozuo',
      //     STYLE: '',
      //     TILEMATRIX: 'EPSG:4326' + ':{z}',
      //     TILEMATRIXSET: 'EPSG:4326',
      //     FORMAT: 'application/json;type=geojson',
      //     TILECOL: '{x}',
      //     TILEROW: '{y}',
      //   }

      //   /*指定layer的source属性值*/
      //   function constructSource() {
      //     var url = baseUrl + '?'
      //     for (var param in params) {
      //       url = url + param + '=' + params[param] + '&'
      //     }
      //     url = url.slice(0, -1)
      //     var source = new VectorTile({
      //       url: url,
      //       format: new GeoJSON({}),
      //       projection: new Projection({
      //         code: 'EPSG:4326',
      //         units: 'degrees',
      //         axisOrientation: 'neu',
      //       }),
      //       tileGrid: new WMTS({
      //         tileSize: [256, 256],
      //         origin: [-180.0, 90.0],
      //         resolutions: [
      //           0.703125,
      //           0.3515625,
      //           0.17578125,
      //           0.087890625,
      //           0.0439453125,
      //           0.02197265625,
      //           0.010986328125,
      //           0.0054931640625,
      //           0.00274658203125,
      //           0.001373291015625,
      //           6.866455078125e-4,
      //           3.4332275390625e-4,
      //           1.71661376953125e-4,
      //           8.58306884765625e-5,
      //           4.291534423828125e-5,
      //           2.1457672119140625e-5,
      //           1.0728836059570312e-5,
      //           5.364418029785156e-6,
      //           2.682209014892578e-6,
      //         ],
      //         matrixIds: 'EPSG:4326',
      //       }),
      //       wrapX: true,
      //     })
      //     return source
      //   }
      //   /*指定layer的样式*/
      //   function styleFunction(feature) {
      //     console.log(feature.values_.name)
      //     //获取要素的名称
      //     let name = feature.values_.name
      //     return new Style({
      //       stroke: new Stroke({
      //         color: '#fff',
      //         width: 1,
      //       }),
      //       fill: new Fill({
      //         color: 'rgba(0,0,255,0.2)',
      //       }),
      //       image: new ol.style.Circle({
      //         radius: 8,
      //         fill: new Fill({
      //           color: '#00f',
      //         }),
      //       }),
      //       text: new Text({
      //         text: feature.values_.name,
      //         fill: new Fill({
      //           color: 'black',
      //         }),
      //         textAlign: 'center',
      //       }),
      //     })
      //   }
      //   //创建Layer
      //   var layer = new ol.layer.VectorTile({
      //     source: constructSource(),
      //     style: styleFunction, //修改layer样式
      //   })
      //   //创建viewe视图
      //   var view = new ol.View({
      //     center: [0, 0],
      //     zoom: 4,
      //     projection: new ol.proj.Projection({
      //       code: 'EPSG:4326',
      //       units: 'degrees',
      //       axisOrientation: 'neu',
      //     }),
      //     extent: [-180.0, -90.0, 180.0, 90.0],
      //   })
      //   //实例化map
      //   var map = new ol.Map({
      //     // controls: ol.control.defaults({
      //     //     attribution: false
      //     // }).extend([
      //     //     new ol.control.MousePosition(),
      //     //     new ScaleControl()
      //     // ]),
      //     layers: [layer],
      //     target: 'map',
      //     view: view,
      //   })
      //   console.log(map)
      //   //缩放地图视图
      //   map
      //     .getView()
      //     .fit(
      //       [
      //         112.563232421875,
      //         34.810420989990234,
      //         113.6436996459961,
      //         35.494773864746094,
      //       ],
      //       map.getSize()
      //     )

      //   //添加地图点击事件
      //   map.on('singleclick', function (evt) {
      //     console.log(evt)
      //     if (map.hasFeatureAtPixel(evt.pixel)) {
      //       let feature = map.getFeaturesAtPixel(evt.pixel)
      //       console.log(feature)
      //       //获取被点击的要素名称
      //       let name = feature[0].values_.name
      //       console.log(name)
      //     }
      //   })
      // })
    })
  },
  methods: {
    //用户下拉菜单点击事件
    handleCommand(command) {
      //判断command内容，处理业务逻辑
      switch (command) {
        case '个人中心': {
          console.log(command)

          break
        }
        case '返回上级': {
          this.$router.push({ name: 'Home' })
          break
        }
        case '退出登录': {
          console.log(command)
          this.$router.push({ name: 'Login' })
          break
        }
      }
    },
    //左侧功能菜单点击事件
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    //右侧视图切换按钮点击事件
    clickSliderTool(value) {
      console.log(value)
      //判断被点击的按钮，执行业务逻辑代码
      switch (value.name) {
        case '地理视图': {
          this.showView.showMapView = true
          this.showView.showDataView = false
          this.showView.showDataMapView = false
          break
        }
        case '数据视图': {
          this.showView.showMapView = false
          this.showView.showDataView = true
          this.showView.showDataMapView = false
          break
        }
        case '混合视图': {
          this.showView.showMapView = false
          this.showView.showDataView = false
          this.showView.showDataMapView = true
          break
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #fff;
}

//左边部分：功能菜单
.el-aside {
  height: 100%;
  background-color: #545c64;
  .el-menu-item,
  .el-submenu {
    text-align: left;
  }
  .el-submenu-item {
    text-align: center;
  }
}

//左边-头部：系统名称+用户图标
.el-header {
  line-height: 60px;
  // background-color: #67c23a;
  background-color: rgb(23, 179, 163);
  display: flex;
  // 系统名称（自动占据所有剩余空间）
  .sysNamepart {
    flex: 1;
    // text-align: left;
  }
  .userpart {
    // 浮动布局+flex布局
    display: flex;
    line-height: 60px;
    // flex: 1;
    .userimg {
      text-align: center;
      margin-top: 10px;
      background-color: #fff;
    }
    .dropdownpart {
      padding-left: 15px;
      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
      }
    }
  }
}
//坐标-main：功能操作区域
.el-main {
  position: relative;
  background-color: #ccc;
  // 控制按钮
  .sliderTool-style {
    position: absolute;
    right: 15px;
  }
  // 视图样式
  .view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: burlywood;
  }
}
</style>
