var option = 0; //选择  0表示个人  1表示交友
var account = $.cookie("socialUtilAccount"); //账号

var school = ""; //学校
var college = ""; //学院
var profession = ""; //专业
var grade; //入学年份
var email = ""; //邮箱
var sex = ""; //性别
var age; //年龄

var username = ""; //昵称
var head = ""; //头像
var signature = ""; //修改签名
var birthday = ""; //生日
var tags = ""; //标签
var circle_info = ""; //个人圈信息
var circle_img = ""; //个人圈图片

// //未登录时返回登录页面
// if(account == "" || account == null) {
// 	window.location.href = "/SocialUtil/matching.html";
// }


//让所有点击显示的图层都隐藏
function divNone(){
	$("#set_1").hide();
	$("#set_2").hide();
	$("#set_3").hide();
	$("#change_photo").hide();
	$("#chat_about").hide();
	$("#choose_friend").hide();
	$("#self_tag").hide();
	$("#save_tag").hide();
	$("#cover_scroll1").hide();
	$("#cover_scroll2").hide();
	$("#cover_scroll3").hide();
}

//获取学校信息
function getSchool() {
	$.ajax({
		type: "GET",
		url: "/SocialUtil/ControllerSchool.do",
		data: {
			"account": account,
		},
		dataType: "json",
		success: function(data) {
			if (data.school != null) school = data.school;
			if (data.college != null) college = data.college;
			if (data.profession != null) profession = data.profession;
			grade = data.grade;
			if (data.sex == "m") sex = "男";
			else sex = "女";
			age = data.age;
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}
getSchool();

//获取页信息
function getPage() {
	$.ajax({
		type: "GET",
		url: "/SocialUtil/ControllerPageInfo.do",
		data: {
			"account": account,
		},
		dataType: "json",
		success: function(data) {
			if (data.username != null) username = data.username;
			if (data.head != null) head = data.head;
			if (data.signature != null) signature = data.signature;
			if (data.birthday != null) birthday = data.birthday;
			if (data.tags != null) tags = data.tags;
			if (data.circleInfo != null) circle_info = data.circleInfo;
			if (data.circleImg != null) circle_img = data.circleImg;
			changeHead();
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}
getPage();

//兼容浏览器获取非行内样式
function getStyle(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
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
$id("single").onclick = function changeSingle() {
	option = 0;
	changeIcon();
	$id("main_message").style.display = "block";
	$id("main_friend").style.display = "none";
	divNone();
}

//切换交友
$id("make_friend").onclick = function changeDouble() {
	option = 1;
	changeIcon();
	$id("main_message").style.display = "none";
	$id("main_friend").style.display = "block";
	divNone();
}

//三个图标点击显示设置框
document.getElementById("dynamic").onclick = function() {
	$("#set_1").show();
	$("#set_2").hide();
	$("#set_3").hide();
}
document.getElementById("modify_contact").onclick = function() {
	$("#set_2").show();
	$("#set_1").hide();
	$("#set_3").hide();
}
document.getElementById("self").onclick = function() {
	$("#set_3").show();
	$("#set_1").hide();
	$("#set_2").hide();
}

//显示数据
$("#name").html(username);
$("#ID").html("ID" + account);
$("#school_name").append(school);
$("#college_name").append(college);
$("#major_name").append(profession);
$("#personal").html(signature);

//设置框点击确定
$id("dynamic_submit").onclick = function() {
	$id("set_1").style.display = "none";
	$("#show1").attr("src", "");
	$("#show2").attr("src", "");
	$("#show3").attr("src", "");
	$("#show4").attr("src", "");
	
	$.ajax({
		type: "POST",
		url: "/SocialUtil/ControllerPageInfo.do",
		data: JSON.stringify({
			"behaviour": "change",
			"username": username,
			"head": head,
			"signature": signature,
			"birthday": birthday,
			"tags": tags,
			"circleInfo": "",
			"circleImg": ""
		}),
		dataType: "json",
		success: function(data) {

		},
		error: function(err) {
			//alert(err.status);
		}
	})
}
$id("email_submit").onclick = function() {
	$id("set_2").style.display = "none";
	if ($id("new_email").value == "") return false;
	$.ajax({
		type: "GET",
		url: "/SocialUtil/SendEmailController.do",
		data: {
			"input": $id("get_code_email").value,
			"behaviour": "confirm",
			"emailNum": $id("new_email").value
		},
		dataType: "json",
		success: function(data) {
			if (data.msg == true) {
				changePassword();
				$id("set_2").style.display = "none";
			} else {
				alert("验证码错误");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}

function changePassword() {
	$.ajax({
		type: "POST",
		url: "/SocialUtil/ControllerUser.do",
		data: JSON.stringify({
			"behaviour": "changePassword",
			"account": account,
			"wpassword": "login_password",
			"opassword": $id("old_password").value,
			"password": $id("new_password").value,
			"email": $id("new_email").value
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == true) {
				alert("更改成功");
			} else {
				alert("更改失败");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}
$id("self_submit").onclick = function() {
	$id("set_3").style.display = "none";
	$.ajax({
		type: "POST",
		url: "/SocialUtil/ControllerSchool.do",
		data: JSON.stringify({
			"behaviour": "change",
			"school": $id("school").value,
			"college": $id("college").value,
			"profession": $id("major").value,
			"grade": grade,
			"email": email,
			"sex": $id("sex").value,
			"age": age
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == true) {
				getShool();
				changeUsername();
			} else {
				alert("修改失败");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}

function changeUsername() {
	$.ajax({
		type: "POST",
		url: "/SocialUtil/ControllerPageInfo.do",
		data: JSON.stringify({
			"behaviour": "change",
			"username": $id("set_name").value,
			"head": head,
			"signature": signature,
			"birthday": $id("select").value,
			"tags": tags,
			"circleInfo": circle_info,
			"circleImg": circle_img
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == true) {
				getPage();
				alert("修改成功");
			} else {
				alert("修改失败");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}

//发布于个人圈的预览图片

$("#dynamic_img1").change(function() {
	$("#dynamic_img1").hide();
	document.getElementById("add1").style.opacity = "0";
	$("#show1").attr("src", URL.createObjectURL($(this)[0].files[0]));
	document.getElementById("show1").style.opacity = "1";
	document.getElementById("add2").style.opacity = "1";
});
$("#dynamic_img2").change(function() {
	$("#dynamic_img2").hide();
	document.getElementById("add2").style.opacity = "0";
	$("#show2").attr("src", URL.createObjectURL($(this)[0].files[0]));
	document.getElementById("show2").style.opacity = "1";
	document.getElementById("add3").style.opacity = "1";
});
$("#dynamic_img3").change(function() {
	$("#dynamic_img3").hide();
	document.getElementById("add3").style.opacity = "0";
	$("#show3").attr("src", URL.createObjectURL($(this)[0].files[0]));
	document.getElementById("show3").style.opacity = "1";
	document.getElementById("add4").style.opacity = "1";
});
$("#dynamic_img4").change(function() {
	$("#dynamic_img4").hide();
	document.getElementById("add4").style.opacity = "0";
	$("#show4").attr("src", URL.createObjectURL($(this)[0].files[0]));
	document.getElementById("show4").style.opacity = "1";
});

//第二个设置中获取验证码
function setTime() {
	var time_get = document.getElementById("time_get");
	var countTime = 60; //时间为60秒
	var interval;
	var click = false; //验证是否点击
	if (countTime > 0) {
		countTime--;
		time_get.innerHTML = countTime + "秒后重新发送";
	} else if (countTime == 0) {
		countTime = 60;
		time_get.innerHTML = "获取验证码";
		clearInterval(interval);
		click = false;
	}
}

$id("time_get").onclick = function() {
	//获取验证码后改变字体
	if (!click) {
		interval = setInterval("setTime()", 1000);
		click = true;
	}
	//点击获取发送验证码到邮箱
	var new_email = document.getElementById("new_email").value;
	var json = {
		"behaviour": "getMsg",
		"new_email": new_email
	};
	$.ajax({
		type: "GET",
		url: "/SocialUtil/SendEmailController.do",
		data: json,
		typeData: "json",
		success: function(data) {},
		error: function(err) {
			//alert(err.status);
		}
	})
}

//检验邮箱的格式是否正确
function emailConfirm() {
	var new_email = document.getElementById("new_email");
	var email_warning = document.getElementById("email_warning");
	new_email.onblur = function() {
		var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if (new_email.value == "") {
			email_warning.innerHTML = "*邮箱不能为空";
		} else if (!reg.test(new_email.value)) {
			email_warning.innerHTML = "*请输入正确的邮箱地址";
		} else {
			email_warning.innerHTML = "";
		}
	}
}
emailConfirm();

//检验两次密码输入是否一致
document.getElementById("confirm_password").onblur = function() {
	if (document.getElementById("new_password").value != document.getElementById("confirm_password").value) {
		input_warning.innerHTML = "*前后两次密码不一致，请重写输入";
		document.getElementById("confirm_password").value = "";
	} else if (document.getElementById("new_password").value == "" || document.getElementById("confirm_password").value ==
		"") {
		input_warning.innerHTML = "*你还没输入或确认密码";
	} else {
		input_warning.innerHTML = "";
	}
}

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
$id("photo").onclick = function() {
	$id("change_photo").style.display = "block";
	$("#set_1").hide();
	$("#set_2").hide();
	$("#set_3").hide();
}
$id("photo_submit").onclick = function(){
	$id("change_photo").style.display = "none";
	$("#preview").attr("src", "");
}
$("#avatar").change(function () {
	$("#photo_warning").html("");
	//拿到文件数据
	var choose_file = $(this)[0].files[0];
	//截取图片名称小数点后的字符串
	var ftype=choose_file.name.substring(choose_file.name.lastIndexOf(".")+1);
	//校验格式是否是图片类型
	if(ftype=="jpg" || ftype=="png" || ftype=="jpeg" || ftype == "JPG"){
		$("#preview").attr("src", URL.createObjectURL($(this)[0].files[0]));
		$("#head_show").attr("src", URL.createObjectURL($(this)[0].files[0]));
		//限制大小，照片大小不能超过1M
		var size = choose_file.size / 1024 / 1024;
		if (size > 1) {
			$("#photo_warning").html("*图片太大了，请重新选择");
			return false;
		}
	}else{
		$("#photo_warning").html("*图片格式好像不对，请重新选择");
		return false;
	}
});



//获取图片的url地址
function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

//可随机生成颜色的方法
var getRandomColor = function() {
	var r = Math.floor(Math.random() * 100 + 100);
	var g = Math.floor(Math.random() * 100 + 100);
	var b = Math.floor(Math.random() * 100 + 100);
	return "rgb(" + r + "," + g + "," + b + ")";
}

//点击tag打开输入框
//点击Tag标签出显示框和保存按钮
document.getElementById("title").onclick = function() {
	var self_tag = document.getElementById("self_tag");
	var delete_tag = document.getElementById("delete_tag");
	var tag = document.getElementById("tag");
	var chooseTag = document.getElementById("choose_tag");
	var tagWarning = document.getElementById("tag_warning");
	//确认标签数量,标签数量最多五个
	var tagNum = 0;
	if (getStyle(self_tag, "display") == "block") {
		self_tag.style.display = "none";
		save_tag.style.display = "none";
	} else {
		self_tag.style.display = "block";
		save_tag.style.display = "block";
	}
	//确认标签预览数量,标签数量最多五个
	let tagNum2 = -1;
	//将标签放在预选栏
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	for (var i = 0; i < tagLi.length; i++) {
		tagLi[i].onclick = function() {
			tagNum2++;
			this.style.display="none";
			if (tagNum2 >= 0 && tagNum2 < 5) {
				var newLi = document.createElement("div");
				newLi.setAttribute("id", "choose_class");
				var liVal = document.createTextNode(this.innerHTML);
				newLi.appendChild(liVal);
				chooseTag.appendChild(newLi);
				//点击去除选定的标签
				var chooseLi = chooseTag.getElementsByTagName("div");
				for (let j = 0; j <chooseLi.length; j++) {	
					chooseLi[j].onclick = function() {						
						for(var n=0;n<tagLi.length;n++){
							if(tagLi[n].innerHTML==chooseLi[j].innerHTML)
							{
								tagLi[n].style.display="block";
							}								
						}
						chooseTag.removeChild(chooseLi[j]);
						tagNum2--;
					};
					
				}
				tagWarning.innerHTML = "";
			} else if (tagNum2 >= 5) {
				tagWarning.innerHTML = "*最对只能放五个标签，请先删除在添加";
				this.style.display="block";
			}
		};
	}
	
	
}

//点击保存将标签放在tag中
//Ajax保存确定的标签作为筛选条件
//tag_show中的标签超过五个的时候把第六个生成的将第一个给替换
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++有bug解决
var tagnum=-1;
var tagtime=0;
$id("save_tag").onclick = function() {
	$("#personal_tag").remove();
	$id("save_tag").style.display = "none";
	$("#self_tag").hide();
	var ntags="";
	var chooseLi = $id("choose_tag").getElementsByTagName("div");
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	for(var i = 0;i < chooseLi.length; i++){	
		tagnum=tagnum+1;
		if(tagnum>=5){
			if(tagnum%5==0){
				tagtime=tagtime+1;
				
				for(var n=0;n<tagLi.length;n++){
					if(tagLi[n].innerHTML==$id("other_tag"+(tagnum-(5*tagtime))).innerHTML)
					{
						tagLi[n].style.display="block";
					}								
				}
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}else{
				for(var n=0;n<tagLi.length;n++){
					if(tagLi[n].innerHTML==$id("other_tag"+(tagnum-(5*tagtime))).innerHTML)
					{
						tagLi[n].style.display="block";
					}								
				}
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}
		}else{
			var tagDiv = document.createElement("div");
			var tagShow = document.getElementById("tag_show");
			var divVal = document.createTextNode(chooseLi[i].innerHTML);
			tagDiv.appendChild(divVal);
			tagShow.appendChild(tagDiv);
			var newTag = tagShow.getElementsByTagName("div");
			newTag[tagnum].setAttribute("id","other_tag" + tagnum);
		}
		ntags = ntags + chooseLi[i];
	}
	var chooseLi_length=chooseLi.length-1;
	for(var i =chooseLi_length; i>=0; i--){
		chooseLi[i].remove();
	}
	$.ajax({
		type: "post",
		url: "/SocialUtil/ControllerPageInfo.do",
		data: JSON.stringify({
			"behaviour": "change",
			"username": username,
			"head": head,
			"birthday": birthday,
			"tags": ntags,
			"circleInfo": circle_info,
			"circleImg": circle_img
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == false) {
				alert("更改失败");
			} else {
				getPage();
				alert("更改成功");
			}
		}
	})
}

//删除标签,彻底删除
$id("delete_tag").onclick = function() {
	$("#personal_tag").remove();
}


//交友页面的动画滚动效果
//点击左按钮
document.getElementById("prev").onclick = function() {
	var show_message = document.getElementById("show_message");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(show_message, "left") == "15px") {
		$("#show_message").animate({
			left: "-342px"
		});
		$("#show_message").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		$("#another_message1").css({
			"left": "372px"
		});
		$("#another_message2").animate({
			left: "-15px"
		});
		$("#another_message2").animate({
			left: "15px"
		});
		another_message2.style.right = "";
		$("#another_message2").css({
			"left": "15px",
			"filter": "none"
		});
	} else if (getStyle(another_message2, "left") == "15px") {
		$("#another_message1").animate({
			left: "-15px"
		});
		$("#another_message1").animate({
			left: "15px"
		});
		$("#another_message1").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message2").animate({
			left: "-342px"
		});
		$("#another_message2").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		show_message.style.left = "";
		$("#show_message").css({
			"left": "372px"
		});
	} else if (getStyle(another_message1, "left") == "15px") {
		$("#show_message").animate({
			left: "-15px"
		});
		$("#show_message").animate({
			left: "15px"
		});
		$("#show_message").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message1").animate({
			left: "-342px"
		});
		$("#another_message1").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		another_message2.style.left = "";
		$("#another_message2").css({
			"right": "-342px"
		});
	}
	divNone();
}
//点击右按钮
document.getElementById("next").onclick = function() {
	var show_message = document.getElementById("show_message");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(show_message, "left") == "15px") {
		$("#show_message").animate({
			left: "372px"
		});
		$("#show_message").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#another_message1").animate({
			left: "30px"
		});
		$("#another_message1").animate({
			left: "15px"
		});
		$("#another_message1").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message2").css({
			"left": "-342px"
		});
	} else if (getStyle(another_message1, "left") == "15px") {
		$("#another_message2").animate({
			left: "30px"
		});
		$("#another_message2").animate({
			left: "15px"
		});
		$("#another_message2").css({
			"left": "15px",
			"filter": "none"
		});
		another_message1.style.left = "";
		$("#another_message1").animate({
			left: "372px"
		});
		$("#another_message1").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#show_message").css({
			"left": "-342px"
		});
	} else if (getStyle(another_message2, "left") == "15px") {
		$("#another_message1").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		$("#another_message2").animate({
			left: "372px"
		});
		$("#another_message2").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#show_message").animate({
			left: "30px"
		});
		$("#show_message").animate({
			left: "15px"
		});
		$("#show_message").css({
			"left": "15px",
			"filter": "none"
		});
	}
	divNone();
}

//对筛选的对象进行存储
var school_condition = "";
var college_condition = "";
var sex_condition = "";
var tag_condition = "";

//筛选框
document.getElementById("icon_choose").onclick = function() {
	var choose_friend = document.getElementById("choose_friend");
	if (choose_friend.style.display == "block") {
		choose_friend.style.display = "none";
	} else {
		choose_friend.style.display = "block";
	}
	//只要选完了点击筛选就用Ajax刷新main_show的内容
	document.getElementById("choose_submit").onclick = function() {
		choose_friend.style.display = "none";
		//筛选数据的传输
		var friend_name = $("#friend_name");
		var friend_school = $("#friend_school");
		var friend_college = $("#friend_college");
		var friend_personal = $("#friend_personal");
		$.post("", {
			sex: sex_condition,
			school: school_condition,
			college: college_condition,
			tags: tag_condition
		}, function(data) {
			friend_name.html(data.name);
			friend_school.html(data.school);
			friend_college.html(data.profession);
			friend_personal.html(data.signature);
		});
	}

	//性别
	var man = document.getElementById("man");
	var woman = document.getElementById("woman");
	man.onclick = function() {
		man.style.background = "lightblue";
		woman.style.background = "white";
	}
	woman.onclick = function() {
		man.style.background = "white";
		woman.style.background = "pink";
	}
	document.getElementById("more_school").onclick = function() {
		document.getElementById("more_school").style.display = "none";
		document.getElementById("school_choose").style.height = "80px";
	}
	document.getElementById("more_college").onclick = function() {
		document.getElementById("more_college").style.display = "none";
		document.getElementById("college_choose").style.height = "210px";
	}
	document.getElementById("more_other").onclick = function() {
		document.getElementById("more_other").style.display = "none";
		document.getElementById("other_choose").style.height = "310px";
	}
	if (man.style.background == "lightblue") {
		sex_condition = man.val;
	} else {
		sex_condition = woman.val;
	}
}

function selection() {
	//选择学校部分
	var school_choose = document.getElementById("school_choose");
	var schoolLi = school_choose.getElementsByTagName("li");
	//学校只能选一个
	var schoolNum = 0;
	for (let i = 0; i < schoolLi.length; i++) {
		schoolLi[i].onclick = function() {
			for (let j = 0; j < schoolLi.length; j++) {
				schoolLi[j].style.background = "#FFF";
			}
			var newSchoolLi = new Array();
			newSchoolLi[0] = schoolLi[0].innerHTML;
			schoolLi[0].innerHTML = schoolLi[i].innerHTML;
			schoolLi[i].innerHTML = newSchoolLi[0];
			schoolLi[0].style.background = "greenyellow";
			school_choose.style.height = "35px";
			schoolNum++;
			if (schoolNum >= 1) {
				school_choose.style.height = "35px";
				document.getElementById("more_school").style.display = "block";
			}
		}
	}

	//对选择的学校进行存储
	for (let i = 0; i < schoolLi.length; i++) {
		if (schoolLi[i].style.background == "greenyellow") {
			school_condition = schoolLi[i].val;
		}
	}


	//学院选择部分
	var college_choose = document.getElementById("college_choose");
	var collegeLi = college_choose.getElementsByTagName("li");
	//学院只能选一个
	var collegeNum = 0;
	for (let i = 0; i < collegeLi.length; i++) {
		collegeLi[i].onclick = function() {
			for (let j = 0; j < collegeLi.length; j++) {
				collegeLi[j].style.background = "#FFF";
			}
			var newCollegeLi = new Array;
			newCollegeLi[0] = collegeLi[0].innerHTML;
			collegeLi[0].innerHTML = collegeLi[i].innerHTML;
			collegeLi[i].innerHTML = newCollegeLi[0];
			collegeLi[0].style.background = "#df64c9";
			college_choose.style.height = "35px";
			collegeNum++;
			if (collegeNum >= 1) {
				college_choose.style.height = "35px";
				document.getElementById("more_college").style.display = "block";
			}
		}
	}

	//对选择的学院进行存储
	for (let i = 0; i < collegeLi.length; i++) {
		if (collegeLi[i].style.background == "#df64c9") {
			college_condition = schoolLi[i].val;
		}
	}

	//标签选择部分
	var other_choose = document.getElementById("other_choose");
	var otherLi = other_choose.getElementsByTagName("li");
	//标签只能选一个
	var tagNum = 0;
	for (let i = 0; i < otherLi.length; i++) {
		otherLi[i].onclick = function() {
			for (let j = 0; j < otherLi.length; j++) {
				otherLi[j].style.background = "#FFF";
			}
			var newTagLi = new Array();
			newTagLi[0] = otherLi[0].innerHTML;
			otherLi[0].innerHTML = otherLi[i].innerHTML;
			otherLi[i].innerHTML = newTagLi[0];
			otherLi[0].style.background = "#ead3ac";
			other_choose.style.height = "35px";
			tagNum++;
			if (tagNum >= 1) {
				other_choose.style.height = "35px";
				document.getElementById("more_other").style.display = "block";
			}
		}
	}

	//对选择的标签进行存储
	for (let i = 0; i < otherLi.length; i++) {
		if (otherLi[i].style.background == "#ead3ac") {
			tag_condition = otherLi[i].val;
		}
	}
}
selection();


//点击显示聊天界面，筛选框和个人圈以及关闭
var interval;
var chat = document.querySelectorAll("#chat");
for (var i = 0; i < chat.length; i++) {
	chat[i].onclick = function() {
		if (getStyle(show_message, "left") == "15px") {
			var chat_about = document.getElementById("chat_about");
			chat_about.style.display = "block";
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval("timeLow()", 1000);
		} else {
			return false;
		}
	}
}

//时间递减函数
//点开聊天框后的倒计时，当时间停止到30秒时提醒，为0时关闭聊天界面
var time = 300;
function timeLow() {
	var timeChat = document.getElementById("time_chat");
	if (time > 0) {
		time--;
		timeChat.innerHTML = time;
	} else if (time == 0) {
		clearInterval(interval);
		chat_about.style.display = "none";
	}
	var chatWarning = document.getElementById("chat_warning");
	if (time <= 30) {
		chatWarning.style.display = "block";
		chatWarning.innerHTML = "聊天时间快结束了，还不快向他要其他的聊天方式吗，聊的开心就快问吧！！";
		chatWarning.style.color = "red";
		timeChat.style.color = "red";
	}
	if (time <= 25) {
		chatWarning.style.display = "none";
	}
}

//点击关闭按钮退出聊天框，并在对面的id = chat_warnig中提示对方退出
//ajax的内容,只要聊天框关闭，刷新main_show的内容

document.getElementById("icon_close").onclick = function() {
	chat_about.style.display = "none";
	clearInterval(interval);
}


//点击加时按钮，在对方的页面弹出confirm框，点击确定加时，点击取消不加时
document.getElementById("icon_time").onclick = function() {

}

//个人圈的查看
//ajax将发布的个人圈资料上传
function lookMyself() {
	var more = document.querySelectorAll("#more");
	var cover_scroll1 = document.getElementById("cover_scroll1");
	var cover_scroll2 = document.getElementById("cover_scroll2");
	var cover_scroll3 = document.getElementById("cover_scroll3");
	var show_message = document.getElementById("show_message");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	more[0].onclick = function() {
		if (getStyle(show_message, "left") != "15px") {
			return false;
		}
		if (getStyle(cover_scroll1, "display") == "none") {
			$("#cover_scroll1").show();
		} else {
			$("#cover_scroll1").hide();
		}
	}
	more[1].onclick = function() {
		if (getStyle(another_message1, "left") != "15px") {
			return false;
		}
		if (getStyle(cover_scroll2, "display") == "none") {
			$("#cover_scroll2").show();
		} else {
			$("#cover_scroll2").hide();
		}
	}
	more[2].onclick = function() {
		if (getStyle(another_message2, "left") != "15px") {
			return false;
		}
		if (getStyle(cover_scroll3, "display") == "none") {
			$("#cover_scroll3").show();
		} else {
			$("#cover_scroll3").hide();
		}
	}
}
lookMyself();

//聊天界面，点击可以发送信息
function sendNews() {
	var sendMsg = document.getElementById("sendMsg");
	var txt = document.getElementById("txt");
	var talk_contact = document.getElementById("talk_contact");
	var contact = talk_contact.getElementsByTagName("p");

	sendMsg.onclick = function() {
		if (txt.value == "") {
			txt.value = "不能发送空内容";
		} else {
			//个人头像
			var myImg = document.createElement("img");
			var newTxt = document.createElement("p");
			newTxt.style.lineHeight = "20px";
			newTxt.style.padding = "5px";
			newTxt.style.borderRadius = "5px";
			newTxt.style.backgroundColor = "yellowgreen";
			newTxt.style.float = "right";
			newTxt.style.fontSize = "15px";
			myImg.style.float = "right";
			myImg.style.height = "40px";
			myImg.style.width = "40px";
			myImg.style.borderRadius = "50%";
			myImg.style.border = "2px solid rgba(0,0,0,.3)";
			myImg.style.clear = "both";
			myImg.style.position = "relative";
			myImg.style.top = "0";
			myImg.style.margin = "8px 10px 0 10px";
			newTxt.innerHTML = txt.value;
			talk_contact.appendChild(myImg);
			talk_contact.appendChild(newTxt);
			txt.value = "";
			newTxt.scrollIntoView();
		}
	}
}
sendNews();

//获取当前时间的函数
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}