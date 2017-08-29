$(function(){
    $.setscroll("bodyMuiScroll");
    jieshaoToshuomingBind();
    //productInfoRender(data1);
    sendProductInfoRequest();
    sendCalOptionsRequest();
    sendCaldoRequest();
    //calOptionsRender(data4);
});
//
function sendCaldoRequest(){
	 var url = requestUrl.calDoUrl;
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": ""
		},
		"body" : {
            "commodityCombinationId": "1",
            "versions": "02",
            "insuredAge":19,
            "insuredAmount":500000
		} 
     }
     $.reqAjaxs( url, sendJson, calDoRender ); 
}
//根据商品组合id查询保费试算项
function sendCalOptionsRequest(){
    var url = requestUrl.calOptionsUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationId": '9'//11-商务飞人  9-健康安详
        }
    }
    $.reqAjaxs( url, sendJson, calOptionsRender ); 
}
//在线产品详情查询
function sendProductInfoRequest(){
    var url = requestUrl.onlineProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationCode": '00400009',//
            "cityCode":"220001",
            "type":"04",
            "provinceCode":"220000"
        }
    }
    $.reqAjaxs( url, sendJson, productInfoRender ); 
}
/**
 * @function 试算
 */
function calDoRender(data){
    console.log(data);
}
//试算条件
function calOptionsRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var calOptionDtos = body.calOptionDtos;
        for(var i = 0; i < calOptionDtos.length; i++){
           var calName    = calOptionDtos[i].calName;
           var calOptions = calOptionDtos[i].calOptions;
           var calDetails = calOptionDetails(calOptions);
           var str = "";
           str += '<div class="d1">';
           str += '<div class="label">' + calName+ '：</div>';
           str += '<div class="conter">';
           str += calDetails;
           str += '</div>';
           $(".insurance-choice").append(str);         
        }
       
    }else{
        modelAlert( message.requestFail );
    }
}
//试算枚举
function calOptionDetails(calOptions){
    var optionsLength = calOptions.length;
    var str = "";
    if( optionsLength == 1 ){
        str += calOptions[0].enuContent;
    }else{
        str += '<ul class="radio">'
        for(var i = 0; i < optionsLength; i++){
            str += '<li>' + calOptions[i].enuContent + '</li>'
        }
        str += '</ul>'
    }
    return str;

}
/**
 * @function 请求响应的线上产品详情数据
 * @param {*} data 
 */
function productInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var commodityCombinationModuleMapper = body.commodityCombinationModuleMapper;
        var commodityCombination             = body.commodityCombination;
        $("#commodityCombinationName").text(commodityCombination.commodityCombinationName);
        $("#companyName").text("");
        for(var i = 0; i < commodityCombinationModuleMapper.length; i++){
            moduleStr(commodityCombinationModuleMapper[i])
        }
    }else{
        modelAlert( message.requestFail );
    }
}

function moduleStr(mapperList){	
	var str = "";
	str += '<dl class="mb10 whitebackground">';
	str += '<dt class="dt">' + mapperList.moduleName + '</dt>';
	str += '<dd class="dd">';	
	if( mapperList.moduleType == "02" ){
		if( mapperList.moduleName == "保障责任" ){
			str += tableGener(mapperList.modueInfo);
		}else{
			str += mapperList.modueInfo;	
		}	    
	}      								
	    str += '</dd></dl>';  
    if( mapperList.bigModuleName == "产品介绍" ){
        $(".jieshao").append(str);
    }else if( mapperList.bigModuleName == "详细说明" ){
        $(".shuoming").append(str);
    }
}
//产品介绍 详情说明切换
function jieshaoToshuomingBind(){
    $(".insurance-tab").find("li").bind("click", function() {
        tab($(this),'on1');					
        $(".insurance-tab_content").hide().eq($(this).index()).show();					
    })
}
function tab(a, flag) {
	$(a).siblings().removeClass(flag); 
	$(a).addClass(flag);
};
//保障责任
function tableGener(dutyStr){
	var trCell = dutyStr.split("|");
	var tableStr = '<table class="gridtable">'
	for(var k = 0; k < trCell.length; k++){
		var tdCell = trCell[k].split("-");
		tableStr += '<tr>'
		for(var j = 0; j < tdCell.length ; j++){
			if( k == 0){
				tableStr += '<th>'+tdCell[j]+'</th>'
			}else{
				tableStr += '<td>'+tdCell[j]+'</td>'
			}					
		}
		tableStr += '</tr>'		
	}
	tableStr += '</table>'
	return tableStr;
}