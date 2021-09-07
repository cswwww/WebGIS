import * as Cesium from 'cesium/Cesium'
import h337 from 'heatmap.js'

export default class DrawHeatMap {
    /**
     * 构造器
     * @param {三维视图实例} _viewer
     */
    constructor(_viewer) {
        this._viewer = _viewer //三维视图实例
        this._layers = [] //临时图层数组
    }

    /**
     * data :{
     *           max: max, //所有数据中的最大值
     *           data: points, //最终要展示的数据
     * }
     * @param {热力图初始化数据实力} data
     * @returns 热力图画布实例
     */
    drawHeatMapCanvas(data) {
        //创建Dom元素
        let isExists = document.querySelector('.heatmap')
        if (isExists) document.body.removeChild(isExists)
            //添加信息的div元素
        let heatMapContainer = document.createElement('div')
        heatMapContainer.style.width = '500px'
        heatMapContainer.style.height = '500px'
        heatMapContainer.className = 'heatmap'
        heatMapContainer.style.display = 'none' //控制热力图不显示
            //将其添加到body中
        document.body.appendChild(heatMapContainer)
            //绘制热力图
        var heatmapInstance = h337.create({
                // only container is required, the rest will be defaults  只需要一个container，也就是最终要绘制图形的dom节点，其他都默认
                container: document.querySelector('.heatmap'),
            })
            // heatmap data format
            //  var data = {
            //    max: max, //所有数据中的最大值
            //    data: points, //最终要展示的数据
            //  }
            // if you have a set of datapoints always use setData instead of addData
            // for data initialization
        heatmapInstance.setData(data)
        console.log(heatmapInstance)
            //获取heatmapInsatnce的画布
        let heatmapCanvas = document.querySelector('.heatmap-canvas')
        return heatmapCanvas
    }

    drawByData() {
        // minimal heatmap instance configuration 配置
        var heatmapInstance = h337.create({
            // only container is required, the rest will be defaults  只需要一个container，也就是最终要绘制图形的dom节点，其他都默认
            container: document.querySelector('.heatmap'),
        })

        // now generate some random data  产生随机数
        var points = []
        var max = 0
        var width = 840
        var height = 400
        var len = 200

        while (len--) {
            var val = Math.floor(Math.random() * 100)
            max = Math.max(max, val) //注意这里有个max用来设置最大值
            var point = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: val,
            }
            points.push(point)
        }
        // heatmap data format
        var data = {
                max: max, //所有数据中的最大值
                data: points, //最终要展示的数据
            }
            // if you have a set of datapoints always use setData instead of addData
            // for data initialization
        heatmapInstance.setData(data)
    }
}