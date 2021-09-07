<template>
  <div class="wrap" v-show="this.$store.state.isShowWarnDetails">
    <!-- 报警明细图标 -->
    <i class="el-icon-platform-eleme detail-icon">报警明细</i>
    <!-- 关闭窗口按钮 -->
    <i
      class="el-icon-circle-close close-icon"
      title="close"
      @click="closeWindow"
    ></i>
    <!-- 上部信息 -->
    <div class="upper">
      <!-- 切换按钮 -->
      <el-button
        class="btn-dealwarn"
        type="success"
        round
        @click="dealWarnRecord"
        >处理报警</el-button
      >
      <!-- 详细信息 -->
      <div class="detailInfo">
        <span class="detailinfo-title">报警者信息</span>
        <div class="info-item">
          <i class="info-item-name">报警人：</i
          ><span class="info-item-value">{{ item.name }}</span>
        </div>
        <div class="info-item">
          <i class="info-item-name">报警次数：</i
          ><span class="info-item-value">{{ item.warnTimes }}</span>
        </div>
        <div class="info-item">
          <i class="info-item-name">患病史：</i
          ><span class="info-item-value">{{ item.illhis }}</span>
        </div>
        <div class="info-item">
          <i class="info-item-name">年龄：</i
          ><span class="info-item-value">{{ item.age }}</span>
        </div>
        <div class="info-item">
          <i class="info-item-name">护理等级：</i
          ><span class="info-item-value">{{ item.nurseLevel }}</span>
        </div>
        <div class="info-item">
          <i class="info-item-name">住：址：</i
          ><span class="info-item-value info-item-value-last">{{
            item.address
          }}</span>
        </div>
      </div>
      <!-- 附近设施点 -->
      <div class="divices">
        <!-- 标题 -->
        <span class="divices-title">附近设施点</span>

        <!-- 下拉框选项 -->
        <section class="select-selection">
          <!-- <span class="property-item">设·施·</span> -->
          <el-select
            class="select-items"
            clearable
            v-model="selectValue"
            placeholder="查询条件"
            @change="selectChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </section>
        <!-- 距离限定 -->
        <section class="dislimited">
          <!-- <span class="property-item">距离:</span> -->
          <el-input
            class="buffer-radius"
            v-model="bufferRadius"
            clearable
            placeholder="缓冲半径/m"
          ></el-input>
        </section>
        <!-- 切换按钮 -->
        <el-button class="btn-query" type="success" round @click="loadData"
          >加载数据</el-button
        >
      </div>
    </div>
    <!-- 底部数据表部分 -->
    <div class="footer">
      <el-table
        class="table-data-view"
        :data="tableData"
        height="250"
        border
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column property="id" label="id" width="50"> </el-table-column>
        <el-table-column prop="name" label="设施点" width="220">
        </el-table-column>
        <el-table-column prop="area" label="所在区域"> </el-table-column>
        <el-table-column prop="distance" label="距离/m"> </el-table-column>
      </el-table>
      <!-- 底部提示：共计的条目数 -->
      <div class="static-marker">
        共计【 {{ totalCounts }} 】条数据,当前选中id={{ selectedId }}
      </div>
    </div>
  </div>
