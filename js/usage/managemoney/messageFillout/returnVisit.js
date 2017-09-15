var riskSupportAbility = '',
	insurePhone = "",
	userCode = '',
	customerId = '',
	commodityCombinationId = '',
	commodityId = '',
	testType = '',
	transToken = '',
	policyNo = '',
	queren='0',
	title = '';
$(function() {
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	orderNo = urlParm.orderNo;
	title = urlParm.title;
	comComName = urlParm.comComName;
	startPiece = urlParm.startPiece;
	userCode = urlParm.userCode;
	laiyuan = urlParm.laiyuan;
	transToken = urlParm.transToken;
	riskSupportAbility = urlParm.riskSupportAbility;
	customerId = urlParm.customerId;
	commodityCombinationId = urlParm.commodityCombinationId;
	commodityId = urlParm.commodityId;
	policyNo = urlParm.policyNo;
	testType = urlParm.testType;
	/**--返回--*/
	$(".fl").bind("tap", function() {
		fanhui();
	})
	$(".ri").bind("tap", function() {
		if(queren!='1'){
			huifang();
		}	
	})
})

function fanhui() {
	if(laiyuan == '1') {
		var sendData = {
			"riskSupportAbility": testType,
			"insurePhone": userCode,
			"userCode": userCode,
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"commodityId": commodityId,
			"testType": $('.testType').html(),
			"transToken": transToken,
			'title': title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = JSON.stringify(sendData);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
	}else{
		sysback();
	}

}

function huifang() {
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
			"policyNo": policyNo
		}
	}
	var url = base.url + 'hkRedemption/getReview.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxs(url, reqData, getReview);
}

function getReview(data) {
	if(data.statusCode == '000000') {
		if(laiyuan == '1') {
			tiaozhuan();
		} else {
			mui.alert('回访确认成功');
			$('.ri').addClass('huisebtn');
			queren='1';
		}
	} else {
		mui.alert(data.statusMessage);
	}
}

function tiaozhuan() {
	var sendData = {
		"userCode": userCode,
		"transTime": "",
		"transToken": transToken,
		"riskSupportAbility": riskSupportAbility,
		"orderNo": orderNo,
		"comComName": comComName,
		"startPiece": startPiece,
		'title': comComName,
		"customerId": customerId,
		"commodityCombinationId": commodityCombinationId,
		"commodityId": commodityId,
		"testType": testType,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/payResult.html?jsonKey=" + jsonStr;
}

function backlast() {
	fanhui();
}