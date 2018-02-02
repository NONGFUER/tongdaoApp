/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	insurePhone = urlParm.insurePhone,
	titles = urlParm.titles,
	roleType = urlParm.roleType,
	title = urlParm.title,
	channel = urlParm.channel,
	transTime = urlParm.transTime,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	commodityId = urlParm.commodityId,
	riskSupportAbility = urlParm.riskSupportAbility,
	pieces = urlParm.pieces;

var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			list: {},
			backimg: "",
		},
	},
})

$(function() {
	var reqData = {
		"head": {
			"channel": channel,
			"userCode": userCode,
			"transTime": $.getTimeStr(),
		},
		"body": {
			"commodityId": "49",
			"flag": "1"
		}
	}
	var url = base.url + 'klBasic/getklBank.do';
	$.reqAjaxs(url, reqData, getBank);
})

function getBank(data) {
	var datas = new Array();
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns.list;
		mui('#list').on('tap', '.banklist', function() {
			var bankName = $(this).attr('bankname');
			var bankCode = $(this).attr('bankcode');
			var dayLimit = $(this).attr('dayLimit');
			urlParm.bankName = bankName;
			urlParm.bankCode = bankCode;
			urlParm.dayLimit = dayLimit;
			urlParm.title = titles;
			urlParm.leftIco = '1';
			urlParm.rightIco = '0';
			urlParm.downIco = '0';
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = "../messageFillout/cornucopiaFillout.html?jsonKey=" + jsonStr;
		})
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*返回*/
function backlast() {
	urlParm.title = titles;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/sunshineFillout.html?jsonKey=" + jsonStr;
}