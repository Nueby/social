var option = 0;		//选择  0表示个人   1表示交友

//获取ID所对应的元素
function $id(id) {
	return document.getElementById(id);
}

//出场动画
window.onload = function load() {
	$(".board").css("display","none");
	resize();
	$id("single").src = "../img/ourself_2.png";
	$id("make_friend").src = "../img/make_friend.png";
	$("#make_friend").animate({
		marginTop:"500px",
		marginLeft:"100px"
	},2000);
	$("#single").animate({
		marginTop:"300px",
		marginLeft:"80px"
	},2000);
}

//重置大小
function resize() {
	$(".board").css("height",parseInt($(".board").css("width")) * 9 / 10 + "px");
}

//更改选择图标
function changeIcon() {
	if(option == 0) {
		$id("single").src = "../img/ourself_2.png";
		$id("make_friend").src = "../img/make_friend.png";
	} else {
		$id("single").src = "../img/ourself.png";
		$id("make_friend").src = "../img/make_friend2.png";
	}
}

//切换个人
var single = document.getElementById("single");
var main_message = document.getElementById("main_message");
var main_friend = document.getElementById("main_friend");
single.onclick = function changeSingle() {
	option = 0;
	changeIcon();
	main_message.style.display = "block";
	main_friend.style.display = "none";
}

//切换交友
var make_friend = document.getElementById("make_friend");
make_friend.onclick = function changeDouble() {
	option = 1;
	changeIcon();
	main_message.style.display = "none";
	main_friend.style.display = "block";
}

//三个图标点击显示设置框
var set_1 =  document.getElementById("set_1");
var set_2 =  document.getElementById("set_2");
var set_3 =  document.getElementById("set_3");
var dynamic = document.getElementById("dynamic");
var modify_contact = document.getElementById("modify_contact");
var self = document.getElementById("self");
dynamic.onclick = function(){
	set_1.style.display = "block";
	set_2.style.display = "none";
	set_2.style.display = "none";
}
modify_contact.onclick = function(){
	set_2.style.display = "block";
	set_1.style.display = "none";
	set_3.style.display = "none";
}
self.onclick = function(){
	set_3.style.display = "block";
	set_1.style.display = "none";
	set_2.style.display = "none";
}


//设置框点击确定
//Ajax上传数据
var dynamic_submit = document.getElementById("dynamic_submit");
// var modify_submit = document.getElementById("modify_submit");
// var self_submit = document.getElementById("self_submit");
dynamic_submit.onclick = function(){
	
}




//点击头像更改头像
//Ajax传输头像保存将头像显示
var photo = document.getElementById("photo");
var change_photo = document.getElementById("change_photo");
photo.onclick =function(){
	change_photo.style.display ="block";
}


//通过裁剪更新信息（onchange和onselect事件处理程序）
function updateInfo(e) {
    $("#newWidth").val(e.w);
    $("#newHeight").val(e.h);
}


//当选择文件时运行以下程序
function fileSelectHandler() {
	var image_file = document.getElementById("image_file");
    // 获得选择的文件
    var oFile = $("#image_file")[0].files[0];
    //每次选择文件时将所有错误隐藏
    $(".error").hide();
    //检查文件的格式，只有png、jpeg和jpg格式的可以被用来做头像
    var rFilter = /^(image\/jpeg|image\/png)$/i;
    if (! rFilter.test(oFile.type)) {
        $(".error").html("请选择png、jpeg和jpg格式的图片").show();
        return;
    }
    //检查文件大小
    if (oFile.size > 250 * 1024) {
        $(".error").html("您选择的文件太大，请重新选择图片").show();
        return;
    }
    //获得图片预览效果
    var oImage = document.getElementById("preview");
    //HTML5的文件选择器
    var oReader = new FileReader();
	//用FileReader()读取file或者Blob的信息
	oReader.readAsDataURL(oFile);
    oReader.onload = function(e) {
		//再将获得的数据给src就可以查看图片
		console.log(e.target.result);
        oImage.src = e.target.result;
        oImage.onload = function () {
            //使用淡入淡出效果显示step的内容
            $(".step").fadeIn(500);
            //创建变量，来保存图片的大小
            var jcrop_api, boundx, boundy;
            //如果jcrop_api存在，就去除它
            if (typeof jcrop_api != "undefined") 
                jcrop_api.destroy();
            //jcrop的方法
            $("#preview").Jcrop({
				//裁剪的最小区域
                minSize: [32, 32],
				//裁剪的最大区域不能超过图片大小
				maxSize: [this.previewBoxWidth,this.previewBoxHeight],
				//改变选框样式
				addClass:"newClass jcrop-holder",
				//背景过渡效果
                bgFade: true,
				//背景透明度
                bgOpacity: .1,
				//选框时候运用到的函数
                onChange: updateInfo,
                onSelect: updateInfo,
            });
        };
    };
}




