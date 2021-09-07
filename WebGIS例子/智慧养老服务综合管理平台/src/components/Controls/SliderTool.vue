<template>
  <div>
    <div
      class="controlTool"
      v-for="(item, index) in itemlist"
      :key="index"
      @click="getItem(item, index)"
    >
      <img class="img-item" :src="item.imgUrl" alt="" :title="item.name" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    itemProperty: Array,
    require: true,
  },
  data() {
    return {
      itemlist: [
        // {
        //   imgUrl: require('../../../static/imgs/admincenter/mapview.png'),
        //   name: '地理视图',
        // },
        // {
        //   imgUrl: require('../../../static/imgs/admincenter/dataview.png'),
        //   name: '数据视图',
        // },
        // {
        //   imgUrl: require('../../../static/imgs/admincenter/mixedview.png'),
        //   name: '混合视图',
        // },
      ],
    }
  },
  mounted() {
    //获取传递的数据
    this.$data.itemlist = this.$props.itemProperty
  },
  methods: {
    //点击事件
    getItem(item, index) {
      // console.log(this.$data.itemlist[index])
      // 自定义事件名称：clickItem
      this.$emit('clickItem', this.$data.itemlist[index])
    },
  },
}
</script>
<style lang="less" scoped>
.controlTool {
  position: static;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  margin-bottom: 15px;
  background-color: rgb(221, 182, 9);
  .img-item {
    padding-top: 2px;
    width: 32px;
    height: 32px;
    border: none;
  }
}
</style>
