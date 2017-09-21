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
			list: {}
		},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				/*$(".banklist").unbind("tap").bind("tap", function() {
					var commodityId = $(this).attr('commodityid');
					var bankName = $(this).attr('bankName');
					var bankCode = $(this).attr('bankCode');
					var dayLimit = $(this).attr('dayLimit');
					urlParm.commodityId = commodityId;
					urlParm.bankName = bankName;
					urlParm.bankCode = bankCode;
					urlParm.dayLimit = dayLimit;
					urlParm.leftIco = '1';
					urlParm.rightIco = '0';
					urlParm.downIco = '0';
					var jsonStr = UrlEncode(JSON.stringify(param));
					window.location.href = "../messageFillout/messageFillout.html?jsonKey=" + jsonStr;
				})*/
			})
		})
	}
})

$(function() {
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": ""
		},
		"body": {
			"commodityId": commodityId,
			"flag": "1"
		}
	}
	var url = base.url + 'investmentLinkedInsurance/getBank.do';
	$.reqAjaxs(url, reqData, getBank);

})

function getBank(data) {
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns.list;
		mui('#list').on('tap', '.banklist', function() {
			var commodityId = $(this).attr('commodityid');
			var bankName = $(this).attr('bankName');
			var bankCode = $(this).attr('bankCode');
			var dayLimit = $(this).attr('dayLimit');
			urlParm.commodityId = commodityId;
			urlParm.bankName = bankName;
			urlParm.bankCode = bankCode;
			urlParm.dayLimit = dayLimit;
			urlParm.title=titles;
			urlParm.leftIco = '1';
			urlParm.rightIco = '0';
			urlParm.downIco = '0';
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = "../messageFillout/messageFillout.html?jsonKey=" + jsonStr;
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