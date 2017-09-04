/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;*/
var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';
var vm = new Vue({
	el: '#list',
	data: {
		objectlist: {},
	}
})

$(function() {
	var reqData = {
		"body": {
			"loggingCustomerId":userCode
		},
		"head": {
			"channel": "01",
			"userCode": "",
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getCountMyTeam.do';
	console.log("页面初始化，发送请求报文--");
	console.log(urlParm);
	$.reqAjaxsFalse(url, reqData, getCountMyTeam);
})

function getCountMyTeam(data) {
	console.log(data.returns.yuyueOrderList);
	//vm.objectlist = data.returns.yuyueOrderList;
}