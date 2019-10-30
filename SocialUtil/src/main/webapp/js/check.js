var isHave = true;		//账号是否被注册
var havePic = false;		//是否有图
var big;		//大图
var small;		//小图
var posY;		//y坐标

//获取标签
function $id(id) {
	return document.getElementById(id);
}

//页面加载事件
function load() {
	erChange();
	enterChange();
	registerChange();
	bar();
	getPic();
	registerOnclick()
}

//登录和注册切换
function erChange() {
	var sign_in = document.querySelector("#Sign_in");
	var title_right = document.querySelector("#title_right");
	var title_left = document.querySelector("#title_left");
	var register = document.querySelector("#register");
	//注册页面显示
	title_right.onclick = function() {
		sign_in.style.display = "none";
		register.style.display = "block";
		title_right.setAttribute("id","change_title_right");
		title_left.setAttribute("id","change_title_left");
	}
	//登录页面显示
	title_left.onclick = function() {
		sign_in.style.display = "block";
		register.style.display = "none";
		title_left.setAttribute("id","title_left");
		title_right.setAttribute("id","title_right");
	}
}

//登录页面
function enterChange() {
	var account = $id("text");
	var password = $id("password");
	var icon_people = $id("icon_people");
	var icon_password = $id("icon_password");
	//改变账号图标
	account.onclick = function (){
		icon_people.setAttribute("id","icon_people_2");
		icon_password.setAttribute("id","icon_password");
	}
	//改变密码图标
	password.onclick = function (){
		icon_password.setAttribute("id","icon_password_2");
		icon_people.setAttribute("id","icon_people");
	}
}

//注册页面
function registerChange() {
	var icon_rpeople = $id("icon_rpeople");
	var icon_password_secret = $id("icon_password_secret");
	var icon_password_confirm = $id("icon_password_confirm");
	var register_text = $id("register_text");
	var register_password = $id("register_password");
	var icon_secret = $id("icon_secret");
	var text_password = $id("text_password");
	var confirm = $id("confirm");
	//图标改变
	register_text.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople_2");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_secret.setAttribute("id","icon_secret");
	}
	register_password.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret_2");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_secret.setAttribute("id","icon_secret");
	}
	confirm.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm_2");
		icon_secret.setAttribute("id","icon_secret");
	}
	text_password.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_secret.setAttribute("id","icon_secret_2");
	}
	//检验账号是否存在
	register_text.onblur = function() {
		var account;
		if(register_text.value == "") {
			account = "";
			$id("accountMsg").innerHTML = "*账号不可为空";
			isHave = true;
		} else {
			account = register_text.value;
			$.ajax({
				type:"GET",
				url:"/passerby/UserController.do",
				data: {
					"behaviour":0,
					"account":account
				},
				dataType:"json",
				success:function(data){
					if(data.result == true) {		//账号存在显示信息
						$id("accountMsg").innerHTML = "*该账号已存在";
						$("#accountMsg").css("color","red");
						isHave = true;
					} else {		//账号不存在显示信息
						$id("accountMsg").innerHTML = "*该账号可使用";
						$("#accountMsg").css("color","green");
						isHave = false;
					}
				},
				error:function(err) {
					alert(err.status);
				}
			})
		}
	}
}

