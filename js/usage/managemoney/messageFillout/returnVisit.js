var riskSupportAbility = '',
	insurePhone = "",
	userCode = '',
	customerId = '',
	commodityCombinationId = '',
	commodityId = '',
	testType = '',
	transToken = '',
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
	testType = urlParm.testType;
	/**--返回--*/
	$(".fl").bind("tap", function() {
		fanhui();
	})
	$(".ri").bind("tap", function() {
		if(laiyuan == '1') {
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
		}else{
			mui.alert('回访确认');
		}
	})
})

function fanhui() {
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
}

function backlast() {
	fanhui();
}