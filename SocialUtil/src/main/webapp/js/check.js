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
	}
	//登录页面显示
	title_left.onclick = function() {
		sign_in.style.display = "block";
		register.style.display = "none";
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
	var icon_accountPassword = $id("icon_accountPassword");
	var register_text = $id("register_text");
	var register_password = $id("register_password");
	var accountPassword = $id("accountPassword");
	var confirm = $id("confirm");
	//图标改变
	register_text.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople_2");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_accountPassword.setAttribute("id","icon_accountPassword");
	}
	accountPassword.onclick = function() {
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_accountPassword.setAttribute("id","icon_accountPassword_2");
	}
	register_password.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret_2");
		icon_password_confirm.setAttribute("id","icon_password_confirm");
		icon_accountPassword.setAttribute("id","icon_accountPassword");
	}
	confirm.onclick = function(){
		icon_rpeople.setAttribute("id","icon_rpeople");
		icon_password_secret.setAttribute("id","icon_password_secret");
		icon_password_confirm.setAttribute("id","icon_password_confirm_2");
		icon_accountPassword.setAttribute("id","icon_accountPassword");
	}
	//检验账号是否存在
	register_text.onblur = function() {
		var account;
		if(register_text.value == "") {
			account = "";
			$id("accountMsg").innerHTML = "<p style='color:#F00;'>*账号不可为空</p>";
			isHave = true;
		} else {
			account = register_text.value;
			var json = {"behaviour":"check","account":account};
			$.ajax({
				type:"GET",
				url:"/SocialUtil/UserController.do",
				data: {"json":JSON.stringify(json)},
				dataType:"json",
				success:function(data){
					if(data.result) {		//账号存在显示信息
						$id("accountMsg").innerHTML = "<p style='color:#F00;'>*该账号已存在</p>";
						isHave = true;
					} else {		//账号不存在显示信息
						$id("accountMsg").innerHTML = "<p style='color:#000;'>该账号可用</p>";
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
    		url:"/SocialUtil/SlipVerificationCodeController.do",
    		data:JSON.stringify(json),
    		dataType:"json",
    		success:function(data) {
    			if(data.verification == true) {		//验证成功
    				if($id("text").value != "") {
	    				var account = $id("text").value;
	    				var password = $id("password").value;
	    				var json = {"behaviour":"login","account":account,"password":password};
	    				$.ajax({
	    					type:"POST",
	    					url:"/SocialUtil/UserController.do",
	    					data:JSON.stringify(json),
	    					dataType:"json",
	    					success:function(data) {
	    						if(data.result == "account") {
	    							$id("enterMsg").innerHTML = "<p style='color:#F00;'>*账号不存在</p>";
	    						} else if(data.result == "password") {
	    							$id("enterMsg").innerHTML = "<p style='color:#F00;'>*密码错误</p>";
	    						} else {		//登录成功
	    							window.location.href = "/SocialUtil/other_html/main.html";
	    						}
	    					},
	    					error:function(err) {
	    						alert(err.status);
	    					}
	    				})
    				} else {
    					$id("enterMsg").innerHTML = "<p style='color:#F00;'>*账号不能为空</p>";
    				}
    			} else {		//验证失败
    				getPic();
    				$id("enterMsg").innerHTML = "<p style='color:#F00;'>*验证失败</p>";
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

    touch_bar.onmouseout = function(ev) {
        isTouch = false;
        startX = 0;
        touch_bar.style.left = "0px";
        bg_new.style.width = "0px";
		$id("check_img").style.display = "none";
    }
	
	touch_bar.onmouseenter = function(ev) {
		$id("big_img").innerHTML = "<img src=data:image/png;base64," + big + " width='300px' height='205px'/>";
		$id("small_img").innerHTML = "<img id='smallPic' src=data:image/png;base64," + small + " width='60px' style='margin-top:" + posY + "px'/>";
		$id("check_img").style.display = "block";
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
	if(isHave == true) {
		registerMsg.innerHTML = "<p style='color:#F00;'>*账号不符合要求</p>";
	} else {
		
	}
}

//添加注册事件
function registerOnclick() {
	$id("submit").onclick = sendRegister;
}
