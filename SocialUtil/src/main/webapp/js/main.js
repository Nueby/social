var option = 0; //选择  0表示个人   1表示交友
var account = $.cookie("socialUtilAccount");		//账号

if(account == "" || account == null) {
	window.location.href = "/SocialUtil/matching.html";		//未登录时回到登录界面
}

//兼容浏览器获取非行内样式
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
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

//主页的ID,学校，专业，个性签名的获取
var name=$("#name");//昵称
var id=$("#ID");//学号
var school=$("#school_name");//学校名字
var college=$("#college_name");//学院名字
var major=$("#major_name");//错误：有两个major的id
var personal = $("#personal")//个性签名


$.ajax({
	type:"GET",
	url:"/SocialUtil/ControllerPageInfo.do",
	data:{
		"account":account,
	},
	dataType:"json",
	success:function(data) {
		id.html("ID:" + data.account);
		
		if(data.username == null) name.html(data.account);
		else name.html(data.username);
		
		if(data.signature == null) personal.html("");
		else personal.html(data.signature);
	},
	error:function(err) {
		alert(err.status);
	}
})

$.ajax({
	type:"GET",
	url:"/SocialUtil/ControllerSchool.do",
	data:{
		"account":account,
	},
	dataType:"json",
	success:function(data) {
		if(data.school != null) school.append(data.school);	
		if(data.college != null) college.append(data.college);
		if(data.major != null) major.append(data.major);
	},
	error:function(err) {
		alert(err.status);
	}
})


//设置框点击确定
//Ajax上传数据
var dynamic_submit = document.getElementById("dynamic_submit");
var email_submit = document.getElementById("email_submit");
var self_submit = document.getElementById("self_submit");
dynamic_submit.onclick = function() {
	set_1.style.display = "none";
	var account=$("#ID").val;//学号
	var contact=$("#contact");
	var dynamic_img=$("#dynamic_img");
	var date=new Date();
	//向服务器个人圈数据传递
	$.post("",{account:account,circle_info:contact,circle_img:dynamic_img,date:date.toLocaleString()},function(data){
		for(var i=0;i<data.length;i++){
			var html="<hr id='dynamic_line'><div id='time'>"+data.date+
			"</div><div id='dynamic_contact'><div id='dynamic_text'>"+data.circle_info+"</div><div id='cover_scroll'></div><div id='dynamic_photo'><img id='dynamic_photoshow'></div></div>";
			$("#show_dynamic").append(html);
		}
		
	},"json");
}
email_submit.onclick = function() {
	set_2.style.display = "none";
	var account=$("#ID").val;//学号
	var confirm_password =$("#confirm_password").val;//修改的密码
	//修改密码和邮箱
	$.post("",{account:account,login_password:confirm_password,},function(data){
		
	},"json");
}
self_submit.onclick = function() {
	set_3.style.display = "none";
	var account=$("#ID").val;//学号
	var username=$("#set_name").val;//昵称
	var sex =$("sex").val;
	var birthday =$("#select").val;
	//修改个人信息
	$.post("",{account:account,username:username,sex:sex,birthday:birthday},function(data){
		name.html(data.username);
	},"json");
}

//发布个人圈的预览图片
//ajax将内容传送并显示在id = show_dynamic里
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
$.get("UserController",{account:account},function(data){
	var old_password=$("#old_password");
	if(data.login_password==old_password){
		$("#input_warning").html("*旧密码输入错误");
		old_password.value="";
	}else{
		$("#input_warning").html("");
	}
});
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
var picUp=$("#picUp");
//头像上传的确定键位
picUp.onclick=function(){
	var oFile = $("#image_file")[0].files[0];//选择的文件
	$.post("",{file:oFile,url:getObjectURL(oFile)},function(data){//传地址或者文件数据
		$("#photo").html(data.head);
	})
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
//确认标签数量,标签数量最多五个
var tagNum = 0;
//点击Tag标签出显示框和保存按钮
document.getElementById("title").onclick = function() {
	if (getStyle(self_tag,"display") == "block") {
		self_tag.style.display = "none";
		save_tag.style.display = "none";
	} else {
		self_tag.style.display = "block";
		save_tag.style.display = "block";
	}
	//确认标签预览数量,标签数量最多五个
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
		};
	}
}


