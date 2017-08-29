var i=0;
var issueChannel;//渠道
$(function(){
	 orderNo = GetQueryString('orderNo');
	 /**---请求后台查询信息-----*/
	 setTimeout(function(){
		 toInitAjax();
	 }, 5000)
	 
	$.setscrollarea("indexpart");	

	/**-----返回------*/
	$(".ps_appload").on("tap",function(){
		if(systemsource == "ios"){
			objcObject.OpenUrl("back");
		}else if(systemsource == "android"){
			android.goBack();
		}
	});
});
function GetQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 


/*显示的信息*/
function init(data,orderStatus){
	$(".ps_paydingdan").html(GetQueryString("orderNo"));
	$(".orderTime").html(data.returns.gfbCxOrder.insertTime);
	var orderStatusName="";
	if(orderStatus=="0205"){
		orderStatusName="支付成功";
	}else if(orderStatus=="0206"){
		orderStatusName="支付失败";
	}else if(orderStatus=="0207"){
		orderStatusName="承保成功";
	}
	$(".orderStatus").html(orderStatusName);
	if(orderStatus== "0205"||orderStatus== "0207"){
		$(".payResult").html("支付成功");
		$(".orderMoney").html(data.returns.gfbCxOffer.totalPre);
		$(".ps_payicon img").attr("src","../../images/pay.png");
	}else {
		$(".payResult").html("支付失败");
		$(".ps_payicon img").attr("src","../../images/payf.png");
		$(".fee").hide();
	}
	issueChannel=data.returns.gfbCxOrder.issueChannel;
	$(".indexpart").show();
	$(".ajax_prevent").remove();
}
/**---请求后台查询信息-----*/
function toInitAjax(){
	++i;
	 var url=base.url + "vi/queryCarPayStatus.do";
	 var reqData={
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"orderNo":orderNo,
			}
		}
	var requestJson = aesEncrypt(JSON.stringify(reqData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			console.log(data);
			if(data.statusCode=="000000"){
				 var orderStatus=data.returns.gfbCxOrder.orderStatus;
				 if(orderStatus!="0202"){
					 init(data,orderStatus);
				 }else{
					 if(i>=2){
						 modelAlert("订单异常，请联系管理员");
						 
					 }else{
						 toInitAjax();
					 }
				 }
				 
			}else{
				modelAlert(data.statusMessage);
			}
			
		},
		error : function(data) {
			$(".ajax_prevent").remove();
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		async : true,
	});
}