</template>
<script>
import { Notification } from 'element-ui' //导入Element-UI：Notification 通知组件
import * as SERVICE from '../../utils/service/serviceUtils'
import * as Viewutils from '../../utils/viewerUtils'
export default {
  data() {
    return {
      //外部属性信息
      outterProperty: {},
      //属性信息
      item: {
        name: '张三',
        warnTimes: 12,
        illhis: '无',
        age: 88,
        nurseLevel: '护理二级',
        address: '河南省焦作市XXX区XX大道XX号111111111',
        lon: '',
        lat: '',
      },
      //被选中的单选按钮
      options: [
        {
          value: '医疗点',
          label: '医疗点',
        },
        {
          value: '分部点',
          label: '分部点',
        },
      ],
      selectValue: '',
      //缓冲半径/米
      bufferRadius: '',
      currentRow: null,
      totalCounts: 7, //共计条目数
      selectedId: '?', //选中行的id值
      tableData: [
        // {
        //   id: '1',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '2',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '3',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '4',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '5',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '6',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '7',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '8',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
        // {
        //   id: '9',
        //   name: '王小虎',
        //   area: '上海市普陀区金沙江路 1518 弄',
        //   distance: 10,
        // },
      ],
    }
  },
  mounted() {
    let _this = this
    this.$nextTick(() => {
      _this.$data.selectedId = '?'
    })
  },
  computed: {
    onWarnDetailOutterProperty() {
      return this.$store.state.warnDetailOutterProperty
    },
  },
  watch: {
    onWarnDetailOutterProperty(value) {
      console.log(value)
      let _this = this
      if (value) {
        this.$data.outterProperty = value
        console.log(this.$data.outterProperty)
        //根据idNumber获取信息，修改item属性值
        let idnum = this.$data.outterProperty.idNumber
        //记录经纬度
        this.$data.item.lon = this.$data.outterProperty.wLon
        this.$data.item.lat = this.$data.outterProperty.wLat
        //根据身份证号获取详细信息
        SERVICE.getWarnDetailByIdnum(idnum).then((res) => {
          let data = res.data
          console.log(data)
          //更新属性信息
          _this.$data.item.name = data.name //报警人姓名
          _this.$data.item.warnTimes = data.warnTimes //报警次数
          _this.$data.item.illhis = data.illHis //患病史：默认为无
          _this.$data.item.age = data.age //年龄
          _this.$data.item.nurseLevel = data.nurseLevel //护理等级
          _this.$data.item.address = data.address //报警地址
        })
      }
    },
  },
  methods: {
    /**关闭窗口点击事件 */
    closeWindow() {
      console.log('close')
      //关闭窗口时，销毁临时图层
      Viewutils.removeTempJsonLayer()
      Viewutils.removeTempMarkerLayer()
      //还原全局变量
      //隐藏详细报警信息窗口
      this.$store.dispatch('setIsShowWarnDetails', false)
      //修改全局变量的值
      this.$store.dispatch('setWarnDetailOutterProperty', undefined)
    },
    /**表格单选事件 */
    handleCurrentChange(val) {
      console.log('点击当前行')
      this.currentRow = val
      //切换相机视角
      Viewutils.makeCemeraFlyTo(val.lon, val.lat)

      console.log(val)
      this.$data.selectedId = val.id
    },
    /**下拉菜单选项改变触发——可空函数（影响效率） */
    selectChange(value) {
      //判断选中项，更新数据项
      switch (value) {
        case '医疗点': {
          // console.log('加载医疗点')

          break
        }
        case '分部点': {
          // console.log('加载分布点')
          break
        }
      }
    },
    /**加载数据按钮点击事件 */
    loadData() {
      console.log(this.$data.selectValue)
      console.log(this.$data.bufferRadius)
      console.log(
        this.$data.outterProperty.wLon,
        this.$data.outterProperty.wLat
      )
      //如果”查询条件“为空，提示信息：请选择查询条件
      if (!this.$data.selectValue) {
        Notification.error({
          title: 'Load Error',
          message: '请选择查询条件！',
          duration: 5000,
        })
        return false
      }
      //判断查询条件
      switch (this.$data.selectValue) {
        case '医疗点': {
          console.log('医疗点')
          //如果”查询条件“不为空，判断缓冲半径是否为空
          if (this.$data.bufferRadius) {
            //不为空
            SERVICE.getHospitalPsByBufferDis(
              /*113.18099*/ this.$data.outterProperty.wLon,
              /*35.2248*/ this.$data.outterProperty.wLat,
              this.$data.bufferRadius
            ).then((res) => {
              let data = res.data
              if (!data || data.length == 0) {
                Notification.error({
                  title: 'Load Error',
                  message: '查询失败,请稍后重试！',
                  duration: 5000,
                })
              } else {
                this.$data.totalCounts = res.data.length
                this.$data.tableData = res.data
                Notification.success({
                  title: 'Success!',
                  message: '累计' + res.data.length + '条结果!',
                  duration: 3000,
                })
                // 销毁临时图层
                Viewutils.removeTempJsonLayer(Viewutils.staticParams.viewer)
                console.log(Viewutils.staticParams.temporaryLayers.jsonColls)
                //加载临时缓冲区图层
                Viewutils.loadTempJsonDataSource(
                  Viewutils.staticParams.viewer,
                  this.$data.outterProperty.wLon,
                  this.$data.outterProperty.wLat,
                  this.$data.bufferRadius
                )
              }
            })
          } else {
            ////如果缓冲半径为空
            // 销毁临时图层
            Viewutils.removeTempJsonLayer()
            SERVICE.getHopitalPOIListsByLonLat(
              /*113.18099*/ this.$data.item.lon,
              /*35.2248*/ this.$data.item.lat
            ).then((res) => {
              let data = res.data
              if (!data || data.length == 0) {
                Notification.error({
                  title: 'Load Error',
                  message: '查询失败,请稍后重试！',
                  duration: 5000,
                })
              } else {
                this.$data.totalCounts = res.data.length
                this.$data.tableData = res.data
                Notification.success({
                  title: 'Success!',
                  message: '累计' + res.data.length + '条结果!',
                  duration: 3000,
                })
              }
            })
          }
          break
        }
        case '分部点': {
          console.log('分部点')
          //如果”查询条件“不为空，判断缓冲半径是否为空
          if (this.$data.bufferRadius) {
            //不为空
            SERVICE.getServicePsByBufferDis(
              /*113.18099*/ this.$data.outterProperty.wLon,
              /*35.2248*/ this.$data.outterProperty.wLat,
              this.$data.bufferRadius
            ).then((res) => {
              let data = res.data
              if (!data || data.length == 0) {
                Notification.error({
                  title: 'Load Error',
                  message: '查询失败,请稍后重试！',
                  duration: 5000,
                })
              } else {
                this.$data.totalCounts = res.data.length
                this.$data.tableData = res.data
                Notification.success({
                  title: 'Success!',
                  message: '累计' + res.data.length + '条结果!',
                  duration: 3000,
                })
                // 销毁临时图层
                Viewutils.removeTempJsonLayer()
                console.log(Viewutils.staticParams.temporaryLayers.jsonColls)
                //加载临时缓冲区图层
                Viewutils.loadTempJsonDataSource(
                  Viewutils.staticParams.viewer,
                  this.$data.outterProperty.wLon,
                  this.$data.outterProperty.wLat,
                  this.$data.bufferRadius
                )
              }
            })
          } else {
            ////如果缓冲半径为空
            // 销毁临时图层
            Viewutils.removeTempJsonLayer()
            //加载新的数据
            SERVICE.getServicePOIListsByLonLat(
              /*113.18099*/ this.$data.item.lon,
              /*35.2248*/ this.$data.item.lat
            ).then((res) => {
              let data = res.data
              if (!data || data.length == 0) {
                Notification.error({
                  title: 'Load Error',
                  message: '查询失败,请稍后重试！',
                  duration: 5000,
                })
              } else {
                this.$data.totalCounts = res.data.length
                this.$data.tableData = res.data
                Notification.success({
                  title: 'Success!',
                  message: '累计' + res.data.length + '条结果!',
                  duration: 3000,
                })
              }
            })
          }

          break
        }
      }
    },
    /**处理当前报警信息 */
    dealWarnRecord() {
      console.log('处理报警信息')
      console.log(this.outterProperty)
      SERVICE.updateWarnRecord(
        'admin1',
        this.outterProperty.idNumber,
        this.outterProperty.warntime,
        this.outterProperty.wLon,
        this.outterProperty.wLat
      ).then((res) => {
        let data = res.data
        console.log(res)
        if (data == 1) {
          Notification.success({
            title: 'Success！',
            message: '已处理！',
            duration: 3000,
          })
        }
      })
    },
  },
}
</script>
<style lang="less">
/* 全局样式 */
.el-radio__label {
  color: #fff;
}
.el-button {
  white-space: pre-wrap;
}
.el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
.el-table th,
.el-table tr {
  color: #fff;
  background-color: transparent;
}
.el-table__body tr:hover > td {
  background-color: rgb(28, 120, 134) !important;
}
.el-table__body tr:focus > td {
  background-color: rgb(28, 120, 134) !important;
}
.el-table__body tr:visited > td {
  background-color: rgb(28, 120, 134) !important;
}
.el-table__body tr.current-row > td {
  background-color: #69a8ea !important;
  color: #fff;
}
</style>
<style lang="less" scoped>
// 局部样式
.wrap {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 230px;
  left: 15px;
  width: 600px;
  height: 500px;
  color: #fff;
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  border-radius: 15px;
  //报警明细图标
  .detail-icon {
    position: absolute;
    left: 0px;
    top: 0px;
    padding: 3px;
    font-size: 18px;
    background-color: #ff4949;
    border-top-left-radius: 15px;
    border-bottom-right-radius: 8px;
  }
  //关闭窗口按钮
  .close-icon {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    font-size: 28px;
  }

  .upper {
    flex: 4;
    display: flex;
    //处理报警按钮
    .btn-dealwarn {
      margin: 25px 10px;
      padding-left: 4px;
      width: 35px;
      height: 160px;
      line-height: normal;
      font-size: 24px;
      background-color: rgb(139, 192, 14);
    }
    //详细信息部分
    .detailInfo {
      flex: 0.6;
      margin: 25px 0 0 0px;
      // padding-right: 10px;
      padding-bottom: 5px;
      // width: 260px;
      height: 180px;
      // background-color: powderblue;
      border: 1px solid skyblue;
      //标题属性
      .detailinfo-title {
        float: right;
        padding: 3px;
        color: springgreen;
        background-color: slateblue;
        border-bottom-left-radius: 10px;
      }
      //item属性
      .info-item {
        padding-left: 15px;
        padding-top: 5px;
        text-align: left;
        display: flex;
        // 字段名称
        .info-item-name {
          font-style: normal;
          color: orange;
          font-weight: 700;
        }
        //字段值
        .info-item-value {
          color: orangered;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: skyblue;
        }
        //最后一个字段值
        .info-item-value-last {
          // font-size: 12px;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .info-item-value-last:hover {
          white-space: normal; /*文本自动处理换行*/
        }
      }
    }
    //附近服务设施
    .divices {
      flex: 0.4;
      display: flex;
      flex-direction: column;
      margin: 25px 10px 0 20px;
      padding-right: 10px;
      padding-bottom: 5px;
      // width: 150px;
      height: 180px;
      border: 1px solid skyblue;
      //标题信息
      .divices-title {
        align-self: flex-start;
        padding: 3px;
        color: springgreen;
        background-color: slateblue;
        border-bottom-right-radius: 10px;
      }
      //下拉框选项
      .select-selection {
        margin-top: 5px;
        display: flex;
        .property-item {
          // flex: 3;
        }
        .select-items {
          // flex: 7;
          margin: 0 auto;
          margin-top: 5px;
        }
      }
      //距离限定
      .dislimited {
        margin-top: 10px;
        display: flex;
        .buffer-radius {
          // flex: 7;
          // padding: 0;
        }
        .el-input {
          padding: 0;
          margin: 0 auto;
        }
      }
      //查询按钮
      .btn-query {
        margin: 0 auto;
        margin-top: 10px;
        width: 130px;
        color: #fff;
        background-color: green;
      }
    }
  }
  .footer {
    flex: 5.5;
    margin: 5px;
    border: 1px solid skyblue;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    //数据表样式
    .table-data-view {
      background-color: transparent;
    }

    //标记条目数
    .static-marker {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: orangered;
    }
  }
}
</style>
