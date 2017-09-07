$(function(){
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	$(".h_back").unbind("tap").bind("tap",function(){
		backlast()
	});

	/*设置滑动区域*/
	$.setscroll();	
});

/*设置滑动区域*/
$.setscroll = function(){
	var Scrollheight = window.innerHeight - $("header").height();
	$("#noticecontent").height(Scrollheight+"px");
	mui("#noticecontent").scroll();
};


function backlast(){//返回上一页
	//window.history.back();
	parm.title="精确报价";
	var jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr);
	window.location.href = "quote.html?jsonKey=" + jsonStr;
}