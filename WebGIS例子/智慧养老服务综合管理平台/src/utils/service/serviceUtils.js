import axios from 'axios'
import qs from 'qs'
/*******************************IP地址*************************************/
const IP = 'http://localhost:8088/springboot-bysj'

/******************************数据请求方法*********************************/

/**
 * 根据账户名称登录到系统
 * @param {账户名} adminAccount
 * @param {密码} password
 */
export function loginByAdminAccount(adminAccount, password) {
    return axios({
        url: IP + '/login/GET/byaccount',
        method: 'GET',
        params: {
            account: adminAccount,
            password: password,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据手机号登录到系统
 * @param {与账户相关联的手机号} phoneNum
 * @param {密码} password
 * @returns
 */
export function loginByPhoneNum(phoneNum, password) {
    return axios({
        url: IP + '/login/GET/byphonenum',
        method: 'GET',
        params: {
            // phoneNum: '13137188108',
            // password: '123456',
            phoneNum: phoneNum,
            password: password,
        },
        dataType: 'json',
        async: false,
    })
}

/***********************用户信息获取——begin***************************************/

/**
 * 获取所有用户的信息
 */
export function getAllClientUserList() {
    return axios({
        url: IP + '/clinetuser/GET/allusers',
        method: 'GET',
        dataType: 'json',
        async: false,
    })
}

/**
 * 通过用户的身份证号获取用户的信息
 * @param {客户的身份证号} idnum
 * @returns
 */
export function getDetailClientUserInfoByIdNum(idnum) {
    return axios({
        url: IP + '/clinetuser/GET/userbyidnum',
        method: 'GET',
        params: {
            idnum: idnum,
        },
        dataType: 'json',
        async: false,
    })
}
/***********************用户信息获取——end***************************************/

/***********************图表渲染——begin***************************************/

/**
 * 左上角饼状图统计数据  /nurselevel/GET 无请求参数
 */
export function getNurseLevel() {
    return axios({
        url: IP + '/namevalue/GET/piedata',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 左下角柱状图统计数据   /clientnumsindomain/GET/12  请求参数：12 34 56
 * @param {中国城市行政区划分级} _code
 * 12 省级
 * 34 城市
 * 56 区县
 */
export function getBarByChinaCode(_code = '56') {
    let url = IP + '/namevalue/GET/bardata/' + _code
    return axios({
        url: url,
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 右上角玫瑰饼状图统计数据  /namevalue/GET/rosedata/nurselevel 无请求参数
 */
export function getRoseByNurseLevel() {
    return axios({
        url: IP + '/namevalue/GET/rosedata/nurselevel',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 右上角玫瑰饼状图统计数据  /namevalue/GET/rosedata/12 :请求参数:12 34 56
 *  @param {中国城市行政区划分级} _code
 * 12 省级
 * 34 城市
 * 56 区县
 */
export function getRoseByChinaCode(_code = '56') {
    let url = IP + '/namevalue/GET/rosedata/' + _code
    return axios({
        url: url,
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 右上角玫瑰饼状图统计数据  /namevalue/GET/rosedata/timelimit 请求参数 starttime endtime
 * @param {起始时间} _startTime
 * @param {终止时间} _endTime
 * @returns
 */
export function getRoseByNurseLevelTime(_startTime, _endTime) {
    return axios({
        url: IP + '/namevalue/GET/rosedata/timelimit',
        method: 'GET',
        params: {
            starttime: _startTime,
            endtime: _endTime,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 右上角玫瑰饼状图统计数据  /namevalue/GET/rosedata/56/timelimit 请求参数 starttime endtime
 * @param {起始时间} _startTime
 * @param {终止时间} _endTime
 * @param {行政区划代码} _code
 * 12 省级
 * 34 城市
 * 56 区县
 */
export function getRoseByChinaCodeTime(_startTime, _endTime, _code = '56') {
    let url = IP + '/namevalue/GET/rosedata/56/timelimit'
    return axios({
        url: url,
        method: 'GET',
        params: {
            starttime: _startTime,
            endtime: _endTime,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 右下角柱状图统计数据  /nvweight/GET/barweightdata/format 无请求参数
 */
export function getBarOrderByNurseLevel() {
    let url = IP + '/nvweight/GET/barweightdata/format'
    return axios({
        url: url,
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 右下角柱状图统计数据  /nvweight/GET/barweightdata/format 请求参数 starttime  endtime
 * @param {起始时间}} _startTime
 * @param {结束时间} _endTime
 * @returns
 */
export function getBarOrderByNurseLevelTime(_startTime, _endTime) {
    let url = IP + '/nvweight/GET/barweightdata/time/format'
    return axios({
        url: url,
        method: 'GET',
        params: {
            starttime: _startTime,
            endtime: _endTime,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 按照省级代码划分服务次数
 * @returns 按照省级代码划分服务次数
 */
export function getBarOrderByChinaCode(_code) {
    let url = IP + '/nvweight/GET/barweightdata/' + _code + '/format'
    return axios({
        url: url,
        method: 'get',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 按照省级代码与时间限定划分服务次数 /nvweight/GET/barweightdata/56/time/format
 * @param {行政区划代码} _code
 * @param {开始时间} startTime
 * @param {结束时间} endTime
 * @returns
 */
export function getBarOrderByChinaCodeTime(_code, startTime, endTime) {
    let url = IP + '/nvweight/GET/barweightdata/' + _code + '/time/format'
    return axios({
        url: url,
        method: 'get',
        params: {
            starttime: startTime,
            endtime: endTime,
        },
        dataType: 'json',
        async: false,
    })
}

/***********************图表渲染——end***************************************/

/************************信息弹出窗口数据请求---begin***********************/
// /nvweight/GET/monthlydata
/**
 * 根据身份证号获取历史报警信息  请求参数---idnum
 * @param {身份证号} _idnum
 */
export function getWarnHistoryInfo(_idnum) {
    return axios({
        url: IP + '/nvweight/GET/monthlydata',
        method: 'GET',
        params: {
            idnum: _idnum,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据身份证号，按月份统计历史报警信息 /namevale/GET/warntime/month 请求参数 idnum
 * @param {身份证号} _idnum
 */
export function getWarnTimeInfoMonthly(_idnum) {
    let url = IP + '/namevale/GET/warntime/month',
        param = { idnum: _idnum }
    return axios({
        url: url,
        method: 'GET',
        params: param,
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据身份证号，获取历史详细的报警时间点列表 /namevale/GET/warntime/detail 请求参数 idnum
 * @param {身份证号} _idnum
 */
export function getWarnTimeInfoDetail(_idnum) {
    return axios({
        url: IP + '/namevale/GET/warntime/detail',
        method: 'GET',
        params: {
            idnum: _idnum,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据身份证号获取详细的基本统计信息 /userstatisticsinfo/byidnum 请求参数 idnum
 * @param {身份证号} idnum
 */
export function getUserStatisticsInfoByIdNum(idnum) {
    return axios({
        url: IP + '/userstatisticsinfo/byidnum',
        method: 'GET',
        params: {
            idnum: idnum,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据身份证号码获取详细的健康信息 /healthrecord/GET/byidnum  请求参数 idnum
 * @param {身份证号} idnum
 */
export function getHealthInfoByIdnum(idnum) {
    return axios({
        url: IP + '/healthrecord/GET/byidnum',
        method: 'GET',
        params: {
            idnum: idnum,
        },
        dataType: 'json',
        async: false,
    })
}

/************************信息弹出窗口数据请求---end***********************/

/************************信息检索窗口数据请求---begin***********************/

/**
 * 获取省份名称与编码
 * @returns 省份名称与编码
 */
export function getProvinceOfWarn() {
    return axios({
        url: IP + '/warnrecord/province',
        method: 'get',
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取市级名称与编码
 * @param {省份编码} code
 * @returns 市级名称与编码
 */
export function getCityOfWarn(code) {
    return axios({
        url: IP + '/warnrecord/province/city',
        method: 'get',
        params: {
            code: code, //请求参数:code
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取县区名称与编码
 * @param {市级编码} code
 * @returns 县区名称与编码
 */
export function getCountryOfWarn(code) {
    return axios({
        url: IP + '/warnrecord/province/city/country',
        method: 'get',
        params: {
            code: code, //请求参数:code
        },
        dataType: 'json',
        async: false,
    })
}
// /warnrecord/province/city/country   请求参数:code

/************************信息弹出窗口数据请求---end***********************/

/************************报警信息查询窗口数据请求---begin***********************/

/**
 * 获取所有的历史报警信息 无请求参数
 * @return 返回有所的历史报警信息数组
 */
export function getAllWarnRecords() {
    return axios({
        url: IP + '/warnrecord/GET/all',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取所有的未处理的历史报警信息 无请求参数
 * @returns 返回所有的未处理的报警信息数组
 */
export function getUnResolvedWarnRecords() {
    return axios({
        url: IP + '/warnrecord/GET/unresolved',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/***
 * 发送json格式的请求体
 */
export function sendJsonData(params) {
    // let jsonData = qs.stringify(params)
    return axios({
        url: IP + '/warnrecord/GET/info',
        method: 'POST',
        data: params,
        dataType: 'json',
        async: false,
    })
}

/**
 * 通过边界数组筛选报警信息
 * @param {边界数组} params
 */
export function getWarnInfoByBounds(params) {
    return axios({
        url: IP + '/warnrecord/GET/boundlimits',
        method: 'POST',
        data: params,
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据矩形范围筛选报警信息
 * @param {矩形框的顶点坐标} params
 * @returns
 */
export function getWarnInfoByRectangle(params) {
    return axios({
        url: IP + '/warnrecord/GET/rectangle',
        method: 'POST',
        data: params,
        dataType: 'json',
        async: false,
    })
}
/**
 * 根据四个边界范围筛选报警信息点
 * @param {最北纬度} north
 * @param {最东经度} east
 * @param {最南纬度} south
 * @param {最西经度} west
 * @returns
 */
export function getWarnRecordByBoundPts(north, east, south, west) {
    return axios({
        url: IP + '/warnrecord/GET/boundpts',
        method: 'GET',
        dataType: 'json',
        params: {
            north: north,
            east: east,
            south: south,
            west: west,
        },
        async: false,
    })
}

/************************报警信息查询窗口数据请求---end***********************/

/***************************服务点信息查询---begin**************************/

/**
 * 获取所有的医院服务点
 */
export function getAllHospital() {
    return axios({
        url: IP + '/servicecenter/GET/allhospitals',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取所有的家政服务点
 * @returns 所有的家政服务点
 */
export function getAllServicePoint() {
    return axios({
        url: IP + '/servicecenter/GET/allservicepoints',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取所有的医院信息点
 */
export function getHospitalPOILists() {
    return axios({
        url: IP + '/hospital/GET',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据经纬度获取分部点
 * @param {经度} lon
 * @param {纬度} lat
 * @returns
 */
export function getServicePOIListsByLonLat(lon, lat) {
    return axios({
        url: IP + '/servicecenter/GET/defaultsps',
        method: 'GET',
        params: {
            lng: lon,
            lat: lat,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据经纬度获取医疗点
 * @param {经度} lon
 * @param {纬度} lat
 * @returns
 */
export function getHopitalPOIListsByLonLat(lon, lat) {
    return axios({
        url: IP + '/servicecenter/GET/defaulthps',
        method: 'GET',
        params: {
            lng: lon,
            lat: lat,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据经纬度与缓冲半径获取分部点
 * @param {经度} lon
 * @param {纬度} lat
 * @param {缓冲半径} distance
 * @returns
 */
export function getServicePsByBufferDis(lon, lat, distance) {
    return axios({
        url: IP + '/servicecenter/GET/spsbybufferdis',
        method: 'GET',
        params: {
            lng: lon,
            lat: lat,
            distance: distance,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据经纬度与缓冲半径获取医疗点
 * @param {经度} lon
 * @param {纬度} lat
 * @param {缓冲半径} distance
 * @returns
 */
export function getHospitalPsByBufferDis(lon, lat, distance) {
    return axios({
        url: IP + '/servicecenter/GET/hpsbybufferdis',
        method: 'GET',
        params: {
            lng: lon,
            lat: lat,
            distance: distance,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 根据身份证号获取详细信息
 */
export function getWarnDetailByIdnum(idnum) {
    return axios({
        url: IP + '/warndetail/GET/entity',
        method: 'GET',
        params: {
            idnum: idnum,
        },
        dataType: 'json',
        async: false,
    })
}

/***********************3D分析——begin*********************************/

/**
 * 获取全焦作市热力图初始化数据
 */
export function getWarnInfoForHeatMapInJiaoZuo() {
    return axios({
        url: IP + '/xyvalue/GET/warninfo',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取焦作市某一个县区热力图初始化数据
 * @param {县区名称} domain
 */
export function getWarnInfoForHeatMapByDomainName(domain) {
    return axios({
        url: IP + '/xyvalue/GET/warninfo/bydomain',
        method: 'GET',
        params: {
            domain: domain,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取热力图json文件资源内容-焦作市范围
 */
export function getHeatMapJsonFileContent() {
    return axios({
        url: IP + '/xyvalue/GET/heatmaparray.json',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取热力图json文件资源内容——县区范围
 * @param {县区名称} domain
 * @returns
 */
export function getHeatMapJsonFileContentByDomain(domain) {
    return axios({
        url: IP + '/xyvalue/GET/bydomain/heatmaparray.json',
        method: 'GET',
        params: {
            domain: domain,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取全焦作市克里金插值源数据
 * @returns 全焦作市克里金插值源数据集
 */
export function getWarnInfoListInJiaoZuoWGS84() {
    return axios({
        url: IP + '/xyvalue/GET/warninfokriging',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取焦作市某个县区的克里金插值源数据
 * @param {县区名称} domain
 * @returns 全焦作市克里金插值源数据集
 */
export function getWarnInfoListByDomainNameWGS84(domain) {
    return axios({
        url: IP + '/xyvalue/GET/warninfokriging/bydomain',
        method: 'GET',
        params: {
            domain: domain,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * @returns 所有的用户信息
 */
export function getUserInfoListInJiaoZuo() {
    return axios({
        url: IP + '/xyvalue/GET/userinfoheatmap',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}
/**
 * @returns 所有的用户信息——wgs84坐标系
 */
export function getUserInfoListInJiaoZuoWGS84() {
    return axios({
        url: IP + '/xyvalue/GET/userinfokriging',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/***********************3D分析——end*********************************/

/***********************报警处理——begin*********************************/
/**
 * 处理报警信息
 * @param {当前管理员账户名称} admin
 * @param {用户身份证号} idnum
 * @param {用户报警时间} warntime
 * @param {经度} lon
 * @param {纬度} lat
 * @returns
 */
export function updateWarnRecord(admin, idnum, warntime, lon, lat) {
    return axios({
        url: IP + '/warnrecord/UPDATE/byidnum',
        method: 'GET',
        params: {
            admin: admin,
            idnum: idnum,
            warntime: warntime,
            lon: lon,
            lat: lat,
        },
        dataType: 'json',
        async: false,
    })
}
/***********************报警处理——end*********************************/

/***********************服务消息处理——end*********************************/

/**
 * 获取分页的页数
 */
export function getPageSize(pagesize) {
    return axios({
        url: IP + '/serviceorder/GET/totalsize',
        method: 'GET',
        params: {
            pagesize: pagesize,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取总页数——未处理的消息
 * @param {每一页的数量} pagesize
 * @returns
 */
export function getUnSolvedPageSize(pagesize) {
    return axios({
        url: IP + '/serviceorder/GET/unsolvedtotalsize',
        method: 'GET',
        params: {
            pagesize: pagesize,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 查询已经处理的详细服务数据
 */
export function selectAllDetailByPageSize(beginindex, offset) {
    return axios({
        url: IP + '/serviceorder/GET/allorder',
        method: 'GET',
        params: {
            beginindex: beginindex,
            offset: offset,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 查询未处理的服务数据
 */
export function selectAllWidthoutDeal(beginindex, offset) {
    return axios({
        url: IP + '/serviceorder/GET/allorder/withoutdeal',
        method: 'GET',
        params: {
            beginindex: beginindex,
            offset: offset,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 *
 * @param {用户名} username
 * @param {经度} lon
 * @param {纬度} lat
 * @param {发起时间} warntime
 * @returns
 */
export function updateServiceRecord(
    username,
    lon,
    lat,
    ordertime,
    admin,
    status
) {
    return axios({
        url: IP + '/serviceorder/UPDATE/status',
        method: 'GET',
        params: {
            username: username,
            lon: lon,
            lat: lat,
            ordertime: ordertime,
            admin: admin,
            status: status,
        },
        dataType: 'json',
        async: false,
    })
}

/***********************服务消息处理——end*********************************/
/***************************城市信息查询--begin**********************************/
/**
 * 获取搜索框基本信息
 */
export function getCityListForIndexBox() {
    return axios({
        url: IP + '/citylist/GET/all',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/***************************城市信息查询--end**********************************/

/*************************获取城市边界数组---begin****************************/

/**
 * 根据城市名称获取边界坐标数组序列
 * @param {城市名称} cityName
 */
export function getCityBoundsJsonArray(cityName) {
    return axios({
        url: IP + '/coordsarray/GET/byname',
        method: 'GET',
        params: {
            cityname: cityName,
        },
        dataType: 'json',
        async: false,
    })
}

/**
 * 获取焦作市的边界坐标数组
 * @returns 焦作市边界坐标数组
 */
export function getJiaoZuoBoundsJsonArray() {
    return axios({
        url: IP + '/coordsarray/GET/jiaozuo',
        method: 'GET',
        params: {},
        dataType: 'json',
        async: false,
    })
}

/*************************获取城市边界数组---end****************************/