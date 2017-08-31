/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	insurePhone = urlParm.insurePhone,
	riskSupportAbility = urlParm.riskSupportAbility;
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
					console.log(1);
					var commodityId=$(this).attr('commodityid');
					var bankName = $(this).attr('bankName');
					var bankCode = $(this).attr('bankCode');
					var dayLimit = $(this).attr('dayLimit');
					var param = {
						"userCode": userCode,
						"commodityCombinationId": commodityCombinationId,
						"insurePhone": insurePhone,
						"riskSupportAbility": riskSupportAbility,
						"bankName": bankName,
						"bankCode":bankCode,
						"dayLimit":dayLimit,
						"commodityId":commodityId
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
			"commodityId": "7",
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