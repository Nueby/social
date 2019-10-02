var option = 0;		//选择  0表示个人   1表示交友

//获取ID所对应的元素
function $id(id) {
	return document.getElementById(id);
}

//出场动画
function load() {
	$(".board").css("display","none");
	resize();
	$id("single").src = "img/single_0.png";
	$id("double").src = "img/double_0.png";
	$("#double").animate({
		marginTop:'25%',
		marginLeft:'5%'
	},2000);
	$("#single").animate({
		marginTop:'12%',
		marginLeft:'2%'
	},2000);
}

//重置大小
function resize() {
	$(".board").css("height",parseInt($(".board").css("width")) * 9 / 10 + "px");
}

//更改选择图标
function changeIcon() {
	if(option == 0) {
		$id("single").src = "img/single.png";
		$id("double").src = "img/double_0.png";
	} else {
		$id("single").src = "img/single_0.png";
		$id("double").src = "img/double.png";
	}
}

//切换个人
function changeSingle() {
	option = 0;
	changeIcon();
	changeBoard();
}

//切换交友
function changeDouble() {
	option = 1;
	changeIcon();
	changeBoard();
}

//切换面板
function changeBoard() {
	if(option == 0) {
		$("#doubleBoard").fadeOut(2000);
		$("#singleBoard").fadeIn(2000);
	} else {
		$("#singleBoard").fadeOut(2000);
		$("#doubleBoard").fadeIn(2000);
	}
}

