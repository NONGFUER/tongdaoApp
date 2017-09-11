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
	$.reqAjaxsFalse(url, reqData, getCustomerAndAgentInfo);

})

function getCustomerAndAgentInfo(data) {
	console.log(data)
	if(data.statusCode=='000000'){
		vm.objectlist = data.returns;
	}else if(data.statusCode=='123456'){
		modelAlert(data.statusMessage,'',lognCont);
	}else{
		modelAlert(data.sstatusMessage);
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}
callSendMessage(phone)
function backlast() {
	var sendData = {
		"customerPhone": userCode,
		"roleType": roleType,
		"customerId": customerId,
		"transToken": transToken,
		"userCode": userCode,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
		"title": '我的预约'
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/agent/myBookings/subscribeList.html?jsonKey=" + jsonStr;
}