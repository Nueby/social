//兼容浏览器获取非行内样式
function getStyle(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}



//举报点击事件
$("#report_manager").click(function(){
	if($("#report_page").is(":hidden")){
		$("#report_page").show();
		$("#brokenLine").css({"background":"rgba(100,100,100,.9"});
	}else{
		$("#report_page").hide();
		$("#brokenLine").css({"background":"rgba(100,100,100,.5"});
	}
	$("#imformation_page").hide();
	$("#linechart_show").hide();
	$("#ciclechart_show").hide();
})
$("#statistics_manager").click(function(){
	if($(".statistics").is(":hidden")){
		setTimeout("showSta()",10);
	}else{
		setTimeout("hideSta()");
	}
	$(".statistics li").click(function(){
		return false;
	})
})
//显示隐藏二级导航栏的函数
function showSta(){
	$(".statistics").show();
}
function hideSta(){
	$(".statistics").hide();
}
// function hideTable(){
// 	$("#chat_record").hide();
// 	$("#imformation_check").hide();
// }

//显示和隐藏聊天记录管理界面
$("#chat_manager").click(function(){
	if($("#record_page").is(":hidden")){
		$("#record_page").show();
	}else{
		$("#record_page").hide();
	}
	$("#imformation_page").hide();
	$("#report_page").hide();
	$("#linechart_show").hide();
	$("#ciclechart_show").hide();
})


//显示和隐藏个人信息界面
$("#personal_imformation").click(function(){
	if($("#imformation_page").is(":hidden")){
		$("#imformation_page").show();
	}else{
		$("#imformation_page").hide();
	}
	$("#record_page").hide();
	$("#report_page").hide();
	$("#linechart_show").hide();
	$("#ciclechart_show").hide();
})

//显示统计图
$("#brokenLine").click(function(){
	if($("#linechart_show").is(":hidden")){
		$("#linechart_show").show();
	}else{
		$("#linechart_show").hide();
	}
	$("#ciclechart_show").hide();
	$("#imformation_page").hide();
	$("#chat_record").hide();
	$("#report_page").hide();
})
$("#reportCicle").click(function(){
	if($("#ciclechart_show").is(":hidden")){
		$("#ciclechart_show").show();
	}else{
		$("#ciclechart_show").hide();
	}
	$("#linechart_show").hide();
	$("#imformation_page").hide();
	$("#chat_record").hide();
	$("#report_page").hide();
})


//构造折线图函数
var LineChart = function(ctx){
	//获取工具
	this.ctx = ctx || document.querySelector("#linechart").getContext("2d");
	this.canvasWidth = this.ctx.canvas.width;
	this.canvasHeight = this.ctx.canvas.height;
	//网格的大小
	this.gridSize = 20;
	//箭头的大小
	this.arrowSize = 10;
	//坐标间距
	this.space = 20;
	//绘制点大小
	this.dottedSize = 6;
	//坐标原点
	this.x0 = this.space;
	this.y0 = this.canvasHeight -this.space;
}
//行为方法
LineChart.prototype.init = function(TagData){
	this.drawGrid();
	this.drawAxis();
	this.drawDotteds(TagData);
};
LineChart.prototype.drawGrid = function(){
	//x方向的线
	var xLineTotal = Math.floor(this.canvasHeight / this.gridSize);
	for(var i = 0; i < xLineTotal;i++){
		this.ctx.beginPath();
		this.ctx.moveTo(0,i * this.gridSize);
		this.ctx.lineTo(this.canvasWidth,i * this.gridSize);
		this.ctx.strokeStyle = "#aaa";
		this.ctx.stroke();
	}
	//y方向的线
	var yLineTotal = Math.floor(this.canvasWidth / this.gridSize);
	for(var i = 0; i < yLineTotal;i++){
		this.ctx.beginPath();
		this.ctx.moveTo(i * this.gridSize,0);
		this.ctx.lineTo(i * this.gridSize,this.canvasHeight);
		this.ctx.strokeStyle = "#aaa";
		this.ctx.stroke();
	}
};
LineChart.prototype.drawAxis = function(){
	//x轴
	this.ctx.beginPath();
	this.ctx.strokeStyle = "black";
	this.ctx.moveTo(this.x0,this.y0);
	this.ctx.lineTo(this.canvasWidth -this.space,this.y0);
	this.ctx.lineTo(this.canvasWidth -this.space - this.arrowSize,this.y0 + this.arrowSize/2);
	this.ctx.lineTo(this.canvasWidth -this.space - this.arrowSize,this.y0 - this.arrowSize/2);
	this.ctx.lineTo(this.canvasWidth -this.space,this.y0);
	this.ctx.stroke();
	this.ctx.fill();
	//y轴
	this.ctx.beginPath();
	this.ctx.strokeStyle = "black";
	this.ctx.moveTo(this.x0,this.y0);
	this.ctx.lineTo(this.space,this.space);
	this.ctx.lineTo(this.space + this.arrowSize/2,this.arrowSize + this.space);
	this.ctx.lineTo(this.space - this.arrowSize/2,this.arrowSize + this.space);
	this.ctx.lineTo(this.space,this.space);
	this.ctx.stroke();
	this.ctx.fill();
};
LineChart.prototype.drawDotteds = function(TagData){
	var that = this;
	//记录当前坐标
	var prevCanvasX = 0;
	var prevCanvasY = 0;
	TagData.forEach(function(item,i){
		//数据在canvas上的坐标
		var canvasX = that.x0 + item.x;
		var canvasY = that.y0 - item.y;
		//绘制点
		that.ctx.beginPath();
		that.ctx.moveTo(canvasX - that.dottedSize / 2,canvasY - that.dottedSize / 2);
		that.ctx.lineTo(canvasX + that.dottedSize / 2,canvasY - that.dottedSize / 2);
		that.ctx.lineTo(canvasX + that.dottedSize / 2,canvasY + that.dottedSize / 2);
		that.ctx.lineTo(canvasX - that.dottedSize / 2,canvasY + that.dottedSize / 2);
		that.ctx.closePath();
		that.ctx.fill();
		//点的连线
		if(i == 0){
			that.ctx.beginPath();
			that.ctx.moveTo(that.x0,that.y0);
			that.ctx.lineTo(canvasX,canvasY);
			that.ctx.stroke();
		}else{
			that.ctx.beginPath();
			that.ctx.moveTo(prevCanvasX,prevCanvasY);
			that.ctx.lineTo(canvasX,canvasY);
			that.ctx.stroke();
		}
		//每次给当前点重新赋值
		prevCanvasX = canvasX;
		prevCanvasY = canvasY;
	})
};
//假数据
//x表示标签名字,每四十就是一个新标签,y代表选择该标签的人数
//后台给数据y就可以

