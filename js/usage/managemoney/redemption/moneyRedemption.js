var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				$('.baozhang').each(function() {
					if($(this).html() == '01') {
						$(this).attr('class', 'baozhang dai');
						$(this).html('待生效');
					} else if($(this).html() == '02') {
						$(this).attr('class', 'baozhang bao');
						$(this).html('保障中');
					} else if($(this).html() == '03') {
						$(this).attr('class', 'baozhang yilingqu');
						$(this).html('已领取');
					} else if($(this).html() == '99') {
						$(this).attr('class', 'baozhang yilingqu');
						$(this).html('已失效');
					}
				})
				$(".div_btn").unbind("tap").bind("tap", function() {
					var url = base.url + 'hkRedemption/getRedemption.do';
					var commodityCommId = $(this).attr('commodityCommId');
					var orderNo = $(this).attr('orderNo');
					var policyNo = $(this).attr("policyNo");
					var insureNo = $(this).attr('insureNo');
					var reqData = {
						"head": {
							"channel": "01",
							"userCode": "2835",
							"transTime": ""
						},
						"body": {
							"orderNo": orderNo,
							"policyNo": policyNo,
							"insureNo": insureNo,
							"commodityCommId": commodityCommId
						}
					}
					$.reqAjaxsFalse(url, reqData, getRedemption);
				})

			})
		})
	}
})
$(function() {
	/*获取数据*/
	var userCode = '2835';
	var reqData = {
		"body": {
			"commdityCommId": "4",
			"customerId": "3"
		},
		"head": {
			"userCode": "2835",
			"transTime": "",
			"channel": "01"
		}
	}
	var url = base.url + 'moneyManage/redemptionList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, redemptionList);
	console.log(vm.Objectlist);
})

function redemptionList(data) {
	console.log(data);
	vm.Objectlist = data.returns.list;
}

function getRedemption(data) {
	console.log(data);
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		var commodityCommId = $(this).attr('commodityCommId');
		var orderNo = $(this).attr('orderNo');
		var policyNo = $(this).attr("policyNo");
		var insureNo = $(this).attr('insureNo');
		var reqData = {
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo": insureNo,
			"commodityCommId": commodityCommId
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = "policyRedemption.html?jsonKey=" + jsonStr;
	}
}