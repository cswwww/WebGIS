<template>
  <div class="wrap" v-show="this.$store.state.isShowAnalysisTool">
    <!-- 分析类型 -->
    <div class="type">
      <span>分析类型：</span>
      <el-select
        class="typeSelectItem"
        v-model="typeValue"
        clearable
        placeholder="请选择"
        @change="typeChange"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 分析范围 -->
    <div class="bounds">
      <!-- 省份 -->
      <el-select
        class="bounds-item"
        v-model="provinceValue"
        clearable
        placeholder="河南省"
      >
        <el-option
          v-for="item in provinceOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 城市 -->
      <el-select
        class="bounds-item"
        v-model="cityValue"
        clearable
        placeholder="焦作市"
      >
        <el-option
          v-for="item in cityOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 区域 -->
      <el-select
        class="bounds-item"
        v-model="domainValue"
        clearable
        placeholder="县区"
        @change="domainChange"
      >
        <el-option
          v-for="item in domainOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 属性选择 -->
    <div class="attrs">
      <span>属性选择：</span>
      <el-select
        class="typeSelectItem attr-select-item"
        v-model="attrValue"
        clearable
        placeholder="报警次数"
        @change="attrsChange"
      >
        <el-option
          v-for="item in attrsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 热力图分析半径 -->
      <el-input
        class="attr-select-item heatorigin"
        v-model="inputRadius"
        v-show="showInputRadius"
        placeholder="热力源radius"
      ></el-input>
      <el-select
        class="typeSelectItem attr-select-item"
        v-model="krigingMode"
        v-show="showKrigingMode"
        clearable
        placeholder="插值模型"
        @change="krigingModeChange"
      >
        <el-option
          v-for="item in krigingOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 时间线滑动 -->
    <div class="timeline">
      <el-button
        class="time-btn"
        type="success"
        plain
        @click="execute3DAnalysis"
        >执行3D分析</el-button
      >
      <el-button class="time-btn" type="success" plain @click="stop3DAnalysis"
        >结束3D分析</el-button
      >
      <!-- <el-button
        class="time-btn"
        type="success"
        plain
        @click="save3DAnalysisResult"
        >保存分析结果</el-button
      > -->
    </div>
    <!-- 3D Analysis图标 -->
    <i class="el-icon-s-data analysis-icon">3D Analysis</i>
    <!-- 关闭图标 -->
    <i class="el-icon-circle-close close-icon" @click="closeWindow"></i>
  </div>
