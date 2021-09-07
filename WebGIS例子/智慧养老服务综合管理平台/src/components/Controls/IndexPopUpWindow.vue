<template>
  <div
    class="wrap"
    v-if="this.$store.state.isShowWarnInfoIndexTool"
    @mousedown="moveInfoWinwod"
  >
    <!-- 检索控件 -->
    <!-- 标题 -->
    <span class="title"
      ><i class="el-icon-s-help icon-style"></i> 信息检索</span
    >
    <!-- 行政区划范围 -->
    <div class="chinaCode">
      <span class="type-item indexItem">行政区划</span>
      <el-select
        v-model="provinceName"
        :disabled="disabledSelectItems"
        placeholder="省份"
        clearable
        @visible-change="showProvince"
        @change="changeProvince"
        @focus="foucusSelect"
      >
        <el-option
          v-for="item in provinceCode"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="cityName"
        :disabled="disabledSelectItems"
        placeholder="市区"
        clearable
        @change="changeCity"
        @focus="foucusSelect"
      >
        <el-option
          v-for="item in cityCode"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="countryName"
        :disabled="disabledSelectItems"
        placeholder="县级"
        clearable
        @focus="foucusSelect"
      >
        <el-option
          v-for="item in countryCode"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!-- 时间跨度 -->
    <div class="timespan indexItem">
      <span class="type-item">时间跨度</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDateSpan"
        @focus="foucusSelect"
      >
      </el-date-picker>
    </div>
    <!-- 按照范围选择-矩形框选/多边形选择 -->
    <div class="areaSel indexItem">
      <span class="type-item">范围选择器</span>
      <el-radio-group
        v-model="radio"
        @change="changeRadioItem"
        :disabled="disabledRadioGroup"
      >
        <el-radio :label="1">矩形范围</el-radio>
        <el-radio :label="2">多边形范围</el-radio>
        <el-radio :label="3">指定范围</el-radio>
      </el-radio-group>
    </div>
    <!-- 四至范围 -->
    <div class="boundNorth">
      <div>
        <span class="item-name">北至：</span
        ><el-input
          placeholder="≤53.883°"
          v-model="northInputVal"
          :disabled="boundDisabled"
        >
        </el-input>
      </div>
    </div>
    <div class="boundEastWest">
      <div class="item">
        <span class="item-name">西至：</span
        ><el-input
          placeholder="≥73.500°"
          v-model="westInputVal"
          :disabled="boundDisabled"
        >
        </el-input>
      </div>
      <div class="item">
        <span class="item-name">东至：</span
        ><el-input
          placeholder="≤137.250°"
          v-model="eastInputVal"
          :disabled="boundDisabled"
        >
        </el-input>
      </div>
    </div>
    <div class="boundSouth">
      <div>
        <span class="item-name">南至：</span
        ><el-input
          placeholder="≥3.517°"
          v-model="southInputVal"
          :disabled="boundDisabled"
        >
        </el-input>
      </div>
    </div>
    <!-- 取消、查询按钮 -->
    <div class="btns indexItem">
      <el-button @click="clear">清除范围</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="query">查询</el-button>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium/Cesium'
