var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile; //"13852291705";
var transToken = urlParm.transToken;//"c8c95c7f95a1b20bd72825ae67842b98";
var customerId = urlParm.customerId;//"812";
var orderNo = urlParm.orderNo;//"BY2017090817544703721608";
$(function(){
	getOrderDetailRequest( customerId,orderNo);
	//getPolicyDetailRequest("20",policyNo);
	$(".anniu2").unbind("tap").bind("tap",function(){
		backlast();
	});
	$("#riskTiaokuan").unbind("tap").bind("tap",function(){
		toArticle($(this))
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
			"orderNo":orderNo
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
		var status				 = shortRiskOrder.policyStatus;
		var picPath	= picStatus(status);
		$(".zhuangtai").attr("src",picPath);
		
		var startTime = shortRiskOrder.startTime.time;
			startTime = timeFormatDate(startTime,"yyyy-MM-dd");
		var endTime   = shortRiskOrder.endTime.time;
			endTime   = timeFormatDate(endTime,"yyyy-MM-dd");
		var prem      = toDecimal2(shortRiskOrder.prem);
		
		if( shortRiskInsured.apRelation == "01"){
			$(".tong").show();			
		}else{
			$(".BBR").show();
		}
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
		var imgDiv = '<img src="'+commodityInfo.banner+'">';
		$(".bxzr").append(imgDiv);
		
		//保险条款
		$("#riskTiaokuan").attr("data-cid",commodityInfo.id + "");		
		$("#epolicy").unbind("tap").bind("tap",function(){
			window.location.href = epolicyUrl;
		});
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

function picStatus(sta){
	var pic = base.url + "tongdaoApp/image/common/nullstatus.png";
	if(sta == "05" ){//待生效
		var pic = base.url + "tongdaoApp/image/common/daizhifu.png";
	}else if(sta == "07" || sta == "08" || sta == "09" || sta == "10" || sta == "13"){//已支付
		var pic = base.url + "tongdaoApp/image/common/yizhifu.png";
	}else if(sta == "02" || sta == "03" || sta == "06" || sta == "11" || sta == "12" || sta == "99" ){//已关闭
		var pic = base.url + "tongdaoApp/image/common/yiguanbi.png";
	}
	return pic;
}

function toArticle(obj){	
	urlParm.cId  = $(obj).attr("data-cid");
	urlParm.title = "条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.frompage = "orderInfoHtml";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/article.html?jsonKey="+jsonStr;
}

//保单详情
function policyNoDetailCallback(data){
	console.log(data);
}