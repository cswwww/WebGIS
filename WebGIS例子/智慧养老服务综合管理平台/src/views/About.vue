<template>
  <div class="aboutWrap" v-if="this.$store.state.isShowAbout">
    <!-- 系统名称 -->
    <h2>智慧养老服务综合管理平台</h2>
    <!-- 详细信息 -->
    <div class="detailInfo">
      <div class="item">
        <span class="name">版本号：</span><span class="value">V2.0</span>
      </div>
      <div class="item">
        <span class="name">开发者：</span><span class="value">席木木</span>
      </div>
      <div class="item">
        <span class="name">开发技术：</span
        ><span class="value">Cesium+Openlayers+Vue技术栈</span>
      </div>
      <div class="item">
        <span class="name">更新日期：</span
        ><span class="value">2021-06-01</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
.aboutWrap {
  position: absolute;
  top: 35%;
  left: 50%;
  width: 420px;
  height: 200px;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: 700;
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  border-radius: 15px;
  z-index: 9999;
  // 详细信息
  .detailInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-top: 5px;
      .name {
        flex: 0.3;
        padding-left: 60px;
        text-align: left;
      }
      .value {
        flex: 0.7;
        padding: 0;
        text-align: center;
      }
    }
  }
}
</style>
