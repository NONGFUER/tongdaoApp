mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	commodityComId = urlParm.commodityComId,
	customerId = urlParm.customerId,
	title = urlParm.title,
	orderNo = urlParm.orderNo;
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			financeOrder: {},
		},
		Objecbody: null,
		baozhang: null,
		returnVisit: {},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				chuli();
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
$(function() {
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"orderNo": orderNo,
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/orderQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}

	function getReview(data) {
		console.log(data)
	}
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		if(vm.Objectitle.financeOrder.policyForm != "" && vm.Objectitle.financeOrder.policyForm != null) {
			window.location.href = base.url + vm.Objectitle.financeOrder.policyForm;
		}
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var commodityCombinationId = vm.Objectitle.financeOrder.commodityCombinationId;
		var reqData = {
			"commodityCombinationId": commodityCombinationId + "",
			"userCode": userCode,
			"customerId": customerId,
			"transToken": transToken,
			"insurePhone": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": title,
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
	})
})
/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		console.log(data)
		vm.Objectitle = data.returns;
		vm.returnVisit = data.returns.financeOrder.returnVisit;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}

function chuli() {
	if($('.baozhang').html() == '11') {
		$('.baozhang').html('待生效')
	} else if($('.baozhang').html() == '2') {
		$('.baozhang').html('保障中')
	} else if($('.baozhang').html() == '4') {
		$('.baozhang').html('已领取')
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('#huifang').addClass('huisebtn');
		vm.returnVisit == '1';
	} else if($('.baozhang').html() == '01') {
		$('.baozhang').html('未提交核保')
	} else if($('.baozhang').html() == '02') {
		$('.baozhang').html('已过期')
	} else if($('.baozhang').html() == '03') {
		$('.baozhang').html('核保失败')
	} else if($('.baozhang').html() == '04') {
		$('.baozhang').html('核保中')
	} else if($('.baozhang').html() == '05') {
		$('.baozhang').html('核保成功')
	} else if($('.baozhang').html() == '06') {
		$('.baozhang').html('支付失败')
	} else if($('.baozhang').html() == '07') {
		$('.baozhang').html('支付成功')
	} else if($('.baozhang').html() == '08') {
		$('.baozhang').html('承保处理中')
	} else if($('.baozhang').html() == '09') {
		$('.baozhang').html('待生效')
	} else if($('.baozhang').html() == '10') {
		$('.baozhang').html('承保成功')
	} else if($('.baozhang').html() == '11') {
		$('.baozhang').html('承保失败')
	} else if($('.baozhang').html() == '12') {
		$('.baozhang').html('已退保')
	} else if($('.baozhang').html() == '13') {
		$('.baozhang').html('支付中')
	} else if($('.baozhang').html() == '99') {
		$('.baozhang').html('已失效')
	}
	bankweihao();
	$('.phoneyin').html(phoneyin($('.phoneyin').html()));
}

function backlast() {
	var sendData = urlParm.urlParm;
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/account/myOrder/allOrder.html?jsonKey=" + jsonStr;
}
/*登录失效*/
function lognCont() {
	loginControl();
}