import * as ViewConfig from '../../utils/viewerUtils'
import * as SERVICE from '../../utils/service/serviceUtils'
import { Notification } from 'element-ui'
import DrawGraphicUtils from '../../utils/utils/DrawGraphicTools'
// import DrawGraphicUtils from '../../utils/utils/DrawGraphicTools'
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      provinceName: '', //省份名称
      cityName: '', //城市名称
      countryName: '', //乡镇名称
      timeStart: '', //起始时间
      timeEnd: '', //终止时间
      value1: '',
      radio: 0,
      boundDisabled: true,
      northInputVal: '', //北至
      westInputVal: '', //西至
      eastInputVal: '', //东至
      southInputVal: '', //南至
      provinceCode: {}, //省份编码值
      cityCode: {}, //市级编码值
      countryCode: {}, //县区编码值
      //是否禁用单选按钮组
      disabledRadioGroup: false,
      //是否禁用select下拉框组
      disabledSelectItems: false,
      //模式{1:表示采用行政区划+时间范围筛选；2：表示采用多边形或者四至模式框筛选}
      mode: -1,
      drawTool: undefined, //绘图实例
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      //实例化绘图工具
      this.$data.drawTool = new DrawGraphicUtils(ViewConfig.staticParams.viewer)
    })
  },
  computed: {
    onIndexPopUpWindow() {
      return this.$store.state.isShowWarnInfoIndexTool
    },
  },
  watch: {
    onIndexPopUpWindow(value) {
      console.log(value)
      if (value) {
        this.$data.mode = -1
        //修改禁用状态
        this.$data.disabledRadioGroup = false
        this.$data.disabledSelectItems = false
      }
    },
  },
  methods: {
    /**
     * 使用鼠标拖拽窗口事件
     */
    moveInfoWinwod(event) {
      console.log(event)
    },
    /**获取焦点事件 */
    foucusSelect(value) {
      console.log('获取焦点')
      //禁用单选按钮组
      this.$data.disabledRadioGroup = true
      //修改筛选模式
      this.$data.mode = 1
      console.log(this.$data.mode)
    },
    /**显示省份 */
    showProvince(value) {
      if (value) {
        //从服务器获取省份列表
        SERVICE.getProvinceOfWarn().then((res) => {
          this.$data.provinceCode = res.data
        })
      }
    },
    /**省份选项发生变化 */
    changeProvince(value) {
      if (value) {
        //从服务器获取市级列表
        SERVICE.getCityOfWarn(value).then((res) => {
          this.$data.cityCode = res.data
        })
      }
    },
    /**市级选项发生变化 */
    changeCity(value) {
      if (value) {
        SERVICE.getCountryOfWarn(value).then((res) => {
          this.$data.countryCode = res.data
        })
      }
    },
    /**调整时间跨度 */
    changeDateSpan(value) {
      console.log(value)
      if (value) {
        //修改起止时间
        this.$data.timeStart = value[0]
        this.$data.timeEnd = value[1]
      } else {
        //修改起止时间
        this.$data.timeStart = ''
        this.$data.timeEnd = ''
      }

      console.log(this.$data.timeStart)
      console.log(this.$data.timeEnd)
    },
    /**修改radio单选选项
     * value:参数，被选中的radio下标值
     */
    changeRadioItem(value) {
      console.log(value)
      //禁用select下拉框组
      this.$data.disabledSelectItems = true
      //修改筛选模式
      this.$data.mode = 2
      console.log(this.$data.mode)

      //根据下标值执行相应的业务逻辑
      switch (value) {
        case 1: {
          console.log('绘制矩形')
          console.log(this.$data.drawTool.getGraphicCollection())
          //销毁上一次的绘制结果
          this.$data.drawTool.destory()
          //绘制矩形
          this.$data.drawTool.drawRectangle()
          //控制四至radio是否可选
          this.$data.boundDisabled = true

          //修改radio选中的下标
          break
        }
        case 2: {
          console.log('绘制多边形')
          //销毁上一次的绘制结果
          this.$data.drawTool.destory()
          //绘制多边形
          this.$data.drawTool.drawPolygon()
          //控制四至radio是否可选
          this.$data.boundDisabled = true
          break
        }
        case 3: {
          console.log('指定四至')
          //清除上一次绘制的结果
          this.$data.drawTool.destory()
          //控制四至radio可选
          this.$data.boundDisabled = false
          break
        }
      }
    },
    /**
     * 清除查询范围及其临时图层
     */
    clear() {
      this.$data.drawTool.destory() //清除所有实体
      //清除鼠标的点击事件
      this.$data.drawTool.destoryHandler()
      if (
        this.$data.northInputVal ||
        this.$data.southInputVal ||
        this.eastInputVal ||
        this.westInputVal
      ) {
        this.$data.northInputVal = ''
        this.$data.southInputVal = ''
        this.$data.eastInputVal = ''
        this.$data.westInputVal = ''
      }
    },
    /**取消按钮点击事件 */
    cancel() {
      if (this.$data.drawTool) this.$data.drawTool.destory()
      this.$store.dispatch('setIsShowWarnInfoIndexTool', false)
    },
    /**执行检索 */
    query() {
      console.log('query')
      //判断模式，修改全局变量的值
      console.log(this.$data.mode)
      switch (this.$data.mode) {
        case 1: {
          console.log('行政区划查询')
          //判断所选的值是否有效
          if (
            this.$data.provinceName ||
            this.$data.cityName ||
            this.$data.countryName || //行政区划选项判断
            (this.$data.timeStart && this.$data.timeEnd)
          ) {
            //选中值有效
            console.log('选中值有效')
            //修改全局变量的值
            this.$store.dispatch('setIndexPopUpWindowParams', {
              mode: this.$data.mode,
              msg: {
                provinceName: this.$data.provinceName,
                cityName: this.$data.cityName,
                countryName: this.$data.countryName,
                timeStart: this.$data.timeStart
                  ? new Date(this.$data.timeStart).getTime()
                  : '',
                timeEnd: this.$data.timeEnd
                  ? new Date(this.$data.timeEnd).getTime()
                  : '',
              },
            })
          } else {
            console.log('选中值wu效')
            //提示筛选条件无效
            Notification.error({
              title: '警告',
              message: '请选择有效的查询方式！',
            })
          }
          break
        }
        case 2: {
          console.log('多边形查询')
          //获取radio判断的下标
          console.log(this.$data.radio)
          switch (this.$data.radio) {
            case 1: {
              //矩形范围选择
              // console.log(this.$data.drawTool.getLonlatCollection())
              //修改全局变量
              this.$store.dispatch('setIndexPopUpWindowGraphicParams', {
                mode: 1,
                data: this.$data.drawTool.getLonlatCollection(),
              })

              break
            }
            case 2: {
              //多边形范围选择
              //获取当前顶点坐标
              // console.log(this.$data.drawTool.getLonlatCollection())
              //修改全局变量
              //修改全局变量
              this.$store.dispatch('setIndexPopUpWindowGraphicParams', {
                mode: 2,
                data: this.$data.drawTool.getLonlatCollection(),
              })

              break
            }
            case 3: {
              //指定四至选择
              //判断条件是否有效
              // console.log(this.westInputVal)
              // console.log(this.eastInputVal)
              // console.log(this.northInputVal)
              // console.log(this.southInputVal)

              if (
                this.$data.northInputVal &&
                this.$data.southInputVal &&
                this.eastInputVal &&
                this.westInputVal
              ) {
                //绘制多边形
                this.$data.drawTool.drawRectangleByBounds(
                  parseFloat(this.northInputVal),
                  parseFloat(this.eastInputVal),
                  parseFloat(this.southInputVal),
                  parseFloat(this.westInputVal)
                )
                //修改全局变量
                //修改全局变量
                this.$store.dispatch('setIndexPopUpWindowGraphicParams', {
                  mode: 3,
                  data: {
                    north: this.northInputVal,
                    east: this.eastInputVal,
                    south: this.southInputVal,
                    west: this.westInputVal,
                  },
                })

                console.log(this.$data.drawTool.getGraphicCollection())
              } else {
                Notification.error({
                  title: '错误',
                  message: '查询范围未填写完整！',
                })
                return
              }

              break
            }
          }
          break
        }
        default: {
          Notification.error({
            title: '错误',
            message: '请选择查询方式！',
          })
          return false
        }
      }
    },
  },
}
</script>
<style>
.el-date-editor .el-range-separator {
  color: orchid;
}
</style>
<style lang="less" scoped>
.wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 380px;
  transform: translate(-50%, -50%);
  background-color: rgba(10, 42, 47, 0.9);
  border: 1px solid skyblue;

  .indexItem {
    margin-top: 10px;
  }
  .indexItem:first {
    margin-top: 32px;
  }
  // 信息检索标题样式
  .title {
    position: absolute;
    left: -8px;
    top: -8px;
    padding: 5px;
    display: inline-block;
    text-align: left;
    // color: #fff;
    color: greenyellow;
    border: 1px solid red;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 25px;
    background-color: rgb(212, 63, 63);
    .icon-style {
      color: greenyellow;
    }
  }

  //行政区划
  .chinaCode {
    display: flex;
    justify-content: space-around;
    line-height: 45px;
    // 检索类型
    .type-item {
      color: #fff;
      padding-top: 20px;
      margin-left: 10px;
    }
    //下拉选项
    .el-select {
      margin-top: 32px;
    }
  }
  //时间跨度
  .timespan {
    display: flex;
    justify-content: space-around;
    // 检索类型
    .type-item {
      color: #fff;
      padding-top: 5px;
    }
  }
  //范围选择
  .areaSel {
    display: flex;
    justify-content: space-around;
    .el-radio {
      margin-top: 10px;
      color: #fff;
    }
    .el-radio:first {
      margin-left: 14px;
    }
    // 检索类型
    .type-item {
      color: #fff;
      margin-right: 14px;
      padding-top: 5px;
    }
  }
  //北至点
  .boundNorth,
  .boundEastWest,
  .boundSouth {
    margin-top: 10px;
    color: #fff;
  }
  .boundEastWest {
    display: flex;
    justify-content: space-around;
  }
  .value-item {
    display: inline-block;
    width: 100px;
    height: 28px;
    line-height: 28px;
    border: 1px solid orange;
  }
  .item-name {
    font-weight: 700;
    color: orangered;
  }
  //按钮组
  .btns {
    display: flex;
    margin: 18px 15px 0 0;
    justify-content: flex-end;
    // 按钮样式
    .el-button {
      background-color: transparent;
      font-weight: 700;
      color: rgb(38, 199, 92);
    }
  }
}
</style>
