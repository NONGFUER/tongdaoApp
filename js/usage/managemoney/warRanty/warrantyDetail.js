mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	cxflag = urlParm.cxflag,
	title = urlParm.title,
	orderNo = urlParm.orderNo;
var channel = urlParm.channel;
var commodityComId = urlParm.commodityComId;
var epolicyUrl = '';
if(typeof(commodityComId) == 'undefined') {
	commodityComId = '';
}
if(channel == '' || channel == null) {
	channel = '01';
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			bxPolicyFinance: {},
		},
		Objecbody: null,
		baozhang: null,
		returnVisit: {},
		commodityComId: "",
		channel: "",
		insureNo: '',
	},
})
$(function() {
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	vm.insureNo = insureNo;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
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

	/*	function getReview(data) {
			console.log(data)
		}*/
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = vm.Objectitle.bxPolicyFinance.policyForm;

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
	$("#epolicyShare").unbind("tap").bind("tap", function() {
		if(!isWeixin()) {
			shareHandle()
		} else {
			wechatEpolicyShare()
		}
	})
	$("#guanbi").unbind('tap').bind("tap", function() {
		$('#weixin').hide()
	})
	vm.commodityComId = commodityComId;
	vm.channel = channel;
})

/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		console.log(data)
		vm.Objectitle = data.returns;
		vm.returnVisit = data.returns.bxPolicyFinance.returnVisit;
		epolicyUrl = vm.Objectitle.bxPolicyFinance.policyForm;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	vm.$nextTick(function() {
		chuli();
	})
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
			"channel": channel,
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
/*退保试算*/
/*function getRedemption(data) {
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
			"channel": channel,
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/policyCancellation.html?jsonKey=" + jsonStr;
	}
}*/
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
	}
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}
	if($('.baozhang').html() != '03' && $('.baozhang').html() != '已领取') {
		mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
			var url = base.url + 'hkRedemption/getRedemption.do';
			var reqData = {
				"head": {
					"userCode": userCode,
					"channel": channel,
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
		mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
			/*接口请求位子*/
			if(vm.returnVisit == '0' && $('.baozhang').html() != '已领取') {
				var reqData = {
					"userCode": userCode,
					"customerId": customerId,
					"transToken": transToken,
					"insurePhone": userCode,
					"policyNo": policyNo,
					"orderNo": orderNo,
					"leftIco": '1',
					"rightIco": '0',
					"downIco": '0',
					"title": title,
				}
				var jsonStr = UrlEncode(JSON.stringify(reqData));
				window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/returnVisit.html?jsonKey=" + jsonStr;
			} else {
				$('#huifang').addClass('huisebtn');
			}
		})
	}
	bankweihao();
	$('.phoneyin').html(phoneyin($('.phoneyin').html()));
}

function backlast() {
	if(commodityComId != "" && channel == '01' && cxflag != '2' && cxflag != '3' && cxflag != '10') {
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
	} else {
		if(channel == '01' && cxflag == '2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyList.html?jsonKey=" + jsonStr;
		} else if(channel == '02' && cxflag == '2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyListWeChat.html?jsonKey=" + jsonStr;
		} else if(cxflag == '3') {
			urlParm.title = '我的出单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/mysingle.html?jsonKey=" + jsonStr;
		} else if(cxflag == '10') {
			urlParm.title = '我的出单';
			urlParm.downIco = '0';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/teaMmysingle.html?jsonKey=" + jsonStr;
		}
	}

}
/*登录失效*/
function lognCont() {
	loginControl();
}

/*电子保单分享*/
function shareHandle() {
	var title = '同道保险电子保单';
	var desc = '点击查看详情';
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	var flag = '2';
	var shareurl = epolicyUrl;
	urlParm.picUrl = epolicyUrl;
	urlParm.shareurl = epolicyUrl;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink = base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey=" + jsonStr;
	shareMethod(shareurl, title, desc, flag, picUrl, twolink);
};

function wechatEpolicyShare() {
	$("#weixin").show()
	var title = '同道保险电子保单';
	var desc = '点击查看详情';
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	var epolicyObj = {
		"directUrl": epolicyUrl
	}
	var jsonStr = UrlEncode(JSON.stringify(epolicyObj));
	var shareUrl = base.url + "tongdaoApp/html/share/epolicyShare.html?jsonKey=" + jsonStr;
	wechatShare(title, desc, picUrl, shareUrl)
}