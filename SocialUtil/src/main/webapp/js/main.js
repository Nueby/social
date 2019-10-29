var option = 0; //选择  0表示个人  1表示交友
var account = $.cookie("socialUtilAccount"); //账号
var tagnum=-1;//标签个数
var tagtime=0;//标签轮数
var ntags="";//传送标签
var grade; //入学年份
var email = ""; //邮箱
var age; //年龄


var signature = ""; //修改签名
var birthday = ""; //生日


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
	$("#friend_list").hide();
}

//获取主页信息
function getPage() {
	var school_name = $id("school_name"); //学校
	var college_name = $id("college_name"); //学院
	var major_name = $id("major_name"); //专业
	var sex_img = $id("sex_img"); //性别
	var personal=$id("personal");//个性签名
	var name = $id(name); //昵称
	var head_show = $id("head_show"); //头像
	var sex="";
	var all_dynamic=$id("all_dynamic");
	$.ajax({
		type: "GET",
		url: "/SocialUtil/UserController.do",
		data: JSON.stringify({
			"behaviour":1,
			"account": account
		}),
		dataType: "json",
		success: function(data) {
			name.html(data.fakename);
			head.src="data:img/png;base64,"+data.head;
			school_name.html(data.school);
			college_name.html(data.college);
			major_name.html(data.major);
			personal.html(data.singlesex);
			ntags=data.tgas;
			sex=data.sex;
			if(ntgas!=""){
				var begintag=new Array();
				begintag=ntags.split("&");
				$("#personal_tag").remove();
				for (i=0;i<begintag.length ;i++ ){
					tagnum=tagnum+1;
					var tagDiv = document.createElement("div");
					var tagShow = document.getElementById("tag_show");
					var divVal = document.createTextNode(begintag[i].innerHTML);
					tagDiv.appendChild(divVal);
					tagShow.appendChild(tagDiv);
					var newTag = tagShow.getElementsByTagName("div");
					newTag[tagnum].setAttribute("id","other_tag" + tagnum);
				}
			}
			if(sex=="男"){
				sex_img.src="../img/man.png";
			}else{
				sex_img.src="../img/woman.png";
			}
			
			var circle_info=data.info;
			var newshow = document.createElement("div");
			var time = document.createElement("div");
			var dynamic_contact = document.createElement("div");
			var dynamic_photo = document.createElement("div");
			newshow.setAttribute("id", "show_dynamic");
			time.setAttribute("id", "time");
			dynamic_contact.setAttribute("id", "dynamic_contact");
			dynamic_photo.setAttribute("id", "dynamic_photo");
			var showVal = document.createTextNode(circle_info);
			var timeshow=document.createTextNode(getNowDate());
			var circle_img=document.createElement("img");
			circle_img.src="data:img/png;base64,"+data.picture;
			
			dynamic_contact.appendChild(showVal);
			time.appendChild(timeshow);
			dynamic_photo.appendChild(circle_img);
			
			newshow.appendChild(time);
			newshow.appendChild(dynamic_contact);
			newshow.appendChild(dynamic_photo);
			all_dynamic.appendChild(newshow);
			
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


<<<<<<< HEAD
=======
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
>>>>>>> master

		},
		error: function(err) {
			//alert(err.status);
		}
	})
}
$id("email_submit").onclick = function() {
	$id("set_2").style.display = "none";
	$id("new_email").value = "";
	$id("get_code_email").value = "";
	$id("old_password").value = "";
	$id("new_password").value = "";
	$id("confirm_password").value = "";
	$id("email_warning").innerHTML = "";
	if ($id("new_email").value == "") return false;
	$.ajax({
		type: "GET",
		url: "/SocialUtil/SendEmailController.do",
		data: JSON.stringify({
			"behaviour": 1,
			"input":$id("get_code_email").value
		}),
		dataType: "json",
		success: function(data) {
			if (data.msg == true) {
				$.ajax({
					type: "GET",
					url: "/SocialUtil/UserController.do",
					data: JSON.stringify({
						"behaviour": 4,
						"account":account,
						"email":$id("new_email").value
					}),
					dataType: "json",
					success: function(data) {
						if(result=="true"){
							alert("邮箱修改成功");
						}
					},
					error: function(err) {
						//alert(err.status);
					}
				})
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
			"behaviour": 5,
			"account": account,
			"password": $id("new_password").value,
			"oldpassword": $id("old_password").value,
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == "true") {
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
	$id("set_name").value = "";
	$id("school").value = "";
	$id("college").value = "";
	$id("major").value = "";
	$.ajax({
		type: "POST",
		url: "/SocialUtil/UserController.do",
		data: JSON.stringify({
			"sex": $id("set_name").value,
			"fakename":$id("radio_box").value,
			"birthday": $id("select").value
		}),
		dataType: "json",
		success: function(data) {
			if (data.result == "true") {
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

<<<<<<< HEAD
// function changeUsername() {
// 	$.ajax({
// 		type: "POST",
// 		url: "/SocialUtil/ControllerPageInfo.do",
// 		data: JSON.stringify({
// 			"behaviour": "change",
// 			"username": $id("set_name").value,
// 			"head": head,
// 			"signature": signature,
// 			"birthday": $id("select").value,
// 			"tags": tags,
// 			"circleInfo": circle_info,
// 			"circleImg": circle_img
// 		}),
// 		dataType: "json",
// 		success: function(data) {
// 			if (data.result == true) {
// 				getPage();
// 				alert("修改成功");
// 			} else {
// 				alert("修改失败");
// 			}
// 		},
// 		error: function(err) {
// 			//alert(err.status);
// 		}
// 	})
// }
// 

//设置框点击确定
$id("dynamic_submit").onclick = function() {	
	var pic = document.getElementById("picture_choose").getElementsByTagName("div");
	//上传数据，要一个一个图片的传
	$(document).ready(function(){
		$("#dynamic_img").on("change", upload );
	});
	for(var i=1; i<pic.length;i++){
		//获取base64的图片数据
		 var file = $("#avatar")[i-1].files[i-1];
		 var reader  = new FileReader();
		 reader.onloadend=function(e) {
			 e.target.result
		}
		 if (file) {
			reader.readAsDataURL(file);
		 }
		var json={"behaviour":2,"account":account,"picture":reader.split(",",2)[1],"ify":ify,"info":$id("contact").value};
		function upload(){
			var self = this;
			$.ajax({
				url:"/SocialUtil/UserController.do",
				type:"post",
				dataType:"json",
				cache:false,
				data:JSON.stringify(json),
				processData: false,// 不处理数据
				contentType: false, // 不设置内容类型
				success:function(data){
					
				}
			});
	}
	}
	$id("set_1").style.display = "none";
	$id("contact").value = "";
	//清空个人圈上传里面的图片
	$(".image_container").remove();
}
//个人圈发布的图片添加，预览和删除

$(function () {
	//记录第几张图片
	var picId = 0;
	var pictureUploading = false;
	$("#form1").delegate(".addImg", "click", function () {
		if (pictureUploading) return;
		pictureUploading = true;
		
		
		if(picId < 4){
			picId++;
			$(".addImg").display="block";
			$(this).attr("data-picId", picId);
			$(this).before("<div class=\"image_container\" data-picId=\"" + picId + "\">"
							+ "<input id=\"image_file" + picId + "\" name=\"image_file" + picId + "\" type=\"file\" accept=\"image/jpeg,image/png,image/gif\" style=\"display: none;\" />"
							+ "<input id=\"picture_input" + picId + "\" name=\"picture_input" + picId + "\" type=\"hidden\" value=\"0\" />"
							+ "<a href=\"javascript:;\" id=\"previewBox" + picId + "\" class=\"previewBox\">"
								+ "<div class=\"delImg\">&times;</div>"
								+ "<img id=\"preview" + picId + "\" style=\"height:70px;width:70px;border-width:0px;\" />"
							+ "</a>"
						+ "</div>");
			$("#image_file" + picId).change(function () {
				var $file = $(this);
				var fileObj = $file[0];
				var windowURL = window.URL || window.webkitURL;
				var dataURL;
				$("#previewBox" + picId).css("display", "inline-block");
				var $img = $("#preview" + picId);
				if (fileObj && fileObj.files && fileObj.files[0]) {
					dataURL = windowURL.createObjectURL(fileObj.files[0]);
					$img.attr('src', dataURL);
				} else {
					dataURL = $file.val();
					var imgObj = $img;
					// 在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
					imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
					imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
				}
				if (1 === picId) {
					defaultImg(picId, true);
				}
				pictureUploading = false;
			});
		}else{
			$(".addImg").display="none";
		}
		$("#image_file" + picId).click();
		//预览图片
		$(".previewBox").click(function () {
			var _picId = parseInt($(this).parent(".image_container").attr("data-picId"));
			$(".image_container").each(function () {
				var i = parseInt($(this).attr("data-picId"));
				if (i === _picId)
					defaultImg(i, true);
				else
					defaultImg(i, false);
			});
		});
		//删除上传的图片
		$(".delImg").click(function () {
			picId--;
			var _picId = parseInt($(this).parent().parent(".image_container").attr("data-picId"));
			$(".image_container[data-picid='" + _picId + "']").remove();
			var pic = document.getElementById("picture_choose").getElementsByTagName("div");
			var imagecontainer=$(".image_container");
			for(var i=1;i<pic.length;i++){
				if(i<picId){
					imagecontainer[i].attr("data-picId", i);
				}else{
					imagecontainer[i].attr("data-picId", i-1);
				}
				
			}
			if ($(".image_container").length > 0 && $(".defaultImg").length < 1) {
				$(".image_container").each(function () {
					
					var i = parseInt($(this).attr("data-picId"));
					defaultImg(i, true);
					return false;
				});
			}
		});
	});
	function defaultImg(picId, selected) {
		if (!picId) return;
		if (!!selected) {
			$("#picture_input" + picId).val(1);
			$("#previewBox" + picId).addClass("defaultImg");
		}
		else {
			$("#picture_input" + picId).val(0);
			$("#previewBox" + picId).removeClass("defaultImg");
		}
	}
=======
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
>>>>>>> master
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
		"behaviour": 0,
		"new_email": new_email
	};
	$.ajax({
		type: "GET",
		url: "/SocialUtil/SendEmailController.do",
		data: JSON.stringify(json),
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
	
	//获取base64的图片数据
	 var file = $("#avatar")[0].files[0];
	 var reader  = new FileReader();
	 reader.onloadend=function(e) {
		 e.target.result
	}
	 if (file) {
		reader.readAsDataURL(file);
	 }
	//头像更改ajax
	var json ={"behaviour":1, "head":reader.split(",",2)[1],"account":account};
	$.ajax({
		type: "GET",
		url: "/SocialUtil/UserController.do",
		data: JSON.stringify(json),
		typeData: "json",
		success: function(data) {
			if(result=="true"){
				alert("头像修改成功");
			}else{
				alert("头像修改失败");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
	getPage();
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
<<<<<<< HEAD

$id("save_tag").onclick = function() {
	var tagWarning = document.getElementById("tag_warning");
	tagWarning.innerHTML = "";
	
=======
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++有bug解决
var tagnum=-1;
var tagtime=0;
$id("save_tag").onclick = function() {
	$("#personal_tag").remove();
>>>>>>> master
	$id("save_tag").style.display = "none";
	$("#self_tag").hide();
	
	var chooseLi = $id("choose_tag").getElementsByTagName("div");
<<<<<<< HEAD
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	var tags="";
=======
>>>>>>> master
	for(var i = 0;i < chooseLi.length; i++){	
		$("#personal_tag").remove();
		tagnum=tagnum+1;
		if(tagnum>=5){
			if(tagnum%5==0){
				tagtime=tagtime+1;
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}else{
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}
			var tags="";
			for(var i=0; i<5; i++){
				tags=tags+$id("other_tag"+(tagnum-(5*tagtime))).innerHTML;
			}
			ntags=tags;
		}else{
			var tagDiv = document.createElement("div");
			var tagShow = document.getElementById("tag_show");
			var divVal = document.createTextNode(chooseLi[i].innerHTML);
			tagDiv.appendChild(divVal);
			tagShow.appendChild(tagDiv);
			var newTag = tagShow.getElementsByTagName("div");
			newTag[tagnum].setAttribute("id","other_tag" + tagnum);
			if(ntags==""){
				ntags=ntags+chooseLi[i];
			}else{
				ntags=ntags+"&"+chooseLi[i];
			}
		}
<<<<<<< HEAD
=======
		ntags = ntags + chooseLi[i];
>>>>>>> master
	}
	var chooseLi_length=chooseLi.length-1;
	for(var i =chooseLi_length; i>=0; i--){
		chooseLi[i].remove();
	}
	$.ajax({
<<<<<<< HEAD
		type:"post",
		url:"/SocialUtil/UserController.do",
		data:JSON.stringify({
			"behaviour":7,
			"tags":ntags,
		}),
		dataType:"json",
		success:function(data) {
			if(data.result == "true") {
				alert("更改成功");
=======
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
>>>>>>> master
			} else {
				getPage();
				alert("更改失败");
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
	var another_message0 = document.getElementById("another_message0");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(another_message0, "left") == "15px") {
		$("#another_message0").animate({
			left: "-342px"
		});
		$("#another_message0").css({
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
		another_message0.style.left = "";
		$("#another_message0").css({
			"left": "372px"
		});
	} else if (getStyle(another_message1, "left") == "15px") {
		$("#another_message0").animate({
			left: "-15px"
		});
		$("#another_message0").animate({
			left: "15px"
		});
		$("#another_message0").css({
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
	var another_message0 = document.getElementById("another_message0");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(another_message0, "left") == "15px") {
		$("#another_message0").animate({
			left: "372px"
		});
		$("#another_message0").css({
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
		$("#another_message0").css({
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
		$("#another_message0").animate({
			left: "30px"
		});
		$("#another_message0").animate({
			left: "15px"
		});
		$("#another_message0").css({
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
		$.post("/SocialUtil/UserController.do", {
			behaviour:3,
			sex: sex_condition,
			school: school_condition,
			college: college_condition,
			tags: tag_condition
		}, function(data) {
			if(data.result=="true"){
				for(var j=0;j<3;j++){
					var friend_name = $("#another_message"+j).children("#friend_name");
					var friend_school = $("#another_message"+j).children("#friend_school");
					var friend_college = $("#another_message"+j).children("#friend_college");
					var friend_personal = $("#another_message"+j).children("#friend_personal");
					if($("#another_message"+j).style.left=="15px"){
						friend_name.html(data.fakename);
						friend_school.html(data.school);
						friend_college.html(data.major);
						friend_personal.html(data.singlesex);
						var tags =data.tags;
						if(tgas!=""){
							var friendtag=new Array();
							friendtag=tags.split("&");
							$("#personal_tag").remove();
							for (i=0;i<friendtag.length ;i++ ){
								$("#another_message"+j).children("friend_tag"+i).html(friendtag[i]);
							}
						}
						//个人圈
						var circle_info=data.info;
						var newshow = document.createElement("div");
						var time = document.createElement("div");
						var dynamic_contact = document.createElement("div");
						var dynamic_photo = document.createElement("div");
						newshow.setAttribute("id", "show_dynamic");
						time.setAttribute("id", "time");
						dynamic_contact.setAttribute("id", "dynamic_contact");
						dynamic_photo.setAttribute("id", "dynamic_photo");
						var showVal = document.createTextNode(circle_info);
						var timeshow=document.createTextNode(getNowDate());
						var circle_img=document.createElement("img");
						circle_img.src="data:img/png;base64,"+data.picture;
						
						dynamic_contact.appendChild(showVal);
						time.appendChild(timeshow);
						dynamic_photo.appendChild(circle_img);
						newshow.appendChild(time);
						newshow.appendChild(dynamic_contact);
						newshow.appendChild(dynamic_photo);
						friend_dynamic.appendChild(newshow);
					}
				}
			}else{
				alert("该筛选条件找不到人");
			}
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


//好友列表的显示
document.getElementById("icon_list").onclick = function() {
	var friend_list = document.getElementById("friend_list");
	if (friend_list.style.display == "block") {
		friend_list.style.display = "none";
	} else {
		friend_list.style.display = "block";
	}
}


//好友列表的头像点开开始聊天
$("#list_show").click(function(){
	$("#chat_page").show();
})


//点击显示聊天界面，筛选框和个人圈以及关闭
var interval;
var chat = document.querySelectorAll("#chat");
for (var i = 0; i < chat.length; i++) {
	chat[i].onclick = function() {
		if (getStyle(show_message, "left") == "15px") {
			$("#chat_about").show();
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval("timeLow()", 1000);
		}else if(getStyle(another_message1, "left") == "15px"){
			$("#chat_about").show();
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval("timeLow()", 1000);
		}else if(getStyle(anoter_message2, "left") == "15px"){
			$("#chat_about").show();
			if (interval) {
				clearInterval(interval);
			}
			interval = setInterval("timeLow()", 1000);
		}else {
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

<<<<<<< HEAD
//改变聊天框的大小
$("#icon_change").click(function(){
	if($("#icon_change img").attr("src") == "../img/small.png"){
		$("#chat_about").css({"height":"75px","overflow":"hidden"});
		$("#icon_change img").attr("src","../img/big.png");
		$("#icon_samll")
	}else if($("#icon_change img").attr("src") == "../img/big.png"){
		$("#chat_about").css({"height":"560px","overflow":"visible"});
		$("#icon_change img").attr("src","../img/small.png");
	}
})


//举报内容的显和隐藏
$("#icon_report").click(function(){
	$("#report_choose").show();
})
//222222222222222222222222222222222222222222222222222222222222222
$(function(){
	//点击选中或取消checkbox
	for(var i=1;i<$("#report_introduce input").lengt+1;i++){
		$("#report_introduce")[i].click(function(){
			if($("#check"+i).checked = true){
				$("#check"+i).checked = false;
			}else{
				$("#check"+i).checked = true;
			}
		})
	}
})
$("#report_submit").click(function(){
	$("#report_choose").hide();
	for(var i = 0;i<$("#report_choose #report_introduce").length;i++){
		if($("#report_introduce input")[i].checked){
			$("#report_introduce input")[i].checked = false;
		}
	}
})
$("#report_cancel").click(function(){
	$("#report_choose").hide();
	for(var i = 0;i<$("#report_choose #report_introduce").length;i++){
		if($("#report_introduce input")[i].checked){
			$("#report_introduce input")[i].checked = false;
		}
	}
})

//加好友的请求
$("#icon_friend").click(function(){
	$("#add_friend").show();
})

//点击确定向对方发送信息
$("#add_submit").click(function(){
	$("#add_friend").hide();
})
$("#add_cancel").click(function(){
	$("#add_friend").hide();
})

//聊天框的拖动
function MoveChat(){
	var chat_about = document.getElementById("chat_about");
	function drag (ele){
		ele.onmousedown = function(e){
			var e = e || window.event;  
			//此处是为了兼容IE，因为IE中事件对象是作为全局对象( window.event )存在的；
			var pageX = e.pageX || e.clientX + document.documentElement.scrollLeft;
			var pageY = e.pageY || e.clientY + document.documentElement.scrollTop;
			//获取鼠标相对盒子的位置；
			var chat_aboutX = pageX - chat_about.offsetLeft;
			var chat_aboutY = pageY - chat_about.offsetTop;
			document.onmousemove = function(e){
				var e = e || window.event;
				var pageX = e.pageX || e.clientX + document.documentElement.scrollLeft;
				var pageY = e.pageY || e.clientY + document.documentElement.scrollTop;
			  //将鼠标当前的坐标值减去鼠标相对盒子的位置，得到盒子当时的位置并将其赋值给盒子，实现移动效果
				chat_about.style.left = pageX - chat_aboutX +'px';
				chat_about.style.top = pageY - chat_aboutY + 'px';
			}
		};
		document.onmouseup = function () {
			//清除盒子的移动事件;
			document.onmousemove = null;
		};
	};
	drag(chat_about);
}
MoveChat();

=======
>>>>>>> master
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
<<<<<<< HEAD
//个人圈的发布时候要给时间，举报信息要给时间后台记录

//直接传纯数字的是在举报那里和聊天记录的
function getDate(){
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
	//有必要就加
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    //获取当前时间
    var now = (year.toString() + month.toString() + date.toString());
	return now;
}
//这是个人圈显示的时间数据
function getNowDate(){
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    //获取当前时间
    var now = (year.toString() + "-" + month.toString() +  "-" + date.toString());
	return now;
}


//收邮件的页面显示
$("#email_main").click(function(){
	
})
=======
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
>>>>>>> 1b94c59f814da3000f5903b32cdc256e1d8604f9
