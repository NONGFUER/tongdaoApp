var vm = new Vue({
	el: '#list',
	data: {
		orderNo: "",
		title: "",
		comComName: "",
		startPiece: "",
		userCode: "",
		transToken: "",
		policyNo:"",
		urlParm: '',
	}
})
$(function() {
	modelAlert('您已确认通过阳光寿险官网查阅到您的电子保单或电子保单链接（您可通过“阳光保险在线”--“我的保单”--“下载电子保单”进行下载）。您已确认投保人是您本人。您已确认已经阅读并理解产品说明书和投保提示书内容，对产品的保险责任和责任免除等相关权益都清楚。您已确认购买的这份产品为一次性交费。您已确认至本合同第5个保单周年日，我公司自动将本金及收益一并返还至您所交保费账户内，返还款项将于3-5个工作日到账您已确认电子保单生成日次日起有15天犹豫期，犹豫期内请您认真审视保险合同，如果您认为保险合同与您的需求不相符，您可以提出解除保险合同，公司将无息退还您所缴纳的保费；犹豫期后退保，您可能会承担一定的损失。','',huifang);
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		$(".result-download").show();
	}
	vm.orderNo = getUrlQueryString('orderNo');
	/*信息*/
	var reqData = {
		"head": {},
		"body": {
			"orderNo": vm.orderNo,
		}
	}
	var url = base.url + 'ygBasic/getYgOrderInform.do';
	$.reqAjaxsFalse(url, reqData, getYgOrderInform);
	function getYgOrderInform(data) {
		console.log(data);
		if(data.statusCode == '000000') {
			vm.comComName = data.returns.ccName;
			vm.startPiece = data.returns.prem;
		}
	}	
	/**--返回--*/
	$("#shouye").unbind("tap").bind("tap", function() {
		sysbackproduct();
	})
	$("#zaici").unbind("tap").bind("tap", function() {
		/*urlParm.title = '产品详情';
		urlParm.commodityComId=urlParm.commodityCombinationId;
			var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/sunshineDetails.html?jsonKey=" + jsonStr;*/
	})
	$(".on1").unbind("tap").bind("tap", function() {
		vm.urlParm.title = '保单详情';
		
		var sendData = vm.urlParm;
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/sunwarrantyDetail.html?jsonKey=" + jsonStr;
	})
	//跳转到下载页面
	$(".result-download").unbind("tap").bind("tap", function() {
		window.location.href = base.url + "tongdaoApp/html/share/download/appDownload.html";
	});
	/**--关注关注号--*/
	$(".follow").bind("tap", function() {
		window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI5NzQzNjc0Mw==&scene=124#wechat_redirect";
	})
})

function init(orderNo) {

}

function backlast() {
	sysbackproduct();
}

function huifang() {
	var url = base.url + 'ygAccountValue/getYgBackOnline.do';
	var reqData = {
		"head": {},
		"body": {
			"orderNo": vm.orderNo,
		}
	}
	$.reqAjaxsFalse(url, reqData, huifangque);

	function huifangque(data) {
		console.log(data)
	}
	/*transToken*/
	var reqData = {
		"head": {},
		"body": {
			"orderNo": vm.orderNo,
		}
	}
	var url = base.url + 'ygBasic/getYgToken.do';
	$.reqAjaxsFalse(url, reqData, getYgToken);

	function getYgToken(data) {
		console.log(data);
		if(data.statusCode == '000000') {
			vm.urlParm = data.returns.financeOrder;
			vm.urlParm.userCode = data.returns.customerBasic.userName;
			vm.urlParm.ccName=vm.comComName;
			vm.urlParm.transToken=data.returns.token;
			vm.transToken = data.returns.token;
		}
	}
}