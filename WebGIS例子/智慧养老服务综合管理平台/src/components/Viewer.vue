<template>
  <div id="viewerContainer" class="viewerContainer"></div>
</template>

<script>
import * as ViewerUtils from '../utils/viewerUtils'
export default {
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      //加载地图
      ViewerUtils.initViewer('viewerContainer')
    })
  },
}
</script>
<style lang="less" scoped>
.viewerContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: aquamarine;
}
</style>
