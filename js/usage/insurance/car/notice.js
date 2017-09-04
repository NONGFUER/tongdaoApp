$(function(){
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
	window.history.back();
}