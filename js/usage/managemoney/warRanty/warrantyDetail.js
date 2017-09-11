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
			bxPolicyFinance: {}
		},
		Objecbody: null,
		baozhang: null,
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
			"policyNo": policyNo,
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		mui.alert('确认');
		/*接口请求位子*/
		var reqData = {
				"head": {
					"userCode": userCode,
					"channel": "01",
					"transTime": $.getTimeStr(),
					"transToken": transToken
				},
				"body": {
					"orderNo": orderNo,
					"customerId": customerId,
					"policyNo":policyNo
				}
			}
			var url = base.url + 'hkRedemption/getReview.do';
			console.log("页面初始化，发送请求报文--");
			$.reqAjaxsFalse(url, reqData, getReview);
	})

	
	function getReview(data){
		console.log(data)
	}
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = base.url + vm.Objectitle.bxPolicyFinance.policyForm;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var commodityCombinationId = vm.Objectitle.bxPolicyFinance.commodityCombinationId;
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
	}else if(data.statusCode == '123456'){
		modelAlert(data.statusMessage, '', lognCont);
	}else{
		modelAlert(data.statusMessage);
	}
}
/*退保试算*/
function getRedemption(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		var reqData = {
			"orderNo": data.returns.redemptionDto.orderNo,
			"insureNo": insureNo,
			"policyNo": data.returns.redemptionDto.policyNo,
			"customerId": customerId,
			"commodityComId": commodityComId,
			"userCode": data.userCode,
			"transTime": "",
			"channel": "01",
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/policyCancellation.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}




/*页面信息*/
function policyQueryListInfo(data) {
	console.log(data)
	vm.Objectitle = data.returns;
}
/*退保试算*/
function getRedemption(data) {
	console.log(data);
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		var reqData = {
			"orderNo": data.returns.redemptionDto.orderNo,
			"insureNo": insureNo,
			"policyNo": data.returns.redemptionDto.policyNo,
			"customerId": customerId,
			"commodityComId": commodityComId,
			"userCode": data.userCode,
			"transTime": "",
			"channel": "01",
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/policyCancellation.html?jsonKey=" + jsonStr;
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
	}
	/*else if($('.baozhang').html() == '04') {
		$('.baozhang').html('核保中');
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
	} else if($('.baozhang').html() == '05') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('核保成功');
	} else if($('.baozhang').html() == '06') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('支付失败');
	} else if($('.baozhang').html() == '07') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('支付成功');
	} else if($('.baozhang').html() == '08') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('承保处理中');
	} else if($('.baozhang').html() == '09') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('待生效');
	} else if($('.baozhang').html() == '10') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('承保成功');
	} else if($('.baozhang').html() == '11') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('承保失败');
	} else if($('.baozhang').html() == '12') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('已退保');
	} else if($('.baozhang').html() == '99') {
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('.baozhang').html('已失效');
	}*/
	if($('.baozhang').html() != '03' && $('.baozhang').html() != '已领取') {
		mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
			var url = base.url + 'hkRedemption/getRedemption.do';
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
					"customerId": customerId
				}
			}
			$.reqAjaxsFalse(url, reqData, getRedemption);
		})
	}
	bankweihao();
	$('.phoneyin').html(phoneyin($('.phoneyin').html()));
}

function backlast() {
	var sendData = {
		"userCode": userCode,
		"commodityComId": commodityComId,
		"flag": '',
		"pageNo": '',
		"customerId": customerId,
		"transToken": transToken,
		"title": '保单列表',
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '1',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyList.html?jsonKey=" + jsonStr;
}
/*登录失效*/
function lognCont() {
	loginControl();
}