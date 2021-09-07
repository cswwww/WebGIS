<template>
  <div
    id="popupOverContainer"
    class="container"
    v-bind:style="itemProperty.positionStyle"
    v-show="showPopUpOver"
  >
    <!-- 标题 -->
    <h4 class="title">{{ itemProperty.name }}</h4>
    <el-image
      class="healthCarve"
      style="width: 24px; height: 24px"
      :src="imgurl"
      title="信息明细"
      @click="drawHealthCarve"
    ></el-image>
    <!-- 关闭按钮 -->
    <i class="el-icon-circle-close close-btn-icon" @click="closePopUpOver"></i>
    <!-- 弹出窗的内容列表 -->
    <div class="content">
      <ul>
        <li>
          <i class="item-name">护理等级:</i
          ><span class="item-value">{{ itemProperty.nurseLevel }}</span>
        </li>
        <li>
          <i class="item-name">健康指数:</i
          ><span class="item-value">
            <!-- {{ itemProperty.healthRate }} -->
            96
          </span>
        </li>
        <li>
          <i class="item-name">性别|年龄:</i
          ><span class="item-value"
            >{{ itemProperty.sex }}|{{
              new Date().getFullYear() -
              new Date(itemProperty.birthTime).getFullYear()
            }}</span
          >
        </li>
        <li>
          <i class="item-name">职业类别:</i
          ><span class="item-value">{{ itemProperty.occupation }}</span>
        </li>
        <li>
          <i class="item-name">联系方式:</i
          ><span class="item-value">{{ itemProperty.phoneNum }}</span>
        </li>
        <li>
          <i class="item-name item-name-last">家庭住址:</i
          ><span class="item-value item-value-last">{{
            itemProperty.address
          }}</span>
        </li>
      </ul>
    </div>
    <!-- 底部小三角 -->
    <i class="el-icon-caret-bottom triangle-icon"></i>
  </div>
</template>
<script>
// 弹出窗口控件
export default {
  // props: {
  //   transProperty: Object,
  //   require: true,
  // },
  data() {
    return {
      //图标路径
      imgurl: require('../../../static/imgs/popupover/carve.png'),
      //组件显隐控制
      showPopUpOver: false,
      //属性信息
      itemProperty: {
        // idNum: '41122419990218281x',
        // name: '顾漫',
        // nurseLevel: '特护一级',
        // healthRate: 0.8,
        // sex: '女',
        // age: 38,
        // occupation: '职业',
        // phoneNum: '13333333333',
        // address: '河南省焦作市山阳区世纪大道2001号',
        // //控制控件显示的位置
        // positionStyle: {
        //   top: '400px',
        //   left: '350px',
        // },
      },
    }
  },
  watch: {
    //监听组件的显隐状态
    onPopUpOverState(value) {
      this.$data.showPopUpOver = value
    },
    //监听组件属性信息
    onItemProperty(value) {
      this.$data.itemProperty = value
    },
  },
  computed: {
    //计算组件的显隐状态
    onPopUpOverState() {
      return this.$store.state.isShowPopUpOver
    },
    //计算组件的属性信息
    onItemProperty() {
      return this.$store.state.popupOverItemProperty
    },
  },
  mounted() {
    // console.log(this.$store.getters.getPopupOverItemProperty)
    // console.log(this.$store.getters.getIsShowPopUpOver)
    // console.log(this.$props.transProperty)
    // this.$data.itemProperty = this.$props.transProperty
    //通过全局状态管理，控制组件的显隐状态
    this.$data.showPopUpOver = this.$store.getters.getIsShowPopUpOver
  },
  methods: {
    /**
     * 绘制健康曲线
     */
    drawHealthCarve() {
      //根据当前属性值中的身份证号获取健康数据，绘制多条曲线（每个指标对应一条曲线）
      // this.$emit('drawHealthCarve', this.$data.idNum)
      console.log('绘制健康曲线')
      //显示组件
      this.$store.dispatch('setIsShowPopUpWindow', true)
      //设置组件的属性值
      this.$store.dispatch('setPopWindowItemProperty', {
        idnum: this.itemProperty.idNum,
      })
      console.log(this.$store.state.popWindowItemProperty)
    },
    /**
     * 关闭当前信息弹窗窗口
     */
    closePopUpOver() {
      // this.$store.commit('setIsShowPopUpOver', false)
      this.$store.dispatch('setIsShowPopUpOverAsync', false)
      console.log('关闭当前信息弹窗窗口')
      console.log(this.$store.getters.getIsShowPopUpOver)
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 280px;
  height: 250px;
  // height: 100px;
  // border-radius: 5px;
  // border-start-end-radius: 15px;
  // border: 2px solid rgba(42, 187, 242, 0.8);
  // background-color: rgba(42, 187, 242, 0.5);
  background: linear-gradient(
        135deg,
        transparent 25px,
        rgba(42, 187, 242, 0.5) 0
      )
      top left,
    linear-gradient(-135deg, transparent 0px, rgba(42, 187, 242, 0.5) 0) top
      right,
    linear-gradient(-45deg, transparent 25px, rgba(42, 187, 242, 0.5) 0) bottom
      right,
    linear-gradient(45deg, transparent 0px, rgba(42, 187, 242, 0.5) 0) bottom
      left;
  background-size: 50% 50%;
  background-repeat: no-repeat;
  // background-color: linear-gradient(-135deg, transparent 15px, #162e48 0);
  // box-shadow: 0px 0px 15px skyblue;
  //标题样式
  .title {
    margin: 0 auto;
    margin-top: 8px;
    width: 70%;
    height: 12%;
    line-height: 25px;
    color: #fff;
    background-color: rgba(42, 187, 242, 0.8);
  }
  .el-image {
    position: absolute;
    right: 12px;
    top: 9px;
  }
  .close-btn-icon {
    position: absolute;
    right: -8px;
    top: -8px;
    color: #fff;
  }
  // 内容样式
  .content {
    li {
      list-style: none;
      text-align: left;
      // 属性名称样式
      .item-name {
        font-style: normal;
        display: inline-block;
        margin-bottom: 2px;
        width: 33%;
        color: #fff;
      }
      .item-name-last {
        // margin-bottom: 5px;
      }
      // 属性值样式
      .item-value {
        display: inline-block;
        width: 65%;
        color: #fff;
        text-align: center;
        overflow: hidden;
      }

      .item-value-last {
        margin-top: 5px;
        // text-align: left;
        font-size: 12px;
      }
    }
  }

  // 底部倒三角图标
  .triangle-icon {
    position: absolute;
    bottom: -10px;
    transform: translateX(-50%);
    color: rgba(42, 187, 242, 0.5);
  }
}
</style>
