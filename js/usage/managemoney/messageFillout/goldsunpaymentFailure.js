var vm = new Vue({
	el: '#list',
	data: {
		orderNo: "",
		title: "",
		comComName: "",
		startPiece: "",
		userCode: "",
		transToken: "",
		urlParm: '',
	}
})
$(function() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		$(".result-download").show();		
	}
	vm.orderNo = getUrlQueryString('orderNo');
	var reqData = {
		"head": {},
		"body": {
			"orderNo": vm.orderNo,
		}
	}
	var url = base.url + 'ygJmyBasic/getYgToken.do';
	$.reqAjaxs(url, reqData, getYgToken);

	function getYgToken(data) {
		console.log(data);
		if(data.statusCode == '000000') {
			vm.urlParm = {};
			vm.urlParm.commodityCombinationId=data.returns.financeOrder.commodityCombinationId;
			vm.urlParm.idAuth=data.returns.customerBasic.idAuth;
			vm.urlParm.userCode = data.returns.customerBasic.userName;
			vm.urlParm.customerId=data.returns.financeOrder.customerId;
			vm.urlParm.transToken=data.returns.token;
			vm.transToken = data.returns.token;
		}
	}
	/*信息*/
	var reqData = {
		"head": {},
		"body": {
			"orderNo": vm.orderNo,
		}
	}
	var url = base.url + 'ygJmyBasic/getYgOrderInform.do';
	$.reqAjaxs(url, reqData, getYgOrderInform);
	function getYgOrderInform(data) {
		console.log(data);
		if(data.statusCode == '000000') {
			vm.comComName = data.returns.ccName;
			vm.urlParm.ccName=data.returns.ccName;
			vm.startPiece = data.returns.prem;
		}
	}
	/**--返回--*/
	$("#shouye").unbind("tap").bind("tap", function() {
		sysbackproduct();
	})
	$(".on1").unbind("tap").bind("tap", function() {
		vm.urlParm.title = '产品详情';
		var jsonStr = UrlEncode(JSON.stringify(vm.urlParm));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/goldsunshineDetails.html?jsonKey=" + jsonStr;
		/*if(urlParm.channel=='01'){
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/sunshineDetails.html?jsonKey=" + jsonStr;
		}else{
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetailsWeChat/sunshineDetailsWeChat.html?jsonKey=" + jsonStr;
		}*/
	})
	//跳转到下载页面
	$(".result-download").unbind("tap").bind("tap",function(){			
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