var TagData = [
	{
	   x : 40,
	   y : 120
	},
	{
		x : 80,
		y : 160
	},
	{
		x : 120,
		y : 200
	},
	{
		x : 160,
		y : 320
	},
	{
		x : 200,
		y : 80
	},
];
var lineChart = new LineChart();
lineChart.init(TagData);



//绘制饼状图函数
var CicleChart = function(ctx){
	//获取工具
	this.ctx = ctx || document.querySelector("#ciclechart").getContext("2d");
	this.w = this.ctx.canvas.width;
	this.h = this.ctx.canvas.height;
	//圆心
	this.x0 = this.w/2;
	this.y0 = this.h/2;
	//圆的半径
	this.radius = 150;
	//确定圆多出的线的长度
	this.outline = 20;
};
//饼状图的行为方法
CicleChart.prototype.init = function(reportData){
	this.drawCicle(reportData);
	this.CicleTitle();
	this.CicleTranslte();
};
//画圆方法
CicleChart.prototype.drawCicle = function(reportData){
	var that = this;
    var angleList = that.transformAngle(reportData);
	//记录起始弧度
	var startAngle = 0;
	angleList.forEach(function(item,i){
		var endAngle = startAngle + item.angle;
		that.ctx.beginPath();
		that.ctx.moveTo(that.x0,that.y0);
		that.ctx.arc(that.x0,that.y0,that.radius,startAngle,endAngle);
		var color = that.ctx.fillStyle = that.getRandomColor();
		that.ctx.fill();
		that.CicleTitle(startAngle,item.angle,color,item.title);
		that.CicleTranslte(startAngle,endAngle);
		startAngle = endAngle;
	})
};
//画标题方法
CicleChart.prototype.CicleTitle = function(startAngle,angle,color,title){
	//绘制指向线
	var edge =this.radius + this.outline;
	var edgeX = Math.cos(startAngle + angle/2)*edge;
	var edgeY = Math.sin(startAngle + angle/2)*edge;
	var outX = this.x0 + edgeX;
	var outY = this.y0 + edgeY;
	this.ctx.beginPath();
	this.ctx.moveTo(this.x0,this.y0);
	this.ctx.lineTo(outX,outY);
	this.ctx.strokeStyle = color;
	this.ctx.stroke();
	//测量文字长度
	this.ctx.font = "16px Microsoft YaHei";
	var textWidth = this.ctx.measureText(title).width;
	//画文字和下划线
	if(outX > this.x0){
		this.ctx.lineTo(outX + textWidth,outY);
		this.ctx.textAlign = "left";
	}else{
		this.ctx.lineTo(outX - textWidth,outY);
		this.ctx.textAlign = "right";
	}
	this.ctx.stroke();
	this.ctx.textBaseline = "bottom";
	this.ctx.fillStyle = "black";
	this.ctx.fillText(title,outX,outY);
};
//给每一块弧度加事件
CicleChart.prototype.CicleTranslte= function(starAngle,endAngle){
	$("#linechart_show").click(function(){
		var x=event.offsetX;
		var y=event.offsetY;console.log(x);
	});
	
};
//转换弧度
CicleChart.prototype.transformAngle = function(reportData){
	var total = 0;
	//计算总人数
	reportData.forEach(function(item,i){
		total += item.number;
	})
	//计算弧度
	reportData.forEach(function(item,i){
		var angle = item.number / total *(Math.PI*2);
		//再将装换好的弧度给reportData方便调用
		item.angle = angle;
	})
	return reportData;
};
//生成随机颜色的方法
CicleChart.prototype.getRandomColor = function(){
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return "rgb(" + r + "," + g + "," + b + ")";
};
var reportData = [
	{
		title:"言语辱骂",
		number:20
	},
	{
		title:"挑逗信息",
		number:30
	},
	{
		title:"海王",
		number:15
	},
	{
		title:"垃圾广告",
		number:50
	},
	{
		title:"恶意骚扰",
		number:10
	},
	{
		title:"信息咋骗",
		number:35
	}
];
var cicleChart = new CicleChart();
cicleChart.init(reportData);
