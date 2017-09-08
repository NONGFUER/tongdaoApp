mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
/*var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '138000000';
var customerId='20';*/
var vm = new Vue({
	el: '#list',
	data: {
		banck:{},
		diqu:"",
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
	if(data.status_code=='000000'){
		if(data.returns!=null&&data.returns!=""){
			vm.banck=data.returns;
			vm.diqu=vm.banck.provinceName+'-'+vm.banck.cityname
		}
	}else if(data.status_code=='123456'){
		modelAlert(data.status_message,'',lognCont);
	}else{
		modelAlert(data.status_message);
	}
}

/*登录失效*/
function lognCont() {
	loginControl();
}

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function backlast() {
	sysback();
}