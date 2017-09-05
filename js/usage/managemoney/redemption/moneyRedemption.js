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
					commodityCommId = $(this).attr('commoditycommid');
					orderNo = $(this).attr('orderno');
					policyNo = $(this).attr("policyno");
					insureNo = $(this).attr('insureno');
				
					var reqData = {
						"head": {
							"userCode": userCode,
							"channel": "01",
							"transTime": $.getTimeStr(),
							"transToken": transToken
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
var userCode = "",
	title = "",
	commdityCommId = "",
	customerId = "",
	transToken = "";
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	userCode = urlParm.userCode;
	title = urlParm.title;
	commdityCommId = urlParm.commodityComId;

	customerId = urlParm.customerId;
	transToken = urlParm.transToken;
	list(userCode, transToken, commdityCommId, customerId);
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
//		var commodityCommId = $(this).attr('commoditycommid');
//		orderNo = $(this).attr('orderno');
//		policyNo = $(this).attr("policyno");
//		insureNo = $(this).attr('insureno');

		var reqData = {
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo": insureNo,
			"title": title,
			"customerId": customerId,
			"commodityCommId": commodityCommId
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = "policyRedemption.html?jsonKey=" + jsonStr;
	}
}

function mylist(userCode, transToken, commdityCommId, customerId) {
	list(userCode, transToken, commdityCommId, customerId);
}

function list(userCode, transToken, commdityCommId, customerId) {
	var reqData = {
		"body": {
			"commdityCommId": commdityCommId,
			"customerId": customerId
		},
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'moneyManage/redemptionList.do';
	$.reqAjaxsFalse(url, reqData, redemptionList);
}