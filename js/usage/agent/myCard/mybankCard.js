mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
/*var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '138000000';
var customerId='20';*/
var vm = new Vue({
	el: '#card_scroll',
	data: {
		banck:{},
	}
})

$(function() {
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getCertificationBankCard.do';
	$.reqAjaxsFalse(url, reqData, getCertificationBankCard);
})

function getCertificationBankCard(data) {
	console.log(data);
}

/*登录失效*/
function lognCont() {
	loginControl();
}

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});
