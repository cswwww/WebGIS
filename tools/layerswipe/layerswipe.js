
function layerSwipe(){
    map()
    map1.removeLayer(td_cia);
    // map1.removeLayer(td_img);
    // map1.removeLayer(td_cva);
    // map1.removeLayer(td_vec);


       
    var swipe = document.getElementById('swipe');   // 用于控制卷帘位置的DOM元素
    td_img.on('prerender', function(event){          // 在Bing地图渲染之前触发
        var ctx = event.context;                 //获得canvas渲染上下文
        var width = ctx.canvas.width * (swipe.value / 100);  // 用于保存卷帘的位置
        
        ctx.save();                 // 保存canvas设置
        ctx.beginPath();            // 开始绘制路径
        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);    // 绘制矩形
        ctx.clip();                 // 裁剪Bing地图，以形成卷帘效果
    })
    
    td_img.on('postrender', function(event){     // 在Bing地图渲染之后触发
        var ctx = event.context;
        ctx.restore();              // 恢复canvas设置
    });

    swipe.addEventListener('input', function(){     // 在每次用户改变swipe控件时触发
        map1.render();               // 渲染地图
    }, false);

}





 

        
