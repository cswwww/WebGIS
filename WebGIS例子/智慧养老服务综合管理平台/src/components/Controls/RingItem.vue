<template>
  <div class="all" @click="clickFire">
    <span class="item-border">
      <el-image
        class="item"
        style="width: 24px; height: 24px"
        fit="cover"
        :lazy="isLazy"
        :src="itemProperty.url"
        :title="itemProperty.name"
        :placeholder="itemProperty.name"
      ></el-image>
    </span>
    <div class="wrap-item"></div>
    <!-- 下拉菜单 -->
    <el-dropdown class="dropMenu" @command="handleCommand" size="mini">
      <span class="el-dropdown-link" v-text="itemProperty.name"></span>
      <el-dropdown-menu slot="dropdown" class="dropMenuitems">
        <el-dropdown-item
          class="dropMenu-item"
          v-for="(item, index) in itemProperty.menus"
          :key="index"
          :command="item"
          >{{ item }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  props: {
    itemProperty: Object,
    require: true,
  },
  data() {
    return {
      isLazy: true,
      item: {
        name: 'item',
        url: require('../../../static/imgs/menus/warning.png'),
        menus: [
          'submenu-1',
          'submenu-2',
          'submenu-3',
          'submenu-4',
          'submenu-5',
        ],
      },
    }
  },
  mounted() {
    this.$data.item = this.$props.itemProperty
    // console.log(this.$props.itemProperty)
  },
  methods: {
    //父级图标点击事件
    clickFire() {
      //参数1：自定义组件事件，在父组件中被调用才能触发父子组件的值传递；参数2：向父组件传递的数据[可为数组形式]
      this.$emit('clickItem', this.$data.item)
    },
    //下拉菜单点击事件
    handleCommand(command) {
      // console.log(command)
      this.$emit('handleCommand', command)
    },
  },
}
</script>
<style lang="less" scoped>
.all {
  // border: 1px solid skyblue;
  display: inline-block;
  position: relative;
  width: 65px;
  height: 65px;
  // overflow: hidden;
}
// 最内层
.item-border {
  display: inline-block;
  margin: 0 auto;
  margin-left: 0px;
  margin-top: 10px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid skyblue;
  // background-color: slateblue;
  .item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

// 最外层
.wrap-item {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 56px;
  height: 56px;
  border: 5px dotted transparent;
  border-left: 5px dotted #73ffff;
  border-left-width: 3px;
  border-right-color: #73ffff;
  border-top-color: transparent;
  border-radius: 50%;
  // background-color: burlywood;
  animation: circle 3s infinite linear;
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
// @keyframes circle2 {
//   0% {
//     transform: rotate(0deg);
//   }

//   100% {
//     transform: rotate(-360deg);
//   }
// }
//下拉菜单
.dropMenu {
  margin-top: 5px;
  // background-color: yellowgreen;
  color: #fff;
  //标题项
  .el-dropdown-link {
    cursor: pointer;
  }
  //菜单子项样式修改
  .dropMenuitems {
    background-color: transparent !important;
    color: red;
  }

  //菜单子项
  .el-dropdown-menu__item {
    color: red !important;
  }
  .dropMenu-item {
    background-color: rosybrown;
  }
}
</style>
