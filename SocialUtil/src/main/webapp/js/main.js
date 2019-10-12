var option = 0; //选择  0表示个人   1表示交友

//兼容浏览器获取非行内样式
function getStyle(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj,null)[attr];
	}
}




//获取ID所对应的元素
function $id(id) {
	return document.getElementById(id);
}

//出场动画
function load() {
	$(".board").css("display", "none");
	resize();
	$id("single").src = "../img/ourself_2.png";
	$id("make_friend").src = "../img/make_friend.png";
	$("#make_friend").animate({
		marginTop: "500px",
		marginLeft: "250px"
	}, 2000);
	$("#single").animate({
		marginTop: "300px",
		marginLeft: "250px"
	}, 2000);
}
load();

//重置大小
function resize() {
	$(".board").css("height", parseInt($(".board").css("width")) * 9 / 10 + "px");
}

//更改选择图标
function changeIcon() {
	if (option == 0) {
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
var set_1 = document.getElementById("set_1");
var set_2 = document.getElementById("set_2");
var set_3 = document.getElementById("set_3");
var dynamic = document.getElementById("dynamic");
var modify_contact = document.getElementById("modify_contact");
var self = document.getElementById("self");
dynamic.onclick = function() {
	set_1.style.display = "block";
	set_2.style.display = "none";
	set_3.style.display = "none";
}
modify_contact.onclick = function() {
	set_2.style.display = "block";
	set_1.style.display = "none";
	set_3.style.display = "none";
}
self.onclick = function() {
	set_3.style.display = "block";
	set_1.style.display = "none";
	set_2.style.display = "none";
}


//设置框点击确定
//Ajax上传数据
var dynamic_submit = document.getElementById("dynamic_submit");
var email_submit = document.getElementById("email_submit");
var self_submit = document.getElementById("self_submit");
dynamic_submit.onclick = function() {
	set_1.style.display = "none";
}
email_submit.onclick = function() {
	set_2.style.display = "none";
}
self_submit.onclick = function() {
	set_3.style.display = "none";
}


//第二个设置中获取验证码
var time_get = document.getElementById("time_get");
var countTime = 60;//时间为60秒
var interval;
var click = false;//验证是否点击
function setTime() {
	if(countTime > 0){
		countTime--;
		time_get.innerHTML = countTime + "秒后重新发送";
	}else if(countTime == 0){
		countTime = 60;
		time_get.innerHTML = "获取验证码";
		clearInterval(interval);
		click = false;
	}
}

//获取验证码后改变字体
time_get.onclick = function() {
	if(!click) {
		interval = setInterval("setTime()", 1000);
		click = true;
	}
}

//点击获取发送验证码到邮箱
document.getElementById("time_get").onclick = function() {
	var new_email = document.getElementById("new_email").value;
	var json = {"behaviour":"getMsg","new_email":new_email};
	$.ajax({
		type:"GET",
		url:"/SocialUtil/SendEmailController.do",
		data:{"json":JSON.stringify(json)},
		typeData:"json",
		success:function(data) {
			alert(data.status);
		},
		error:function(err) {
			alert(err.status);
		}
	})
}


//检验验证码和发送的是否一致
document.getElementById("email_submit").onclick = function() {
	var input = document.getElementById("get_code_email").value;
	var json = {"behaviour":"check","input":parseInt(input)};
	$.ajax({
		type:"POST",
		url:"/SocialUtil/SendEmailController.do",
		data:JSON.stringify(json),
		typeData:"json",
		success:function(data) {
			alert(data.status);
		},
		error:function(err) {
			alert(err.status);
		}
	})
}

//检验邮箱的格式是否正确
var new_email = document.getElementById("new_email");
var email_warning = document.getElementById("email_warning");
new_email.onblur = function(){
	var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	if(new_email.value == ""){
		email_warning.innerHTML = "*邮箱不能为空";
	}else if(! reg.test(new_email.value)){
		email_warning.innerHTML = "*请输入正确的邮箱地址";
	}else{
		email_warning.innerHTML = "";
	}
}

//输入旧密码验证旧密码是否填写正确,旧密码id = old_password
//检验两次密码输入是否一致
var input_warning = document.getElementById("input_warning");
document.getElementById("confirm_password").onblur = function(){
	if(document.getElementById("new_password").value != document.getElementById("confirm_password").value){
		input_warning.innerHTML = "*前后两次密码不一致，请重写输入";
		document.getElementById("confirm_password").value = "";
	}else if(document.getElementById("new_password").value == "" || document.getElementById("confirm_password").value ==""){
		input_warning.innerHTML = "*你还没输入或确认密码";
	}else{
		input_warning.innerHTML = "";
	}
}


//个人信息框的设置
//Ajax保存数据
$(function() {
	$("#school").blur(function() {
		//获取用户名
		var school = $(this).val();
		//进行ajax的处理
		var span = $("#show_school");
		$.post("findServlet", {
			school: school
		}, function(data) {
			if (data.schoolExsit) {
				span.css("color", "green");
				span.html(data.msg);
			} else {
				span.css("color", "red");
				span.html(data.msg);
			}
		}, "json")
	});
});

//个人信息框的填写设置
$(function() {
	$.ms_DatePicker({
		YearSelector: ".years",
		MonthSelector: ".months",
		DaySelector: ".days"
	});
});
(function($) {
	$.extend({
		ms_DatePicker: function(options) {
			var defaults = {
				YearSelector: ".years",
				MonthSelector: ".months",
				DaySelector: ".days",
				FirstText: "--",
				FirstValue: 0
			};
			var opts = $.extend({}, defaults, options);
			var $YearSelector = $(opts.YearSelector);
			var $MonthSelector = $(opts.MonthSelector);
			var $DaySelector = $(opts.DaySelector);
			var FirstText = opts.FirstText;
			var FirstValue = opts.FirstValue;

			// 初始化
			var str = "<option value=\"" + FirstValue + "\">" + FirstText + "</option>";
			$YearSelector.html(str);
			$MonthSelector.html(str);
			$DaySelector.html(str);

			// 年份列表
			var yearNow = new Date().getFullYear();
			var yearSel = $YearSelector.attr("rel");
			for (var i = yearNow; i >= 1900; i--) {
				var sed = yearSel == i ? "selected" : "";
				var yearStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
				$YearSelector.append(yearStr);
			}

			// 月份列表
			var monthSel = $MonthSelector.attr("rel");
			for (var i = 1; i <= 12; i++) {
				var sed = monthSel == i ? "selected" : "";
				var monthStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
				$MonthSelector.append(monthStr);
			}

			// 日列表(仅当选择了年月)
			function BuildDay() {
				if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) {
					// 未选择年份或者月份
					$DaySelector.html(str);
				} else {
					$DaySelector.html(str);
					var year = parseInt($YearSelector.val());
					var month = parseInt($MonthSelector.val());
					var dayCount = 0;
					switch (month) {
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							dayCount = 31;
							break;
						case 4:
						case 6:
						case 9:
						case 11:
							dayCount = 30;
							break;
						case 2:
							dayCount = 28;
							if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
								dayCount = 29;
							}
							break;
						default:
							break;
					}

					var daySel = $DaySelector.attr("rel");
					for (var i = 1; i <= dayCount; i++) {
						var sed = daySel == i ? "selected" : "";
						var dayStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
						$DaySelector.append(dayStr);
					}
				}
			}
			$MonthSelector.change(function() {
				BuildDay();
			});
			$YearSelector.change(function() {
				BuildDay();
			});
			if ($DaySelector.attr("rel") != "") {
				BuildDay();
			}
		}
	});
})(jQuery);




