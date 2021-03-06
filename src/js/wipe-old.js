var canvas = document.getElementById('cas');
var context = canvas.getContext('2d');

var _w = canvas.width;
var _h = canvas.height;
var t = 0;
var moveX = 0;
var moveY = 0;

//表示鼠标的状态，是否按下，默认为未按下false，按下true
var isMouseDown = false;
//device保存设备类型，如果是移动端则为true，PC端为false
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
var radius = 20;//涂抹的半径
console.log(navigator.userAgent);
console.log(device);
var clickEvtName = device ? "touchmove" : "mousedown";
var moveEvtName = device ? "touchmove" : "mousemove";
var endEvtName = device ? "touchend" : "mouseup";
//生成画布上的遮罩，默认为颜色#666
function drawMask(context){
	context.fillStyle="#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}
function drawT(context,x1,y1,x2,y2){
	if(arguments.length === 3){
		//调用的是画点功能
		context.save();
		context.beginPath();
		context.arc(x1,y1,radius,0,2*Math.PI);
		context.fillStyle = "red";
		context.fill();
		context.restore();
	}else if(arguments.length === 5){
		//调用的是画线功能
		context.save();
		context.lineCap = "round";
		context.lineWidth = radius*2;
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.stroke();
		context.restore();
	}else{
		
	}
}
cas.addEventListener(clickEvtName,function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	moveX = device ? event.touches[0].clientX : event.clientX;
	moveY = device ? event.touches[0].clientY : event.clientY;
	drawT(context,moveX,moveY);
},false);
cas.addEventListener(moveEvtName,function(evt){
	//判断，当isMouseDown为true时，才执行下面的操作
		if(!isMouseDown){
			return false;
		}else{
			var event = evt || window.event;
			event.preventDefault();
			var x2 = device ? event.touches[0].clientX : event.clientX;
			var y2 = device ? event.touches[0].clientY : event.clientY;
			drawT(context,moveX,moveY,x2,y2);
			moveX = x2;
			moveY = y2;
		}
},false);
cas.addEventListener(endEvtName,fn2,false);
function fn2(evt){
	//还原isMouseDown 为false
	isMouseDown = false;
	if(getTransparencyPercent(context) > 50){
		alert("超出了50%的面积");
//		drawMask(context);
		clearRech(context);
	}
}
function clearRech(context){
	context.clearRect(0,0,_w,_h);
}
function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	for(var i=0;i<imgData.data.length;i+=4){
		var a=imgData.data[i+3];
		if(a===0){
			t++;
		}
	}
	var percent = (t/(_w*_h))*100;
	console.log("透明点的个数:"+t);
	console.log("占地面积"+ Math.ceil(percent) +"%");
	//return percent.toFixed(2);//截取小数点两位
	return Math.round(percent);
}
window.onload = function(){
	drawMask(context);
};