//点击保存将标签放在tag中
//Ajax保存确定的标签作为筛选条件
//tag_show中的标签超过五个的时候把第六个生成的将第一个给替换
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++有bug解决
save_tag.onclick = function(){
	save_tag.style.display ="none";
	document.getElementById("self_tag").style.display = "none";
	var chooseLi = chooseTag.getElementsByTagName("div");
	var tagDiv = document.createElement("div");
	var tagShow = document.getElementById("tag_show");
	
	tag.removeAttribute(document.getElementById("personal_tag"));
	var tags="";
	for(var i = 0;i < chooseLi.length; i++){
		var divVal = document.createTextNode(chooseLi[i].innerHTML);
		tagDiv.appendChild(divVal);
		tagShow.appendChild(tagDiv);
		var newTag = tagShow.getElementsByTagName("div");
		for(var j = 0; j < newTag.length;j++){
			newTag[j].setAttribute("id","other_tag" + j);
		}
		tags=tags+chooseLi[i];
	}
	$.post("",{tags:tags},function(data){
		
	},"json");
}


//删除标签,彻底删除
delete_tag.onclick = function(){
	$("#personal_tag").remove();
}


//交友页面的动画滚动效果
//点击左按钮
document.getElementById("prev").onclick = function(){
	var show_message = document.getElementById("show_message");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if(getStyle(show_message,"left") == "15px"){
		$("#show_message").animate({left:"-342px"});
		$("#show_message").css({"left":"-342px","filter":"blur(3px)"});
		$("#another_message1").css({"left":"372px"});
		$("#another_message2").animate({left:"-15px"});
		$("#another_message2").animate({left:"15px"});
		another_message2.style.right = "";
		$("#another_message2").css({"left":"15px","filter":"none"});
	}else if(getStyle(another_message2,"left") == "15px"){
		$("#another_message1").animate({left:"-15px"});
		$("#another_message1").animate({left:"15px"});
		$("#another_message1").css({"left":"15px","filter":"none"});
		$("#another_message2").animate({left:"-342px"});
		$("#another_message2").css({"left":"-342px","filter":"blur(3px)"});
		show_message.style.left = "";
		$("#show_message").css({"left":"372px"});
	}else if(getStyle(another_message1,"left") == "15px"){
		$("#show_message").animate({left:"-15px"});
		$("#show_message").animate({left:"15px"});
		$("#show_message").css({"left":"15px","filter":"none"});
		$("#another_message1").animate({left:"-342px"});
		$("#another_message1").css({"left":"-342px","filter":"blur(3px)"});
		another_message2.style.left = "";
		$("#another_message2").css({"right":"-342px"});
	}
	$("#cover_scroll1").hide();
	$("#cover_scroll2").hide();
	$("#cover_scroll3").hide();
}
//点击右按钮
document.getElementById("next").onclick = function(){
	var show_message = document.getElementById("show_message");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if(getStyle(show_message,"left") == "15px"){
		$("#show_message").animate({left:"372px"});
		$("#show_message").css({"left":"372px","filter":"blur(3px)"});
		$("#another_message1").animate({left:"30px"});
		$("#another_message1").animate({left:"15px"});
		$("#another_message1").css({"left":"15px","filter":"none"});
		$("#another_message2").css({"left":"-342px"});
	} else if(getStyle(another_message1,"left") == "15px"){
		$("#another_message2").animate({left:"30px"});
		$("#another_message2").animate({left:"15px"});
		$("#another_message2").css({"left":"15px","filter":"none"});
		another_message1.style.left = "";
		$("#another_message1").animate({left:"372px"});
		$("#another_message1").css({"left":"372px","filter":"blur(3px)"});
		$("#show_message").css({"left":"-342px"});
	}else if(getStyle(another_message2,"left") == "15px"){
		$("#another_message1").css({"left":"-342px","filter":"blur(3px)"});
		$("#another_message2").animate({left:"372px"});
		$("#another_message2").css({"left":"372px","filter":"blur(3px)"});
		$("#show_message").animate({left:"30px"});
		$("#show_message").animate({left:"15px"});
		$("#show_message").css({"left":"15px","filter":"none"});
	}
	$("#cover_scroll1").hide();
	$("#cover_scroll2").hide();
	$("#cover_scroll3").hide();
}

