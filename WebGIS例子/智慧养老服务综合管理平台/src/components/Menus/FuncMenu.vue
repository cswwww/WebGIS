<template>
  <div class="container">
    <!-- 项目名称 -->
    <h3 class="sysName">智慧养老服务综合管理平台</h3>
    <!-- 收缩按钮 -->
    <button class="funcBtn" @click="hideAll">信息检索</button>
    <!-- 视角重置按钮 -->
    <button class="funcBtn funcBtn-1" @click="resetView">reset View</button>
    <!-- 功能模块 -->
    <div class="funcModules">
      <el-badge :value="0" class="item" @click="clickWarnInfo">
        <RingItem
          class="ringitem-style"
          v-for="(item, index) in funcItems"
          :key="index"
          :itemProperty="item"
          @clickItem="clickRingItem"
          @handleCommand="handleCommandDropMenu"
        />
      </el-badge>
    </div>
    <audio
      id="mp3Control"
      controls="controls"
      hidden
      mouted="true"
      :src="mp3Src"
      ref="audio"
    ></audio>
  </div>
</template>
<script>
import RingItem from '../Controls/RingItem'
import * as Cesium from 'cesium/Cesium'
import * as ViewUtils from '../../utils/viewerUtils'
import * as SERVICE from '../../utils/service/serviceUtils'
import h337 from 'heatmap.js'
export default {
  components: {
    RingItem,
  },
  data() {
    return {
      mp3Src: require('../../../static/mp3/dingdong.mp3'),
      //功能模块图标资源
      funcItems: [
        {
          name: '数据统计',
          url: require('../../../static/imgs/menus/statistics.png'),
          menus: [],
        },
        {
          name: '报警查询',
          url: require('../../../static/imgs/menus/warning.png'),
          menus: [],
        },
        {
          name: '服务中心',
          url: require('../../../static/imgs/menus/index.png'),
          // menus:['地域索引','等级索引','']
          menus: [],
        },
        {
          name: '三维分析',
          url: require('../../../static/imgs/menus/3danalysis.png'),
          menus: ['用户插值图', '客户热力图', '插值分析', '路径分析'],
        },
        {
          name: '系统管理',
          url: require('../../../static/imgs/menus/management.png'),
          // menus: ['系统管理', '雪花特效', '雨水特效', '云雾特效', '黑夜特效'],
          menus: ['关于系统', '雪花特效', '云雾特效', '黑夜特效'],
        },
      ],
      //是否开启图片懒加载
      isLazy: true,
    }
  },
  methods: {
    /**
     * 隐藏菜单按钮
     */
    hideAll() {
      console.log('显示信息检索窗口')
      this.$store.dispatch(
        'setIsShowUserIndexBox',
        !this.$store.state.isShowUserIndexBox
      )
    },
    /**
     * 查看报警信息
     */
    clickWarnInfo(value) {
      console.log('查看报警信息', value)
    },
    /**
     *
     */
    resetView() {
      this.$refs.audio.currentTime = 0 //从头开始播放提示音
      this.$refs.audio.play() //播放
      if (ViewUtils.staticParams.viewer) {
        //飞到目标区域
        ViewUtils.staticParams.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            113.2609138954192,
            35.190953503678095,
            8000.0
          ),
          //设置相机朝向：俯仰角、倾角
          orientation: {
            heading: Cesium.Math.toRadians(350),
            pitch: Cesium.Math.toRadians(-50),
            roll: 0.0,
          },
        })
      }
    },
    /**
     * RingItem子组件点击事件
     */
    clickRingItem(value) {
      console.log(value)
      //判断子组件的name属性值，实现相应的业务逻辑
      switch (value.name) {
        case '报警查询': {
          console.log('报警查询')
          this.$store.dispatch(
            'setIsShowWarnInfoIndex',
            !this.$store.state.isShowWarnInfoIndex
          )
          break
        }
        case '数据统计': {
          //修改数据统计Statistics组件的显隐状态
          this.$store.dispatch(
            'setIsShowStatistics',
            !this.$store.state.isShowStatistics
          )
          console.log('数据统计')
          break
        }
        case '服务中心': {
          console.log('服务中心')
          this.$store.dispatch(
            'setIsShowServiceCenter',
            !this.$store.state.isShowServiceCenter
          )

          break
        }
        case '三维分析': {
          console.log('三维分析')
          this.$store.dispatch('setIsShowAnalysisTool', true)
          break
        }
        case '系统管理': {
          console.log('系统管理')
          //执行页面跳转-管理中心(在新的页面中打开)
          let newPage = this.$router.resolve({ path: '/admincenter' })
          window.open(newPage.href, '_blank')
          // let routeUrl = this.$router.resolve({
          //   name: 'AdminCenter',
          //   //query: {id:96}
          // })
          // console.log(routeUrl)
          // window.open(routeUrl.href, '_blank')

          break
        }
      }
    },
    /**
     * 点击下拉菜单
     */
    handleCommand(command) {
      console.log(command)
    },
    /**
     * RingItem子组件：下拉菜单点击事件
     */
    handleCommandDropMenu(value) {
      console.log(value)
      //'雪花特效', '雨水特效', '云雾特效', '黑夜特效'
      //根据获取的值执行页面跳转
      switch (value) {
        case '用户插值图': {
          SERVICE.getUserInfoListInJiaoZuoWGS84().then((res) => {
            let data = res.data
            console.log(data)
            let lngs = [], //经度数组
              lats = [], //纬度数组
              coords = [], //经纬度数组
              values = [] //值数组
            let len = data.length - 1
            for (let i = 0; i < len; i++) {
              lngs.push(data[i].x)
              lats.push(data[i].y)
              coords.push(data[i].x)
              coords.push(data[i].y)
              values.push(data[i].value)
            }
            //获取最小外接矩形
            let coord = ViewUtils.getMinExtentOfData(data)
            ViewUtils.drawKriging(
              ViewUtils.staticParams.viewer,
              lats,
              lngs,
              values,
              coords,
              coord,
              'exponential'
            )
          })

          break
        }
        case '客户热力图': {
          SERVICE.getUserInfoListInJiaoZuo().then((res) => {
            console.log(res)
            let data = res.data
            //获取最大的value值
            let len = data.length - 1
            let maxValue = Number.MIN_VALUE
            while (len >= 0) {
              if (data[len].value > maxValue) maxValue = data[len]
              data[len].radius = 5
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
              gradient: {
                0.45: 'rgb(000,000,255)',
                0.55: 'rgb(000,255,255)',
                0.65: 'rgb(000,255,000)',
                0.95: 'rgb(255,255,000)',
                1.0: 'rgb(255,000,000)',
              },
            })
            heatmapInstance.setData(dataForHeatMap)
            console.log(heatmapInstance)
            //获取heatmapInsatnce的画布
            let heatmapCanvas = document.querySelector('.heatmap-canvas')
            ViewUtils.drawHeatMapInViewer(heatmapCanvas, '', 1)
          })
          //创建Viewer实例，将热力图作为材质贴地显示

          break
        }
        case '系统管理': {
          //执行页面跳转-管理中心(在新的页面中打开)
          let newPage = this.$router.resolve({ path: '/admincenter' })
          window.open(newPage.href, '_blank')
          break
        }
        case "关于系统":{
          //显示关于系统窗口
          this.$store.dispatch("setIsShowAbout",true)
          setTimeout(() => {
             this.$store.dispatch("setIsShowAbout",false)
          }, 3000);
          break
        }
        case '雪花特效': {
          console.log('雪花特效')
          console.log(ViewUtils.staticParams.weatherInstance.snow)
          let snowStatus = ViewUtils.staticParams.weatherInstance.snow.enabled
          ViewUtils.staticParams.weatherInstance.snow.enabled = !snowStatus
          // ViewUtils.staticParams.weatherInstance.snow.enabled = !ViewUtils
          //   .staticParams.weatherInstance.snow.enabled
          break
        }
        // case '雨水特效': {
        //   console.log('雨水特效')
        //   let rainStatus = ViewUtils.staticParams.weatherInstance.rain.enabled
        //   ViewUtils.staticParams.weatherInstance.rain.enabled = !rainStatus
        //   // ViewUtils.staticParams.weatherInstance.rain.enabled = !ViewUtils
        //   //   .staticParams.weatherInstance.rain.enabled
        //   break
        // }
        case '云雾特效': {
          console.log('云雾特效')
          ViewUtils.staticParams.viewer.scene.fog.enabled = !ViewUtils
            .staticParams.viewer.scene.fog.enabled
          break
        }
        case '黑夜特效': {
          console.log('黑夜特效')
          console.log(ViewUtils.staticParams.viewer.scene.globe.enableLighting)
          ViewUtils.staticParams.viewer.scene.globe.enableLighting = !ViewUtils
            .staticParams.viewer.scene.globe.enableLighting
          break
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  display: inline-block;
  position: absolute;
  top: 20px;
  left: 1%;
  width: 500px;
  height: 185px;
  color: #fff;
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  border-radius: 15px;
  // z-index: 999999;
  // 平台名称
  .sysName {
    margin: 15px auto;
    margin-bottom: 0px;
    width: 480px;
    height: 50px;
    font-size: 32px;
    line-height: 50px;
    border: 1px solid skyblue;
    border-radius: 5px;
    border-start-end-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  //收缩按钮
  .funcBtn {
    display: inline-block;
    position: absolute;
    top: 80px;
    left: 12px;
    height: 60px;
    background-color: transparent;
    color: #fff;
    border: 1px solid skyblue;
  }
  //视角重置按钮
  .funcBtn-1 {
    top: 150px;
    height: 30px;
    text-align: center;
  }
  //功能模块
  .funcModules {
    margin-left: 65px;
    .ringitem-style {
      margin: 0 auto;
      margin-top: 15px;
      margin-left: 20px;
    }
    .ringitem-style:nth-child(2n + 1) .wrap-item {
      /**修改外边框动画样式 */
      animation: circle2 3s infinite linear;
    }
  }
}

//自定义动画样式:修改自定义组件的动画效果
@keyframes circle2 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
