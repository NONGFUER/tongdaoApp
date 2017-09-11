var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile; //"13852291705";
var transToken = urlParm.transToken;//"c8c95c7f95a1b20bd72825ae67842b98";
var customerId = urlParm.customerId;//"812";
var orderNo = urlParm.orderNo;//"BY2017090817544703721608";
var policyNo = urlParm.policyNo;//"8G8013423201700090000057"
$(function(){
	getOrderDetailRequest( customerId,orderNo);
	getPolicyDetailRequest("20",policyNo);
	$(".anniu2").unbind("tap").bind("tap",function(){
		backlast();
	});
});
//订单详情	
function getOrderDetailRequest( customerId,orderNo){
	var url = base.url + "personal/getMyOrderDetail.do";
	var sendJson = {
		"head":{
			"channel"  :"01",
            "userCode" :mobile,
            "transTime":$.getTimeStr(),
            "transToken":transToken
		},
		"body":{
			"loggingCustomerId":customerId,
			"orderNo":orderNo,
			"customerId":customerId
		}			
	} 
	$.reqAjaxs( url, sendJson, orderDetailCallback );
}
//订单详情
function orderDetailCallback(data){
	console.log(data);
	if( data.status_code == "000000" ){
		var body = data.returns;
		var commodityCombination = body.commodityCombination;
		var commodityInfo		 = body.commodityInfo;
		var orderBasic			 = body.orderBasic;
		var shortRiskInsured	 = body.shortRiskInsured;
		var shortRiskOrder		 = body.shortRiskOrder;
		
		var startTime = shortRiskOrder.startTime.time;
			startTime = timeFormatDate(startTime,"yyyy-MM-dd");
		var endTime   = shortRiskOrder.endTime.time;
			endTime   = timeFormatDate(endTime,"yyyy-MM-dd");
		var prem      = toDecimal2(shortRiskOrder.prem);
		//投保人星系
		$("#orderNo").text(orderNo);//订单号
		$("#insureName").text(commodityInfo.commodityName);//商品名称
		$("#TBRName").text(shortRiskOrder.insureName);//投保人姓名
		$("#TBRID").text(shortRiskOrder.insureIdentitycard);//投保人身份证
		$("#qijian").text(startTime+"至"+endTime);//投保期间
		$("#baofei").text(prem+"元");//保费
		
		//被保人信息
		$("#BBRName").text(shortRiskInsured.insuredname);
		$("#BBRID").text(shortRiskInsured.insuredidno);
	}
}

function backlast(){
	urlParm.title = "我的订单";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "1";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "allOrder.html?jsonKey="+jsonStr;
}
function getPolicyDetailRequest(customerId,policyNo){
	var url = base.url + "personal/getMyPolicyDetail.do";
	var sendJson = {
			"head":{
				"channel"  :"02",
	            "userCode" :mobile,
	            "transTime":$.getTimeStr(),
	            "transToken":transToken
			},
			"body":{
				"loggingCustomerId":customerId,
				"policyNo":policyNo,
				"customerId":customerId
			}
	}
	$.reqAjaxs( url, sendJson, policyNoDetailCallback );
	
}


//保单详情
function policyNoDetailCallback(data){
	console.log(data);
}