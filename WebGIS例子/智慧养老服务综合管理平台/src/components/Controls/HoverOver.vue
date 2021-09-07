<template>
  <div
    id="hoverOverContainer"
    class="container"
    v-bind:style="itemProperty.positionStyle"
    v-show="isShowHoverover"
  >
    <!-- 客户名称 -->
    <h4 class="title">客户名称：{{ itemProperty.name }}</h4>
    <!-- 信息部分 -->
    <div class="content">
      <span class="nurveLevel">{{ itemProperty.nurseLevel }}</span
      ><span class="warnTimes">{{ itemProperty.warnTimes }}/次</span
      ><span class="healthRate">{{ itemProperty.healthRate }}/%</span>
    </div>
    <!-- 底部小三角 -->
    <i class="el-icon-caret-bottom triangle-icon"></i>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowHoverover: false,
      itemProperty: {
        name: '张三',
        nurseLevel: '特护一级',
        warnTimes: 12,
        healthRate: 93.6,
        positionStyle: {
          top: '400px',
          left: '350px',
        },
      },
    }
  },
  //计算属性
  computed: {
    onShowHoveroverState() {
      return this.$store.state.isShowHoverOver
    },
    onItemProperty() {
      return this.$store.state.hoverOverItemProperty
    },
  },
  //监听属性
  watch: {
    onShowHoveroverState(value) {
      this.$data.isShowHoverover = value
      //判断如果value值为true,就控制组件在3s之后自动隐藏
      if (value) {
        setTimeout(() => {
          this.$store.dispatch('setIsShowHoverOverAsync', false)
        }, 3000)
      }
    },
    onItemProperty(value) {
      this.$data.itemProperty = value
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  width: 280px;
  height: 70px;
  // background: rgba(42, 187, 242, 0.5);
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  //标题样式
  .title {
    margin: 6px 0 0 6px;
    width: 140px;
    height: 25px;
    line-height: 25px;
    color: orange;
    background-color: rgba(42, 187, 242, 0.5);
    border-radius: 6px;
    // background-color: rgba(68, 68, 184, 0.6);
    // background: linear-gradient(
    //       135deg,
    //       transparent 5px,
    //       rgba(42, 187, 242, 0.5) 0
    //     )
    //     top left,
    //   linear-gradient(-135deg, transparent 0px, rgba(42, 187, 242, 0.5) 0) top
    //     right,
    //   linear-gradient(-45deg, transparent 5px, rgba(42, 187, 242, 0.5) 0) bottom
    //     right,
    //   linear-gradient(45deg, transparent 0px, rgba(42, 187, 242, 0.5) 0) bottom
    //     left;
  }
  //数据内容
  .content {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    span {
      width: 85px;
      line-height: 21px;
      color: white;
      border-radius: 8px;
      background-color: burlywood;
    }
    .nurveLevel {
      //护理等级
      background-color: rgba(15, 139, 71, 0.9);
    }
    .warnTimes {
      //报警次数
      background-color: rgba(255, 0, 0, 0.7);
    }
    .healthRate {
      background-color: rgba(189, 211, 89, 0.9);
    }
  }
}

// 底部倒三角图标
.triangle-icon {
  position: absolute;
  bottom: -10px;
  transform: translateX(-50%);
  // color: rgba(42, 187, 242, 0.5);
  color: rgba(0, 0, 0, 0.8);
}
</style>
