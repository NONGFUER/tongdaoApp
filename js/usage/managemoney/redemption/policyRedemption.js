var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
			hKCalculate: {},
			huisebtn: {},
		},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				bankweihao()
			})
		})
	}
})
var commodityCommId = "",
	title = "",
	customerId = "",
	transToken = "",
	orderNo = "",
	userCode = "";
insureNo = "";
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	commodityCommId = urlParm.commodityCommId;
	title = urlParm.title;
	insureNo = urlParm.insureNo;
	customerId = urlParm.customerId;
	userCode = urlParm.userCode;
	transToken = urlParm.transToken;
	orderNo = urlParm.orderNo;
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": $.getTimeStr(),
			"transToken": transToken,
		},
		"body": {
			"commodityCommId": commodityCommId,
			"orderNo": orderNo,
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/redemptionTrial.do';
	$.reqAjaxsFalse(url, reqData, redemptionTrial);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		if(vm.huisebtn != '1') {
			var reqData = {
				"head": {
					"channel": "01",
					"userCode": userCode,
					"transToken": transToken,
					"transTime": $.getTimeStr(),
				},
				"body": {
					"orderNo": orderNo,
					"policyNo": vm.Objectlist.hKCalculate.policyNo,
					"insureNo": insureNo,
					"customerId": customerId
				}
			}
			var url = base.url + 'hkRedemption/getRedemption.do';
			$.reqAjaxsFalse(url, reqData, getRedemption);
		}
	})
})

function redemptionTrial(data) {
	console.log(data);
	vm.Objectlist = data.returns;
}
/*赎回试算*/
function getRedemption(data) {
	if(data.statusCode == '000000') {
		var reqData = {
			"body": {
				"orderNo": orderNo,
				"insureNo": insureNo,
				"policyNo": vm.Objectlist.hKCalculate.policyNo,
				"customerId": customerId
			},
			"head": {
				"userCode": userCode,
				"transTime": $.getTimeStr(),
				"transToken": transToken,
				"channel": "01"
			}
		}
		var url = base.url + 'hkRedemption/getRedemptionConfirmation.do';
		$.reqAjaxsFalse(url, reqData, getRedemptionConfirmation);
	} else if(data.statusCode == "123456") {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*退保赎回*/
function getRedemptionConfirmation(data) {
	if(data.statusCode == "000000") {
		modelAlert(data.statusMessage);
		vm.huisebtn = '1';
		$('#huifang').attr('style', 'background-color: #999;')
	} else if(data.statusCode == "123456") {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}

/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}
/*返回*/
function backlast() {
	var sendData = {
		"commodityComId": commodityCommId,
		"customerId": customerId,
		"userCode": userCode,
		"channel": "01",
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"title": title,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '1',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/redemption/moneyRedemption.html?jsonKey=" + jsonStr;
}