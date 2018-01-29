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
if(commodityCombinationId = '4') {
	productFlag = '01';
} else if(commodityCombinationId = '5') {
	productFlag = '02';
}
if(leixing == 'liji') {
	$('.man-div-body-ul_li_div_btn').show();
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
			"customerId": customerId + '',
		}
	}
	var url = base.url + 'ygJmyBasic/getYgOrderInform.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}

	function getReview(data) {
		console.log(data)
	}
	/*电子保单*/
	var reqDatadian = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"orderNo": orderNo,
			"customerId": customerId + '',
		}
	}
	var urldian = base.url + 'ygJmyBasic/getYgDownloadUrl.do';
	$.reqAjaxsFalse(urldian, reqDatadian, getYgDownloadUrl);
	/*电子保单*/
	function getYgDownloadUrl(data) {
		if(data.statusCode == '000000') {
			if(data.returns.DownloadUrl) {
				vm.dianzibaodan = data.returns.DownloadUrl;
			} else {
				vm.dianzibaodan = null;
			}
		} else if(data.statusCode == '123456') {
			modelAlert(data.statusMessage, '', lognCont);
		} else {
			modelAlert(data.statusMessage);
		}
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
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/goldsunshineDetails.html?jsonKey=" + jsonStr;
		/*if(channel == '01') {
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
		} else {
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetailsWeChat/productDetailsWeChat.html?jsonKey=" + jsonStr;
		}*/
	})

	$("#liji").unbind("tap").bind("tap", function() {
		$('.note').show();
		/*触发短信接口*/
		$(".note-div-btn").unbind("tap").bind("tap", function() {
			if($('#yan').val() != null && $('#yan').val() != "") {
				if(ma == $('#yan').val()) {
					var reqData = {
						"head": {
							"userCode": userCode,
							"channel": channel,
							"transTime": $.getTimeStr(),
							"transToken": transToken
						},
						"body": {
							"bankCode": vm.Objectitle.financeOrder.bankCode,
							"holderName": vm.Objectitle.financeOrder.insureName,
							"cardNo": vm.Objectitle.financeOrder.bankCertificate,
							"orderNo": orderNo,
							"insureNo": insureNo,
							"payAmount": vm.Objectitle.financeOrder.prem + '',
							"productFlag": productFlag,
							"customerId": customerId,
						}
					}
					var url = base.url + 'hkunderwrit/getinsure.do';
					$.reqAjaxs(url, reqData, getinsure);
				} else {
					mui.alert('验证码错误!');
				}
			} else {
				mui.alert('验证码不能为空!');
			}
		})
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
		vm.returnVisit = data.returns.financeOrder.returnVisit;
		vm.name = data.returns.commodityCombination.commodityCombinationName;
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