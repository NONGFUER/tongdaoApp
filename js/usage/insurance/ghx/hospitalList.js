/**
 * @author shaye
 * 日期：2016-10-15
 */

var param = ""; // 整个页面的数据对象
var channel="1";
$(function(){
	/*--------------返回-----------*/
	$(".mui-action-back").unbind("tap").bind("tap",function() {
		window.history.back();
		return false;
	});
	// 获取页面                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
	$.getProductDetail();
	
	
	// 滑动区域
	$.setscroll();
})

// 加载页面信息
	$.getProductDetail = function() {	
		var url = base.url + "/commonCache/getByCacheCode.do";
		var reqData = {
				"cacheCode" : "commonCacheBO.dictionary.bx_hospital"		
		}
		$.toAjaxs(url, reqData, $.cb2);
	}
	$.cb2 = function(data){		
		if (data.returns.cacheValue == "") {
			modelAlert("获取医院列表异常");
			return false;
		} 
		var datastring = JSON.parse(data.returns.cacheValue);
		for(var i=0; i<datastring.length; i++ ){
			var str="";
			str = "<li class='hospitalName'>"+datastring[i].text+"</li>"
			$(".hospitalContent").append(str);
		}
		
	}

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height()
			- $(".detailcomfrim").height() - 10;
	$("#indexpart").height(Scrollheight + "px");
	mui("#indexpart").scroll();
};

function backlast(){
	urlParm.title    = "产品详情";
	urlParm.leftIcon = "1";
	if( roleType == "00" ){
		urlParm.rightIco = "0";
	}else{
		urlParm.rightIco = "1";
	}	
	urlParm.downIco  = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/ghx/ghxProductDetail.html?jsonKey=" + jsonStr;	
}