//var shareMobile = getUrlQueryString("mobile");//手机
var cusId		= '1038'//getUrlQueryString("cusId");//手机
var shareMobile = "";
var countdown = 60;
var validateCode = "q";
$(function(){
	resize();
	window.addEventListener("resize", function () {
		resize();
	});	
	$(".touinner").attr("src","../../image/share/invite/tou.png");
	getNameRequest(cusId);
	$("#btnSendCode").unbind("tap").bind("tap",function(){		
		var mobile = $("#checkPhone").val();
		if($.isNull(mobile)){
			modelAlert("请输入您的手机号！");
			return false;
		}else{
			settime();
			sendMessageRequest(mobile);
		}
		
	});
	$(".invite_button").unbind().bind("tap",function(){
		var mobile = $("#checkPhone").val();
		var checkCode = $("#checkCode").val();
		if($.isNull(mobile)){
			modelAlert("请输入您的手机号！");
			return false;
		}
		if($.isNull(checkCode)){
			modelAlert("请输入您的验证码！");
			return false;
		}
		if( validateCode != checkCode ){
			modelAlert("验证码不符！");
			$("#checkCode").val("");
			return false;
		}
		if($(".invite-font img").hasClass("on")){
			inviteRequest(mobile,shareMobile)
		}
		
	})
	$(".invite-font img").unbind("tap").bind("tap",function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on")
			$(this).attr("src","../../image/share/invite/hgou.png");
			$(".invite_button img").attr("src","../../image/share/invite/invite_button1.png");
		}else{
			$(this).addClass("on")
			$(this).attr("src","../../image/share/invite/lgou.png");
			$(".invite_button img").attr("src","../../image/share/invite/invite_button.png");
		}
	});
	$(".xieyi").unbind("tap").bind("tap",function(){
		window.location.href = base.url + "tongdaoApp/html/agreement/agreeProtocol.html"
	});
});

//发送短信接口
function sendMessageRequest( mobile ){	
	var url = base.url + "commonMethod/GetRegCode.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : mobile,
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"userName":mobile,
				"type":"1101"
			}
	}
	$.reqAjaxs( url, sendJson, sendMessageCallback );
}

//发送短信回调
function sendMessageCallback(data){
	if(data.statusCode == "000000"){		
			validateCode = data.returns.validateCode;	
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}

//客户邀请

function inviteRequest(mobile,shareMobile){
	var url = base.url + "register/userRegister.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : mobile,
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"userName":mobile,
				"passWord":"",
				"sourceFlag":"2",
				"inviterPhone":shareMobile
			}
	}
	$.reqAjaxs( url, sendJson, inviteCallback );
}


function inviteCallback(data){
	if( data.statusCode == "000000" ){
		$("#checkPhone").val("");
		$("#checkCode").val("");
		$("#btnSendCode").removeAttr("disabled");
		$("#btnSendCode").val("发送验证码");
		countdown = 0;
		modelAlert("恭喜您，注册成功，立即下载APP,开启同道保险。","",toDownload);				
	}else if(data.statusCode == "000001"){
		modelAlert("您已注册同道保险，请下载APP直接登录。","",toDownload);
	}else{
		modelAlert(data.statusMessage,"",reload);
	}
}

//点击"获取验证码"
function settime() {
	if(countdown == 0) {
		$("#btnSendCode").removeAttr("disabled");
		$("#btnSendCode").val("发送验证码");
		countdown = 60;
		return false;
	} else {
		$("#btnSendCode").attr("disabled", "disabled");
		$("#btnSendCode").val(countdown + "秒");
		countdown--;
	}
	setTimeout(function() {
		settime()
	}, 1000)
}

//获取姓名
function getNameRequest(cusId){
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : "",
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"customerId":cusId
			}
	}
	$.reqAjaxsFalse( url, sendJson, getNameCallback );
}

function getNameCallback(data){
	if(data.statusCode == "000000"){		
		shareMobile = data.returns.customerBasic.userName;
		//getTouxiang(shareMobile)
	}else{
		modelAlert(data.statusMessage);
	}
}

/*function getTouxiang(shareMobile){
	$.ajax({
		type: "get",
		url: base.url+"customerBasic/getAppImage.do",
		data: "userName="+shareMobile,
		success: function(data){
			if(data){
				$(".touinner").attr("src",base.url+"customerBasic/getAppImage.do?userName="+shareMobile);
			}else{
				$(".touinner").attr("src","../../image/common/tou.png");
			}		
		   },
		error:function(){
			$(".touinner").attr("src","../../image/share/invite/tou.png");
		}
		});
}*/
function reload(){
	window.location.reload(true);
}
function toDownload(){
	window.location.href = base.url + "tongdaoApp/html/share/download/appDownloadXJTest.html";
}

function resize(){
	var cWidth = document.documentElement.clientWidth;
	var calheight = $("#calheight").height()-cWidth*0.12;
	$(".touxiang").css("top",calheight+"px");
	$(".touxiang").css("width",cWidth*0.2);
	$(".touxiang").css("height",cWidth*0.2);
	$(".touxiang").css("padding",cWidth*0.008 +"px 0");
	$(".invite-context").css("margin-top",cWidth*0.1+2 +"px");
}