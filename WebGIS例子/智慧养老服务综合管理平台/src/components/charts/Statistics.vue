<template>
  <div class="wrap" v-show="this.$store.state.isShowStatistics">
    <!-- 左边部分 -->
    <div class="leftpart">
      <div id="myChart1" class="container_1"></div>
      <div id="myChart2" class="container_2"></div>
    </div>
    <!-- 右边部分 -->
    <div class="rightpart">
      <div class="rightselectitems">
        <!-- 下拉选项 -->
        <el-select
          v-model="value"
          placeholder="划分标准"
          class="selectitems"
          @change="changeItem"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            popper-append-to-body="false"
          >
          </el-option>
        </el-select>
        <!-- 时间范围选择器 -->
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="start"
          end-placeholder="end"
          align="right"
          @change="changeTimeDomain"
        >
        </el-date-picker>
      </div>

      <div id="myChart3" class="container_3"></div>
      <div id="myChart4" class="container_4"></div>
    </div>
  </div>
</template>
<script>
import * as SERVICE from '../../utils/service/serviceUtils'
export default {
  data() {
    return {
      options: [
        {
          value: '护理等级',
          label: '护理等级',
        },
        {
          value: '省级区划',
          label: '省级区划',
        },
        {
          value: '市级区划',
          label: '市级区划',
        },
        {
          value: '县级区划',
          label: '县级区划',
        },
      ],
      value: '',
      value2: '',
      //日期选择器起始时间属性信息
      startTime: 0,
      entTime: 0,
      //划分标准：取值信息
      divideWay: '',
    }
  },
  mounted() {
    this.drawByNurseLevel()
    this.drawByDomain()
    this.drawnByWarnings()
    this.drawByServiceTimes()
  },
  methods: {
    /**时间范围选择器选择内容变化 */
    changeTimeDomain(event) {
      //重新创建echarts3实例
      this.$echarts.init(document.getElementById('myChart3')).dispose() // 销毁实例
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      //重新创建echarts4实例
      this.$echarts.init(document.getElementById('myChart4')).dispose() // 销毁实例
      let mychart4 = this.$echarts.init(document.getElementById('myChart4'))
      //业务逻辑判断
      if (!event) {
        //初始化玫瑰图
        SERVICE.getRoseByNurseLevel().then((res) => {
          let data = res.data
          let legendItems = []
          if (data) {
            //获取图例名称
            let count = data.length - 1
            while (count >= 0) {
              legendItems.push(data[count--])
            }
            this.initEChartByOption(myChart, data, legendItems)
          }
        })
        //初始化柱状图
        SERVICE.getBarOrderByNurseLevel().then((res) => {
          let data = res.data
          this.initEchart4ByOptions(mychart4, data)
        })
        return false
      }

      //获取当前选中的划分标准
      if (!event || event.length == 0) return false
      //获取起止时间对应的毫秒数
      let start = event[0].getTime(),
        end = event[1].getTime()
      //将毫秒数作为参数发送给服务端，解析数据
      //判断划分方式是否有效
      if (
        this.$data.divideWay &&
        this.$data.divideWay != '划分标准' &&
        this.$data.divideWay != '护理等级'
      ) {
        switch (this.$data.divideWay) {
          case '省级区划': {
            //重绘玫瑰图
            SERVICE.getRoseByChinaCodeTime(start, end, '12').then((res) => {
              let data = res.data
              let legendItems = []
              if (data) {
                //获取图例名称
                let count = data.length - 1
                while (count >= 0) {
                  legendItems.push(data[count--])
                }
                this.initEChartByOption(myChart, data, legendItems)
              }
            })
            //重绘柱状图
            SERVICE.getBarOrderByChinaCodeTime('12', start, end).then((res) => {
              let data = res.data
              this.initEchart4ByOptions(mychart4, data)
            })

            return
          }
          case '市级区划': {
            SERVICE.getRoseByChinaCodeTime(start, end, '34').then((res) => {
              let data = res.data
              let legendItems = []
              if (data) {
                //获取图例名称
                let count = data.length - 1
                while (count >= 0) {
                  legendItems.push(data[count--])
                }
                this.initEChartByOption(myChart, data, legendItems)
              }
            })
            //重绘柱状图
            SERVICE.getBarOrderByChinaCodeTime('34', start, end).then((res) => {
              let data = res.data
              this.initEchart4ByOptions(mychart4, data)
            })
            return
          }
          case '县级区划': {
            SERVICE.getRoseByChinaCodeTime(start, end, '56').then((res) => {
              let data = res.data
              let legendItems = []
              if (data) {
                //获取图例名称
                let count = data.length - 1
                while (count >= 0) {
                  legendItems.push(data[count--])
                }
                this.initEChartByOption(myChart, data, legendItems)
              }
            })
            //重绘柱状图
            SERVICE.getBarOrderByChinaCodeTime('56', start, end).then((res) => {
              let data = res.data
              this.initEchart4ByOptions(mychart4, data)
            })
            return
          }
        }
      } else {
        SERVICE.getRoseByNurseLevelTime(start, end).then((res) => {
          let data = res.data
          let legendItems = []
          if (data) {
            //获取图例名称
            let count = data.length - 1
            while (count >= 0) {
              legendItems.push(data[count--])
            }
            this.initEChartByOption(myChart, data, legendItems)
          }
        })
      }
    },
    /**点击事件 */
    changeItem(event) {
      //修改属性信息
      this.$data.divideWay = event
      //重新创建echarts实例
      this.$echarts.init(document.getElementById('myChart3')).dispose() // 销毁实例
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      this.$echarts.init(document.getElementById('myChart4')).dispose() // 销毁实例
      let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
      //根据选中的值执行图表渲染
      switch (event) {
        case '护理等级': {
          //重绘玫瑰图
          SERVICE.getRoseByNurseLevel().then((res) => {
            let data = res.data
            let legendItems = []
            if (data) {
              //获取图例名称
              let count = data.length - 1
              while (count >= 0) {
                legendItems.push(data[count--])
              }
              this.initEChartByOption(myChart, data, legendItems)
            }
          })
          //重绘柱状图
          this.drawByServiceTimes()
          break
        }
        case '省级区划': {
          //重绘玫瑰图
          SERVICE.getRoseByChinaCode('12').then((res) => {
            let data = res.data
            let legendItems = []
            if (data) {
              //获取图例名称
              let count = data.length - 1
              while (count >= 0) {
                legendItems.push(data[count--])
              }
              this.initEChartByOption(
                myChart,
                data,
                legendItems,
                '省级区划/报警次数'
              )
            }
          })
          //重绘柱状图
          SERVICE.getBarOrderByChinaCode('12').then((res) => {
            let data = res.data
            this.initEchart4ByOptions(myChart4, data)
          })
          break
        }
        case '市级区划': {
          SERVICE.getRoseByChinaCode('34').then((res) => {
            let data = res.data
            let legendItems = []
            if (data) {
              //获取图例名称
              let count = data.length - 1
              while (count >= 0) {
                legendItems.push(data[count--])
              }
              this.initEChartByOption(
                myChart,
                data,
                legendItems,
                '市级区划/报警次数'
              )
            }
          })
          //重绘柱状图
          SERVICE.getBarOrderByChinaCode('34').then((res) => {
            let data = res.data
            this.initEchart4ByOptions(myChart4, data)
          })
          break
        }
        case '县级区划': {
          SERVICE.getRoseByChinaCode().then((res) => {
            let data = res.data
            let legendItems = []
            if (data) {
              //获取图例名称
              let count = data.length - 1
              while (count >= 0) {
                legendItems.push(data[count--])
              }
              this.initEChartByOption(
                myChart,
                data,
                legendItems,
                '县级区划/报警次数'
              )
            }
          })
          //重绘柱状图
          SERVICE.getBarOrderByChinaCode('56').then((res) => {
            let data = res.data
            this.initEchart4ByOptions(myChart4, data)
          })
          break
        }
      }
    },

    /**初始化图表 */
    initEChartByOption(
      _myChart,
      data,
      legendItems,
      seriesName = '护理等级/报警次数'
    ) {
      //绘制图表
      let option = {
        title: {
          text: '历史报警次数',
          // subtext: '纯属虚构',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.6)',
          textStyle: {
            color: '#fff',
          },
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          // left: 'center',
          // top: 'bottom',
          top: '0%',
          right: '-1%',
          orient: 'vertical',
          textStyle: {
            color: '#fff',
            fontSize: 10,
          },
          data: legendItems,
        },
        series: [
          {
            name: seriesName,
            type: 'pie',
            radius: [20, 100],

            roseType: 'radius',
            itemStyle: {
              borderRadius: 10,
            },

            label: {
              color: '#ccc',
            },
            labelLine: {
              lineStyle: {},
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: data,
          },
        ],
      }
      _myChart.setOption(option)
    },

    //绘制图表-1:根据护理等级统计结果绘图&根据区域划分统计用户数量
    drawByNurseLevel() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      //请求数据
      SERVICE.getNurseLevel().then((res) => {
        let data = res.data
        if (data) {
          let option = {
            title: {
              text: '护理等级/数量',
              textStyle: {
                color: '#fff',
              },
            },
            legend: {
              top: '8%',
              left: '-5%',
              orient: 'vertical',
              textStyle: {
                color: '#fff',
              },
            },
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(0,0,0,0.6)',
              textStyle: {
                color: '#fff',
              },
            },
            series: [
              {
                name: '客户数量',
                type: 'pie',
                left: '35',
                radius: ['35%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center',
                  fontSize: '12px',
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: data,
              },
            ],
          }
          // 绘制图表
          myChart1.setOption(option)
          setTimeout(function () {
            window.onresize = function () {
              myChart1.resize()
            }
          }, 200)
        }
      })
    },
    //绘制图标-2:
    drawByDomain() {
      //初始化图表
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      //存储x、y轴数据
      let x_axis = [],
        y_axis = [],
        y_axis2 = []
      //请求数据
      SERVICE.getBarByChinaCode(/*56 */).then((res) => {
        let data = res.data
        if (data) {
          //倒序（数组最优遍历方式）
          var i = data.length - 1
          while (i >= 0) {
            x_axis.push(data[i].name)
            y_axis.push(data[i].value)
            y_axis2.push((data[i].value / data.length).toFixed(1))
            i--
          }
          //加载数据
          let option = {
            title: {
              text: '分区统计',
              textStyle: {
                color: '#fff',
              },
              left: 5,
              top: 5,
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(0,0,0,0.6)',
              textStyle: {
                color: '#fff',
              },
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999',
                },
              },
            },
            // legend: {
            //   data: ['数量', '占比'],
            //   textStyle: {
            //     color: '#fff',
            //   },
            // },
            xAxis: {
              type: 'category',
              data: x_axis,
              position: 'bottom',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff',
                },
                formatter: function (value) {
                  return value.trim().split('').join('\n')
                },
              },
              axisPointer: {
                type: 'shadow',
              },
            },
            yAxis: [
              {
                type: 'value',
                name: '数量',
                nameTextStyle: {
                  color: '#FF8C00',
                },
                axisLabel: {
                  color: '#fff',
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: false,
                },
                splitLine: {
                  lineStyle: {
                    color: 'transparent',
                  },
                },
              },
              {
                type: 'value',
                name: '占比',
                nameTextStyle: {
                  color: 'yellow',
                },
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                  color: '#fff',
                  formatter: '{value} %',
                },
                splitLine: {
                  lineStyle: {
                    color: 'transparent',
                  },
                },
              },
            ],
            series: [
              {
                name: '数量',
                type: 'bar',
                itemStyle: {
                  normal: {
                    //定义一个list，然后取得不同的值
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = [
                        '#C1632B',
                        '#B5C334',
                        '#FCCE10',
                        '#E87C25',
                        '#27727B',

                        '#FE8463',
                        '#9BCA63',
                        '#FAD860',
                        '#F3A43B',
                        '#60C0DD',

                        '#D7504B',
                        '#C6E579',
                        '#F4E001',
                        '#F0805A',
                        '#26C0C0',
                      ]
                      return colorList[params.dataIndex]
                    }, //以下为是否显示，显示位置和显示格式的设置了

                    // label: {
                    //   show: true,
                    //   position: 'top',
                    //   formatter: '{c}',
                    // },
                  },
                }, //设置柱的宽度，要是数据太少，柱子太宽不美观~
                barWidth: 15,
                data: y_axis,
              },
              {
                name: '占比',
                type: 'line',
                yAxisIndex: 1,
                data: y_axis2,
                // label: {
                //   show: true,
                //   position: 'top',
                //   formatter: '{c}%',
                // },
              },
            ],
          }
          // 绘制图表
          myChart2.setOption(option)
          //设置宽高自适应
          setTimeout(function () {
            window.onresize = function () {
              myChart2.resize()
            }
          }, 200)
        }
      })
    },
    //绘制图表-3:根据预警分析结果统计区域内的用户量
    drawnByWarnings() {
      let mychart3 = this.$echarts.init(document.getElementById('myChart3'))
      //请求数据
      SERVICE.getRoseByNurseLevel().then((res) => {
        let data = res.data
        let legendItems = []
        if (data) {
          //获取图例名称
          let count = data.length - 1
          while (count >= 0) {
            legendItems.push(data[count--])
          }
          this.initEChartByOption(mychart3, data, legendItems)
        }
      })
    },
    //绘制图表-4：根据服务次数统计区域内的用户量
    drawByServiceTimes() {
      let _that = this
      let mychart4 = this.$echarts.init(document.getElementById('myChart4'))
      //请求数据
      SERVICE.getBarOrderByNurseLevel().then((res) => {
        let data = res.data
        _that.initEchart4ByOptions(mychart4, data)
      })
    },
    //初始化图表4
    initEchart4ByOptions(_mychart, data) {
      //字符串换行函数
      let value = function (value) {
        return (value + '').trim().split('').join('\n')
      }
      //设置option属性
      let option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.6)',
          textStyle: {
            color: '#fff',
          },
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        dataset: {
          source: data,
        },
        grid: { containLabel: true },
        xAxis: {
          name: value(data[0][1]),
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          nameTextStyle: {
            color: 'orangered',
          },
        },

        yAxis: {
          name: data[0][2],
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
            },
            formatter: function (value) {
              return (value + '').trim().split('').join('\n')
            },
          },
          nameTextStyle: {
            color: 'orangered',
          },
        },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 0,
          max: 100,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F'],
          },
          textStyle: {
            color: 'yellow',
          },
        },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: data[0][1],
              // Map the "product" column to Y axis
              y: data[0][2],
            },
          },
        ],
      }
      _mychart.setOption(option)
    },
  },
}
</script>
<style>
/* 全局样式  */
/**下拉框属性 */
.el-select {
  margin: 5px;
  margin-bottom: 0;
  background-color: rgba(10, 42, 47, 0.5);
}
.el-input {
  width: 110px;
  background-color: transparent;
}
.el-input__inner {
  color: orangered;
  background-color: transparent;
}
.el-date-editor .el-range-input {
  color: orangered;
  padding: 3px 0px;
}
.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  flex: 1;
  margin: 5px 5px 0 0;
  width: 50%;
}
input {
  background-color: transparent;
}
/**下拉菜单子项属性 */
.el-select-dropdown {
  background-color: transparent;
}
.el-select-dropdown__item span {
  color: #e6e6fa;
}
.el-select-dropdown__item.hover {
  background-color: transparent;
}
/* 时间范围选择器 */
.el-picker-panel,
.el-picker-panel__footer {
  color: aqua;
  background-color: rgba(0, 0, 0, 0.7);
}
.el-input.is-disabled .el-input__inner {
  color: skyblue;
  background-color: rgba(0, 0, 0, 0.7);
}
.el-picker-panel__icon-btn {
  color: aqua;
}
.el-time-panel {
  background-color: rgba(255, 255, 255, 0.9);
}
</style>

