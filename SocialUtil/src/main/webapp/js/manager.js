//构造函数
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
LineChart.prototype.init = function(data){
	this.drawGrid();
	this.drawAxis();
	this.drawDotteds(data);
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
LineChart.prototype.drawDotteds = function(data){
	var that = this;
	//记录当前坐标
	var prevCanvasX = 0;
	var prevCanvasY = 0;
	data.forEach(function(item,i){
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

var data = [
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
lineChart.init(data);