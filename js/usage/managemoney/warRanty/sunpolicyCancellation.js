/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	orderNo = urlParm.orderNo,
	insureNo = urlParm.insureNo,
	commodityComId = urlParm.commodityComId,
	policyNo = urlParm.policyNo,
	ccName=urlParm.ccName,
	remark=urlParm.remark,
	transToken = urlParm.transToken,
	title = urlParm.title,
	customerId = urlParm.customerId,
	userCode = urlParm.userCode;
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
				yearRate:"",
		},
		ccName:'',
		policyNo:'',
		remark:'',
		bao: null,
	},
})
$(function() {
	vm.ccName=ccName;
	vm.policyNo=policyNo;
	vm.remark=remark;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"orderNo":orderNo,
			"customerId":customerId+'',
		}
	}
	var url = base.url + 'ygRedemption/ygRedemptionTrial.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, redemptionTrial);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', tuibao)
})

function redemptionTrial(data) {
	console.log(data);
	if(data.statusCode=='000000'){
		vm.Objectlist = data.returns.ygCalculateDto;
	}else if(data.statusCode=='123456'){
		modelAlert(data.statusMessage,'',lognCont)
	}else{
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
			"customerId": customerId+'',
		},
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'ygRedemption/getYgRedemptionConfirmation.do';
	$.reqAjaxsFalse(url, reqData, getRedemptionConfirmation);
}
/*退保2*/
function getRedemptionConfirmation(data) {
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		mui.alert(data.statusMessage,'',chenggong);
		mui(".man-div-body-ul_li_div_btn").off("tap", "#huifang", tuibao);
		$('#huifang').addClass('huisebtn');
	}
}
/*返回*/
function backlast() {
	var sendData = {
		"userCode": userCode,
		"customerId": customerId,
		"commodityComId": commodityComId,
		"channel": "01",
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"ccName":ccName,
		"orderNo": orderNo,
		"policyNo": policyNo,
		"insureNo": insureNo,
		"title": title,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/sunwarrantyDetail.html?jsonKey=" + jsonStr;
}
/*回到列表页面*/
function chenggong(){
	var sendData = {
		"userCode": userCode,
		"customerId": customerId+'',
		"commodityComId": commodityComId+'',
		"channel": "01",
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"orderNo": orderNo,
		"policyNo": policyNo,
		"insureNo": insureNo,
		"title": '保单详情',
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyList.html?jsonKey=" + jsonStr;
}
