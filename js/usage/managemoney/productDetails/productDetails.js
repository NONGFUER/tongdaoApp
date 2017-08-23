var InterValObj; //timer变量，控制时间  
var count = 5; //间隔函数，1秒执行  
var curCount; //当前剩余秒数  

$(".body_title").unbind("tap").bind("tap", function() {
	console.log($(this).siblings('ul'));
	$(this).children('.jiantou').toggleClass('shangjiantou');
	$(this).siblings('ul').toggle();
})
$(".dianji").unbind("tap").bind("tap", function() {
	sendMessage();
})

function sendMessage() {　
	curCount = count;　　 //设置button效果，开始计时  
	$("#btnSendCode").attr("disabled", "true");
	$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次  
	　　 //向后台发送处理数据  
	$.ajax({　　
		type: "POST", //用POST方式传输  
		　　dataType: "text", //数据格式:JSON  
		　　url: 'Login.ashx', //目标地址  
		　　data: "dealType=" + dealType + "&uid=" + uid + "&code=" + code,
		　　error: function(XMLHttpRequest, textStatus, errorThrown) {},
		　　success: function(msg) {}
	});
}

function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器  
		$("#btnSendCode").removeAttr("disabled"); //启用按钮  
		$("#btnSendCode").val("重新发送验证码");
	} else {
		curCount--;
		$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
	}
}