$(function() {
	/*--------------返回-----------*/
	$(".backButtom").unbind("tap").bind("tap",function() {
		window.history.back();
	});
});


function backlast(){//返回上一页
	window.history.back();
}