/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	orderNo = urlParm.body.orderNo,
	insureNo = urlParm.body.insureNo,
	commmodityComId = urlParm.body.commmodityComId,
	policyNo = urlParm.body.policyNo,
	transToken = urlParm.transToken,
	title = urlParm.title,
	customerId = urlParm.customerId,
	userCode = urlParm.head.userCode;

var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {

			})
		})
	}
})
$(function() {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"commodityCommId": commmodityComId,
			"orderNo": orderNo,
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/redemptionTrial.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, redemptionTrial);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', tuibao)
})

function redemptionTrial(data) {
	console.log(data);
	vm.Objectlist = data.returns.hKCalculate;
}
/*退保1*/
function tuibao() {
	var reqData = {
		"body": {
			"orderNo": orderNo,
			"insureNo": insureNo,
			"policyNo": policyNo,
			"customerId": customerId
		},
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'hkRedemption/getRedemptionConfirmation.do';
	$.reqAjaxsFalse(url, reqData, getRedemptionConfirmation);
}
/*退保2*/
function getRedemptionConfirmation(data) {
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		mui.alert(data.statusMessage);
		mui(".man-div-body-ul_li_div_btn").off("tap", "#huifang", tuibao);
		$('#huifang').addClass('huisebtn');
	}
}
/*返回*/
function backlast() {
	var sendData = {
		"userCode": userCode,
		"channel": "01",
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"orderNo": orderNo,
		"policyNo": policyNo,
		"insureNo": insureNo,
		"customerId": customerId,
		"title": title,
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyDetail.html?jsonKey=" + jsonStr;
}