//滑动登录
function bar() {
	var isTouch = false; //标志位，是否点击
	var startX = 0; //鼠标点击的偏移量，实现平滑移动的保证
	var touch_bar = $id("touch_bar");
    var bg_bar = $id("bg_bar");
    var bg_new = $id("bg_new");
    /* 
    为滑块绑定鼠标移动事件
    当鼠标在滑块上移动时，使滑块在水平方向上跟随移动
    是否移动要根据标志位检测滑块是否被点击
    */
    touch_bar.onmousemove = function(ev) {
		//给ev加window事件
        var ev = ev || window.event;
		/*
		ev.cilenX - startX >0保证鼠标向左边滑动不会让滑块 也偏移
		ev.clientX - startX < bg_bar.offsetWidth - touch_bar.offsetWidth
		滑块要在滑动范围内移动
		*/
        if (ev.clientX - startX > 0 &&
            ev.clientX - startX < bg_bar.offsetWidth - touch_bar.offsetWidth &&
            isTouch) {
				touch_bar.style.left = ev.clientX - startX + "px";
				bg_new.style.width = ev.clientX - startX + touch_bar.offsetWidth / 2 + "px";
				$id("smallPic").style.marginLeft = touch_bar.style.left;
        }
    } 
    //设置滑块点击事件,改变标志位，并重置偏移量 
    touch_bar.onmousedown = function(ev) {
        isTouch = true;
        startX = event.clientX;
    }
    //设置滑块鼠标点击取消事件,改变标志位，重置偏移量 
    touch_bar.onmouseup = function(ev) {
    	var distance = parseInt(touch_bar.style.left);
    	var json = {"distance":distance};
    	$.ajax({
    		type:"post",
    		url:"/passerby/SlipVerificationCodeController.do",
    		data:JSON.stringify(json),
    		dataType:"json",
    		success:function(data) {
				if(data.verification == true) {		//验证成功
					if($id("text").value != "") {
						var account = $id("text").value;
						var password = $id("password").value;
						var json = {"behaviour":4,"account":account,"password":password};
						$.ajax({
							type:"GET",
							url:"/passerby/UserController.do",
							data:JSON.stringify(json),
							dataType:"json",
							success:function(data) {
								if(data.result == false) {
									$id("enterMsg").innerHTML = "*密码错误";
								} else {		//登录成功
									$.cookie("socialUtilAccount",account);
									window.location.href = "/passerby/other_html/main.html";
									$("#loading").show();
								}
							},
							error:function(err) {
								alert(err.status);
							}
						})
					} else {
						$id("enterMsg").innerHTML = "*账号不能为空";
					}
				} else {		//验证失败
					getPic();
					$id("enterMsg").innerHTML = "*验证失败";
				}
			},
			error:function(err) {
				alert(err.status);
			}
		})
		isTouch = false;
		startX = 0;
		touch_bar.style.left = "0px";
		bg_new.style.width = "0px";
		$id("smallPic").style.marginLeft = touch_bar.style.left;
	}
	
    //设置滑块鼠标移出事件,改变标志位，并重置偏移量

    touch_bar.onmouseleave = function() {
        isTouch = false;
        startX = 0;
        touch_bar.style.left = "0px";
        bg_new.style.width = "0px";
		$id("check_img").style.display = "none";
    }
	
	touch_bar.onmouseenter = function() {
		$id("big_img").innerHTML = "<img src=data:image/png;base64," + big + " width='300px' height='205px'/>";
		$id("small_img").innerHTML = "<img id='smallPic' src=data:image/png;base64," + small + " width='60px' style='margin-top:" + posY + "px'/>";
		$id("check_img").style.display = "block";
		//$("#loading").show();
		$("#loading").show();
	}
    //重置偏移量
    touch_bar.style.left = "0px";
    bg_new.style.width = "0px";
}
//获取滑动验证图片
function getPic() {
	$.ajax({
		type:"GET",
		url:"/SocialUtil/SlipVerificationCodeController.do",
		data:{},
		dataType:"json",
		success:function(data) {
			big =  data.big;		//大图
			small = data.small;		//小图
			posY = data.posY;		//y坐标
			havePic = true;
		},
		error:function(err) {
		    alert(err.status);
		}
	})
}

//发送注册消息
function sendRegister() {
	var registerMsg = $id("registerMsg");
	var account = $id("register_text").value;
	var accountPassword = $id("accountPassword").value;
	var register_password = $id("register_password").value;
	var confirm = $id("confirm").value;
	var school=$id("select").value;
	if(isHave) {
		registerMsg.innerHTML = "<p style='color:#F00;'>*账号不符合要求</p>";
	} else if(accountPassword == "") {
		registerMsg.innerHTML = "*密码不能为空";
	} else if(register_password == ""){
		registerMsg.innerHTML = "*密码不能为空";
	} else if(register_password != confirm) {
		registerMsg.innerHTML = "*两次密码不一致";
	} else {
		//跨域
		var json = {"method":"authUser","xh":account+"","pwd":accountPassword+"","password":register_password,"school":school};
		$.ajax({
			type:"POST",
			url:"/passerby/RegisterController.do",
			data:JSON.stringify(json),
			dataType:"json",
			success:function(data) {
				if(data.result == true) {
					registerMsg.innerHTML = "*注册成功";
				if(data.result == true) {
					registerMsg.innerHTML = "*注册成功";
				} else {
					registerMsg.innerHTML = "*学号信息错误";
				}
			},
			error:function(err) {
				alert(err.status);
			}
		})
	}
}

//添加注册事件
function registerOnclick() {
	$id("submit").onclick = sendRegister;
}



//字体跳动效果
$(document).ready(function() {
	$("#roloadText").beatText({
		isAuth: true,
		beatHeight: "1em",
		isRotate: false,
		upTime: 100,
		downTime: 100
	});
});
