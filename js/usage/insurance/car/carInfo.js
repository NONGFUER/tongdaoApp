$(function() {
	$.setscrollarea("indexpart");
	$(".h_back").unbind("tap").bind("tap",function() {
		backlast();
	});
});



function backlast(){//返回上一页
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	if(parm.body!=undefined){
		parm.title="车险信息";
		parm.body.pagesflag="1";
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "carMes.html?jsonStr="+ jsonStr;
	}else{
		
		var str = window.location.search;
		str = str.substr(9, str.length);
		str = UrlDecode(str);
		parm = JSON.parse(str);
		parm.title="车险信息";
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "carMes.html?jsonStr="+ jsonStr;
	}
}