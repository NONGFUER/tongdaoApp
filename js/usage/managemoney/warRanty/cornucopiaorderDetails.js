mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	channel = urlParm.channel,
	commodityComId = urlParm.commodityComId,
	customerId = urlParm.customerId,
	title = urlParm.title,
	orderNo = urlParm.orderNo;
if(typeof(channel) == 'undefined') {
	channel = '01';
}
var leixing = urlParm.leixing;
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行  
var curCount; //当前剩余秒数
var productFlag = '01';
var epolicyUrl = '';
if(commodityCombinationId = '4') {
	productFlag = '01';
} else if(commodityCombinationId = '5') {
	productFlag = '02';
}

if(userCode) {
	$('.phone').html(phoneyin(userCode));
}
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
		channel: "",
		name: "",
		dianzibaodan: null,
		insurelist: '',
		recognizeelist: '',
	},
})
$(function() {
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"orderNo": orderNo,
			"customerId": customerId + ''
		}
	}
	var url = base.url + 'klBasic/getklOrderInform.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}

	function getReview(data) {
		console.log(data)
	}

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
			"title": vm.name,
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/cornucopiaDetails.html?jsonKey=" + jsonStr;
	})

	$("#liji").unbind("tap").bind("tap", function() {
		var url = base.url + 'insuredkunlun/payCost.do';
		var redata = {
			"head": {
				"userCode": userCode,
				"channel": channel,
				"transTime": $.getTimeStr(),
				"transToken": transToken
			},
			"body": {
				"proposalContNo": insureNo,
				"oldTranNo": orderNo,
			}
		}
		$.reqAjaxs(url, redata, payCost);

		function payCost(data) {
			if(data.statusCode == '000000') {
				var sendData = datalist;
				sendData.commodityCombinationId = commodityCombinationId;
				sendData.comComName = ccName;
				sendData.startPiece = vm.Objectitle.commodityCombination.startPiece;
				sendData.userCode = userCode;
				sendData.customerId = customerId;
				sendData.transToken = transToken;
				var jsonStr = UrlEncode(JSON.stringify(sendData));
				window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/cornucopiapayResult.html?jsonKey=" + jsonStr;
			} else if(data.statusCode == '123456') {
				modelAlert(data.statusMessage, '', lognCont);
			} else {
				modelAlert(data.statusMessage);
			}
		}

	})
	/*发送短信*/
	$(".dianji").unbind("tap").bind("tap", function() {
		sendMessage();
	})
	vm.channel = channel;
	vm.$nextTick(function() {
		chuli();
		$(".baodan").unbind("tap").bind("tap", function() {
			/*正式版使用接口↓*/
			window.location.href = vm.dianzibaodan;
		})
		$("#epolicyShare").unbind("tap").bind("tap", function() {
			if(!isWeixin()) {
				shareHandle()
			} else {
				wechatEpolicyShare()
			}
		})
	})
})

function getinsure(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		var laiyuan = '2'; //1.投保页面,2.订单详情
		$('.note').hide();
		var sendData = {
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken,
			"orderNo": data.returns.orderNo,
			"policyNo": data.returns.policyNo,
			"comComName": vm.Objectitle.commodityCombination.commodityCombinationName,
			"startPiece": vm.Objectitle.financeOrder.prem,
			'title': vm.Objectitle.commodityCombination.commodityCombinationName,
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"commodityId": commodityComId,
			'laiyuan': laiyuan, //页面来源
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/returnVisit.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}

}
/*发送短信*/
function sendMessage() {　
	curCount = count;
	$(".dianji").addClass("mui-disabled");
	$(".dianji").html("60");
	$(".dianji").attr("style", "color:#E0E0E0");
	$(".dianji").html(curCount);
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次  
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"userName": userCode,
			"type": '103',
		}
	};
	var url = base.url + 'commonMethod/GetRegCode.do';
	$.reqAjaxs(url, reqData, GetRegCode);
}
/*点击X关发送短信窗口*/
$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
});
/*验证码倒计时*/
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器  
		$(".dianji").removeClass("mui-disabled"); //启用按钮  
		$(".dianji").attr("style", "color:#333");
		$(".dianji").html("获取验证码");
	} else {
		curCount--;
		$(".dianji").html(curCount);
	}
}
/*发送短信*/
function GetRegCode(data) {
	mui.alert(data.statusMessage);
	ma = data.returns.validateCode;
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}
/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		console.log(data)
		vm.Objectitle = data.returns;
		/*vm.returnVisit = data.returns.financeOrder.returnVisit;
		vm.name = data.returns.commodityCombination.commodityCombinationName;*/
		vm.dianzibaodan = data.returns.financeOrder.epolicyUrl;
		epolicyUrl = vm.dianzibaodan;
		for(i = 0; i < vm.Objectitle.listRiskPartys.length; i++) {
			if(vm.Objectitle.listRiskPartys[i].partyType == '1') {
				vm.insurelist = vm.Objectitle.listRiskPartys[i];
				if(vm.Objectitle.listRiskPartys[i].provinceName == 'null' || vm.Objectitle.listRiskPartys[i].provinceName == null) {
					vm.insurelist.provinceName = '';
				}
				if(vm.Objectitle.listRiskPartys[i].cityName == 'null' || vm.Objectitle.listRiskPartys[i].cityName == null) {
					vm.insurelist.cityName = '';
				}
				if(vm.Objectitle.listRiskPartys[i].areaName == 'null' || vm.Objectitle.listRiskPartys[i].areaName == null) {
					vm.insurelist.areaName = '';
				}
			} else if(vm.Objectitle.listRiskPartys[i].partyType == '2') {
				vm.recognizeelist = vm.Objectitle.listRiskPartys[i];
			}
		}
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
		$('.baozhang').html('未核保')
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
	var baozheng = $('.baozhang').html();
	if(baozheng == '核保成功' || baozheng == '支付失败') {
		$('#liji').show();
	}
}

function backlast() {
	if(title == '订单详情') {
		urlParm.title = '我的订单';
		urlParm.downIco = '1';
		var sendData = urlParm;
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/account/myOrder/allOrder.html?jsonKey=" + jsonStr;
	} else if(title == '交易详情') {
		urlParm.title = '交易明细';
		urlParm.downIco = '1';
		var sendData = urlParm;
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/transactionDetail.html?jsonKey=" + jsonStr;
	}
	if(leixing == 'liji') {
		urlParm.title = '我的订单';
		urlParm.downIco = '1';
		var sendData = urlParm;
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/account/myOrder/allOrder.html?jsonKey=" + jsonStr;
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
$("#guanbi").unbind('tap').bind("tap", function() {
	$('#weixin').hide()
})