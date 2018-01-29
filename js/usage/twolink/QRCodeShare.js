var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	mobile = urlParm.userCode,
	state = urlParm.state,
	ccName = urlParm.ccName,
	ccId = urlParm.ccId,
	name = urlParm.name,
	desc = urlParm.desc,
	picUrl = urlParm.picUrl,
	customerId = urlParm.customerId,
	transToken = urlParm.transToken,
	fl = urlParm.fl;

$(function() {
	if(isWeiXin()) {
		$('#fenxiang').hide();
	}
	mui('.mui-scroll-wrapper').scroll();
	$('.ccName').html(ccName);
	productQR();
	$("#fenxiang").unbind("tap").bind("tap", function() {
		shareHandle();
	})
});

function shareHandle() {
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var shareurl = base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey=" + jsonStr;
	shareMethod(shareurl, name, desc, "2", picUrl);
};

function productQR() {
	var url = base.url + 'productCommon/productQR.do';
	if(urlParm.ccId) {
		var ccId = urlParm.ccId;
	} else {
		var ccId = '';
	}
	if(urlParm.shareurl){
		var shareurl = urlParm.shareurl;
	}else{
		var shareurl = base.url + "tongdaoApp/html/share/kongbai.html?mobile=" + mobile + '&ccId=' + ccId + '&type=' + state;
	}
	var reqData = {
		"head": {
			"channel": "02",
			"userCode": mobile,
			"transTime": $.getTimeStr(),
			"transToken": ""
		},
		"body": {
			"customerId": customerId,
			"url": shareurl,
			"flag": fl //1产品列表，2产品详情
		}
	}
	$.reqAjaxs(url, reqData, productQRCallback);
}

function productQRCallback(data) {
	console.log(data);
	$("#QRCode").attr("src", data.returns.QRUrl);
}

function backlast() {
	sysback();
}

//判断是否微信登陆
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}