var vm = new Vue({
	el: '#list',
	data: {
		orderNo: "",
		title: "",
		comComName: "",
		startPiece: "",
		userCode: "",
		transToken: "",
	}
})
$(function() {
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == "micromessenger") {
		$(".result-download").show();		
	}
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	vm.orderNo = urlParm.orderNo;
	vm.title = urlParm.title;
	vm.comComName = urlParm.comComName;
	vm.startPiece = urlParm.startPiece[0];
	vm.userCode = urlParm.userCode;
	vm.transToken = urlParm.transToken;
	if(typeof(vm.startPiece) == 'undefined') {
		vm.startPiece=urlParm.startPiece;
		var canpingzhifu='01';//产品支付页面跳转过来
	}else{
		var canpingzhifu='02';//订单支付页跳转过来
	}
	/**--返回--*/
	$("#shouye").unbind("tap").bind("tap", function() {
		sysbackproduct();
	})
	$(".on1").unbind("tap").bind("tap", function() {
		urlParm.title = '保单详情';
		urlParm.commodityComId=urlParm.commodityCombinationId;
		urlParm.canpingzhifu=canpingzhifu;
		var sendData = urlParm;
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyDetail.html?jsonKey=" + jsonStr;
	})
	//跳转到下载页面
	$(".result-download").unbind("tap").bind("tap",function(){			
		window.location.href = base.url + "tongdaoApp/html/share/download/appDownload.html";		
	});
	/**--分享--*/
	/*$("#share").bind("tap",function(){
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		var shareurl= base.url+"tongdaoApp/page/html/cancerRisk/resultshare.html?jsonKey="+ jsonStr;
		console.log(shareurl)
		var title=parm.body.productName;
		var desc="您有一份保单"+$("#status").html()+"。"+name+"向您推荐了保单信息，点击查看";
		var picUrl=base.url+"App/images/tongdaoic.png";
		shareMethod(shareurl,title,desc,"baodan",picUrl);
	})*/

	/**--重新支付--*/
	/*$(".pay").bind("tap",function(){
		var url = base.url + "cancerRisk/pay.do";
		var reqData = {
			"head":{
				"channel":"01",
				"userCode":"",
				"transTime":$.getTimeStr()
			},"body":{
				"serialNo":serialNo,
			}
		}	
		$.toAjaxs(url,reqData,function(data){
			console.log(data);
		    if(data.statusCode == "000000") {
		    	$("#requestDoc").val(data.returns.pay);
				$("#f1").attr("action", data.returns.payUrl);
				$("form").submit();
		    }else {
			   modelAlert(data.statusMessage);
			}
		});
	});*/

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