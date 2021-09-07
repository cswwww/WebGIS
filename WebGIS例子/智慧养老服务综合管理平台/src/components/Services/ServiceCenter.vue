<template>
  <div class="servicecenterwrap" v-show="this.$store.state.isShowServiceCenter">
    <!-- 标题部分 -->
    <div class="title"><i class="el-icon-s-help"> 服务中心</i></div>
    <!-- 关闭按钮 -->
    <i
      class="el-icon-circle-close close-item"
      title="关闭窗口"
      @click="closeWindow"
    ></i>
    <!-- 顶部操作按钮部分 -->
    <div class="funcbtns">
      <el-row>
        <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple-light">
            <el-switch
              v-model="switchValue"
              active-text="已处理"
              inactive-text="未处理"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSwitch"
            >
            </el-switch></div
        ></el-col>
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple-light nurse-item">
            状态值：<span class="item">0-未处理</span
            ><span class="item">1-已处理</span>
          </div></el-col
        >
        <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"
          ><div
            class="grid-content bg-purple-light static-item"
            @click="switchView"
          >
            数据视图
            <!-- <i class="el-icon-sort"></i> 统计视图 -->
          </div></el-col
        >
      </el-row>
    </div>
    <!-- 分割线 -->
    <el-divider class="seperateline"></el-divider>
    <!-- 表格内容部分 -->
    <div class="tableContent" v-show="isShowTableContent">
      <el-table :data="tableData" height="550" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="服务内容">
                <span>{{ props.row.serviceContent }}</span>
              </el-form-item>
              <el-form-item label="经度">
                <span>{{ props.row.lon }}</span>
              </el-form-item>
              <el-form-item label="纬度">
                <span>{{ props.row.lat }}</span>
              </el-form-item>
              <el-form-item label="预约时间">
                <span>{{ props.row.orderTime }}</span>
              </el-form-item>
              <el-form-item label="处理时间">
                <span>{{ props.row.endTime }}</span>
              </el-form-item>
              <el-form-item label="服务地址">
                <span>{{ props.row.serviceAddress }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号 ID" prop="id"> </el-table-column>
        <el-table-column label="用户" prop="username"> </el-table-column>
        <el-table-column label="请求时间" prop="orderTime"> </el-table-column>
        <el-table-column label="处理状态" prop="orderState"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              :disabled="isAbled"
              @click="agreeClick(scope.row)"
              >同意</el-button
            >
            <el-button
              type="text"
              size="small"
              :disabled="isAbled"
              @click="disAgreeClick(scope.row)"
              >拒绝</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="maxPageSize"
        @current-change="currentChanhe"
      >
      </el-pagination>
    </div>
    <!-- 二维地图部分 -->
    <!-- <div class="geoContent" id="olmapinstance" v-show="isShowGeoContent"></div> -->
  </div>
</template>
<script>
import * as SERVICE from '../../utils/service/serviceUtils'
import { Notification } from 'element-ui'
//导出openlayers接口
// import 'ol/ol.css' //样式文件
// import Map from 'ol/Map'
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
// import XYZ from 'ol/source/XYZ'
// import View from 'ol/View'
// import { fromLonLat } from 'ol/proj'
// import { defaults } from 'ol/control.js'
import 'ol/ol.css'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, Projection } from 'ol/proj'
// import { VectorTile as VectorSource } from 'ol/source'
// import { GeoJSON } from 'ol/format'
// import { WMTS } from 'ol/tilegrid'
// import { Style, Stroke, Fill, Circle, Text } from 'ol/style'
// import { VectorTile as VectorLayer } from 'ol/layer'
export default {
  data() {
    return {
      switchValue: true, //开关属性
      switchRes: 1, //状态值
      tableData: [],
      maxPageSize: 1,
      isShowTableContent: true, //是否显示数据视图
      // isShowGeoContent: true, //是否显示地理视图
      olMap: undefined,
      isAbled: true, //定义按钮是否可用[默认显示已处理记录，设置为不可用]
    }
  },
  mounted() {
    let _this = this
    this.$nextTick(() => {
      _this.getPageSize() //获取分页页数
      _this.initData()
      //初始化地图页面
      // _this.initOlMap('olmapinstance')
    })
  },
  methods: {
    /**初始化openlayers地图 */
    initOlMap(_mapId) {
      if (this.olMap) this.olMap = undefined //置空地图实例
      //获取矢量切片url与基本样式定义
      // var baseUrl = 'http://localhost:8080/geoserver/gwc/service/wmts'
      // var params = {
      //   REQUEST: 'GetTile',
      //   SERVICE: 'WMTS',
      //   VERSION: '1.0.0',
      //   LAYER: 'test:jiaozuo',
      //   STYLE: '',
      //   TILEMATRIX: 'EPSG:4326' + ':{z}',
      //   TILEMATRIXSET: 'EPSG:4326',
      //   FORMAT: 'application/json;type=geojson',
      //   TILECOL: '{x}',
      //   TILEROW: '{y}',
      // }

      // /*指定layer的source属性值*/
      // function constructSource() {
      //   var url = baseUrl + '?'
      //   for (var param in params) {
      //     url = url + param + '=' + params[param] + '&'
      //   }
      //   url = url.slice(0, -1)
      //   var source = new VectorSource({
      //     url: url,
      //     format: new GeoJSON({}),
      //     projection: new Projection({
      //       code: 'EPSG:4326',
      //       units: 'degrees',
      //       axisOrientation: 'neu',
      //     }),
      //     tileGrid: new WMTS({
      //       tileSize: [256, 256],
      //       origin: [-180.0, 90.0],
      //       resolutions: [
      //         0.703125,
      //         0.3515625,
      //         0.17578125,
      //         0.087890625,
      //         0.0439453125,
      //         0.02197265625,
      //         0.010986328125,
      //         0.0054931640625,
      //         0.00274658203125,
      //         0.001373291015625,
      //         6.866455078125e-4,
      //         3.4332275390625e-4,
      //         1.71661376953125e-4,
      //         8.58306884765625e-5,
      //         4.291534423828125e-5,
      //         2.1457672119140625e-5,
      //         1.0728836059570312e-5,
      //         5.364418029785156e-6,
      //         2.682209014892578e-6,
      //       ],
      //       matrixIds: 'EPSG:4326',
      //     }),
      //     wrapX: true,
      //   })
      //   return source
      // }
      // /*指定layer的样式*/
      // function styleFunction(feature) {
      //   console.log(feature.values_.name)
      //   //获取要素的名称
      //   let name = feature.values_.name
      //   return new Style({
      //     stroke: new Stroke({
      //       color: '#fff',
      //       width: 1,
      //     }),
      //     fill: new Fill({
      //       color: 'rgba(0,0,255,0.2)',
      //     }),
      //     image: new Circle({
      //       radius: 8,
      //       fill: new Fill({
      //         color: '#00f',
      //       }),
      //     }),
      //     text: new Text({
      //       text: feature.values_.name,
      //       fill: new Fill({
      //         color: 'black',
      //       }),
      //       textAlign: 'center',
      //     }),
      //   })
      // }
      // //创建Layer
      // var layer = new VectorLayer({
      //   source: constructSource(),
      //   style: styleFunction, //修改layer样式
      // })

      var map = new Map({
        layers: [
          // new TileLayer({
          //   source: new OSM(),
          // }),
          new TileLayer({
            //影像底图
            className: 'sat',
            source: new XYZ({
              url:
                'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
              wrapX: true,
            }),
            visible: true,
          }),
          //叠加矢量边界
          // layer,
        ],
        target: _mapId,
        view: new View({
          center: fromLonLat([113.2609138954192, 35.190953503678095]),
          zoom: 12,
        }),
      })
      //记录当前实例
      this.olMap = map

      //创建新的地图实例
      // var map = new Map({
      //   layers: [
      //     //定义图层
      //     // new TileLayer({
      //     //     source: new OSM(),
      //     // }),
      //     new TileLayer({
      //       className: 'maptiles',
      //       source: new XYZ({
      //         // 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&scl=1&ltype=2',
      //         url:
      //           'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      //         // url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      //         // url: 'http://192.168.124.70/{z}/{x}/{y}.jpg',
      //         wrapX: true,
      //       }),
      //       visible: true,
      //     }),
      //     new TileLayer({
      //       //影像底图
      //       className: 'sat',
      //       source: new XYZ({
      //         // 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&scl=1&ltype=2',
      //         // url: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      //         url:
      //           'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      //         // url: 'http://192.168.124.70/{z}/{x}/{y}.jpg',
      //         wrapX: true,
      //       }),
      //       visible: false,
      //     }),
      //   ],
      //   target: 'olmapinstance', //dom容器的id值
      //   view: new View({
      //     // 113.274063, 35.193959
      //     //113.24315696502676,35.21484481827645
      //     center: fromLonLat([113.241823, 35.215892]),
      //     zoom: 10,
      //     projection: 'EPSG:3857',
      //   }),
      //   controls: new defaults({
      //     attribution: false,
      //     rotate: false,
      //     zoom: false,
      //   }),
      // })
    },
    /**关闭窗口 */
    closeWindow() {
      this.$store.dispatch('setIsShowServiceCenter', false)
    },
    /**分页的当前页改变 */
    currentChanhe(value) {
      console.log(value)
      //触发数据响应
      if (this.switchRes == 1) {
        SERVICE.selectAllDetailByPageSize((value - 1) * 9, 9).then((res) => {
          let data = res.data
          console.log(data)
          //先清空数据集
          this.tableData = []
          let len = data.length - 1
          while (len >= 0) this.tableData.unshift(data[len--])
        })
      } else {
        console.log('获取未处理数据')
      }
    },
    /**获取分页页数 */
    getPageSize() {
      SERVICE.getPageSize(9).then((res) => {
        let data = res.data
        this.maxPageSize = data
      })
    },
    /**获取未处理的分页数量 */
    getUnsolvedPageSize() {
      SERVICE.getUnSolvedPageSize(9).then((res) => {
        let data = res.data
        this.maxPageSize = data
      })
    },
    /**初始化数据 */
    initData() {
      console.log('更新')
      SERVICE.selectAllDetailByPageSize(0, 9).then((res) => {
        let data = res.data
        console.log(data)
        //先清空数据集
        this.tableData = []
        let len = data.length - 1
        while (len >= 0) this.tableData.unshift(data[len--])
      })
    },
    initUnSolvedData() {
      SERVICE.selectAllWidthoutDeal(0, 9).then((res) => {
        let data = res.data
        this.tableData = []
        let len = data.length - 1
        while (len >= 0) this.tableData.unshift(data[len--])
      })
    },
    /**查看信息 */
    handleClick(row) {
      console.log(row)
      this.$store.dispatch('setServicePtCoord', { lng: row.lon, lat: row.lat }) //修改全局变量
      this.$store.dispatch('setIsShowQueryWindow', true) //修改querywindow窗口的显隐状态
    },
    /**同意提供服务 */
    agreeClick(row) {
      let state = row.orderState
      if (state == 1) {
        Notification.info({
          title: 'Attention',
          message: '该消息无需处理!',
        })
        return false
      }
      SERVICE.updateServiceRecord(
        row.username,
        row.lon,
        row.lat,
        row.orderTime,
        'admin1',
        1
      ).then((res) => {
        let data = res.data
        if (data == 1) {
          Notification.success({
            title: 'Success',
            message: '消息处理成功！!',
          })
        } else {
          Notification.warning({
            title: 'Error',
            message: '消息处理失败,请重试！!',
          })
        }
      })
      console.log(row)
    },
    /**不同意提供服务 */
    disAgreeClick(row) {
      let state = row.orderState
      if (state == 1) {
        Notification.info({
          title: 'Attention',
          message: '该消息无需处理!',
        })
        return false
      }
      SERVICE.updateServiceRecord(
        row.username,
        row.lon,
        row.lat,
        row.orderTime,
        'admin1',
        2
      ).then((res) => {
        let data = res.data
        if (data == 1) {
          Notification.success({
            title: 'Success',
            message: '消息处理成功！!',
          })
        } else {
          Notification.warning({
            title: 'Error',
            message: '消息处理失败,请重试！!',
          })
        }
      })
      console.log(row)
    },
    /**
     * 切换数据/统计视图
     */
    switchView(value) {
      console.log('switch', value)
    },
    /**开关选项 */
    changeSwitch(value) {
      if (value) {
        //表示已处理
        this.switchRes = 1
        this.getPageSize()
        this.initData()
        //按钮不可用
        this.isAbled = true
      } else {
        this.switchRes = 0 //表示未处理
        this.getUnsolvedPageSize()
        this.initUnSolvedData()
        //按钮可用
        this.isAbled = false
      }
      console.log(this.switchRes)
    },
  },
}
</script>
<style>
.el-divider--horizontal {
  margin: 10px 0;
}
.el-switch__label {
  color: #fff;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-table__body tr.hover-row > td {
  background-color: rgb(28, 120, 134);
}
.el-pagination.is-background .el-pager li {
  background-color: transparent;
  color: #fff;
}
</style>
<style lang="less" scoped>
.servicecenterwrap {
  position: absolute;
  top: 60%;
  left: 50%;
  width: 1400px;
  height: 660px;
  color: #fff;
  transform: translate(-50%, -50%);
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  // 标题样式
  .title {
    position: absolute;
    top: -5px;
    left: -5px;
    padding: 10px;
    background-color: slateblue;
    border-top-left-radius: 10px;
    border-bottom-right-radius: 15px;
  }
  // 关闭按钮
  .close-item {
    position: absolute;
    top: -14px;
    right: -14px;
    font-size: 28px;
  }
  // 功能按钮
  .funcbtns {
    margin-top: 10px;
    .bg-purple {
      color: #fff;
    }
    .bg-purple-light {
      // background: #e5e9f2;
      line-height: 38px;
      cursor: pointer;
    }
    .static-item {
      border: 1px solid skyblue;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 35px;
    }
    .nurse-item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .item:nth-child(1) {
        padding: 0 3px;
        background-color: rgb(192, 47, 47);
      }
      .item:nth-child(2) {
        padding: 0 3px;
        background-color: rgb(51, 187, 51);
      }
    }
  }
  // 分割线
  .seperateline {
    background-color: blue;
  }
  //表格部分
  .tableContent {
    height: 400px;

    // background-color: slateblue;
  }
  //地理视图部分
  .geoContent {
    position: absolute;
    top: 62px;
    left: 0;
    width: 100%;
    height: 598px;
    background-color: slateblue;
  }
}
// 取消滚动条显示
.el-table--scrollable-y ::-webkit-scrollbar {
  display: none;
}
.el-button--text {
  color: orange;
}
/deep/ .el-table__expand-icon {
  color: #fff;
  font-weight: 700;
}
</style>
