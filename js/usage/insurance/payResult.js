$(function(){
	//$.setscrollarea("order_result");
	var payResult=getUrlQueryString("payResult");
	if(payResult){
		console.log(payResult)
		policyNo=$(payResult).find('policyNo').text();
		var orderNo=$(payResult).find('orderNo').text();
		var serialNo=$(payResult).find('serialNo').text();
		console.log(policyNo);console.log(orderNo);console.log(serialNo);
	}else if(getUrlQueryString("orderNo")){
		var orderNo=getUrlQueryString("orderNo");
	}
	
	$("#orderNo").html(orderNo);
	init(orderNo);	
	/**--返回--*/
	$("#close").bind("tap",function(){
		sysbackproduct();
	})
	$(".backProduct").bind("tap",function(){
		sysbackproduct();
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
	var url = base.url + "personal/getMyOrderDetail.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr(),
			"transToken":""
		},"body":{
			'orderNo': orderNo

		}
	}	
	$.reqAjaxs(url,reqData,function(data){
		console.log(data);
	    if(data.status_code == "000000") {
	    	var body = data.returns;
	    	var shortRiskInsured = body.shortRiskInsured;
	    	var shortRiskOrder = body.shortRiskOrder;
	    	var prem = toDecimal2(shortRiskOrder.prem)+'元';
	    	var commodityInfo = body.commodityInfo;
	    	var productName = commodityInfo.commodityName;
	    	$("#prem").text(prem)
	    	$("#productName").text(productName);
	    }else {
		   modelAlert("查询异常");
		}
	});
}

//跳转到订单详情页面
function toOrderDetail(){
	
}

function backlast(){
	sysbackproduct();
}


