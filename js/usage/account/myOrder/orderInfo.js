var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile = urlParm.mobile; //"13852291705";
var transToken = urlParm.transToken;//"c8c95c7f95a1b20bd72825ae67842b98";
var customerId = urlParm.customerId;//"812";
var orderNo = urlParm.orderNo;//"BY2017090817544703721608";
var orderStatus = urlParm.orderStatus;
var ccId = "";
var epolicyUrl = "";
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
	$("#baodanShare").unbind("tap").bind("tap",function(){
		if(!isWeixin()){
			shareHandle()
		}else{
			wechatEpolicyShare()
		}	
	})
	$("#guanbi").unbind('tap').bind("tap", function() {
		$('#weixin').hide()
	})
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
		epolicyUrl			 = shortRiskOrder.epolicyUrl;	
		var startTime = shortRiskOrder.startTime.time;
			startTime = timeFormatDate(startTime,"yyyy-MM-dd");
		var endTime   = shortRiskOrder.endTime.time;
			endTime   = timeFormatDate(endTime,"yyyy-MM-dd");
		var prem      = toDecimal2(shortRiskOrder.prem);
			yuyueId = shortRiskOrder.yuyueId;
		//投保人星系
		$("#orderNo").text(orderNo);//订单号
		$("#insureNo").text(orderBasic.insureNo);//订单号
		$("#insureName").text(commodityInfo.commodityName);//商品名称
		$("#TBRName").text(shortRiskOrder.insureName);//投保人姓名
		$("#TBRID").text(shortRiskOrder.insureIdentitycard);//投保人身份证
		$("#qijian").text(startTime+"至"+endTime);//投保期间
		$("#baofei").text(prem+"元");//保费
		
		var insuredLen = shortRiskInsured.length;
		if( insuredLen >= 1){
			for( var i = insuredLen-1; i >= 0; i-- ){
				var tbrstr = getTbrList(shortRiskInsured[i],i,insuredLen);
				$("#toubaoren").after(tbrstr);
			}
		}
		
		var imgDiv = '<img src="'+commodityInfo.banner+'">';
		$(".bxzr").append(imgDiv);
		
		//保险条款
		$("#riskTiaokuan").attr("data-cid",commodityInfo.id + "");		
		if(epolicyUrl){			
				$("#epolicy").show();
				$("#baodanShare").show();
		}
		$("#epolicy").unbind("tap").bind("tap",function(){
			//window.location.href = epolicyUrl;
			sysbackurl(epolicyUrl);
		});
		$(".anniu1").unbind("tap").bind("tap",function(){
			if( ccId == "14" ){
				sendGhxPayRequest(orderNo)
			}else if( ccId == "21" || ccId == "22" || ccId == "23" ){
				sendPayRequest(orderNo);
			}else{
				payRequest(yuyueId);
			}			
		});
	}
}

function backlast(){
	if(urlParm.channel == '02'){
		history.go(-1);
	}else{
		urlParm.title = "我的订单";
		urlParm.leftIco = "1";
		urlParm.rightIco = "0";
		urlParm.downIco = "1";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = "allOrder.html?jsonKey="+jsonStr;
	}
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
	if(isWeixin()){
		var sendJson = {
				  "head": {
				    "channel": "02",
				    "userCode": mobile,
				    "transTime": $.getTimeStr()
				  },
				  "body": {
				    "orderNo": orderNo,
				    "payWay": "01",
				    "redirectUrl": base.url + "tongdaoApp/html/insurance/main/payResult.html?orderNo="+orderNo,
				    "customerId": customerId
				  }
				}
	}else{
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

//保全家
function sendPayRequest(orderNo){
	var url = base.url + 'preservation/bqjPay.do';
	if(isWeixin()){
		var sendJson = {
				  "head": {
				    "channel": "02",
				    "userCode": mobile,
				    "transTime": $.getTimeStr()
				  },
				  "body": {
					 "orderNo": orderNo,		   
				     "payWay": "01",
				     "redirectUrl": base.url + "tongdaoApp/html/insurance/main/payResult.html?orderNo="+orderNo,
				     "customerId": customerId
				  }
				}
	}else{
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
	}	
	$.reqAjaxs( url, sendJson, bqjPayBackCall );
}

function bqjPayBackCall(data){
	console.log(data);
	if(data.statusCode == "000000"){
		window.location.href=data.returns.payUrl;
	}else{
		modelAlert(data.statusMessage);
	}
}

function getTbrList(obj,index,len){
	console.log(obj);
	if( obj.apRelation == "01" ){
		var objstr =  '<div id="agenter" class="agenter">';
    		objstr += '<article class="insureName border-1px-bottom" style="padding-right: 6.67%;">'
    		if( len == "1" ){
    			objstr += '<div style="width:50%;float:left"><span>被保人信息</span></div><div  class="tong" style="display:block"><span>同投保人</span></div>'
    		}else{
    			objstr += '<div style="width:50%;float:left"><span>被保人信息'+(index+1)+'</span></div><div  class="tong" style="display:block"><span>同投保人</span></div>'
    		}   		
    		objstr += '</article></div>'		
	}else{
		var objstr = '<div id="agenter" class="agenter">'
			objstr += '<article class="insureName border-1px-bottom" style="padding-right: 6.67%;">'
		    objstr += '<div style="width:50%;float:left"><span>被保人信息'+(index+1)+'</span></div>'			
			objstr += '</article>'
			objstr += '<ul class="BBR">'
			objstr += '<li class="name border-1px-bottom"><div class="li_title">姓名</div>'
			objstr += '<div id="BBRName" class="li_value">'+obj.insuredname+'</div>'
			objstr += '</li>'
			objstr += '<li class="IDType border-1px-bottom"><div class="li_title">证件类型</div><div id="BBRIDType" class="li_value">身份证</div></li>'
			objstr += '<li class="ID border-1px-bottom"><div class="li_title">证件号</div>'
			objstr += '<div id="BBRID" class="li_value">'+obj.insuredidno+'</div>'
			objstr += '</li></ul></div>'
	}
	return objstr;
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

function shareHandle(){			
	var title = '同道保险电子保单';
	var desc  ='点击查看详情';	
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";	
	var flag = '2';			
	var shareurl = epolicyUrl;	
	urlParm.picUrl=epolicyUrl;
	urlParm.shareurl = epolicyUrl;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink=base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+jsonStr;
	shareMethod(shareurl, title, desc,flag,picUrl,twolink);
};

function wechatEpolicyShare(){
	$("#weixin").show()
	var title = '同道保险电子保单';
	var desc  ='点击查看详情';	
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";	
	var epolicyObj = {"directUrl":epolicyUrl}
	var jsonStr = UrlEncode(JSON.stringify(epolicyObj));
	var shareUrl = base.url + "tongdaoApp/html/share/epolicyShare.html?jsonKey="+jsonStr;	
	wechatShare(title,desc,picUrl,shareUrl)
}