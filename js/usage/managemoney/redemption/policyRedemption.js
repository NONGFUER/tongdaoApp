var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
			hKCalculate: {},
			huisebtn: {},
		},
	},
/*	mounted() {
		this.$nextTick(function() {
			$(function() {
				bankweihao()
			})
		})
	}*/
})
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行  
var curCount; //当前剩余秒数
var commodityCommId = "",
	title = "",
	customerId = "",
	transToken = "",
	orderNo = "",
	userCode = "",
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
	if(userCode) {
		$('.phone').html(phoneyin(userCode));
	}
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
			$('.note').show();
			$(".note-div-btn").unbind("tap").bind("tap", function() {
				if($('#yan').val() != null && $('#yan').val() != "") {
					if(ma == $('#yan').val()) {

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
					} else {
						mui.alert('验证码错误!');
					}
				} else {
					mui.alert('验证码不能为空!');
				}
			})
		}
	})
	/*发送短信*/
	$(".dianji").unbind("tap").bind("tap", function() {
		sendMessage();
	})
})

function redemptionTrial(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		vm.Objectlist = data.returns;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	vm.$nextTick(function() {
		bankweihao();
	})
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
		vm.huisebtn = '1';
		$('.note').hide();
		$('#huifang').attr('style', 'background-color: #999;')
		modelAlert(data.statusMessage,'',shouye);
	} else if(data.statusCode == "123456") {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	$('.note').hide();
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*返回首页*/
function shouye(){
	sysback();
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
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
			"channel": '01',
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