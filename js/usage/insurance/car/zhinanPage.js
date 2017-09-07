var jsonStr;
$(function() {
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	parm.title="选择投保方案";
	jsonStr = JSON.stringify(parm);
	jsonStr = UrlEncode(jsonStr);
	/*--------------返回-----------*/
	$(".backButtom").unbind("tap").bind("tap",function() {
		//window.history.back();
		window.location.href = "insuranceCoverage.html?jsonKey=" + jsonStr;
	});
});


function backlast(){//返回上一页
	//window.history.back();
	window.location.href = "insuranceCoverage.html?jsonKey=" + jsonStr;
}