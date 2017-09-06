/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	insurePhone = urlParm.insurePhone,
	titles = urlParm.titles,
	title=urlParm.title,
	channel=urlParm.channel,
	transTime=urlParm.transTime,
	transToken=urlParm.transToken,
	customerId=urlParm.customerId,
	commodityId=urlParm.commodityId,
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
				$(".banklist").unbind("tap").bind("tap", function() {
					var commodityId = $(this).attr('commodityid');
					var bankName = $(this).attr('bankName');
					var bankCode = $(this).attr('bankCode');
					var dayLimit = $(this).attr('dayLimit');
					var param = {
							"userCode": userCode,
							"channel": "01",
							"transTime": $.getTimeStr(),
							"transToken": transToken,
							"commodityCombinationId": commodityCombinationId,
							"customerId": customerId,
							"commodityId": commodityId,
							"bankCode":bankCode,
							"dayLimit":dayLimit,
							"title":titles,
							"bankName":bankName,
							"pieces":pieces
					}
					var jsonStr = UrlEncode(JSON.stringify(param));
					window.location.href = "../messageFillout/messageFillout.html?jsonKey=" + jsonStr;
				})
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
	$.reqAjaxsFalse(url, reqData, getBank);
})

function getBank(data) {
	vm.Objectitle = data.returns.list;
	console.log(vm.Objectitle)
}