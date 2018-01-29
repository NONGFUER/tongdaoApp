/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	orderNo = urlParm.orderNo,
	insureNo = urlParm.insureNo,
	commodityComId = urlParm.commodityComId,
	policyNo = urlParm.policyNo,
	ccName = urlParm.ccName,
	remark = urlParm.remark,
	channel=urlParm.channel,
	transToken = urlParm.transToken,
	title = urlParm.title,
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
	vm.remark = remark;
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
	var url = base.url + 'ygJmyRedemption/ygRedemptionTrial.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, redemptionTrial);
	$("#huifang").unbind("tap").bind("tap", function() {
		tuibao();
	})
})

function redemptionTrial(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		vm.Objectlist = data.returns.ygCalculateDto;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont)
	} else {
		modelAlert(data.statusMessage);
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*退保1*/
function tuibao() {
	var reqData = {
		"body": {
			"orderNo": orderNo,
			"insureNo": insureNo,
			"policyNo": policyNo,
			"customerId": customerId + '',
		},
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'ygJmyRedemption/getYgRedemptionConfirmation.do';
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
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/goldsunwarrantyDetail.html?jsonKey=" + jsonStr;
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