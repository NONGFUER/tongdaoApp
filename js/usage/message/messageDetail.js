var messagecontext;
var messageTime;
var messageId;
var customerId;
var myScroll;
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	messageId = urlParm.messageId,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
$(function() {
//	if (myapi().isSamSung() == 1) {
//		$("#indexpart").css("overflow", "auto");
//	} else {
//		$("#indexpart").css("overflow", "hidden");
//		$("#indexpart_scroll").css({
//			"position" : "absolute",
//			"width" : "100%",
//		});
//	}
//	$("#indexpart").css("height",
//			($("body").height() - $("header").height() - 20 + "px"));
//	
//	if (myapi().isSamSung() == 1) {
//		jq("#indexpart").niceScroll("#indexpart .wrapper");
//	} else {
//		myScroll = new iScroll('indexpart', {
//			vScrollbar : false,
//		});
//	};
	
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
	});
	
//	messagecontext = myapi().getMessageInfo();
//	messageTime = myapi().getGlobal("messageTime");
//	messageId = "1918";
//	customerId = "802";
//	alert("messagecontext=" + messagecontext);
//	alert("messageId=" + messageId);
	
	//加载消息详情
	loadMessageDetail();
	
//	// 加载数据渲染
//	$.messagescontent();
	$("#main_btn_goBack").unbind("tap").bind("tap",function() {
		if(systemsource == "ios"){
			objcObject.OpenUrl("back");
		}else if(systemsource == "android"){
			android.goBack();
		}
	});
});

function backlast(){
	sysback();
}

//加载消息详情不并设置已读
function loadMessageDetail() {
	var parm = {};
//	parm.messageId = myapi().getMessageID();
//	parm.messageInfo = myapi().getMessageInfo();
//	parm.userName = myapi().getGlobal("UserName");
//	var url = myapi().url + "messagePush/queryMessageContextByContent.do";
//	myapi().toAjax(url, parm, "loadMessageDetailCallBack");

	var url = base.url + 'messageCenter/getMessageDetail.do';
	var sendJson = {
		  "head": {
		    "channel": "01",
		    "userCode": userCode,
		    "transTime": $.getTimeStr(),
		    "transToken":transToken
		  },
		  "body": {
			 "messageId": messageId,		   
		     "customerId": customerId
		  }
		}
	$.reqAjaxs( url, sendJson, loadMessageDetailCallBack );

};

/**
 * 加载消息详情回调
 */
function loadMessageDetailCallBack(param) {
	if (param != "") {
		console.log(param);
		if (param.statusCode == "000000") {
			messagecontext = param.returns.messageContent.messageContent;
			messageTime = param.returns.messageContent.pushTime;// dealtimes
			// 加载数据渲染
			$.messagescontent();
			//修改消息状态为已读
//			setReadMessage(paramList.pwdMessage.id);
		}
	}
};

//修改消息状态为已读
//function setReadMessage(messageId) {
//	var parm = {};
//	parm.messageId = messageId;
//	parm.phone = myapi().getGlobal("UserName");
//	var url1 = myapi().url + "messagePush/readMessage.do";
//	myapi().toAjax(url1, parm, null);
//};
	

$.messagescontent = function() {
	var messagestr = "";
//	var mTime = timeFormatDate(messageTime.time, 'yyyy-MM-dd HH:mm:ss');
	messagestr += "<div class='messages_infort'><div class='messages_infort_content'>"
			+ messagecontext + "</div>";
	messagestr += "</div>";
	messagestr += "<div class='messages_time'><span>" + messageTime + "</span>";/*"2015-09-17 15:09:05"*/
	messagestr += "</div>";
	$("#messages_main").html(messagestr);
//	refreshIscroll();
};
//function refreshIscroll() {
//	if (myapi().isSamSung() == 1) {
//		jq("#indexpart").niceScroll("#indexpart .wrapper").resize();
//	} else {
//		myScroll.refresh();
//	}
//};