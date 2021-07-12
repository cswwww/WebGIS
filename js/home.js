/**
 * 主页使用的一些函数
 */ 
function fadeIn(element,speed){
    if(element.style.display = 'none'){
        element.style.opacity = 0; 
        element.style.display = 'block'
        if(element.style.opacity !=1){
            var speed = speed || 30 ;
            var num = 0;
            var st = setInterval(function(){
            num++;
            element.style.opacity = num/10;
            if(num>=10)  {  clearInterval(st);  }
            },speed);
        }
    }
}

function fadeOut(element,speed){
    if(element.style.opacity !=0){
        var speed = speed || 30 ;
        var num = 10;
        var st = setInterval(function(){
        num--;
        element.style.opacity = num / 10 ;
        if(num<=0)  {clearInterval(st);
            element.style.display = 'none' }
        },speed);
    }
}


var i=1;
function displayWindows(element) {
    var mydiv = document.getElementById(element);
    if(i%2==1){
        fadeIn(mydiv,20);
    }
    if(i%2==0){
        fadeOut(mydiv,20);
    }
    i++;
}


function a(){
    var projectionSelect = document.getElementById("projection");   
projectionSelect.addEventListener('change', function(event){
    // 使mousePositionControl控件的投影与选取投影控件选取的投影一致
    mousePositionControl.setProjection(event.target.value);    
});
var precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function(event){
    var format = ol.coordinate.createStringXY(event.target.valueAsNumber);
    mousePositionControl.setCoordinateFormat(format);
});
}