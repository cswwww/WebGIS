<template>
  <div class="container" v-if="this.$store.state.isShowPopUpWindow">
    <i class="el-icon-question windowIcon"></i>
    <span>Property-Window</span>
    <!-- 关闭按钮 -->
    <i class="el-icon-circle-close closeIcon" @click="closeWindow"></i>
    <!-- 主体内容 -->
    <el-row class="mainContent">
      <!-- 左边区域---begin -->
      <el-col :span="12" class="leftPart">
        <el-row class="right-row-1" :gutter="40">
          <i class="el-icon-info tip-icon">&nbsp;&nbsp;资料卡</i>
          <span class="tip-blank"></span>
          <div class="tip-name">
            <span class="tip-name-item">Name</span>
            <i class="tip-split-item">|</i>
            <span class="tip-name-item">{{ inputValueObj.name }}</span>
          </div>
        </el-row>
        <!-- 详细信息 -->
        <el-row class="right-row-2" :gutter="20">
          <el-col :span="12">
            <!-- //左边部分 -->
            <div class="basic-item">
              <span class="basic-item-property">性别：</span
              ><span>{{ inputValueObj.sex }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">年龄：</span
              ><span>{{ inputValueObj.age }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">职业：</span
              ><span>{{ inputValueObj.occupation }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">Tel：</span
              ><span>{{ inputValueObj.phoneNum }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">第三方：</span
              ><span>{{ inputValueObj.agentName }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <!-- //右边部分 -->
            <div class="basic-item">
              <span class="basic-item-property">健康指数：</span><span>56</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">护理等级：</span
              ><span>{{ inputValueObj.nurseLevel }}</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property"> 服务时长：</span
              ><span>{{ inputValueObj.serviceDays }}/天</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">服务次数：</span
              ><span>{{ inputValueObj.serviceTimes }}/次</span>
            </div>
            <div class="basic-item">
              <span class="basic-item-property">报警次数：</span
              ><span>{{ inputValueObj.warnTimes }}/次</span>
            </div>
          </el-col>
          <el-row class="address">
            <div class="basic-item">
              <span class="basic-item-property">住址：</span
              ><span>{{ inputValueObj.curAddress }}</span>
            </div>
          </el-row>
        </el-row>
        <el-row class="right-row-3" :gutter="20">
          <div id="map"></div>
          <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
          </div>
        </el-row>
      </el-col>
      <!-- 左边区域---end -->
      <!-- 右边区域---begin -->
      <el-col :span="12" class="rightPart">
        <!-- 切换图表的图标 -->

        <!-- 图表1：健康指数变化图 -->
        <div id="chart1" class="right-chart" v-show="showChart1"></div>

        <!-- 图表2：报警次数变化图 -->
        <div id="chart2" class="right-chart" v-show="showChart2"></div>
        <!-- 切换图表的图标 -->
        <img
          class="switch-image"
          :src="switchUrl"
          alt=""
          @click="switchEChart"
        />
        <!-- <el-image
          class="switch-image"
          style="width: 24px; height: 24px"
          :src="switchUrl"
          @click="switchEChart"
        ></el-image> -->
      </el-col>

      <!-- 右边区域---end -->
    </el-row>
  </div>
</template>

<script>
import * as MapUtils from '../../utils/utils/mapUtils'
import * as SERVICE from '../../utils/service/serviceUtils'
import KeyValueMathUtil from '../../utils/utils/KeyValueMathUtil'
import DateParseUtils from '../../utils/utils/DateParseUtils'
import 'ol/ol.css'
import Map from 'ol/Map'
// import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import Overlay from 'ol/Overlay'
import View from 'ol/View'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { fromLonLat, transform } from 'ol/proj'
import { toStringHDMS } from 'ol/coordinate'
import XYZ from 'ol/source/XYZ'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
export default {
  data() {
    return {
      //图片样式
      switchImgfit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      //图标路径
      switchUrl: require('../../../static/imgs/popupwindow/switch.png'),
      //控制图表1-健康指数变化图 显隐
      showChart1: true,
      //控制图表2-报警次数变化图 显隐
      showChart2: true,
      //属性信息
      itemProperty: {},
      //inputVal
      inputValueObj: {
        age: 100,
        agentName: '孙武新',
        curAddress: '河南省焦作市山阳区东方红街道和平街社区',
        lat: 35.2411,
        lon: 113.243,
        name: '宋斌',
        nurseLevel: '特护一级',
        occupation: '导游',
        phoneNum: '16656851040',
        serviceDays: 627,
        serviceTimes: 1,
        warnTimes: 1,
      },
    }
  },
  //计算属性
  computed: {
    //控制当前窗体的显隐
    onPopUpWindowState() {
      return this.$store.state.isShowPopUpWindow
    },
    //控制当前窗体的属性信息
    onPopWindowItemProperty() {
      return this.$store.state.popWindowItemProperty
    },
  },
  //监听属性
  watch: {
    onPopUpWindowState(value) {},
    onPopWindowItemProperty(value) {
      this.$data.itemProperty = value
      console.log(this.itemProperty)
      if (this.itemProperty && this.itemProperty.idnum) {
        //发送请求，初始化基本信息
        SERVICE.getUserStatisticsInfoByIdNum(this.itemProperty.idnum).then(
          (res) => {
            this.$data.inputValueObj = res.data
            console.log(res.data)
            //地图信息初始化
            this.initConponentInfo(this.$data.inputValueObj)
            //初始化图表
            this.initWarnTimeInfoChart(this.itemProperty.idnum)
          }
        )
      }
    },
  },
  mounted() {
    console.log(this.itemProperty)
    this.$nextTick(function () {})
  },
  methods: {
    /**
     * 初始化组件信息内容
     */
    initConponentInfo(inputVal) {
      let mapInstance = MapUtils.initMap('map', inputVal.lon, inputVal.lat)
      MapUtils.initMarker(mapInstance, inputVal.lon, inputVal.lat)
      MapUtils.initPopUpInfo(mapInstance, inputVal.lon, inputVal.lat)
    },
    /**关闭弹出窗口 */
    closeWindow() {
      console.log('点击事件')
      this.$store.dispatch('setIsShowPopUpWindow', false)
    },
    /**切换图表 */
    switchEChart() {
      console.log('切换图表')
      this.showChart1 = !this.showChart1
      // this.showChart2 = !this.showChart2
    },
    /**根据报警信息绘制图表 chart2 */
    initWarnTimeInfoChart(idnum) {
      console.log(idnum)
      if (idnum == undefined) {
        return false
      }
      //初始化图表
      let myChart0 = this.$echarts.init(document.getElementById('chart1'))
      let mychart = this.$echarts.init(document.getElementById('chart2'))
      //请求数据-按月份统计
      SERVICE.getWarnTimeInfoMonthly(idnum).then((resbymonth) => {
        let dataC1 = resbymonth.data
        let dataListC1 = dataC1.map((item) => {
          return item.name
        })
        let ValueListC1 = dataC1.map((item) => {
          return item.value
        })
        //获取最大最小值
        let minValue = new KeyValueMathUtil(dataC1).getMinValue()
        let maxValue = new KeyValueMathUtil(dataC1).getMaxValue()

        //请求数据-详细报警时刻
        SERVICE.getWarnTimeInfoDetail(idnum).then((resdetail) => {
          let dataC2 = resdetail.data
          let dataListC2 = dataC2.map((item) => {
            return item.name
          })
          let ValueListC2 = dataC2.map((item) => {
            return item.value
          })
          //初始化图表
          let option = {
            // Make gradient line here-线条线性渐变样式
            visualMap: [
              {
                show: true,
                type: 'continuous',
                top: '15%',
                right: 5,
                seriesIndex: 0,
                min: minValue != undefined ? minValue : 0,
                max: maxValue != undefined ? maxValue : 1,
              },
              {
                show: false,
                type: 'continuous',
                seriesIndex: 1,
                dimension: 0,
                min: 0,
                max: dataListC1.length - 1,
              },
            ],
            //图标标题样式
            title: [
              {
                left: '5%',
                text: '月平均报警次数',
              },
              {
                top: '72%',
                left: '5%',
                text: '报警时间线',
              },
            ],
            dataZoom: [
              {
                xAxisIndex: 1, //控制第二个图表的时间线
                startValue: '2014-06-01',
              },
              {
                type: 'inside',
              },
            ],
            //鼠标悬停显示内容
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(0,0,0,0.6)',
              textStyle: {
                color: '#fff',
              },
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999',
                },
              },
            },
            //X轴
            xAxis: [
              {
                data: dataListC1,
              },
              {
                data: dataListC2,
                gridIndex: 1,
              },
            ],
            //Y轴
            yAxis: [
              {},
              {
                gridIndex: 1,
                show: false,
              },
            ],
            //坐标轴样式
            grid: [
              {
                bottom: '40%',
              },
              {
                top: '80%',
              },
            ],
            //绘制图表
            series: [
              {
                type: 'line',
                //showSymbol: false,
                data: ValueListC1,
              },
              {
                type: 'line',
                //showSymbol: false,
                data: ValueListC2,
                xAxisIndex: 1,
                yAxisIndex: 1,
              },
            ],
          }
          mychart.setOption(option)
        })
      })
      //请求数据-健康信息数据
      SERVICE.getHealthInfoByIdnum('41088219301111650X').then(
        (resHealthInfo) => {
          // console.log(resHealthInfo)
          let healthInfoData = resHealthInfo.data
          //获取时间轴
          let axis_x = [],
            len = healthInfoData[1][0].length - 1
          while (len--) {
            axis_x.unshift(
              new DateParseUtils(healthInfoData[1][0][len]).formatDate()
            )
          }
          //初始化图表
          let option = {
            title: {
              text: '健康指数曲线图',
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(0,0,0,0.6)',
              textStyle: {
                color: '#fff',
              },
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999',
                },
              },
            },
            legend: {
              orient: 'vertical',
              right: 25,
              data: healthInfoData[0],
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            // toolbox: {
            //   feature: {
            //     saveAsImage: {},
            //   },
            // },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: axis_x,
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                name: '血压值',
                type: 'line',
                stack: '总量',
                data: healthInfoData[1][1],
              },
              {
                name: '脉搏频率',
                type: 'line',
                stack: '总量',
                data: healthInfoData[1][2],
              },
              {
                name: '体温值',
                type: 'line',
                stack: '总量',
                data: healthInfoData[1][3],
              },
              {
                name: '呼吸速率',
                type: 'line',
                stack: '总量',
                data: healthInfoData[1][4],
              },
            ],
          }
          myChart0.setOption(option)
        }
      )
    },
  },
}
</script>
<style>
/* 去掉el-row的左右margin值-20px */
.el-row {
  margin: 0 !important;
}
</style>
<style lang="less" scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  // border-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  //窗口图标
  .windowIcon {
    float: left;
    // position: absolute;
    left: 0;
    top: 3px;
    padding: 5px;
    color: orange;
    font-size: 24px;
  }
  //关闭按钮
  .closeIcon {
    float: right;
    // position: absolute;
    right: 0;
    top: 3px;
    padding: 5px;
    font-size: 24px;
  }
  //主体区域
  .mainContent {
    position: relative;
    width: 100%;
    height: 97%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    overflow: hidden;
    // clear: both;
    // content: '';
    // width: 0;
    // height: 0;
    // display: block;
    // visibility: hidden;
    //左边区域
    .leftPart {
      height: 100%;
      // background-color: pink;
      overflow: hidden;
      .right-row-1 {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: right;
        height: 10%;
        padding: 0;
        .tip-icon {
          // position: absolute;
          // top: 5px;
          // left: 35px;
          margin-left: 5px;
          flex: 1;
          padding: 10px 0;
          background-color: royalblue;
          border-start-end-radius: 25px;
          border-bottom-left-radius: 25px;
        }
        .tip-blank {
          flex: 1;
          background-color: seagreen;
        }
        .tip-name {
          display: flex;
          justify-content: space-around;
          flex: 2;
          margin-right: 5px;
          padding: 3px 0;
          background-color: rgba(0, 0, 255, 0.4);
          border-radius: 10px;
          .tip-name-item {
            flex: 1;
            padding: 3px 0;
            // border: 1px solid blue;
          }
          .tip-split-item {
            display: inline-block;
            font-size: 22px;
            color: blue;
          }
        }
      }
      .right-row-2 {
        height: 35%;
        // background-color: rgba(0, 0, 0, 0.5);
        border-top: 1px solid skyblue;
        border-bottom: 1px solid skyblue;
        .basic-item {
          padding-top: 5px;
          text-align: left;
          .basic-item-property {
            padding-right: 5px;
            color: #fff;
            font-weight: 700;
          }
        }
        .basic-item:last-child {
          padding-bottom: 5px;
        }
        .address {
          padding: 0px 10px;
          text-align: left;
        }
      }
      .right-row-3 {
        height: 51%;
        background-color: rgba(0, 0, 0, 0.8);
        #map {
          margin: 0 auto;
          margin-top: 2px;
          height: 99%;
          // background-color: orchid;
        }
        //弹出框样式
        .ol-popup {
          position: absolute;
          // background-color: white;
          background-color: rgba(10, 42, 47, 0.8);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          padding: 2px;
          border-radius: 10px;
          border: 1px solid #a5a0a0e3;
          bottom: 12px;
          left: 5px;
          min-width: 220px;
        }
        .ol-popup:after,
        .ol-popup:before {
          top: 100%;
          border: solid transparent;
          content: ' ';
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }
        .ol-popup:after {
          border-top-color: white;
          border-width: 10px;
          left: 48px;

          margin-left: -10px;
        }
        .ol-popup:before {
          border-top-color: #cccccc;
          border-width: 11px;
          left: 48px;
          margin-left: -11px;
        }
        .ol-popup-closer {
          text-decoration: none;
          position: absolute;
          top: 2px;
          right: 8px;
        }
        .ol-popup-closer:after {
          content: '✖';
          color: orangered;
        }
      }
    }
    //右边区域
    .rightPart {
      height: 96%;
      background-color: snow;
      overflow: hidden;
      //切换图表的图标样式
      .switch-image {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 24px;
        height: 24px;
        // background-color: purple;
      }
      //图表样式
      .right-chart {
        position: relative;
        // width: 100%;
        height: 100%;
        // background-color: palegreen;
      }
    }
  }
}
</style>
