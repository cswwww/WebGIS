import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入echarts
import * as echarts from 'echarts'
//引入Cesium
import * as Cesium from 'cesium/Cesium'
import * as widgets from 'cesium/Widgets/widgets.css'
//引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// 引入vue-light-timeline
// import LightTimeline from 'vue-light-timeline'

// 使用element-ui
Vue.use(Element)
    //使用echarts
Vue.prototype.$echarts = echarts
    //使用axios
Vue.use(VueAxios, axios)
    //使用vue-light-timeline
    // Vue.use(LightTimeline)

Vue.config.productionTip = false
Vue.prototype.Cesium = Cesium
Vue.prototype.widgets = widgets

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')