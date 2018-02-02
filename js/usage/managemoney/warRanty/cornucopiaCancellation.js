/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	orderNo = urlParm.orderNo,
	insureNo = urlParm.insureNo,
	commodityComId = urlParm.commodityComId,
	policyNo = urlParm.policyNo,
	ccName = urlParm.ccName,
	channel=urlParm.channel,
	prem=urlParm.prem,
	transToken = urlParm.transToken,
	title = urlParm.title,
	bankName=urlParm.bankName,
	bankCode=urlParm.bankCode,
	bankAccNo=urlParm.bankAccNo,
	customerId = urlParm.customerId,
	userCode = urlParm.userCode;
if(typeof(channel) == 'undefined') {
	channel = '01';
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
			yearRate: "",
			prem:'',
			bankCode:'',
			bankname:'',
			bankCertificate:'',
		},
		ccName: '',
		policyNo: '',
		remark: '',
		bao: null,
	},
})
$(function() {
	vm.ccName = ccName;
	vm.policyNo = policyNo;
	vm.Objectlist.prem=prem;
	vm.Objectlist.bankCode=bankCode;
	vm.Objectlist.bankName=bankName;
	vm.Objectlist.bankCertificate=bankAccNo;
	$("#huifang").unbind("tap").bind("tap", function() {
		tuibao();
	})
})
/*登录失效*/
function lognCont() {
	loginControl();
}
/*退保1*/
function tuibao() {
	var reqData = {
		"body": {
			"proposalContNo":policyNo,
			"contNo":insureNo,
			"customerId": customerId + '',
		},
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'kLSurrender/Surrender.do';
	$.reqAjaxs(url, reqData, getRedemptionConfirmation);
}
/*退保2*/
function getRedemptionConfirmation(data) {
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		
		mui.alert(data.statusMessage, '', chenggong);
		$("#huifang").unbind("tap").bind("tap", function() {
			tuibao();
		})
		//mui(".man-div-body-ul_li_div_btn").off("tap", "#huifang", tuibao);
		$('#huifang').addClass('huisebtn');
	}
}
/*返回*/
function backlast() {
	var sendData = {
		"userCode": userCode,
		"customerId": customerId,
		"commodityComId": commodityComId,
		"channel": channel,
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"ccName": ccName,
		"orderNo": orderNo,
		"policyNo": policyNo,
		"insureNo": insureNo,
		"title": title,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/cornucopiaDetail.html?jsonKey=" + jsonStr;
}
/*回到列表页面*/
function chenggong() {
	var sendData = {
		"userCode": userCode,
		"customerId": customerId + '',
		"commodityComId": commodityComId + '',
		"channel": channel,
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"orderNo": orderNo,
		"policyNo": policyNo,
		"insureNo": insureNo,
		"title": '我的保单',
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '1',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	if(channel=='01'){
		window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyList.html?jsonKey=" + jsonStr;
	}else{
		window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyListWeChat.html?jsonKey=" + jsonStr;
	}
	
}
$('.wenhaoico').unbind("tap").bind("tap", function() {
	modelAlert('该银行账户将用于领取保费或者退保，要求该银行账号所有人必须为投保人本人');
})