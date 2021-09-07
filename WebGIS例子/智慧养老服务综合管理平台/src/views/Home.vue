<template>
  <div class="wrap">
    <Viewer />
    <About />
    <FuncMenu />
    <LayerSwitch />
    <Footer />
    <WarnInfoIndex />
    <Statistics />
    <PopupOver />
    <HoverOver />
    <PopupWindow />
    <IndexPopUpWindow />
    <!-- <WarnItem :outProperty="item" /> -->
    <WarnDetails />
    <!-- <div class="heatmap"></div> -->
    <AnalysisTool />
    <ServiceCenter />
    <QueryWindow />
    <UserIndexBox />
    <!-- <TimeLine /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import Viewer from '../components/Viewer' //视图模块
import About from '../views/About' //关于
import FuncMenu from '../components/Menus/FuncMenu' //功能模块
import Footer from '../components/Controls/Footer' //底部提示信息
import Statistics from '../components/charts/Statistics' //数据统计模块
import WarnInfoIndex from '../components/Warns/WarnInfoIndex' //报警信息目录树
import PopupOver from '../components/Controls/PopupOver' //鼠标点击弹出窗口模块-测试
import HoverOver from '../components/Controls/HoverOver' //鼠标悬浮弹出窗口模块-测试
import PopupWindow from '../components/Controls/PopupWindow' //弹出窗体
import IndexPopUpWindow from '../components/Controls/IndexPopUpWindow' //检索窗口
import LayerSwitch from '../components/Controls/LayerSwitch' //图层控制开关
// import WarnItem from '../components/Controls/WarnItem'
import WarnDetails from '../components/Controls/WarnDetails' //报警详情查看
import AnalysisTool from '../components/3DAnalysis/AnalysisTool' //三维分析工具
import ServiceCenter from '../components/Services/ServiceCenter' //服务中心窗口
import QueryWindow from '../components/2D3DMapView/QueryWindow' //二三维同步窗口
import UserIndexBox from '../components/IndexBox/UserIndexBox' //搜索框工具
// import TimeLine from '../components/Controls/TimeLine' //时间线工具（测试）
export default {
  name: 'Home',
  components: {
    Viewer,
    About,
    FuncMenu,
    Statistics,
    WarnInfoIndex,
    PopupOver,
    HoverOver,
    Footer,
    PopupWindow,
    IndexPopUpWindow,
    LayerSwitch,
    // WarnItem,
    WarnDetails,
    AnalysisTool,
    ServiceCenter,
    QueryWindow,
    UserIndexBox,
    // TimeLine,
  },
  data() {
    return {
      // item: {
      //   id: 1,
      //   name: '张三',
      //   status: '已处理',
      //   datetime: '2020-01-18',
      //   place: '河南省焦作市山阳区世纪大道2001号',
      // },
    }
  },
}
</script>
<style lang="less" scoped></style>
