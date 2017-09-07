$(function(){
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	/*设置滑动区域*/
	$.setscroll();
	$(".h_back").unbind("tap").bind("tap",function(){
		backlast();
	});
	//商业险条款
	$("#SYProtocal").unbind("tap").bind("tap",function(){
		parm.title="车险商业险条款";
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "JQProtocal.html?jsonKey=" + jsonStr;
	})
	//交强险条款
	$("#JQProtocal").unbind("tap").bind("tap",function(){
		parm.title="车险交强险条款";
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "JQProtocal.html?jsonKey=" + jsonStr;
	})
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