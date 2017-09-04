var parm = {};
var userCode = "";
$(function(){	
	//加载数据
	loadDate();
	//初始化
	init();
    
	//点击返回按钮
	$(".mui-action-back").on("tap",function(){
//		$.saveUserBehaviorAnalyzer(
//				"tongdaoPlatform\\App\\html\\help\\helpcenterInfo.html", "离开", "帮助中心",
//				"", null, null, null, false);
		if(systemsource == "ios"){
			objcObject.OpenUrl("back");
		}else if(systemsource == "android"){
			android.goBack();
		}
	});	
});

/**
* 加载数据
*/
function loadDate() {
	var url = base.url + "/HelpCenter/queryOnHelpType.do";
	var data = {
			"head":{
//				"userCode":userCode,
				"transTime":$.getTimeStr(),
				"channel":"1"
			},"body":{
				"dic_type": "bx_help_type"
			}
	};
	$.reqAjaxs(url,data,$.infocallBack);
}

$.infocallBack = function(param){
	if(param != null){
		if(param.status.statusCode == "000000"){
			var str = "";
			var paramlist = param.status.returns.helpTypeList;
			if(!$.isNull(paramlist) && paramlist.length > 0){
				for(var i = 0; i < paramlist.length; i++){
					var dic = paramlist[i];
					if(i%2 == "0"){
						str += '<div class="helplist border-br" title="' + dic.dicCode + '" name="' + dic.dicValue + '"><div class="helpimg"><img src="../../../image/account/help/' + dic.dicExplain + '"></div>' + dic.dicValue + '</div>';
						
					}else{
						str += '<div class="helplist border-bottom" title="' + dic.dicCode + '" name="' + dic.dicValue + '"><div class="helpimg"><img src="../../../image/account/help/' + dic.dicExplain + '"></div>' + dic.dicValue + '</div>';
					}
				}
				
			}else{
				modelAlert("暂无数据");
			}
		}else{
			modelAlert(param.statusMessage);
		}
		
		$("#helpInfoArea").html(str);
		
		//点击类型进入列表页
		$(".helplist").unbind("tap").bind("tap",function(){
			var typeName = $(this).attr("name");
			parm.qustionType = $(this).attr("title");
			parm.qustionName = typeName;
			parm.flag="111";
			var jsonStr = JSON.stringify(parm);
			
			jsonStr = UrlEncode(jsonStr);
//			$.saveUserBehaviorAnalyzer(
//					"tongdaoPlatform\\App\\html\\help\\helpcenterInfo.html", "离开", "帮助中心",
//					typeName, null, null, null, false);
			window.location.href=base.url + "/tongdaoApp/html/account/help/helpcenter.html?jsonKey="+jsonStr;
		});
	}else{
		modelAlert("请求异常");
	}
}

function init(){
	/*设置滑动区域*/
	$.setscroll();
}
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#helpcenters").height(Scrollheight +"px");
};