<template>
  <div class="warpswitch">
    <!-- 图表——控制开关 -->
    <i class="el-icon-sort switch-icon" title="图层控制开关"></i>
    <!-- 信息点图层开关 -->
    <div>
      <span>信息点：</span>
      <el-switch
        v-model="poiInfovalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchPoiInfoState"
      >
      </el-switch>
    </div>
    <!-- 报警点开关 -->
    <div>
      <span>报警点：</span>
      <el-switch
        v-model="warnPtsvalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchWarnInfoState"
      >
      </el-switch>
    </div>
    <!-- 服务点开关 -->
    <div>
      <span>服务点：</span>
      <el-switch
        v-model="servicecentervalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchServicecenteState"
      >
      </el-switch>
    </div>
    <!-- 行政区划矢量图开关 -->
    <div>
      <span>政区图：</span>
      <el-switch
        v-model="domainsvalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchShpMapState"
      >
      </el-switch>
    </div>
    <!-- 建筑物群开关 -->
    <div>
      <span>建筑物：</span>
      <el-switch
        v-model="buildingsvalue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="switchBuildingsState"
      >
      </el-switch>
    </div>
  </div>
</template>
<script>
import * as ViewUtils from '../../utils/viewerUtils'
export default {
  data() {
    return {
      poiInfovalue: false, //信息点显示开关
      warnPtsvalue: false, //报警点显示开关
      servicecentervalue: false, //服务点显示开关
      domainsvalue: false, //行政区划显示开关
      buildingsvalue: false, //建筑群显示开关
    }
  },
  computed: {
    onWarnPtsLayerStatus() {
      return this.$store.state.warnPtsLayerStatus
    },
  },
  watch: {
    onWarnPtsLayerStatus(value) {
      if (value) {
        //切换按钮开关
        this.$data.warnPtsvalue = value
        //修改图层显隐状态
        ViewUtils.showPOIInfoPts(
          ViewUtils.staticParams.warnPOICollection,
          value
        )
      }
    },
  },
  methods: {
    /**
     * 修改信息点显示状态
     */
    switchPoiInfoState(value) {
      console.log(value) //true/false
      ViewUtils.showPOIInfoPts(
        ViewUtils.staticParams.poiEntittCollection,
        value
      )
    },
    /**修改当前报警点显示状态 */
    switchWarnInfoState(value) {
      ViewUtils.showPOIInfoPts(ViewUtils.staticParams.warnPOICollection, value)
      this.$store.dispatch('setWarnPtsLayerStatus', value) // 修改图层状态
    },
    /**修改服务点显示状态 */
    switchServicecenteState(value) {
      ViewUtils.showPOIInfoPts(ViewUtils.staticParams.hospitalCollection, value)
      ViewUtils.showPOIInfoPts(
        ViewUtils.staticParams.servicePointCollection,
        value
      )
    },
    /**修改矢量行政区划图显示状态 */
    switchShpMapState(value) {
      ViewUtils.showShpDataSOurce(value)
    },
    /**修改建筑群显隐状态 */
    switchBuildingsState(value) {
      console.log('修改建筑群显隐状态', value)
      ViewUtils.show3dTilesBuildingsLayers(value)
    },
  },
}
</script>
<style lang="less" scoped>
.warpswitch {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 150px;
  height: 175px;
  position: absolute;
  top: 25px;
  left: 550px;
  color: #fff;
  padding-top: 5px;
  background-color: rgba(10, 42, 47, 0.8);
  z-index: 99999;
  border: 1px solid skyblue;
  border-radius: 35px;
  border-top-left-radius: 0px;
  border-bottom-right-radius: 0px;
  // 图层开关样式
  .switch-icon {
    position: absolute;
    top: -5px;
    left: -5px;
    font-size: 24px;
    color: #fff;
    border: 1px solid #fff;
    background-color: orangered;
    border-radius: 50%;
  }
}
</style>
