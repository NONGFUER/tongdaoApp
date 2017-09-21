var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile; //"13852291705";
var transToken = urlParm.transToken;//"c8c95c7f95a1b20bd72825ae67842b98";
var customerId = urlParm.customerId;//"812";
var orderNo = urlParm.orderNo;//"BY2017090817544703721608";
var orderStatus = urlParm.orderStatus;
var ccId = "";
$(function(){
	if( orderStatus == "待支付"){
		$(".anniu1").removeClass("hidden");
	}
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
	$.reqAjaxsFalse( url, sendJson, orderDetailCallback );
}
//订单详情
function orderDetailCallback(data){
	console.log(data);
	if( data.status_code == "000000" ){
		var body = data.returns;
		var commodityCombination = body.commodityCombination;
			ccId = commodityCombination.id+"";
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
			yuyueId = shortRiskOrder.yuyueId;
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
		$(".anniu1").unbind("tap").bind("tap",function(){
			if( ccId == "14" ){
				sendGhxPayRequest(orderNo)
			}else{
				payRequest(yuyueId);
			}			
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

/*支付接口*/
function payRequest(serialNo){
	if( ccId != "1" && ccId != "2" && ccId != "3"){
		var url = base.url + 'ecard/pay.do';
	}else{
		var url = base.url + 'cancerRisk/pay.do';
	}
	var reqData = {
	    "head":{
	        "channel":"01",
	        "userCode":mobile,
	        "transTime":$.getTimeStr()
	    },"body":{
	        "serialNo":serialNo	       
	    }
	}
	if( ccId != "1" && ccId != "2" && ccId != "3"){
		reqData.body.payType = "7";
	}else{
		reqData.body.orderResource = "5";
	}	
	$.toAjaxs(url,reqData,payReturnReponse);
}

//支付回调
function payReturnReponse(data){
	if(data.statusCode == "000000") {
	    $("#requestDoc").val(data.returns.pay);
	    $("#f1").attr("action", data.returns.payUrl);
	    $("form").submit();
	}else {
	    modelAlert(data.statusMessage);
	}
}


function sendGhxPayRequest(orderNo){
	var url = base.url + 'ghxOrder/pay.do';
	var sendJson = {
		  "head": {
		    "channel": "01",
		    "userCode": mobile,
		    "transTime": $.getTimeStr(),
		    "transToken":transToken
		  },
		  "body": {
		    "orderNo": orderNo,
		    "payWay": "02",
		    "redirectUrl": base.url + "tongdaoApp/html/insurance/main/payResult.html?orderNo="+orderNo,
		    "customerId": customerId
		  }
		}
	$.reqAjaxs( url, sendJson, ghxPayBackCall );
}

function ghxPayBackCall(data){
	console.log(data);
	if(data.statusCode == "000000"){
		window.location.href=data.returns.payUrl;
	}else{
		modelAlert(data.statusMessage);
	}
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

