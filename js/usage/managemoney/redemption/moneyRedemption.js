var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				chuli();
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
	},
	watch: {
		Objectlist: function(val) {
			this.$nextTick(function() {
				$(function() {
					chuli();
				})
			})
		}
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
	commdityCommId = urlParm.commodityComId;
	customerId = urlParm.customerId;
	transToken = urlParm.transToken;
	list(userCode, transToken, commdityCommId, customerId);
	mui('.man-div-body-ul ').on('tap', '.man-div-body-ul_li', function() {

	})
})

function redemptionList(data) {
	if(data.statusCode == '000000') {
		console.log(data);
		vm.Objectlist = data.returns.list;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function getRedemption(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		var reqData = {
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo": insureNo,
			"title": title,
			"customerId": customerId,
			"commodityCommId": commodityCommId,
			"userCode":userCode,
			"transToken":transToken,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = "policyRedemption.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function mylist(userCode, transToken, customerId, commdityCommId) {
	userCode = userCode;
	transToken = transToken;
	commdityCommId = commdityCommId;
	customerId = customerId;
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
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}

function chuli() {
	$('.baozhang').each(function() {
		if($(this).html() == '11') {
			$(this).attr('class', 'baozhang dai');
			$(this).html('待生效');
		} else if($(this).html() == '2') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('保障中');
		} else if($(this).html() == '4') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('已领取');
		} else if($(this).html() == '6') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('已失效');
		}
	})
}