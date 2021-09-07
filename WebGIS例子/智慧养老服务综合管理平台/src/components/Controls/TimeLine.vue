<template>
  <div class="wrap">
    <light-timeline :items="items" class="lightTimeline">
      <template slot="tag" slot-scope="{ item }">
        {{ item.date }}
      </template>
      <template slot="content" slot-scope="{ item }">
        {{ item.msg }}
      </template>
    </light-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showdialog: false,
      choosefalse: false,
      items: [
        {
          date: '2019-02-12',
          msg: '测试内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
        {
          date: '2019-02-13',
          msg: '练习内容',
        },
      ],
    }
  },
  methods: {
    initHistoryData() {},
    clickTimeLineItem(value) {
      console.log(value)
    },
  },
}
</script>
<style lang="less" scoped>
.lightTimeline[data-v-7dcb96ba] {
  // overflow: visible;
}
.lightTimeline[data-v-7dcb96ba]::-webkit-scrollbar {
  width: 0; //不显示滚动条
}
.wrap {
  position: absolute;
  left: 15px;
  top: 220px;
  width: 300px;
  height: 300px;
  padding-left: 8px;
  color: #fff;
  border: 1px solid skyblue;
  // background-color: rgba(10, 42, 47, 0.8);
}

.multiPeriodImagesDialog {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  pointer-events: none;
}
.multiPeriodImagesDialog .el-dialog {
  position: absolute;
  right: 5px;
  margin: 0px;
  max-height: 450px;
  max-width: 300px;
}
.lightTimeline {
  max-height: 300px;
  overflow: scroll;
  color: aliceblue;
}
</style>