//修改昵称
//ajax将昵称保存
var change_name = document.getElementById("change_name");
var name_sure = document.getElementById("name_sure");
change_name.onclick = function(){
	name_sure.style.display = "block";
	name_sure.onclick = function(){
		name_sure.style.display = "none";
	}
}


//可随机生成颜色的方法
var getRandomColor = function(){
	var r = Math.floor(Math.random()*100 + 100);
	var g = Math.floor(Math.random()*100 + 100);
	var b = Math.floor(Math.random()*100 + 100);
	return "rgb(" + r + "," + g + "," + b + ")";
}

//在tag里面生成随机坐标，添加的标签随机放在tag上 
 function getRandomPlace(space){
	var tag = document.getElementById("tag");
	var x = Math.floor(Math.random()*300);
	var y = Math.floor(Math.random()*200);
    space.style.left = x + "px";
	space.style.bottom = y + "px";
	//如果space的位置与之前的标签重合，则重新生成坐标
	if(space.style.bottom == y || space.style.left ==x){
		getRandomPlace(space);
	}//如果space的长度加上随机生成的x大于Tag框，则将x或y坐标减去框的长度
	else if(space.style.left > 350 || space.style.bottom > 150){
		space.style.left = x - space.style.width + "px";
		space.style.bottom = y - space.style.height + "px";
	}
}

//点击tag打开输入框
var title = document.getElementById("title");
var self_tag = document.getElementById("self_tag");
var save_tag = document.getElementById("save_tag");
var delete_tag = document.getElementById("delete_tag");
var tag = document.getElementById("tag");
//确认标签数量，最多只能有五个标签
var tagNum = 0;
//点击Tag标签出显示框和保存按钮
title.onclick = function(){
	if(self_tag.style.display == "block"){
		self_tag.style.display = "none";
		save_tag.style.display = "none";
	}else{
		self_tag.style.display = "block";
		save_tag.style.display = "block";
	}
}
//点击勾时生成内容到下方
//Ajax保存标签内容
save_tag.onclick = function(){
	var tagVal = document.getElementById("self_tag").value;
	var personal_tag = document.getElementById("personal_tag");
	var tag_warning = document.getElementById("tag_warning");
	var newDiv = document.createElement("div");
	newDiv.setAttribute("id","other_tag");
	var close = document.createElement("img");
	close.src = "../img/close.png";
	close.setAttribute("id","delete_tag");
	if(tagVal == ""){
		tag_warning.innerHTML ="*请先输入内容才能生成标签"	;
	}else{
		document.getElementById("tag").removeChild(personal_tag);
		tag.appendChild(newDiv);
		newDiv.innerHTML = tagVal;
		//获取位置
		getRandomPlace(newDiv);
		tag_warning.innerHTML ="";
	}
	if(!personal_tag){
		return false;
	}
	tagVal ="";
	tagNum ++;
	if(tagNum > 5){
		tagVal = "最多只能存在五个标签，请先删除再添加";
		return false;
	}
	console.log(newDiv.bottom);
}
//点击x时删除生成的内容
//Ajax删除标签
delete_tag.onclick = function(){
	var personal_tag = document.getElementById("personal_tag");
	document.getElementById("tag").removeChild(personal_tag);
}