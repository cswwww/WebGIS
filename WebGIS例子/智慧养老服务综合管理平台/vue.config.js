//vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
    // 基本路径(把开发服务器假设在根路径)
    publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : './',
    // publicPath: './',
    //构建输出时的目录
    outputDir: 'dist',
    // 放置静态资源的目录
    assetsDir: 'static',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    //webpack-dev-server配置
    devServer: {
        host: 'localhost',
        open: true, //true:编译完成后自动使用默认浏览器打开
        port: 8033, //端口号
        hot: true, //启用热部署
        // proxy: {
        //     // 可以用于配置跨域请求
        //     '/api': {
        //         target: 'http://127.0.0.1:8080',
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/api': '',
        //         },
        //     },
        // },
    },
    configureWebpack: {
        output: {
            sourcePrefix: ' ',
        },
        amd: {
            toUrlUndefined: true,
        },
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                cesium: path.resolve(__dirname, cesiumSource),
            },
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
            ]),
            new CopyWebpackPlugin([
                { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
            ]),
            new CopyWebpackPlugin([
                { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
            ]),
            new CopyWebpackPlugin([{
                from: path.join(cesiumSource, 'ThirdParty/Workers'),
                to: 'ThirdParty/Workers',
            }, ]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./'),
            }),
        ],
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false,
        },
        // performance: {
        //     hints: 'warning',
        //     //入口起点的最大体积 整数类型（以字节为单位）
        //     maxEntrypointSize: 50000000,
        //     //生成文件的最大体积 整数类型（以字节为单位 300k）
        //     maxAssetSize: 500000000,
        //     //只给出 js 文件的性能提示
        //     assetFilter: function(assetFilename) {
        //         return assetFilename.endsWith('.js')
        //     },
        // },
    },
}