//点击头像更改头像
//Ajax传输头像保存将头像显示在id = photo里面
var photo = document.getElementById("photo");
var change_photo = document.getElementById("change_photo");
photo.onclick = function() {
	change_photo.style.display = "block";
}


//通过裁剪更新信息（onchange和onselect事件处理程序）
function updateInfo(e) {
	$("#newWidth").val(e.w);
	$("#newHeight").val(e.h);
}


//当点击头像时选择头像
document.getElementById("image_file").onchange = function() {
	// 获得选择的文件
	var oFile = $("#image_file")[0].files[0];
	//每次选择文件时将所有错误隐藏
	$(".error").hide();
	//检查文件的格式，只有png、jpeg和jpg格式的可以被用来做头像
	var rFilter = /^(image\/jpeg|image\/png|image\/jpg)$/i;
	if (!rFilter.test(oFile.type)) {
		$(".error").html("请选择png、jpeg和jpg格式的图片").show();
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
		oImage.src = e.target.result;
		oImage.onload = function() {
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
				maxSize: [this.previewBoxWidth, this.previewBoxHeight],
				//改变选框样式
				addClass: "newClass jcrop-holder",
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


//获取图片的url地址
 function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {   // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}


//发布个人圈的预览图片
//ajax将内容传送并显示在id = show_dynamic里
$("#dynamic_img").change(function() {
	$("#show").attr("src", URL.createObjectURL($(this)[0].files[0]));
});

document.getElementById("dynamic_img").onclick = function() {
	document.getElementById("add").style.marginLeft = 150 + "px";
}



//可随机生成颜色的方法
var getRandomColor = function() {
	var r = Math.floor(Math.random() * 100 + 100);
	var g = Math.floor(Math.random() * 100 + 100);
	var b = Math.floor(Math.random() * 100 + 100);
	return "rgb(" + r + "," + g + "," + b + ")";
}


//点击tag打开输入框
var self_tag = document.getElementById("self_tag");
var delete_tag = document.getElementById("delete_tag");
var tag = document.getElementById("tag");
var chooseTag = document.getElementById("choose_tag");
var tagWarning = document.getElementById("tag_warning");
//点击Tag标签出显示框和保存按钮
document.getElementById("title").onclick = function() {
	if (self_tag.style.display == "block") {
		self_tag.style.display = "none";
		save_tag.style.display = "none";
	} else {
		self_tag.style.display = "block";
		save_tag.style.display = "block";
	}
	//确认标签数量,标签数量最多五个
	let tagNum = 0;
	//将标签放在预选栏
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	for(var i = 0;i < tagLi.length;i++){
		tagLi[i].onclick = function(){
			var newLi = document.createElement("div");
			newLi.setAttribute("id","choose_class");
			var liVal = document.createTextNode(this.innerHTML);
			newLi.appendChild(liVal);
			chooseTag.appendChild(newLi);
			tagNum ++;
			if(tagNum >= 0 && tagNum < 5){
				//点击去除选定的标签
				var chooseLi = chooseTag.getElementsByTagName("div");
				for (let j = 0; j < chooseLi.length; j++) {
					chooseLi[j].onclick = function() {
						chooseTag.removeChild(chooseLi[j]);
						tagNum --;
					};
				}
				tagWarning.innerHTML = "";
			}else if(tagNum > 5){
				chooseTag.removeChild(newLi);
				tagWarning.innerHTML = "*最对只能放五个标签，请先删除在添加";
			}
			console.log(tagNum);
		};
	}
}


//点击保存将标签放在tag中
//Ajax保存确定的标签作为筛选条件
save_tag.onclick = function(){
	var chooseLi = chooseTag.getElementsByTagName("div");
	var tagDiv = document.createElement("div");
	tag.appendChild(tagDiv);
	for(var i = 0;i < chooseLi.length; i++){
		var divVal = document.createTextNode(chooseLi[i].innerHTML);
		tagDiv[i].setAttribute("id","other_tag"+"i+1");
		tagDiv[i].appendChild(divVal);
	}
}



//交友页面的动画滚动效果



//点击显示聊天界面，筛选蓝和个人圈以及关闭

document.getElementById("chat").onclick = function(){
	var chat_about = document.getElementById("chat_about");
	chat_about.style.display = "block";
	//点开聊天框后的倒计时，当时间停止到30秒时提醒，为0时关闭聊天界面
	var interval = setInterval("timeLow()",1000);
}
//时间递减函数
//退出之后不只在页面退出，还要让f12里的源码也没有
// var time = 5;
// function timeLow(){
// 	var timeChat = document.getElementById("time_chat");
// 	if(time > 0){
// 		time--;
// 		timeChat.innerHTML = time;
// 	}else if(time == 0){
// 		clearInterval(interval);
// 		chat_about.style.display = "none";
// 	}
// 	var chatWarning = document.getElementById("chat_warning");
// 	if(time <= 30){
// 		chatWarning.style.display = "block";
// 		chatWarning.innerHTML = "聊天时间快结束了，还不快向他要其他的聊天方式吗，聊的开心就快问吧！！";
// 		chatWarning.style.color = "red";
// 		timeChat.style.color = "red";
// 	}
// 	if(time <= 25){
// 		chatWarning.style.display = "none";
// 	}
// }
//点击关闭按钮退出聊天框，并在对面的id = chat_warnig中提示对方退出
//ajax的内容

document.getElementById("icon_close").onclick = function(){
	chat_about.style.display = "none";
}


//点击加时按钮，在对方的页面弹出confirm框，点击确定加时，点击取消不加时
document.getElementById("icon_time").onclick = function(){
	chat_about.style.display = "none";
}


// document.getElementById("more").onclick = function(){
	
// }
document.getElementById("choose").onclick = function(){
	var choose_friend = document.getElementById("choose_friend");
	choose_friend.style.display = "block";
}

//聊天界面，点击可以发送信息
var sendMsg = document.getElementById("sendMsg");
var txt = document.getElementById("txt");
var talk_contact = document.getElementById("talk_contact");
var contact = talk_contact.getElementsByTagName("p");

sendMsg.onclick = function(){
	if(txt.value == ""){
		txt.value = "不能发送空内容";
	}else{
		var newTxt = document.createElement("p");
		newTxt.style.backgroundColor = "yellowgreen";
		newTxt.style.clear = "both";
		newTxt.style.float = "right";
		newTxt.style.marginRight = "5px";
		newTxt.innerHTML = txt.value;
		talk_contact.appendChild(newTxt);
		txt.value = "";
		newTxt.scrollIntoView();
	}
}
