const { Notification } = require('element-ui')

var websocket = null
    //浏览器是否支持
if ('WebSocket' in window) {
    // 上面我们给webSocket定位的路径
    //IP:localhost:8088/springboot-bysj   访问路径：/websocket
    websocket = new WebSocket('ws://localhost:8088/springboot-bysj/websocket')
} else {
    alert('该浏览器不支持websocket!')
}
//建立连接
websocket.onopen = function(event) {
        console.log('建立连接')
    }
    //关闭连接
websocket.onclose = function(event) {
        console.log('连接关闭')
    }
    //消息来的时候的事件
websocket.onmessage = function(event) {
    // 这里event.data就是我们从后台推送过来的消息
    console.log('收到消息:' + event.data)
        // 在这里我们可以在页面中放置一个音乐，例如“您有新的订单了！”这样的提示音
    document.querySelector('#mp3Control').currentTime = 0
    document.querySelector('#mp3Control').play()
    Notification.success({
        title: 'Loading Success...',
        message: '有新的报警消息,请查看!',
        duration: 5000,
    })
}

//发生错误时
websocket.onerror = function() {
        alert('websocket通信发生错误！')
    }
    //窗口关闭时，Websocket关闭
window.onbeforeunload = function() {
    websocket.close()
}

module.exports = websocket