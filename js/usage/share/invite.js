var shareMobile = getUrlQueryString("mobile");//手机
var cusId		= getUrlQueryString("cusId");//手机
var countdown = 60;
$(function(){
	getNameRequest(cusId);
	getTouxiang();
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
				"type":"101"
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
		modelAlert("恭喜您，成功加入同道保险！");
		$("#checkPhone").val("");
		$("#checkCode").val("");
	}else{
		modelAlert(data.statusMessage);
	}
}

//点击"获取验证码"
function settime() {
	if(countdown == 0) {
		$("#btnSendCode").attr("disabled",false);
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
	$.reqAjaxs( url, sendJson, getNameCallback );
}

function getNameCallback(data){
	if(data.statusCode == "000000"){
		$("#name").text(data.returns.customerBasic.name);
	}else{
		modelAlert(data.statusMessage);
	}
}

function getTouxiang(){
	$.ajax({
		type: "get",
		url: base.url+"customerBasic/getAppImage.do",
		data: "userName="+shareMobile,
		success: function(data){
			if(data){
				$(".touinner").attr("src",base.url+"appUser/getAppImage.do?userName="+shareMobile);
			}else{
				$(".touinner").attr("src","../../image/common/tou.png");
			}		
		   },
		error:function(){
			$(".touinner").attr("src","../../image/account/tou.png");
		}
		});
}