var orderNo="";//订单号
var wxFlag="";//来源：1:由微信公众号我的保单进入列表
var ELpolicyURL="";//电子保单页面
$(function(){
	/*var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
    flag=parm.comeFlag;//来源：1:由产品页进入列表；2：由APP首页我的出单进入列表；3：由微信公众号我的保单进入列表
*/	orderNo=getUrlQueryString("orderNo");
	phone = getUrlQueryString("phone");
	wxFlag=getUrlQueryString("wxFlag");
	/*orderNo="1494898032512";*/
	
	if(wxFlag==1){
		$("#pageTitle").html("保单详情");
	}else{
		$("#pageTitle").html("我的订单");
	}
	/* 设置滑动区域 */
	$.setscroll();
	$(".h_back,.fanhui").unbind("tap").bind("tap",function(){
		window.history.back();
	})
	//条款
	$(".tiaokuan").unbind("tap").bind("tap",function(){
		window.location.href="jcxtiaokuan.html";
	})
	//获取订单详情并渲染页面
	getPolicyInfo();
	//电子保单
	$(".baodan").unbind("tap").bind("tap",function(){
		window.location.href=ELpolicyURL;
	})
	
})
//获取订单详情并渲染页面
function getPolicyInfo(){
	var url=base.share_sxyurl+"jcxPolicy/getOrderInfo.do";
	var reqData={
			"head":{
				"channel": "01",
			    "userCode": "2835",
			    "transTime": ""
			},"body":{
				"orderNo": orderNo
			}
	}
	$.reqAjaxs(url,reqData,function(data){
		console.log(data);
		if(data.statusCode=="000000"){
			var param=data.returns.orderDto;
			//添加已发放佣金字段
			var commission = data.returns.bxRgPolicCommissionCollect;
			if(commission){
				$(".yongjin_value").html(commission.commissionTotal+"元");
				$(".yongjin").show();
			}
			$(".policyNo").html(param.policyNo);
			$("#TBRName").html(param.insureName);
			$("#TBRID").html(param.insureCardNo);
			$("#TBRMobile").html(param.insurePhone);
			$("#TBRchepai").html(param.carNO);
			$("#TBRMail").html(param.insureEmail);
			var policyStatus=param.policyStatus;//订单状态
			if(policyStatus=="00"||policyStatus=="99"){
				$(".zhuangtai").attr("src","../../images/yizhongzhi.png");
			}else if(policyStatus=="03"){
				$(".zhuangtai").attr("src","../../images/daishengxiao.png");
			}else if(policyStatus=="04"){
				$(".zhuangtai").attr("src","../../images/baozhanging.png");
			}
			
			ELpolicyURL=param.ePolicyUrl;
		}else{
			modelAlert(data.statusMessage)
		}
	})
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead").height(Scrollheight);
	mui("#contentHead").scroll();
}; 