//对筛选的对象进行存储
var school_condition="";
var college_condition="";
var sex_condition="";
var tag_condition="";

//筛选框
document.getElementById("icon_choose").onclick = function(){
	var choose_friend = document.getElementById("choose_friend");
	if(choose_friend.style.display == "block"){
		choose_friend.style.display = "none";
	}else{
		choose_friend.style.display = "block";
	}
	//只要选完了点击筛选就用Ajax刷新main_show的内容
	document.getElementById("choose_submit").onclick = function(){
		choose_friend.style.display = "none";
		//筛选数据的传输
		var friend_name=$("#friend_name");
		var friend_school=$("#friend_school");
		var friend_college=$("#friend_college");
		var friend_personal=$("#friend_personal");
		$.post("",{sex:sex_condition,school:school_condition,college:college_condition,tags:tag_condition},function (data){
			friend_name.html(data.name);
			friend_school.html(data.school);
			friend_college.html(data.profession);
			friend_personal.html(data.signature);
		});
	}
	
	//性别
	var man = document.getElementById("man");
	var woman = document.getElementById("woman");
	man.onclick = function(){
		man.style.background = "lightblue";
		woman.style.background = "white";
	}
	woman.onclick = function(){
		man.style.background = "white";
		woman.style.background = "pink";
	}
	document.getElementById("more_school").onclick = function(){
		document.getElementById("more_school").style.display = "none";
		document.getElementById("school_choose").style.height = "80px";
	}
	document.getElementById("more_college").onclick = function(){
		document.getElementById("more_college").style.display = "none";
		document.getElementById("college_choose").style.height = "210px";
	}
	document.getElementById("more_other").onclick = function(){
		document.getElementById("more_other").style.display = "none";
		document.getElementById("other_choose").style.height = "310px";
	}
	if(man.style.background == "lightblue"){
		sex_condition=man.val;
	}else{
		sex_condition=woman.val;
	}
}


//选择学校部分
var school_choose = document.getElementById("school_choose");
var schoolLi = school_choose.getElementsByTagName("li");
//学校只能选一个
var schoolNum = 0;
for(let i = 0; i < schoolLi.length;i++){
	schoolLi[i].onclick = function(){
		for(let j = 0; j < schoolLi.length; j++) {
			schoolLi[j].style.background = "#FFF";
		}
		var newSchoolLi = new Array();
		newSchoolLi[0] = schoolLi[0].innerHTML;
		schoolLi[0].innerHTML = schoolLi[i].innerHTML;
		schoolLi[i].innerHTML = newSchoolLi[0];
		schoolLi[0].style.background = "greenyellow";
		school_choose.style.height = "35px";
		schoolNum ++;
		if(schoolNum >= 1){
			school_choose.style.height = "35px";
			document.getElementById("more_school").style.display = "block";
		}
	}
}

//对选择的学校进行存储
for(let i = 0; i < schoolLi.length;i++){
	if(schoolLi[i].style.background == "greenyellow"){
		school_condition=schoolLi[i].val;
	}
}


//学院选择部分
var college_choose = document.getElementById("college_choose");
var collegeLi = college_choose.getElementsByTagName("li");
//学院只能选一个
var collegeNum = 0;
for(let i = 0; i < collegeLi.length;i++){
	collegeLi[i].onclick = function(){
		for(let j = 0; j < collegeLi.length; j++) {
			collegeLi[j].style.background = "#FFF";
		}
		var newCollegeLi = new Array;
		newCollegeLi[0] = collegeLi[0].innerHTML;
		collegeLi[0].innerHTML = collegeLi[i].innerHTML;
		collegeLi[i].innerHTML = newCollegeLi[0];
		collegeLi[0].style.background = "#df64c9";
		college_choose.style.height = "35px";
		collegeNum ++;
		if(collegeNum >= 1){
			college_choose.style.height = "35px";
			document.getElementById("more_college").style.display = "block";
		}
	}
}

//对选择的学院进行存储
for(let i = 0; i < collegeLi.length;i++){
	if(collegeLi[i].style.background == "#df64c9"){
		college_condition=schoolLi[i].val;
	}
}

