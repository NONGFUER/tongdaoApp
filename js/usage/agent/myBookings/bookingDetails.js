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
		objectlist: {
			yuyueOrderinfo: {},
			commodityComModuleList: {}
		},
	}
})
$(function() {
	if(roleType == '02') {
		$('.btn').show();
	} 
	var reqData = {
		"body": {
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"yuyuePhone": yuyuePhone,
			"yuyueName": yuyueName,
			"yuyueNo": yuyueNo
		},
		"head": {
			"channel": "01",
			"userCode": "",
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'yuyueOrder/getYuyueOrderDetail.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxs(url, reqData, getYuyueOrderDetail);
	$(".btn").unbind("tap").bind("tap", function() {
		var sendData = {
			"customerPhone": userCode,
			"roleType": roleType,
			"customerId": customerId,
			"commodityCombinationId":commodityCombinationId,
			"yuyuePhone":yuyuePhone,
			"yuyueName":yuyueName,
			"yuyueNo":yuyueNo,
			"transToken": transToken,
			"userCode": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": '客户经理'
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/agent/myBookings/myManager.html?jsonKey=" + jsonStr;
	})
})

function getYuyueOrderDetail(data) {
	console.log(data)
	vm.objectlist = data.returns;
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	/*var sendData = {
		"customerPhone": userCode,
		"roleType": roleType,
		"customerId": customerId,
		"transToken": transToken,
		"userCode": userCode,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
		"title": '我的预约'
	};*/
	urlParm.leftIco='1';
	urlParm.rightIco='0';
	urlParm.downIco='0';
	urlParm.title='我的预约';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agent/myBookings/subscribeList.html?jsonKey=" + jsonStr;
}