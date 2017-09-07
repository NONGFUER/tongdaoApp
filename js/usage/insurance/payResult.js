var policyNo;
var parm;
var name;
$(function(){
	//$.setscrollarea("order_result");
	var payResult=getUrlQueryString("payResult");
	console.log(payResult)
	policyNo=$(payResult).find('policyNo').text();
	var orderNo=$(payResult).find('orderNo').text();
	var serialNo=$(payResult).find('serialNo').text();
	console.log(policyNo);console.log(orderNo);console.log(serialNo);
	$("#orderNo").html(orderNo);
	init(orderNo);	
	/**--返回--*/
	$("#close").bind("tap",function(){
		sysbackproduct();
	})
	$("#backproduct").bind("tap",function(){
		sysbackproduct();
	})	
	/**--分享--*/
	$("#share").bind("tap",function(){
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		var shareurl= base.url+"tongdaoApp/page/html/cancerRisk/resultshare.html?jsonKey="+ jsonStr;
		console.log(shareurl)
		var title=parm.body.productName;
		var desc="您有一份保单"+$("#status").html()+"。"+name+"向您推荐了保单信息，点击查看";
		var picUrl=base.url+"App/images/tongdaoic.png";
		shareMethod(shareurl,title,desc,"baodan",picUrl);
	})
	
	/**--重新支付--*/
	$(".pay").bind("tap",function(){
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
	});
	
	
	/**--关注关注号--*/
	$(".follow").bind("tap",function(){
		window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI5NzQzNjc0Mw==&scene=124#wechat_redirect";
	})
})
function init(orderNo){
	var url = base.url + "cancerRisk/queryOrder.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			'orderNo': orderNo

		}
	}	
	$.toAjaxs(url,reqData,function(data){
		console.log(data);
	    if(data.statusCode == "000000") {
	    	var body = data.returns;
	    	var shortRiskInsured = body.shortRiskInsured;
	    	var shortRiskOrder = body.shortRiskOrder;
	    	var prem = toDecimal2(shortRiskOrder.prem)+'元';
	    	var productName = "险险险险险险险"
	    	$("#prem").text(prem)
	    	$("#productName").text(productName);
	    }else {
		   modelAlert(data.statusMessage);
		}
	});
}




