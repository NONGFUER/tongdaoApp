var iframeflag;
var noticeid = "";
$(function(){
//	url传值解密过程    
	var urlstr = getUrlQueryString('jsonKey');
//	$.saveUserBehaviorAnalyzer("gfb\\newExp\\App\\html\\ambassador\\helpInfo.html", "浏览",
//			"解答", null, null, null, null, null);
	urlstr = UrlDecode(urlstr);
	parm = JSON.parse(urlstr);
	/*设置滑动区域*/
	$.setscroll();
	//加载图片
	$(".rules img").attr("src",base.imagePath + "account/help/editingicon.png");
	$(".fx_question img").attr("src",base.imagePath + "account/help/bz_leftbtn.png");
	//获取详情信息
	$.questionInfo();
	//点击返回
	$(".mui-action-back").unbind("tap").bind("tap",function(){
			var jsonStr = JSON.stringify(parm);
			 jsonStr = UrlEncode(jsonStr);
//			 $.saveUserBehaviorAnalyzer(
//					"tongdaoPlatform\\App\\html\\help\\helpInfo.html", "离开", "帮助中心",
//					"帮助中心", null, null, null, false);
			 window.location.href = base.url + "/tongdaoApp/html/account/help/helpcenter.html?jsonKey=" + jsonStr;
	});
	//点击所需问题返回
	$(".ambassadorback").unbind("tap").bind("tap",function(){
		var jsonStr = JSON.stringify(parm);
		 jsonStr = UrlEncode(jsonStr);
//		 $.saveUserBehaviorAnalyzer(
//				"gfb\\newExp\\App\\html\\ambassador\helpInfo.html", "离开", "解答",
//				"帮助中心", null, null, null, false);
		 window.location.href = base.url + "/tongdaoApp/html/account/help/helpcenter.html?jsonKey=" + jsonStr;
	})
});
//获取详情信息
$.questionInfo = function(){
	var url = base.url + "/HelpCenter/saveHelpThree.do";
	var data = {
			"head":{
				"userCode":111,
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"qustionCode" : parm.qustionCode
			}			
	}
	$.reqAjaxs(url,data,$.questionCallBack);
}
//获取信息
$.questionCallBack = function(param){
	if (param.statusCode == "000000") {
		var paramlist = param.returns.totalInfo;
		//订单号码
		if(!$.isNull(paramlist.questionTitle)){
			$("#qustionTitle").html(paramlist.questionTitle);
		}
		if(!$.isNull(paramlist.questionInfo)){
			$(".helpIntro").html(paramlist.questionInfo);
		}
//		if(paramlist.qustionType == "01"){
//			$(".qustionsType").html("账户");
//		}else if(paramlist.qustionType == "02"){
//			$(".qustionsType").html("佣金");
//		}else if(paramlist.qustionType == "03"){
//			$(".qustionsType").html("保险产品");
//		}else if(paramlist.qustionType == "04"){
//			$(".qustionsType").html("保险投保");
//		}else if(paramlist.qustionType == "05"){
//			$(".qustionsType").html("保单");
//		}else if(paramlist.qustionType == "06"){
//			$(".qustionsType").html("同道代理人");
//		}else if(paramlist.qustionType == "07"){
//			$(".qustionsType").html("挂号险");
//		}
		$(".qustionsType").html(parm.qustionName);
	}else{
		modelAlert(param.statusMessage);
	}
}
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#helpInfo").height(Scrollheight+"px");
	mui("#helpInfo").scroll();
};