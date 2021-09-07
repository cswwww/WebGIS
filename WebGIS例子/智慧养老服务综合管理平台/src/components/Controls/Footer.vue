<template>
  <div class="container">
    <div class="item">
      <i>经度:</i><span>{{ itemProperty.lng }}</span>
    </div>
    <div class="item">
      <i>纬度:</i><span>{{ itemProperty.lat }}</span>
    </div>
    <div class="item">
      <i>海拔:</i><span>{{ itemProperty.alt }}米</span>
    </div>
    <div class="item">
      <i>方向:</i><span>{{ itemProperty.dir }}度</span>
    </div>
    <div class="item">
      <i>俯仰角:</i><span>{{ itemProperty.angle }}度</span>
    </div>
    <div class="item">
      <i>视高:</i><span>{{ itemProperty.sceneAlt }}米</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemProperty: {
        lng: 125.3, //经度
        lat: 23.5, //纬度
        alt: 90, //海拔
        dir: 35, //方向
        angle: -90, //倾角
        sceneAlt: 8000, //视高
      },
    }
  },
  mounted() {},
  computed: {
    onItemProperty() {
      return this.$store.state.footerProperty
    },
  },
  watch: {
    onItemProperty(value) {
      this.itemProperty = value
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25px;
  color: #fff;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  .item {
    margin-right: 25px;
    i {
      font-style: normal;
      padding-right: 5px;
    }
    span {
    }
  }
}
</style>