//标签选择部分
var other_choose = document.getElementById("other_choose");
var otherLi = other_choose.getElementsByTagName("li");
//标签只能选一个
var tagNum = 0;
for(let i = 0; i < otherLi.length;i++){
	otherLi[i].onclick = function(){
		for(let j = 0; j < otherLi.length; j++) {
			otherLi[j].style.background = "#FFF";
		}
		var newTagLi = new Array();
		newTagLi[0] = otherLi[0].innerHTML;
		otherLi[0].innerHTML = otherLi[i].innerHTML;
		otherLi[i].innerHTML = newTagLi[0];
		otherLi[0].style.background = "#ead3ac";
		other_choose.style.height = "35px";
		tagNum ++;
		if(tagNum >= 1){
			other_choose.style.height = "35px";
			document.getElementById("more_other").style.display = "block";
		}
	}
}

//对选择的标签进行存储
for(let i = 0; i < otherLi.length;i++){
	if(otherLi[i].style.background == "#ead3ac"){
		tag_condition=otherLi[i].val;
	}
}



//点击显示聊天界面，筛选框和个人圈以及关闭
var interval;
var chat = document.querySelectorAll("#chat");
for(var i = 0;i <chat.length;i++){
	chat[i].onclick = function(){
		if(getStyle(show_message,"left") == "15px"
		|| getStyle(another_message1,"left") == "15px"
		||getStyle(another_message1,"left") == "15px"){
			var chat_about = document.getElementById("chat_about");
			chat_about.style.display = "block";
			if(interval){
				clearInterval(interval);
			}
			interval = setInterval("timeLow()",1000);
		}else{
			return false;
		}	
	}
}
//时间递减函数
//点开聊天框后的倒计时，当时间停止到30秒时提醒，为0时关闭聊天界面
var time = 300;
function timeLow(){
	var timeChat = document.getElementById("time_chat");
	if(time > 0){
		time--;
		timeChat.innerHTML = time;
	}else if(time == 0){
		clearInterval(interval);
		chat_about.style.display = "none";
	}
	var chatWarning = document.getElementById("chat_warning");
	if(time <= 30){
		chatWarning.style.display = "block";
		chatWarning.innerHTML = "聊天时间快结束了，还不快向他要其他的聊天方式吗，聊的开心就快问吧！！";
		chatWarning.style.color = "red";
		timeChat.style.color = "red";
	}
	if(time <= 25){
		chatWarning.style.display = "none";
	}
}
//点击关闭按钮退出聊天框，并在对面的id = chat_warnig中提示对方退出
//ajax的内容,只要聊天框关闭，刷新main_show的内容

document.getElementById("icon_close").onclick = function(){
	chat_about.style.display = "none";
	clearInterval(interval);
}


//点击加时按钮，在对方的页面弹出confirm框，点击确定加时，点击取消不加时
document.getElementById("icon_time").onclick = function(){
	
}


//个人圈的查看
//ajax将发布的个人圈资料上传
var more = document.querySelectorAll("#more");
var cover_scroll1 = document.getElementById("cover_scroll1");
var cover_scroll2 = document.getElementById("cover_scroll2");
var cover_scroll3 = document.getElementById("cover_scroll3");
var show_message = document.getElementById("show_message");
var another_message1 = document.getElementById("another_message1");
var another_message2 = document.getElementById("another_message2");
more[0].onclick = function(){
	if(getStyle(show_message,"left") != "15px"){
		return false;
	}
	if(getStyle(cover_scroll1,"display") == "none"){
		$("#cover_scroll1").show();
	}else{
		$("#cover_scroll1").hide();
	}
}
more[1].onclick = function(){
	if(getStyle(another_message1,"left") != "15px"){
		return false;
	}
	if(getStyle(cover_scroll2,"display") == "none"){
		$("#cover_scroll2").show();
	}else{
		$("#cover_scroll2").hide();
	}
}
more[2].onclick = function(){
	if(getStyle(another_message2,"left") != "15px"){
		return false;
	}
	if(getStyle(cover_scroll3,"display") == "none"){
		$("#cover_scroll3").show();
	}else{
		$("#cover_scroll3").hide();
	}
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
