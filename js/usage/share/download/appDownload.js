$(function(){
	/* 设置滑动区域 */
	$.setscroll();
	// 取消遮罩
	$("#zhezhaoImg").on("tap",function(){
		$("#zhezhaoImg").hide();
	});
	$(".android").on("tap",function(){
		if(isWeixn()){
			$("#zhezhaoImg").show();
	    }else{
	    	if(systemsource == "ios"){
	    		mui.alert("请使用Android设备下载","温馨提示");
	    	}
	    }
	});
	$(".ios").on("tap",function(){
		if(isWeixn()){
			$("#zhezhaoImg").show();
	    }else{
	    	 if(systemsource == "android"){
	    		 mui.alert("请使用IOS设备下载","温馨提示");
	    	}
	    }
		
	});
	if(window.location.pathname == "/tongdaoPlatform/tongdaoApp/html/share/download/appDownloadXJTest.html"){
		wechatShareXJ()
	}else{
		wechatShareDL()
	}
})
$.setscroll = function() {
	var Scrollheight = window.innerHeight;
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};

function isWeixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
}

function wechatShareDL(){
	var title = '下载同道APP';
	var desc  ='为您提供专业保险服务';	
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";		
	var shareUrl = base.url + "tongdaoApp/html/share/download/appDownload.html"	
	wechatShare(title,desc,picUrl,shareUrl)
}
function wechatShareXJ(){
	var title = '下载同道APP';
	var desc  ='为您提供专业保险服务';	
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";		
	var shareUrl = base.url + "tongdaoApp/html/share/download/appDownloadXJTest.html"	
	wechatShare(title,desc,picUrl,shareUrl)
}