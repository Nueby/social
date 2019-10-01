var option = 0;		//选择  0表示个人   1表示交友

//获取ID所对应的元素
function $id(id) {
	return document.getElementById(id);
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

function changeSingle() {
	option = 0;
	changeIcon();
}

function changeDouble() {
	option = 1;
	changeIcon();
}

