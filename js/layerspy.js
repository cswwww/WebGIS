let radius = 75;          //设置探查半径 
// 当按上方向键时放大圆圈，按下方向键时缩小圆圈，同时渲染地图并阻止按键默认事件
document.addEventListener("keydown", function (event) {
    if (event.key  == "ArrowUp") {
      radius = Math.min(radius + 5, 150);
      map1.render();
      event.preventDefault();

    } else if (event.key === "ArrowDown") {
      radius = Math.max(radius - 5, 25);
      map1.render();
      event.preventDefault();
    }
  });

// 实时得到鼠标的像素位置
//TODO: 将鼠标监听范围修改为#map
// var container = document.getElementById("");     
var mousePosition = null;   
document.addEventListener('mousemove', function(event) {
    mousePosition =  map1.getEventPixel(event);
    map1.render();
});
document.addEventListener('mouseout', function () {
    mousePosition = null;
    map1.render();
});


function layerSpy() {
    map()
    // map1.addLayer(td_cia);
    map1.removeLayer(td_cia);
    
// 绘制蒙版
td_img.on("prerender",function(event) { // 在每次绘制影像图层之前触发
    let ctx = event.context;    // 获取canvase渲染上下文
    let pixelRatio = event.frameState.pixelRatio;   // 获取地图当前帧的像素比率
    ctx.save();             // 保存当前canvas设置
    ctx.beginPath();             // 开始绘制路径
    // 当mousePosition不为null时才执行
    if (mousePosition) {
      // canvas绘制圆圈
      ctx.arc(
        mousePosition[0] * pixelRatio,
        mousePosition[1] * pixelRatio,
        radius * pixelRatio, 0, 2 * Math.PI
      );
      ctx.lineWidth = 5 * pixelRatio;
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.stroke();
    }
    // 仅显示osm中画圆圈的部分
    // 使用刚绘制的圆裁剪影像图层，使得影像图层只保留该圆的范围
    // https://www.w3school.com.cn/tiy/t.asp?f=html5_canvas_clip
    ctx.clip();
  });
  // 在图层渲染之后，重置canvas上下文
  td_img.on("postrender", event => {
    let ctx = event.context;
    ctx.restore();   // canvas恢复到之前的设置
  });
  
}

