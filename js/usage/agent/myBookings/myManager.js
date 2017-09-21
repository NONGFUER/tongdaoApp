/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	customerId = urlParm.customerId,
	commodityCombinationId = urlParm.commodityCombinationId,
	yuyuePhone = urlParm.yuyuePhone,
	yuyueName = urlParm.yuyueName,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	yuyueNo = urlParm.yuyueNo,
	userCode = urlParm.userCode;

console.log(urlParm);
var vm = new Vue({
	el: '#list',
	data: {
		objectlist: {},
		teamCodeMobile: {},
	}
})
$(function() {
	var reqData = {
		"body": {
			"customerId": customerId
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}

	var url = base.url + 'customerBasic/getCustomerAndAgentInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxs(url, reqData, getCustomerAndAgentInfo);
	$(".phone-button").unbind("tap").bind("tap", function() {
		var phone = $(this).attr('phone');
		callService(phone);
	})
	$(".message-button").unbind("tap").bind("tap", function() {
		var phone = $(this).attr('phone');
		callSendMessage(phone)
	})
})

function getCustomerAndAgentInfo(data) {
	console.log(data)
	if(data.statusCode == '000000') {
		vm.objectlist = data.returns.agent;
		vm.teamCodeMobile = vm.objectlist.teamCodeMobile;
		if(vm.teamCodeMobile != null && vm.teamCodeMobile != '') {
			getTouxiang();
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.sstatusMessage);
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function getTouxiang() {
	$.ajax({
		type: "get",
		url: base.url + "customerBasic/getAppImage.do",
		data: "userName=" + vm.teamCodeMobile,
		success: function(data) {
			if(data) {
				$(".tou").attr("src", base.url + "customerBasic/getAppImage.do?userName=" + vm.teamCodeMobile);
			} else {
				$(".tou").attr("src", "../../../image/account/tou.png");
			}
		},
		error: function() {
			$(".tou").attr("src", "../../../image/account/tou.png");
		}
	})
}

function backlast() {
	urlParm.leftIco='1';
	urlParm.rightIco='0';
	urlParm.downIco='0';
	urlParm.title='预约详情';
	/*var sendData = {
		"customerPhone": userCode,
		"roleType": roleType,
		"customerId": customerId,
		"transToken": transToken,
		"userCode": userCode,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
		"title": '预约详细'
	};
	*/
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agent/myBookings/bookingDetails.html?jsonKey=" + jsonStr;
}