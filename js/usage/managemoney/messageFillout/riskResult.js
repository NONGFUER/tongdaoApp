/**
 * 
 */
var testType;
var titles = "";
var transToken="";
$(function() {
	//	url传值解密过程

	var urlstr = getUrlQueryString('jsonKey');
	urlstr = UrlDecode(urlstr);
	parm = JSON.parse(urlstr);
	console.info(parm);
	testType = parm.body.testType;
	mobile = parm.body.mobile;
	productCode = parm.body.productCode;
	customerId = parm.body.customerId;
	transToken=parm.transToken;
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
			"resultRisk": testType
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
	$.reqAjaxsFalse(url, reqData, saveRiskAbles);

	function saveRiskAbles(data) {
		if(data.statusCode == '000000') {
			var sendData = {
				"insurePhone": mobile,
				"commodityCombinationId": customerId,
				"userCode": productCode,
				"title": titles,
			}
			var jsonStr = JSON.stringify(sendData);
			jsonStr = UrlEncode(jsonStr);
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
		}
	}
}

function buy() {
	var reqData = {
		"body": {
			"userPhone": mobile,
			"resultRisk": "1"
		},
		"head": {
			"userCode": productCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	}
	var url = base.url + 'investmentLinkedInsurance/saveRiskAble.do';
	$.reqAjaxsFalse(url, reqData, saveRiskAble);

	function saveRiskAble(data) {
		if(data.statusCode == '000000') {
			var sendData = {
				"riskSupportAbility": testType,
				"insurePhone": mobile,
				"userCode": productCode,
				"commodityCombinationId": customerId,
				"testType": $('.testType').html(),
				'title': titles,
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