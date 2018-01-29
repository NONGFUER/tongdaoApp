$(function() {
	var str = window.location.search;
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	$.setscrollarea("indexpart");
	$(".h_back").unbind("tap").bind("tap",function() {
		backlast();
	});
});



function backlast(){//返回上一页
	parm.title="车辆信息";
	parm.rightIco="1";
	if(parm.body!=undefined){
		parm.body.pagesflag="1";
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "carMes.html?jsonKey="+ jsonStr;
	}else{
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "carMes.html?jsonKey="+ jsonStr;
	}
}