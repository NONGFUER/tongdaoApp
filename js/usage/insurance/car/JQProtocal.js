var iframeflag;
$(function(){
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
	window.history.back();
}