<style lang="less" scoped>
// 局部样式
.wrap {
  height: 100%;
}
.leftpart {
  position: absolute;
  bottom: 1%;
  // left: 0;
  left: 1%;
  // height: 75%;
  height: calc(100% - 230px); /**动态计算盒子的高度 */
  // transform: translateY(-70%);
  color: #fff;
  border: 1px solid skyblue;
  background-color: rgba(10, 42, 47, 0.6);
  // z-index: 9999;
  //图表-1:
  .container_1,
  .container_2 {
    // margin-left: 50px;
    margin: 5px;
    width: 340px;
    height: 50%;
  }
}
// 右边部分-使用/deep/深度修改element-ui的组件属性

.rightpart {
  position: absolute;
  right: 0.5%;
  top: 50%;
  height: 98%;
  transform: translateY(-50%);
  border: 1px solid skyblue;
  background-color: rgba(10, 42, 47, 0.6);
  .rightselectitems {
    display: flex;
    width: 350px;
  }
  // 划分标准下拉框
  // .selectitems {
  //   // width: 40%;
  // }
  //图表-3、4
  .container_3,
  .container_4 {
    margin-top: 5px;
    width: 320px;
    height: 50%;
  }
  //图表3
  .container_3 {
    height: 35%;
  }
  //图表-4
  .container_4 {
    height: 60%;
  }
}
</style>
