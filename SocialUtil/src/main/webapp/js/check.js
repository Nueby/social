
var sign_in = document.querySelector("#Sign_in");
var title_right = document.querySelector("#title_right");
var title_left = document.querySelector("#title_left");
var register = document.querySelector("#register");


//登录和注册切换 


title_right.onclick = function(){
	sign_in.style.display = "none";
	register.style.display = "block";
}


title_left.onclick = function(){
	if(sign_in.style.display == "none"){
		sign_in.style.display = "block";
		register.style.display = "none";
	}else{
		return false;
	}
}


//登录页面输入时图标改变


var text = document.getElementById("text");
var password = document.getElementById("password");
var icon_people = document.getElementById("icon_people");
var icon_password = document.getElementById("icon_password");


//Ajax看数据库验证号码有没有被注册过
text.onclick = function (){
	//点击是setAttribute改变id属性节点
	icon_people.setAttribute("id","icon_people_2");
	icon_password.setAttribute("id","icon_password");
}

//Ajax看密码与账号是否匹配

password.onclick = function (){
	icon_password.setAttribute("id","icon_password_2");
	icon_people.setAttribute("id","icon_people");
}


//注册页面点击时图标改动

var icon_phone = document.getElementById("icon_phone");
var icon_password_secret = document.getElementById("icon_password_secret");
var icon_password_confirm = document.getElementById("icon_password_confirm");
var register_text = document.getElementById("register_text");
var register_password = document.getElementById("register_password");
var confirm = document.getElementById("confirm");

register_text.onclick = function(){
	icon_phone.setAttribute("id","icon_phone_2");
	icon_password_secret.setAttribute("id","icon_password_secret");
	icon_password_confirm.setAttribute("id","icon_password_confirm");
}
register_password.onclick = function(){
	icon_phone.setAttribute("id","icon_phone");
	icon_password_secret.setAttribute("id","icon_password_secret_2");
	icon_password_confirm.setAttribute("id","icon_password_confirm");
}
confirm.onclick = function(){
	icon_phone.setAttribute("id","icon_phone");
	icon_password_secret.setAttribute("id","icon_password_secret");
	icon_password_confirm.setAttribute("id","icon_password_confirm_2");
}


//注册页面验证号码长度
//Ajax检验是否被注册过
//检验两次密码是否一致

//滑动登录


var isTouch = false; //标志位，是否点击
var startX = 0; //鼠标点击的偏移量，实现平滑移动的保证

//Ajax传送X值给后端验证滑块是否到位
//Ajax传送图片
(function() {
    var touch_bar = document.getElementById("touch_bar");
    var bg_bar = document.getElementById("bg_bar");
    var bg_new = document.getElementById("bg_new");
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
        }
    } 
	
    //设置滑块点击事件,改变标志位，并重置偏移量 
	
    touch_bar.onmousedown = function(ev) {
        isTouch = true;
        startX = event.clientX;
    }
	
    //设置滑块鼠标点击取消事件,改变标志位，重置偏移量 
	
    touch_bar.onmouseup = function(ev) {
        isTouch = false;
        startX = 0;
        touch_bar.style.left = "0px";
        bg_new.style.width = "0px";
    }
	
    //设置滑块鼠标移出事件,改变标志位，并重置偏移量

    touch_bar.onmouseout = function(ev) {
        isTouch = false;
        startX = 0;
        touch_bar.style.left = "0px";
        bg_new.style.width = "0px";
		document.getElementById("check_img").style.display = "none";
    }
	
	touch_bar.onmouseenter = function(ev) {
		document.getElementById("check_img").style.display = "block";
	}
 
    //重置偏移量
    touch_bar.style.left = "0px";
    bg_new.style.width = "0px";
})();



//insertAfter()函数是让元素节点可以插在另一个元素节点之后
function insertAfter(newElement,targetElement){
	var parent = targetElement.parseNode;
	if(parent.lastchild == targetElement){
		parent.appenChild(newElement);
	}else{
		//nextSbling函数为当前元素的下一个元素
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}



//电话号码长度验证

/* var text = document.querySelector("#text");
var textval = text.value;

//获取数组长度
function getStrLength(strValue) {
    var strLength = strValue.length;
        for (var j = 0; j < strValue.length; j++) {
            if (strValue <= 11) {
                strLength++;
            }
        }
    return strLength;
}
var number = getStrLength(textval); */




//Ajax发送短信验证码

//发送验证码倒计时
var getCode = document.querySelector("#get");
var countTime = 60;//时间为60秒
var interval;
var click = false;
function setTime() {
	if(countTime > 0){
		countTime--;
		getCode.innerHTML = countTime + "秒后重新发送";
	}else if(countTime == 0){
		countTime = 60;
		getCode.innerHTML = "获取验证码";
		clearInterval(interval);
		click = false;
	}
}

//获取验证码后改变字体
getCode.onclick = function() {
	if(!click) {
		interval = setInterval("setTime()", 1000);
		click = true;
	}
}
//Ajax检查验证码填写与发送的是否一样