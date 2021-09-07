import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //state:驱动应用的数据源
    state: {
        footerProperty: {}, //底部地理信息属性值
        isShowPopUpOver: false, //控制popUpOver组件的显隐
        popupOverItemProperty: {}, //popUpOver组件的属性传值
        isShowHoverOver: false, //控制HoverOver组件的显隐
        hoverOverItemProperty: {}, //HoverOver组件的属性传值
        isShowStatistics: true, //Statistic组件的显隐
        isShowPopUpWindow: false, //是否显示弹出窗口popUpWidnow
        popWindowItemProperty: {}, //弹出窗口popUpWidnow属性信息
        isShowWarnInfoIndexTool: false, //是否显示信息检索工具窗口
        isShowWarnInfoIndex: false, //是否显示信息检索窗口
        indexPopUpWindowParams: {}, //信息检索窗口中查询参数的值
        indexPopUpWindowGraphicParams: '', //信息检索窗口中图形查询参数的值
        warnPtsLayerStatus: false, //报警点图层的状态（显示/隐藏）
        isShowWarnDetails: false, //是否显示详细报警信息窗口
        warnDetailOutterProperty: undefined, //详细报警窗口的外部属性值
        isShowAnalysisTool: false, //是否显示分析工具
        isShowServiceCenter: false, //是否显示数据中心窗口
        isShowQueryWindow: false, //是否显示视景窗口
        servicePtCoord: {}, //服务点坐标值{lng,lat}
        isShowUserIndexBox: false, //是否显示搜索框窗口
        isShowAbout: false, //关于窗口
    },
    //获取状态树中的状态值:将返回结果暴露为属性值
    getters: {
        getFooterProperty: (state) => {
            return state.footerProperty
        },
        getIsShowPopUpOver: (state) => {
            return state.isShowPopUpOver
        },
        getPopupOverItemProperty: (state) => {
            return state.popupOverItemProperty
        },
        getIsShowHoverOver: (state) => {
            return state.isShowHoverOver
        },
        getHoverOverItemProperty: (state) => {
            return state.hoverOverItemProperty
        },
        getIsShowStatistics: (state) => {
            return state.isShowStatistics
        },
        getIsShowPopUpWindow: (state) => {
            return state.isShowPopUpWindow
        },
        getPopWindowItemProperty: (state) => {
            return state.popWindowItemProperty
        },
        getIsShowWarnInfoIndexTool: (state) => {
            return state.isShowWarnInfoIndexTool
        },
        getIsShowWarnInfoIndex: (state) => {
            return state.isShowWarnInfoIndex
        },
        getIndexPopUpWindowParams: (state) => {
            return state.indexPopUpWindowParams
        },
        getIndexPopUpWindowGraphicParams: (state) => {
            return state.indexPopUpWindowGraphicParams
        },
        getWarnPtsLayerStatus: (state) => {
            return state.warnPtsLayerStatus
        },
        getIsShowWarnDetails: (state) => {
            return state.isShowWarnDetails
        },
        getWarnDetailOutterProperty: (state) => {
            return state.warnDetailOutterProperty
        },
        getIsShowAnalysisTool: (state) => {
            return state.isShowAnalysisTool
        },
        getIsShowServiceCenter: (state) => {
            return state.isShowServiceCenter
        },
        getIsShowQueryWindow: (state) => {
            return state.isShowQueryWindow
        },
        getServicePtCoord: (state) => {
            return state.servicePtCoord
        },
        getIsShowUserIndexBox: (state) => {
            return state.isShowUserIndexBox
        },
        getIsShowAbout: (state) => {
            return state.isShowAbout
        },
    },
    //设置状态树中的状态值:必须同步执行
    mutations: {
        setFooterProperty(state, payload) {
            state.footerProperty = payload
        },
        setPopupOverItemProperty(state, payload) {
            state.popupOverItemProperty = payload
        },
        setIsShowPopUpOver(state, payload) {
            state.isShowPopUpOver = payload
        },
        setIsShowHoverOver(state, payload) {
            state.isShowHoverOver = payload
        },
        setHoverOverItemProperty(state, payload) {
            state.hoverOverItemProperty = payload
        },
        setIsShowStatistics(state, payload) {
            state.isShowStatistics = payload
        },
        setIsShowPopUpWindow(state, payload) {
            state.isShowPopUpWindow = payload
        },
        setPopWindowItemProperty(state, payload) {
            state.popWindowItemProperty = payload
        },
        setIsShowWarnInfoIndexTool(state, payload) {
            state.isShowWarnInfoIndexTool = payload
        },
        setIsShowWarnInfoIndex(state, payload) {
            state.isShowWarnInfoIndex = payload
        },
        setIndexPopUpWindowParams(state, payload) {
            state.indexPopUpWindowParams = payload
        },
        setIndexPopUpWindowGraphicParams(state, payload) {
            state.indexPopUpWindowGraphicParams = payload
        },
        setWarnPtsLayerStatus(state, payload) {
            state.warnPtsLayerStatus = payload
        },
        setIsShowWarnDetails(state, payload) {
            state.isShowWarnDetails = payload
        },
        setWarnDetailOutterProperty(state, payload) {
            state.warnDetailOutterProperty = payload
        },
        setIsShowAnalysisTool(state, payload) {
            state.isShowAnalysisTool = payload
        },
        setIsShowServiceCenter(state, payload) {
            state.isShowServiceCenter = payload
        },
        setIsShowQueryWindow(state, payload) {
            state.isShowQueryWindow = payload
        },
        setServicePtCoord(state, payload) {
            state.servicePtCoord = payload
        },
        setIsShowUserIndexBox(state, payload) {
            state.isShowUserIndexBox = payload
        },
        setIsShowAbout(state, payload) {
            state.isShowAbout = payload
        },
    },
    //处理异步数据修改：可执行异步操作
    actions: {
        setFooterPropertyAsync({ commit }, payload) {
            commit('setFooterProperty', payload)
        },
        setPopupOverItemPropertyAsync({ commit }, payload) {
            commit('setPopupOverItemProperty', payload)
        },
        setIsShowPopUpOverAsync({ commit }, payload) {
            commit('setIsShowPopUpOver', payload)
        },
        setIsShowHoverOverAsync({ commit }, payload) {
            commit('setIsShowHoverOver', payload)
        },
        setHoverOverItemPropertyAsync({ commit }, payload) {
            commit('setHoverOverItemProperty', payload)
        },
        setIsShowStatistics({ commit }, payload) {
            commit('setIsShowStatistics', payload)
        },
        setIsShowPopUpWindow({ commit }, payload) {
            commit('setIsShowPopUpWindow', payload)
        },
        setPopWindowItemProperty({ commit }, payload) {
            commit('setPopWindowItemProperty', payload)
        },
        setIsShowWarnInfoIndexTool({ commit }, payload) {
            commit('setIsShowWarnInfoIndexTool', payload)
        },
        setIsShowWarnInfoIndex({ commit }, payload) {
            commit('setIsShowWarnInfoIndex', payload)
        },
        setIndexPopUpWindowParams({ commit }, payload) {
            commit('setIndexPopUpWindowParams', payload)
        },
        setIndexPopUpWindowGraphicParams({ commit }, payload) {
            commit('setIndexPopUpWindowGraphicParams', payload)
        },
        setWarnPtsLayerStatus({ commit }, payload) {
            commit('setWarnPtsLayerStatus', payload)
        },
        setIsShowWarnDetails({ commit }, payload) {
            commit('setIsShowWarnDetails', payload)
        },
        setWarnDetailOutterProperty({ commit }, payload) {
            commit('setWarnDetailOutterProperty', payload)
        },
        setIsShowAnalysisTool({ commit }, payload) {
            commit('setIsShowAnalysisTool', payload)
        },
        setIsShowServiceCenter({ commit }, payload) {
            commit('setIsShowServiceCenter', payload)
        },
        setIsShowQueryWindow({ commit }, payload) {
            commit('setIsShowQueryWindow', payload)
        },
        setServicePtCoord({ commit }, payload) {
            commit('setServicePtCoord', payload)
        },
        setIsShowUserIndexBox({ commit }, payload) {
            commit('setIsShowUserIndexBox', payload)
        },
        setIsShowAbout({ commit }, payload) {
            commit('setIsShowAbout', payload)
        },
    },
    modules: {},
})