</template>
<script>
import * as ViewUtils from '../../utils/viewerUtils'
import * as SERVICE from '../../utils/service/serviceUtils'
// import DrawHeatMap from '../../utils/heatmap/drawHeatMap'
import { Notification } from 'element-ui' //导入Element-UI：Notification 通知组件
//第三方插件
import h337 from 'heatmap.js'
import html2canvas from '../../utils/heatmap/html2canvas'
import canvas2image from '../../utils/heatmap/canvas2image'
export default {
  data() {
    return {
      //分析类型数组
      typeOptions: [
        {
          value: '热力图分析',
          label: '热力图分析',
        },
        {
          value: '插值分析',
          label: '插值分析',
        },
        {
          value: '服务区分析',
          label: '服务区分析',
        },
      ],
      typeValue: '',
      provinceOptions: [
        {
          value: '河南省',
          label: '河南省',
        },
      ], //省份选项
      provinceValue: '', //省份名称
      cityOptions: [
        {
          value: '焦作市',
          label: '焦作市',
        },
      ], //城市选项
      cityValue: '', //城市名称
      domainOptions: [
        {
          value: '解放区',
          label: '解放区',
        },
        {
          value: '中站区',
          label: '中站区',
        },
        {
          value: '马村区',
          label: '马村区',
        },
        {
          value: '山阳区',
          label: '山阳区',
        },
        {
          value: '修武县',
          label: '修武县',
        },
        {
          value: '博爱县',
          label: '博爱县',
        },
        {
          value: '武陟县',
          label: '武陟县',
        },
        {
          value: '温县',
          label: '温县',
        },
        {
          value: '沁阳市',
          label: '沁阳市',
        },
        {
          value: '孟州市',
          label: '孟州市',
        },
      ], //区域选项
      domainValue: '', //区域名称
      attrsOptions: [
        {
          value: '报警次数',
          label: '报警次数',
        },
        // {
        //   value: '服务次数',
        //   label: '服务次数',
        // },
      ], //属性选项
      attrValue: '', //属性值
      inputRadius: '', //热力源半径
      showInputRadius: true, //是否显示热力源半径输入框
      krigingMode: '', //克里金插值模型
      showKrigingMode: false, //是否显示克里金插值模式选择
      krigingOptions: [
        {
          value: 'gaussian',
          label: 'gaussian',
        },
        {
          value: 'exponential',
          label: 'exponential',
        },
        {
          value: 'spherical',
          label: 'spherical',
        },
      ],
      coordsAyalysis: [], //差值分析边界数组
      heatmapCon: '', //热力图容器
    }
  },
  methods: {
    /**关闭窗口点击事件 */
    closeWindow() {
      this.$store.dispatch('setIsShowAnalysisTool', false)
    },
    /**
     * 分析类型切换事件
     */
    typeChange(value) {
      console.log(value)
      switch (value) {
        case '热力图分析': {
          //显示热力图半径输入框
          this.$data.showInputRadius = true
          this.$data.showKrigingMode = false
          break
        }
        case '插值分析': {
          //显示克里金数学模型选择框
          this.$data.showInputRadius = false
          this.$data.showKrigingMode = true
          break
        }
      }
    },
    /**分析县区切换事件 */
    domainChange(value) {
      console.log(value)
      SERVICE.getCityBoundsJsonArray(value).then((res) => {
        let data = res.data
        this.coordsAyalysis = data
        console.log(this.coordsAyalysis)
      })
    },
    /**属性项切换事件 */
    attrsChange(value) {
      // console.log(value)
      // switch (value) {
      //   case '报警次数': {
      //     break
      //   }
      // case '服务次数': {
      //   break
      // }
      // }
    },
    /**克里金插值模型切换 */
    krigingModeChange(value) {
      console.log(value)
    },
    /**
     * 执行三维分析
     */
    execute3DAnalysis() {
      console.log('执行三维分析')
      //获取当前“分析类型”
      console.log()
      if (!this.$data.typeValue) {
        Notification.warning({
          title: '警告',
          message: '未选择分析类型！',
          type: 'warning',
        })
        return false
      }
      switch (this.$data.typeValue) {
        case '热力图分析': {
          //逻辑判断
          if (!this.$data.attrValue) {
            Notification.warning({
              title: '警告',
              message: '未选择分析属性！',
              type: 'warning',
            })
            return false
          } else {
            // switch (this.$data.attrValue) {
            //   case '报警次数': {
            //     this.heatMapAnalysis_warn(this.$data.inputRadius)
            //     break
            //   }
            // }
            this.heatMapAnalysis_warn(this.$data.inputRadius)
          }
          break
        }
        case '插值分析': {
          console.log('插值分析')
          if (!this.$data.domainValue) {
            //测试全焦作市插值分析结果
            //获取焦作市边界数组
            SERVICE.getJiaoZuoBoundsJsonArray().then((res) => {
              let data = res.data
              this.coordsAyalysis = data
            })
            SERVICE.getWarnInfoListInJiaoZuoWGS84().then((res) => {
              let data = res.data
              this.executeKrigingAyalisys(data, 1) //全焦作市
            })
          } else {
            //测试焦作市某个县区的插值分析结果
            SERVICE.getWarnInfoListByDomainNameWGS84(
              this.$data.domainValue
            ).then((res) => {
              let data = res.data
              this.executeKrigingAyalisys(data, 2) //焦作市下的区县
            })
          }
          break
        }
      }
    },
    /**
     * 执行克里金插值分析
     */
    executeKrigingAyalisys(data, mode) {
      console.log(data)
      let lngs = [], //经度数组
        lats = [], //纬度数组
        // coords = [], //经纬度数组
        values = [] //值数组
      let len = data.length - 1
      for (let i = 0; i < len; i++) {
        lngs.push(data[i].x)
        lats.push(data[i].y)
        // coords.push(data[i].x)
        // coords.push(data[i].y)
        values.push(data[i].value)
      }
      console.log(lngs)
      console.log(lats)
      // console.log(coords)
      console.log(values)
      //获取最小外接矩形
      let coord = ViewUtils.getMinExtentOfData(data)
      if (!this.$data.krigingMode) {
        //执行克里金插值函数
        if (mode == 1) {
          ViewUtils.drawKriging(
            ViewUtils.staticParams.viewer,
            lats,
            lngs,
            values,
            this.coordsAyalysis,
            coord
          )
        } else {
          ViewUtils.drawKriging(
            ViewUtils.staticParams.viewer,
            lats,
            lngs,
            values,
            this.coordsAyalysis,
            coord
          )
        }
      } else {
        //执行指定数学模型的克里金插值函数
        if (mode == 1) {
          ViewUtils.drawKriging(
            ViewUtils.staticParams.viewer,
            lats,
            lngs,
            values,
            this.coordsAyalysis,
            coord,
            this.$data.krigingMode
          )
        } else {
          ViewUtils.drawKriging(
            ViewUtils.staticParams.viewer,
            lats,
            lngs,
            values,
            this.coordsAyalysis,
            coord,
            this.$data.krigingMode
          )
        }
      }
    },
    /**热力图分析 */
    heatMapAnalysis_warn(inputRadius) {
      //判断县区数据是否有效
      if (!this.$data.domainValue) {
        //执行数据请求
        SERVICE.getWarnInfoForHeatMapInJiaoZuo().then((res) => {
          let data = res.data
          //获取最大的value值
          let len = data.length - 1
          let maxValue = Number.MIN_VALUE
          while (len >= 0) {
            if (data[len].value > maxValue) maxValue = data[len]
            if (inputRadius) data[len].radius = inputRadius
            len--
          }
          //构造heatMap初始化对象
          // heatmap data format
          let dataForHeatMap = {
            max: maxValue, //所有数据中的最大值
            data: data, //最终要展示的数据
          }
          console.log(dataForHeatMap)
          //构建热力图
          //1-创建Dom元素
          let isExists = document.querySelector('.heatmap')
          if (isExists) document.body.removeChild(isExists)
          //添加信息的div元素
          let heatMapContainer = document.createElement('div')
          heatMapContainer.style.width = '800px'
          heatMapContainer.style.height = '800px'
          heatMapContainer.className = 'heatmap'
          heatMapContainer.style.display = 'none' //控制热力图不显示
          //将其添加到body中
          document.body.appendChild(heatMapContainer)
          //绘制热力图
          var heatmapInstance = h337.create({
            container: document.querySelector('.heatmap'),
          })
          heatmapInstance.setData(dataForHeatMap)
          console.log(heatmapInstance)
          //获取heatmapInsatnce的画布
          let heatmapCanvas = document.querySelector('.heatmap-canvas')
          // let heatmapCanvas = {}
          ViewUtils.drawHeatMapInViewer(
            heatmapCanvas,
            this.$data.domainValue,
            1
          )
        })
      } else {
        //如果县区数据有效，就执行县区范围内的热力图生成
        SERVICE.getWarnInfoForHeatMapByDomainName(this.$data.domainValue).then(
          (res) => {
            let data = res.data
            //获取最大的value值
            let len = data.length - 1
            let maxValue = Number.MIN_VALUE
            while (len >= 0) {
              if (data[len].value > maxValue) maxValue = data[len]
              if (inputRadius) data[len].radius = inputRadius
              len--
            }
            // heatmap data format
            let dataForHeatMap = {
              max: maxValue, //所有数据中的最大值
              data: data, //最终要展示的数据
            }
            console.log(dataForHeatMap)
            //构建热力图
            //1-创建Dom元素
            let isExists = document.querySelector('.heatmap')
            if (isExists) document.body.removeChild(isExists)
            //添加信息的div元素
            let heatMapContainer = document.createElement('div')
            heatMapContainer.style.width = '800px'
            heatMapContainer.style.height = '800px'
            heatMapContainer.id = 'heatmapContainer'
            heatMapContainer.className = 'heatmap'
            heatMapContainer.style.display = 'none' //控制热力图不显示
            //记录当前heatmap容器
            this.heatmapCon = heatMapContainer
            //将其添加到body中
            document.body.appendChild(heatMapContainer)
            //绘制热力图
            var heatmapInstance = h337.create({
              container: document.querySelector('.heatmap'),
            })
            heatmapInstance.setData(dataForHeatMap)
            console.log(heatmapInstance)
            //获取heatmapInsatnce的画布
            let heatmapCanvas = document.querySelector('.heatmap-canvas')
            // let heatmapCanvas = {}
            ViewUtils.drawHeatMapInViewer(
              heatmapCanvas,
              this.$data.domainValue,
              2
            )
          }
        )
      }
    },
    /**
     * 结束三维分析
     */
    stop3DAnalysis() {
      console.log('结束三维分析')
      this.$data.domainValue = ''
      this.coordsAyalysis = []
      ViewUtils.destoryTDAnalysisLayers()
    },
    /**
     * 保存三维分析结果
     */
    save3DAnalysisResult() {
      // let heatMap = document.getElementsByClassName('heatmap')
      // console.log(heatMap)
      // // let canvas = heatMap[0]
      // // canvas.toDataURL('image/png')
      // console.log(CanvasUtil)
      // console.log(html2canvas)
      // CanvasUtil(document.querySelector('.heatmap'), {}).then((canvas) => {
      //   console.log(canvas)
      //   var strDataURI = canvas.toDataURL('image/jpeg')
      //   var image = strDataURI.replace('image/jpeg', 'image/octet-stream')
      //   window.location.href = image
      // this.downloadResult('heatmapContainer')
      // })
      console.log()
      //   .firstElementChild
    },
  },
}
</script>
<style>
/* 字体样式 */
.el-select-dropdown__item span {
  color: orangered;
}
.el-input.is-disabled .el-input__inner {
  background-color: transparent;
}
</style>
<style lang="less" scoped>
.wrap {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 20px;
  left: 730px;
  width: 400px;
  height: 215px;
  color: #fff;
  border: 1px solid skyblue;
  background-color: rgba(10, 42, 47, 0.8);
  border-radius: 5px;
  border-top-right-radius: 25px;
  //3D Analysis
  .analysis-icon,
  .close-icon {
    position: absolute;
    right: 20px;
    top: 5px;
    font-style: italic;
    color: red;
  }
  //关闭图标
  .close-icon {
    top: -12px;
    right: -12px;
    color: skyblue;
    font-size: 25px;
    font-style: normal;
  }
  // 分析类型
  .type,
  .attrs,
  .bounds,
  .timeline {
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    span {
      flex: 3;
      font-size: 14px;
      align-self: center;
    }
    .typeSelectItem {
      flex: 6;
      font-size: 14px;
    }
    .attr-select-item {
      flex: 2.8;
    }
    .heatorigin {
      margin-top: 5px;
      margin-right: 10px;
    }
  }
  //分析范围
  .bounds {
    justify-content: space-around;
    .bounds-item {
      flex: 1;
    }
  }
  //时间线
  .timeline {
    margin-top: 15px;
    flex-direction: row;
    justify-content: center;
    .time-btn {
      background-color: transparent;
    }
  }
}
</style>
