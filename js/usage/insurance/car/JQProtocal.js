var iframeflag;
$(function(){
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	/*设置滑动区域*/
	$.setscroll();
	/*返回上一页*/
	$(".shiming_back").unbind("tap").bind("tap",function(){
		backlast();
	});
	
});
/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#inpartmain").height(Scrollheight+"px");
	mui("#inpartmain").scroll();
};



function backlast(){//返回上一页
	//window.history.back();
	parm.title="保险条款";
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr);
	window.location.href = "insuranceTerms.html?jsonKey=" + jsonStr;
}