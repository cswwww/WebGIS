<template>
  <div class="wrap" v-if="this.$store.state.isShowWarnInfoIndex">
    <!-- 头部区域-检索工具---begin -->
    <div class="header">
      <span class="el-icon-s-tools toolbox-icon">工具箱</span>
      <div class="func-items-group">
        <i
          class="el-icon-search search-icon"
          title="检索工具"
          @click="indexTool"
          >检索</i
        >
        <i class="el-icon-connection deal-icon" title="待处理" @click="dealTool"
          >待处理</i
        >
        <i
          class="el-icon-refresh refresh-icon"
          title="重置列表"
          @click="resetTool"
          >重置</i
        >
      </div>
    </div>
    <!-- 头部区域-检索工具---end -->
    <!-- 分割线 -->
    <hr class="splitLine" />
    <!-- 报警项 -->
    <div class="warn-items infinite-list-item">
      <el-scrollbar style="height: 100%">
        <WarnItem
          :outProperty="item"
          v-for="(item, index) in itemList"
          :key="index"
          @showDetail="viewDetail"
        />
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import WarnItem from '../../components/Controls/WarnItem'
import * as ViewUtils from '../../utils/viewerUtils'
import * as SERVICE from '../../utils/service/serviceUtils'
import { Notification } from 'element-ui' //导入Element-UI：Notification 通知组件
export default {
  components: {
    WarnItem,
  },
  data() {
    return {
      item: {
        id: 1,
        idnum: '41122419980268521',
        name: '张三',
        status: '已处理',
        datetime: '2020-01-18',
        place: '河南省焦作市山阳区世纪大道2001号',
      },
      itemList: [
        // {
        //   id: 1,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 2,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 3,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 4,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 5,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 6,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 7,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 8,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 9,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 10,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 11,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // },
        // {
        //   id: 12,
        //   name: '张三',
        //   status: '已处理',
        //   datetime: '2020-01-18 18:30:00',
        //   endtime: '2020-01-18 18:35:26',
        //   place: '河南省焦作市山阳区世纪大道2001号',
        // }
      ],
      indexWarnTime: '',
    }
  },
  mounted() {
    this.$nextTick(function () {
      // SERVICE.getAllWarnRecords().then((res) => {
      //getUnResolvedWarnRecords
      SERVICE.getUnResolvedWarnRecords().then((res) => {
        let data = res.data
        console.log(data)
        console.log(data.length)
        if (!data || data.length == 0) {
          Notification.success({
            title: 'Loading Error',
            message: '历史报警信息不存在！',
            duration: 3000,
          })
          //否则置空数据集
          this.$data.itemList = []
          return false
        }
        //加载数据集
        Notification.success({
          title: '待处理报警信息...',
          message: '累计' + data.length + '条报警信息!',
          duration: 3000,
        })
        this.$data.itemList = res.data
      })
    })
  },
  computed: {
    //属性计算
    onIndexPopUpWindowParams() {
      return this.$store.state.indexPopUpWindowParams
    },
    onIndexPopUpWindowGraphicParams() {
      return this.$store.state.indexPopUpWindowGraphicParams
    },
  },
  watch: {
    //属性监听
    onIndexPopUpWindowParams(value) {
      console.log(value)
      /*
      mode: 1
      msg: {
        cityName: ""
        countryName: ""
        provinceName: 410000
        timeEnd: NaN
        timeStart: NaN

      }
      */
      //根据数据内容发起数据请求
      let searchMode = value.mode
      let msg = value.msg
      console.log(msg)
      if (searchMode == 1) {
        console.log('send jsondata')
        //按照条件筛选数据集
        SERVICE.sendJsonData({
          msg,
        }).then((res) => {
          let data = res.data
          console.log(data)
          if (!data || data.length == 0) {
            Notification.warning({
              title: 'Loading Error',
              message: '历史报警信息不存在！',
              duration: 3000,
            })
            //置空数据集
            this.$data.itemList = []
            return false
          }
          //先清空数据
          this.$data.itemList = []
          //在重新加载数据集
          Notification.success({
            title: 'Success!',
            message: '累计' + data.length + '条报警信息!',
            duration: 3000,
          })
          let len = res.data.length - 1
          while (len >= 0) {
            this.$data.itemList.unshift(data[len--])
          }
          console.log(this.$data.itemList)
        })
      }
    },
    onIndexPopUpWindowGraphicParams(value) {
      if (value) {
        switch (value.mode) {
          case 1: {
            //按照矩形查询
            SERVICE.getWarnInfoByRectangle(value.data).then((res) => {
              let data = res.data
              console.log(data)
              if (!data || data.length == 0) {
                Notification.warning({
                  title: 'Loading Error',
                  message: '查询结果为空',
                  duration: 3000,
                })
                //置空数据集
                this.$data.itemList = []
                return false
              }
              //先清空数据
              this.$data.itemList = []
              //在重新加载数据集
              Notification.success({
                title: 'Success!',
                message: '累计' + data.length + '条报警信息!',
                duration: 3000,
              })
              let len = res.data.length - 1
              while (len >= 0) {
                this.$data.itemList.unshift(data[len--])
              }
              console.log(this.$data.itemList)
            })
            break
          }
          case 2: {
            //多边形查询
            SERVICE.getWarnInfoByBounds(value.data).then((res) => {
              console.log(res)
              //更新数据
              let data = res.data
              console.log(data)
              if (!data || data.length == 0) {
                Notification.warning({
                  title: 'Loading Error',
                  message: '查询结果为空',
                  duration: 3000,
                })
                //置空数据集
                this.$data.itemList = []
                return false
              }
              //先清空数据
              this.$data.itemList = []
              //在重新加载数据集
              Notification.success({
                title: 'Success!',
                message: '累计' + data.length + '条报警信息!',
                duration: 3000,
              })
              let len = res.data.length - 1
              while (len >= 0) {
                this.$data.itemList.unshift(data[len--])
              }
              console.log(this.$data.itemList)
            })
          }
          case 3: {
            //按照指定边界范围查询
            //发送数据请求
            SERVICE.getWarnRecordByBoundPts(
              value.data.north,
              value.data.east,
              value.data.south,
              value.data.west
            ).then((res) => {
              let data = res.data
              console.log(data)
              if (!data || data.length == 0) {
                Notification.warning({
                  title: 'Loading Error',
                  message: '查询结果为空',
                  duration: 3000,
                })
                //置空数据集
                this.$data.itemList = []
                return false
              }
              //先清空数据
              this.$data.itemList = []
              //在重新加载数据集
              Notification.success({
                title: 'Success!',
                message: '累计' + data.length + '条报警信息!',
                duration: 3000,
              })
              let len = res.data.length - 1
              while (len >= 0) {
                this.$data.itemList.unshift(data[len--])
              }
              console.log(this.$data.itemList)
            })
          }
        }
        value = ''
      }
    },
  },
  methods: {
    /**检索工具图标点击事件 */
    indexTool() {
      this.$store.dispatch('setIsShowWarnInfoIndexTool', true)
    },
    /**重置列表图标点击事件 */
    resetTool() {
      console.log('resetTool')
      SERVICE.getAllWarnRecords().then((res) => {
        let data = res.data
        if (!data || data.length == 0) {
          Notification.warning({
            title: 'Loading Error',
            message: '历史报警信息不存在！',
            duration: 3000,
          })
          //否则置空数据集
          this.$data.itemList = []
          return false
        }
        //加载数据集
        Notification.success({
          title: 'Success!',
          message: '累计' + data.length + '条报警信息!',
          duration: 3000,
        })
        this.$data.itemList = res.data
      })
    },
    /**查看待处理报警信息 */
    dealTool() {
      console.log('dealTool')
      SERVICE.getUnResolvedWarnRecords().then((res) => {
        let data = res.data
        if (!data || data.length == 0) {
          Notification.warning({
            title: 'Loading Error',
            message: '报警信息已经处理完毕！',
            duration: 3000,
          })
          //否则置空数据集
          this.$data.itemList = []
          return false
        }
        //加载数据集
        Notification.success({
          title: 'Success!',
          message: '累计' + data.length + '条报警信息!',
          duration: 3000,
        })
        this.$data.itemList = res.data
      })
    },
    /**自定义组件WarnItem的点击事件 */
    viewDetail(value) {
      console.log(value)
      if (value) {
        //判断报警点状态
        switch (value.status) {
          case 0: {
            //未处理
            // this.$store.dispatch('setWarnPtsLayerStatus', true) // 修改图层状态
            //加载报警点位置
            //             wLat: 35.1764
            // wLon: 113.197
            //显示详细报警信息窗口
            this.$store.dispatch('setIsShowWarnDetails', true)
            //修改全局变量的值
            this.$store.dispatch('setWarnDetailOutterProperty', value)
            //清除上一次添加的标记点
            ViewUtils.removeTempMarkerLayer()
            ViewUtils.removeTempJsonLayer()
            //加载新的临时标记点
            ViewUtils.loadTempMarker(value.wLon, value.wLat)
            break
          }
          case 1: {
            //已经处理
            //显示组件
            this.$store.dispatch('setIsShowPopUpWindow', true)
            //设置组件的属性值
            this.$store.dispatch('setPopWindowItemProperty', {
              idnum: value.idNumber,
            })
            break
          }
        }
      }
    },
  },
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
ul {
  list-style: none;
}
/* 修改树组件的背景色 */
/* .el-tree {
  background-color: transparent;
  color: #fff;
} */
/* 修改鼠标悬停时树节点的背景色 */
/* .el-tree-node__content:hover {
  background-color: rgba(255, 255, 255, 0.3);
} */
/* 修改鼠标点击选中时树节点的背景色 */
/* .el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(255, 255, 255, 0.3);
} */
/* .el-tree-node__content:focus {
  background-color: rgba(255, 255, 255, 0.3);
} */
</style>
<style lang="less" scoped>
.wrap {
  position: absolute;
  right: 1%;
  top: 1%;
  width: 320px;
  height: 95%;
  color: #fff;
  background-color: rgba(10, 42, 47, 0.8);
  border: 1px solid skyblue;
  // 头部区域
  .header {
    margin: 10px 5px 0 5px;
    display: flex;
    justify-content: flex-start;
    height: 35px;
    line-height: 35px;
    background-color: rgb(90, 75, 224);
    border-radius: 5px;
    .toolbox-icon {
      margin-right: 10px;
      line-height: 35px;
      padding: 0 5px;
      background-color: rgb(138, 194, 138);
      border-radius: 5px;
      border-top-right-radius: 45%;
    }
    //功能图标按钮组
    .func-items-group {
      flex: 1;
      display: flex;
      justify-content: space-around;
    }
    // 检索按钮&重置列表按钮
    .search-icon,
    .refresh-icon,
    .deal-icon {
      line-height: 35px;
    }
    .search-icon:hover {
      cursor: pointer;
    }
    .refresh-icon:hover {
      cursor: pointer;
    }
    .deal-icon:hover {
      cursor: pointer;
    }
  }
  //分割线
  .splitLine {
    margin: 10px 0;
    border: none;
    height: 1px;
    background-color: skyblue;
  }
  //报警项
  .warn-items {
    height: 93%;
    // background-color: slateblue;
  }
}
</style>
