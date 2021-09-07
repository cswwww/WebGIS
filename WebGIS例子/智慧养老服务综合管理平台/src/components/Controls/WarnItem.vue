<template>
  <div class="item-wrap">
    <!-- 序号 -->
    <span class="numid">{{ itemProperty.id }}</span>
    <!-- 报警人&处理状态&详情 -->
    <div class="generalInfo">
      {{ itemProperty.name }}
      <!-- 处理状态 -->
      <span class="status">{{
        itemProperty.status == '1' ? '已处理' : '未处理'
      }}</span>
      <!-- 详情 -->
      <span class="detail" @click="showDetail">详情</span>
    </div>
    <!-- 报警时间 -->
    <div class="datetime">报警时间：{{ itemProperty.warntime }}</div>
    <!-- 处理时间 -->
    <div class="endtime">处理时间：{{ itemProperty.endTime }}</div>
    <!-- 报警地点 -->
    <div class="place">报警地点：{{ itemProperty.warnAddress }}</div>
  </div>
</template>
<script>
export default {
  props: {
    outProperty: Object,
    require: true,
  },
  data() {
    return {
      itemProperty: {
        id: 1,
        idNumber: '',
        name: '张三',
        status: '已处理',
        warntime: '2020-01-18 18:30:00',
        endTime: '2020-01-18 18:35:26',
        wLon: '',
        wLat: '',
        warnAddress: '河南省焦作市山阳区世纪大道2001号',
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$data.itemProperty = undefined
      this.$data.itemProperty = this.$props.outProperty
      this.$forceUpdate()
    })
    // console.log(this.$data.itemProperty)
  },
  computed: {
    onItemProperty() {
      return this.$data.itemProperty
    },
  },
  watch: {
    onItemProperty(value) {
      // this.$data.itemProperty = value
      // console.log(value)
    },
    //深度监听
    outProperty: {
      handler(newValue, oldValue) {
        this.$data.itemProperty = this.$props.outProperty
      },
      deep: true,
    },
  },
  methods: {
    //自定义事件
    showDetail() {
      // console.log(event)
      // console.log(this.$data.itemProperty)
      //向父组件发送消息
      this.$emit('showDetail', this.$data.itemProperty)
    },
  },
}
</script>
<style lang="less" scoped>
div {
  margin-top: 5px;
}
.item-wrap {
  position: relative;
  width: 300px;
  height: 90px;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  font-size: 14px;
  color: #fff;
  // transform: translate(-50%, -50%);
  background-color: rgba(10, 42, 47, 0.8);
  /* 序号 */
  .numid {
    display: inline-block;
    position: absolute;
    top: 5px;
    left: 5px;
    width: 40px;
    height: 20px;
    background-color: #ff5c26;
  }
  //报警人&处理状态&详情
  .generalInfo {
    margin-left: 50px;
    display: flex;
    text-align: left;
    color: #26ffff;
    // justify-content: space-around;
    //处理状态
    .status {
      flex: 3;
      text-align: right;
      color: #92b9cc;
    }
    //详情
    .detail {
      flex: 2;
      text-align: right;
      padding-right: 8px;
      display: inline-block;
      color: #fff;
    }
    .detail:hover {
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: orangered;
    }
  }
  //报警时间
  .datetime {
    margin-left: 40px;
    text-align: left;
    font-size: 12px;
    color: #92bacd;
  }
  // 处理时间
  .endtime {
    margin-left: 40px;
    text-align: left;
    font-size: 12px;
    color: #92bacd;
  }
  //报警地点
  .place {
    margin-left: 40px;
    text-align: left;
    font-size: 12px;
    color: #92bacd;
  }
}
</style>
