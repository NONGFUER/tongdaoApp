var pageNo = "1";//当前页码
var totalpage = "1";//后台返回总页数
var qustionType = "";
var qustionName = "";
var flag = "";
var userCode = "";
var parm = {};
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

/**
	* 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		if(pageNo <= totalpage){
			var url = base.url + "/HelpCenter/searchHelpTwo.do";
			var data = {
					"head":{
//						"userCode":userCode,
						"transTime":$.getTimeStr(),
						"channel":"1"
					},"body":{
						"qustionType": qustionType,
						"pageNo": pageNo,
					    "pageSize": "10"
					}
			};
			$.reqAjaxs(url,data,$.questionListCallBack);
		}else{
			mui.toast("没有更多数据了！");
		}
		mui('#pullrefresh').pullRefresh().endPullupToRefresh();
	}, 100);
	
	
}
$.questionListCallBack = function(param){
	//获取后台返回总页数
	totalpage = param.returns.pager.pageCount;
	//mui('#pullrefresh').pullRefresh().endPullupToRefresh((++pageNo > totalpage)); //参数为true代表没有更多数据了。
	++pageNo;
	if(param.statusCode == "000000"){
		var str = "";
		var paramlist = param.returns.pager.entities;
		if(!$.isNull(paramlist) && paramlist.length > 0){
			for(var i = 0; i < paramlist.length; i++){
				if(paramlist[i].status == "0"){
					$("#pullrefresh").show();
					$("#noRecord").hide();
					str += '<div class="notice_info">';
					str += '<div class="helpcenter_enter"><input type="hidden" value="'+paramlist[i].questionCode+'"/>';
					str += '<ul><li class="border-1px-bottom" id="loginpwd">';
					if(paramlist[i].questionTitle.length > 15){
						var noticeTitle = paramlist[i].questionTitle;
						str += '<div class="helpcenter_li_left">'+ noticeTitle.substr(0,13)+ "..." + '</div>'; 
					}else{
						str += '<div class="helpcenter_li_left">'+ paramlist[i].questionTitle + '</div>'; 
					}
					str += '<div class="helpcenter_li_right"><img class="setMebtimg"/></div>';
					str += '</li></ul>';
					str += '</div></div>'; 
				}
			}
			
		}else{
			$("#pullrefresh").hide();
			$("#noRecord").show();
		}
	}else{
		modelAlert(param.statusMessage);
	}
	
	$("#helpcentercontent").append(str);
	
	//加载图片（右箭头）
	$(".setMebtimg").attr("src",base.imagePath + "account/help/arrowmore.png");
	//点击进入帮助中心第三页--解释页面
	$(".helpcenter_enter").unbind("tap").bind("tap",function(){
		var qustionCode = $(this).find("input").val();
		 parm.qustionCode = qustionCode;
		 parm.qustionName = qustionName;
		 var jsonStr = JSON.stringify(parm);
		 jsonStr = UrlEncode(jsonStr);
//		 $.saveUserBehaviorAnalyzer(
//				"tongdaoPlatform\\App\\html\\help\\helpcenter.html", "离开", "帮助中心",
//				"解答", null, null, null, false);
		 window.location.href = base.url + "/tongdaoApp/html/account/help/helpInfo.html?jsonKey=" + jsonStr;
	})	
	
}
if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}
$(function(){
	var urlstr = getUrlQueryString('jsonKey');
//	$.saveUserBehaviorAnalyzer("tongdaoPlatform\\App\\html\\help\\helpcenter.html", "浏览",
//			"帮助中心", null, null, null, null, null);
	urlstr = UrlDecode(urlstr);
	parm = JSON.parse(urlstr);
	qustionType = parm.qustionType;//帮助中心枚举值的标记
	qustionName = parm.qustionName;//帮助中心枚举值的标记
	//console.log(qustionType);
	flag = parm.flag;
//	userCode = parm.userCode;
	//console.log(parm);
	
	//点击返回按钮    
	$(".mui-action-back").unbind("tap").bind("tap",function(){
//		 $.saveUserBehaviorAnalyzer(
//					"tongdaoPlatform\\App\\html\\help\\helpInfo.html", "离开", "帮助中心",
//					"帮助中心", null, null, null, false);
		
		if(flag == "111"){
			var jsonStr = JSON.stringify(parm);
			 jsonStr = UrlEncode(jsonStr);
			 window.location.href = base.url + "/tongdaoApp/html/account/help/helpcenterInfo.html?jsonKey=" + jsonStr;
		}else if(flag == "222"){
			var jsonStr = JSON.stringify(parm.parm);
			console.log(parm.parm);
			 jsonStr = UrlEncode(jsonStr);
			window.location.href = "../product/ghxProductdetail.html?jsonKey=" + jsonStr;
		}else if(flag == "333"){
			var jsonStr = JSON.stringify(parm.parm);
			//console.log(parm.parm);
			 jsonStr = UrlEncode(jsonStr);
			window.location.href = "../wechat/ghxProductdetailShare.html?jsonKey=" + jsonStr;
		}else{
			if(systemsource == "ios"){
				objcObject.OpenUrl("back");
			}else if(systemsource == "android"){
				android.goBack();
			}
		}
		
	})
	/**-- 点击返回帮助中心---*/
	$(".helpback").unbind("tap").bind("tap",function(){
//		 $.saveUserBehaviorAnalyzer(
//					"tongdaoPlatform\\App\\html\\help\\helpInfo.html", "离开", "帮助中心",
//					"帮助中心", null, null, null, false);
		var jsonStr = JSON.stringify(parm);
		 jsonStr = UrlEncode(jsonStr);
		 window.location.href = base.url + "/tongdaoApp/html/account/help/helpcenterInfo.html?jsonKey=" + jsonStr;
	
		
	})
	/*设置滑动区域*/
	$.setscroll();
	
	//加载头部title
//	if(qustionType == "01"){
//		$(".mui-title").html("账户");
//	}else if(qustionType == "02"){
//		$(".mui-title").html("提现银行卡");
//	}else if(qustionType == "03"){
//		$(".mui-title").html("保险产品");
//	}else if(qustionType == "04"){
//		$(".mui-title").html("保险投保");
//	}else if(qustionType == "05"){
//		$(".mui-title").html("保单");
//	}else if(qustionType == "06"){
//		$(".mui-title").html("独立代理人");
//	}else if(qustionType == "07"){
//		$(".mui-title").html("挂号险");
//	}
	$(".mui-title").html(qustionName);
	$(".noRecordimg img").attr("src",base.imagePath+"account/help/noRecord.png");// 没有相关记录
	$(".backbtn img").attr("src",base.imagePath+"account/help/backicon.png");
})
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#pullrefresh").height(Scrollheight-80 +"px");
};
			