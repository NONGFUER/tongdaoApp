if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	var mobile = urlParm.mobile ? urlParm.mobile : ''; //"13852291705";
	var transToken = urlParm.transToken ? urlParm.transToken : '';//"c8c95c7f95a1b20bd72825ae67842b98";
	var customerId = urlParm.customerId ? urlParm.customerId : '';//"812";
	var policyNo = urlParm.policyNo ? urlParm.policyNo : '';//"8G8013423201700090000057"
	var cxflag = urlParm.cxflag ? urlParm.cxflag : "2" ;
}else{
	var urlParm = {};
	var mobile ="";
	var transToken = "";//"c8c95c7f95a1b20bd72825ae67842b98";
	var customerId = "";//"812";
	var policyNo = getUrlQueryString("policyNo");//"8G8013423201700090000057"
}

$(function(){
//	if(cxflag == "3"){
//		$(".anniu2").show();
//	}
	getPolicyDetailRequest(customerId,policyNo);
	$(".anniu2").unbind("tap").bind("tap",function(){
		backlast();
	});
	$("#riskTiaokuan").unbind("tap").bind("tap",function(){
		toArticle($(this))
	});
});
function getPolicyDetailRequest(customerId,policyNo){
	var url = base.url + "personal/getMyPolicyDetail.do";
	var sendJson = {
			"head":{
				"channel"  :"01",
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
//保单详情
function policyNoDetailCallback(data){
	console.log(data);
	if( data.status_code == "000000" ){
		var body = data.returns;
		var commodityCombination = body.commodityCombination;
		var commodityInfo		 = body.commodityInfo;
		var policyBasic			 = body.policyBasic;
		var shortRiskInsured	 = body.shortRiskInsured;
		var shortRiskOrder		 = body.shortRiskOrder;
		var shortRiskPolicy      = body.shortRiskPolicy;
		var status				 = shortRiskPolicy.policyStatus;
		var picPath				 = picStatus(status);
		if(commodityCombination.id == "17"){
			$('#qhArrow').show()
			qiehuan()
			
		}
		$(".zhuangtai").attr("src",picPath);
		var epolicyUrl			 = shortRiskOrder.epolicyUrl;
		var startTime = shortRiskOrder.startTime.time;
			startTime = timeFormatDate(startTime,"yyyy-MM-dd");
		var endTime   = shortRiskOrder.endTime.time;
			endTime   = timeFormatDate(endTime,"yyyy-MM-dd");
		var prem      = toDecimal2(shortRiskOrder.prem);
		
		//投保人星系
		$("#policyNo").text(policyNo);//订单号
		$("#insureNo").text(policyBasic.insureNo);//投保单号
		$("#riskName").text(commodityInfo.commodityName);//商品名称
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
		
		if(commodityCombination.id == "17"){
			qiehuanimg()
		}else{
			var imgDiv = '<img src="'+commodityInfo.banner+'">';
			$(".bxzr").append(imgDiv);
		}
		
		
		//保险条款
		$("#riskTiaokuan").attr("data-cid",commodityInfo.id + "");
		if(epolicyUrl){		
			if( urlParm.frompage != "payResultHtml" ){
				$("#epolicy").show();
			}					
		}
		$("#epolicy").unbind("tap").bind("tap",function(){
			//window.location.href = epolicyUrl;
			sysbackurl(epolicyUrl);
		});
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
	if(sta == "10" || sta == "11" ){//待生效
		var pic = base.url + "tongdaoApp/image/common/daishengxiao.png";
	}else if(sta == "2" || sta == "8" || sta == "12" || sta == "9"){//保障中
		var pic = base.url + "tongdaoApp/image/common/baozhanging.png";
	}else if(sta == "3" || sta == "4" || sta == "5" || sta == "6" || sta == "7" || sta == "13"){//已过期
		var pic = base.url + "tongdaoApp/image/common/yiguoqi.png";
	}
	return pic;
}
function qiehuan(){
	$("#changeWay").unbind("tap").bind("tap",function(){
		urlParm.title = "保障切换";
		urlParm.leftIco = "1";
		urlParm.rightIco = "0";
		urlParm.downIco = "0";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'tongdaoApp/html/insurance/sxy/chooseChuxingWay.html?jsonKey='+jsonStr;
	});
}

function qiehuanimg(){
	var url = base.url + "common/getTrafficTime.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"phone":mobile
			}
	}
	$.reqAjaxsFalse(url,reqData,function(data){
		var imgimg = 'http://jichupro.oss-cn-szfinance.aliyuncs.com/commodityCombination/commodityBaoZhang/00500005_'+data.returns.bxSxyTraffic.trafficWay+'.jpg'
		var imgDiv = '<img src="'+imgimg+'">';
		$(".bxzr").append(imgDiv);
	});
}

function toArticle(obj){	
	urlParm.cId  = $(obj).attr("data-cid");
	urlParm.title = "条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	urlParm.frompage = "policyInfoHtml";
	if( urlParm.search ){
		urlParm.search = urlParm.search;
	}	
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/article.html?jsonKey="+jsonStr;
}

function backlast(){
	if(urlParm.channel == '02'){
		history.go(-1);
	}else{
		if( cxflag == "2" ){			
			urlParm.title = "我的保单";
			urlParm.leftIco = "1";
			urlParm.rightIco = "0";
			urlParm.downIco = "1";
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = "policyList.html?jsonKey="+jsonStr;				
		}else if(cxflag == "3"){
			urlParm.title = "我的出单";
			urlParm.leftIco = "1";
			urlParm.rightIco = "0";
			urlParm.downIco = "1";
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/mysingle.html?jsonKey="+jsonStr;
		}else if(cxflag == "4"){
			window.location.href = base.url + "tongdaoApp/html/insurance/main/payResult.html" + urlParm.search;
		}else if( cxflag == "10" ){
			urlParm.title = "我的出单";
			urlParm.leftIco = "1";
			urlParm.rightIco = "0";
			urlParm.downIco = "0";
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/teaMmysingle.html?jsonKey="+jsonStr;
		}else if(cxflag == "cancer"){
			window.location.href = base.url + "tongdaoApp/page/html/cancerRisk/result.html" + urlParm.search;
		}else if(cxflag == "ecard"){
			window.location.href = base.url + "tongdaoApp/page/html/ecard/result.html" + urlParm.search;
		}
	}
			
}
