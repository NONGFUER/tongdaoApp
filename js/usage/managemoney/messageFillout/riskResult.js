/**
 * 
 */
var testType;
var titles = "";
var transToken = "";
var commodityId = "";
var productFlag='';
var channel='';
$(function() {
	//	url传值解密过程
	var urlstr = getUrlQueryString('jsonKey');
	urlstr = UrlDecode(urlstr);
	parm = JSON.parse(urlstr);
	console.info(parm);
	testType = parm.body.testType;
	productFlag=parm.productFlag;
	mobile = parm.body.mobile;
	channel=parm.channel;
	productCode = parm.body.productCode;
	customerId = parm.body.customerId;
	commodityId = parm.body.commodityId;
	commodityCombinationId = parm.body.commodityCombinationId;
	transToken = parm.head.transToken;
	titles = parm.titles;
	//初始化
	$.init();
	//头部返回按钮
	$(".h_back").unbind("tap").bind("tap", function() {

	});

	//继续购买按钮
	$(".button-again").unbind("tap").bind("tap", function() {
		if(testType != "5") {
			$(".shadow").show();
		} else {
			buy();
		}
	});
	$(".cancel").bind("tap", function() {
		product();
	});
	$(".retest").bind("tap", function() {
		buy();
	});
	//放弃购买按钮
	$(".button-return").unbind("tap").bind("tap", function() {
		product();
	});
});

$.init = function() {
	/*滑动区域*/
	$.setscroll();
	if(testType == "1") {
		$(".testType").html("保守型");
	} else if(testType == "2") {
		$(".testType").html("稳健型");
	} else if(testType == "3") {
		$(".testType").html("平衡型");
	} else if(testType == "4") {
		$(".testType").html("积极型");
	} else if(testType == "5") {
		$(".testType").html("进取型");
	}

};

function product() {
	var reqData = {
		"body": {
			"userPhone": mobile,
			"resultRisk": testType,
			"customerId": customerId
		},
		"head": {
			"userCode": productCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"title": titles,
	}
	var url = base.url + 'investmentLinkedInsurance/saveRiskAble.do';
	$.reqAjaxs(url, reqData, saveRiskAbles);

	function saveRiskAbles(data) {
		if(data.statusCode == '000000') {
			var sendData = {
				"insurePhone": productCode,
				"customerId": customerId,
				"commodityCombinationId": commodityCombinationId,
				"userCode": productCode,
				"commodityId": commodityId,
				"transToken": transToken,
				"channel":channel,
				"title": titles,
				"leftIco": '1',
				"rightIco": '0',
				"downIco": '0',
			}
			var jsonStr = JSON.stringify(sendData);
			jsonStr = UrlEncode(jsonStr);
			if(channel=='01'){
				window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
			}else{
				window.location.href = base.url + "tongdaoApp/html/managemoney/productDetailsWeChat/productDetailsWeChat.html?jsonKey=" + jsonStr;
			}
			
		}
	}
}

function buy() {
	var reqData = {
		"body": {
			"userPhone": mobile,
			"resultRisk": testType,
			"customerId": customerId,
		},
		"head": {
			"userCode": productCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'investmentLinkedInsurance/saveRiskAble.do';
	$.reqAjaxs(url, reqData, saveRiskAble);

	function saveRiskAble(data) {
		if(data.statusCode == '000000') {
			var sendData = {
				"riskSupportAbility": testType,
				"insurePhone": productCode,
				"userCode": productCode,
				"customerId": customerId,
				"commodityCombinationId": commodityCombinationId,
				"commodityId": commodityId,
				"testType": $('.testType').html(),
				"transToken": transToken,
				"channel":channel,
				"productFlag":productFlag,
				'title': titles,
				"leftIco": '1',
				"rightIco": '0',
				"downIco": '0',
			}
			var jsonStr = JSON.stringify(sendData);
			jsonStr = UrlEncode(jsonStr);
				window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
			
		}
	}

}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#indexpart").height(Scrollheight + "px");
	mui("#indexpart").scroll();
};