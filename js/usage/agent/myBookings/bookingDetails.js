/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	customerId = urlParm.customerId,
	commodityCombinationId = urlParm.commodityCombinationId,
	yuyuePhone = urlParm.yuyuePhone,
	yuyueName = urlParm.yuyueName,
	transToken = urlParm.transToken,
	yuyueNo = urlParm.yuyueNo,
	userCode = urlParm.userCode;

console.log(urlParm);
var vm = new Vue({
	el: '#list',
	data: {
		objectlist: {
			yuyueOrderinfo:{},
			commodityComModuleList:{}
		},
	}
})
$(function() {
	var reqData = {
		"body": {
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"yuyuePhone": yuyuePhone,
			"yuyueName":yuyueName,
			"yuyueNo":yuyueNo
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
	$.reqAjaxsFalse(url, reqData, getYuyueOrderDetail);
	
})
function getYuyueOrderDetail(data){
	console.log(data)
	vm.objectlist=data.returns;
}
