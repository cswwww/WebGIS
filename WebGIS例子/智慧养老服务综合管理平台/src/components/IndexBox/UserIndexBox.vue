<template>
  <div class="UserIndexBoxWrap" v-show="this.$store.state.isShowUserIndexBox">
    <div class="selectComtrol">
      <treeselect
        ref="DRHA_EFaultModeTree"
        v-model="DRHA_EFaultModeTree_value"
        :multiple="true"
        :options="DRHA_EFaultModeTree_options"
        :flatten-search-results="true"
        :flat="true"
        :show-count="true"
        :disable-branch-nodes="true"
        :searchable="true"
        @open="openModeTree_handleOpen"
        @select="DRHA_EFaultModeTree_handleSelect"
        @deselect="DRHA_EFaultModeTree_handleDeSelect"
        placeholder=" 请选择..."
      />
    </div>
    <div class="selectedList">
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="600px"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="label" label="姓名" sortable width="100">
        </el-table-column>
        <el-table-column prop="nlevel" label="护理等级" sortable width="80">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
//导入组件
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
//导入service工具类
import * as SERVICE from '../../utils/service/serviceUtils'
//导入ViewUitls工具类
import * as ViewUitls from '../../utils/viewerUtils'
export default {
  components: {
    //注册组件
    Treeselect,
  },
  data() {
    return {
      DRHA_EFaultModeTree_value: null,
      // DRHA_EFaultModeTree_lables: [],
      //选项列表数据
      DRHA_EFaultModeTree_options: [
        // {
        //   id: '1',
        //   label: '山阳区',
        //   children: [
        //     {
        //       id: '1-1',
        //       label: 'Apple ?',
        //       isNew: true,
        //     },
        //     {
        //       id: '1-2',
        //       label: 'Grapes ?',
        //     },
        //     {
        //       id: '1-3',
        //       label: 'Pear ?',
        //     },
        //     {
        //       id: '1-4',
        //       label: 'Strawberry ?',
        //     },
        //     {
        //       id: 'watermelon',
        //       label: 'Watermelon ?',
        //     },
        //   ],
        // },
        // {
        //   id: 'vegetables',
        //   label: '中站区',
        //   children: [
        //     {
        //       id: 'corn',
        //       label: 'Corn ?',
        //       children: [],
        //     },
        //     {
        //       id: 'carrot',
        //       label: 'Carrot ?',
        //     },
        //     {
        //       id: 'eggplant',
        //       label: 'Eggplant ?',
        //     },
        //     {
        //       id: 'tomato',
        //       label: 'Tomato ?',
        //     },
        //   ],
        // },
      ],
      //表格数据
      tableData: [
        // {
        //   label: '2016-05-02',
        //   nlevel: '王小虎',
        //   idnum: '1111111',
        // },
        // {
        //   label: '2016-05-02',
        //   nlevel: '王小虎',
        // },
        // {
        //   label: '2016-05-02',
        //   nlevel: '王小虎',
        // },
        // {
        //   label: '2016-05-02',
        //   nlevel: '王小虎',
        // },
      ],
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initComponent()
    // })
  },
  computed: {
    onInputValue() {
      return this.DRHA_EFaultModeTree_value
    },
  },
  watch: {
    onInputValue(value) {
      console.log(value)
      value.length == 0 ? (this.tableData = []) : ''
    },
  },
  methods: {
    formatter(row, column) {
      return row.address
    },
    /**查看事件：定位到目标点位-->弹出信息框 */
    handleEdit(index, row) {
      console.log(index, row)
      //通过用户数据进行定位+信息显示操作
      ViewUitls.moveCameraShowInfoWindow(row.id, ViewUitls.staticParams.viewer)
    },
    /**移除事件：从目标列表中移除当前item--> 取消选中状态*/
    handleDelete(index, row) {
      console.log(index, row)
      //弹出用户数据{splice方法会改变原始数组。}
      let len = this.tableData.length - 1
      while (len >= 0) {
        if (
          this.tableData[len].label.trim() == row.label &&
          this.tableData[len].nlevel.trim() == row.nlevel &&
          this.tableData[len].id.trim() == row.id
        ) {
          // console.log(
          //   this.tableData[len].id,
          //   this.tableData[len].label,
          //   this.tableData[len].nlevel
          // )
          // console.log(len)
          this.tableData.splice(len, 1)
          break
        }
        len -= 1
      }
    },
    DRHA_EFaultModeTree_handleSelect(node, instanceId) {
      console.log('Select')
      console.log(node, instanceId)
      // this.DRHA_EFaultModeTree_lables.push(node.label)
      this.tableData.push({
        label: node.label, //姓名
        nlevel: node.geom, //护理等级
        id: node.id, //身份证号
      })
    },
    DRHA_EFaultModeTree_handleDeSelect(node, instanceId) {
      console.log('DeSelect')
      console.log(node)
      //弹出用户数据{splice方法会改变原始数组。}
      let len = this.tableData.length - 1
      while (len >= 0) {
        if (
          this.tableData[len].label.trim() == node.label &&
          this.tableData[len].nlevel.trim() == node.geom &&
          this.tableData[len].id.trim() == node.id
        ) {
          console.log(
            this.tableData[len].id,
            this.tableData[len].label,
            this.tableData[len].nlevel
          )
          // console.log(len)
          this.tableData.splice(len, 1)
          break
        }
        len -= 1
      }
    },

    openModeTree_handleOpen(value) {
      SERVICE.getCityListForIndexBox().then((res) => {
        let data = res.data
        this.DRHA_EFaultModeTree_options = data
      })
    },
  },
}
</script>
<style>
.vue-treeselect__control {
  background-color: rgba(10, 42, 47, 0.6);
  border: 1px solid skyblue;
}
.vue-treeselect__menu {
  background-color: rgba(10, 42, 47, 0.8);
}
</style>
<style lang="less" scoped>
.UserIndexBoxWrap {
  position: absolute;
  color: orangered;
  left: 20px;
  top: 230px;
  display: flex;
  flex-direction: column;
  // height: 150px;
  background-color: rgba(10, 42, 47, 0.6);
  border: 1px solid skyblue;
  //下拉框选择列表
  .selectComtrol {
    width: 350px;
    margin: 0 auto;
    margin-top: 2px;
  }
  //被选中的table列表
  .selectedList {
    margin-top: 2px;
    border-top: 1px solid skyblue;
  }
}
/deep/ input {
  color: #fff;
} // 取消滚动条显示
.el-table--scrollable-y ::-webkit-scrollbar {
  display: none;
}
</style>
