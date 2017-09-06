mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	commodityComId = urlParm.commodityComId,
	customerId = urlParm.customerId,
	title = urlParm.title,
	orderNo = urlParm.orderNo;
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {}
	}
})
$(function() {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
})
/*页面信息*/
function policyQueryListInfo(data) {
	console.log(data)
	vm.Objectitle = data.returns;
}

function backlast() {
	var sendData = {
		"userCode": userCode,
		"commodityComId": commodityComId,
		"flag": '',
		"pageNo": '',
		"customerId": customerId,
		"transToken": transToken,
		"title": '保单列表',
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '1',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyList.html?jsonKey=" + jsonStr;
}