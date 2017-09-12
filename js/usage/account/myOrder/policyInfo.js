var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile; //"13852291705";
var transToken = urlParm.transToken;//"c8c95c7f95a1b20bd72825ae67842b98";
var customerId = urlParm.customerId;//"812";
var policyNo = urlParm.policyNo;//"8G8013423201700090000057"
$(function(){
	getPolicyDetailRequest(customerId,policyNo);
	$(".anniu2").unbind("tap").bind("tap",function(){
		backlast();
	});
});
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
				"policyNo":policyNo				
			}
	}
	$.reqAjaxs( url, sendJson, policyNoDetailCallback );
	
}
//订单详情
function policyNoDetailCallback(data){
	console.log(data);
	if( data.status_code == "000000" ){
		var body = data.returns;
		var commodityCombination = body.commodityCombination;
		var commodityInfo		 = body.commodityInfo;
		var policyBasic			 = body.policyBasic;
		var shortRiskInsured	 = body.shortRiskInsured;
		var shortRiskOrder		 = body.shortRiskOrder;
		var shortRiskPolicy      = body.shortRiskPolicy
		var epolicyUrl			 = shortRiskOrder.epolicyUrl;
		var startTime = shortRiskOrder.startTime.time;
			startTime = timeFormatDate(startTime,"yyyy-MM-dd");
		var endTime   = shortRiskOrder.endTime.time;
			endTime   = timeFormatDate(endTime,"yyyy-MM-dd");
		var prem      = toDecimal2(shortRiskOrder.prem);
		//投保人星系
		$("#policyNo").text(policyNo);//订单号
		$("#riskName").text(commodityInfo.commodityName);//商品名称
		$("#TBRName").text(shortRiskOrder.insureName);//投保人姓名
		$("#TBRID").text(shortRiskOrder.insureIdentitycard);//投保人身份证
		$("#qijian").text(startTime+"至"+endTime);//投保期间
		$("#baofei").text(prem+"元");//保费
		
		//被保人信息
		$("#BBRName").text(shortRiskInsured.insuredname);
		$("#BBRID").text(shortRiskInsured.insuredidno);
		var imgDiv = '<img src="'+commodityInfo.banner+'">';
		$(".bxzr").append(imgDiv);
	}
}

function backlast(){
	urlParm.title = "我的保单";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "1";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "policyList.html?jsonKey="+jsonStr;
}
