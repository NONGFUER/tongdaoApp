//试算条件
var calChoices = [];  
$(function(){
    $.setscroll("bodyMuiScroll");
    jieshaoToshuomingBind();		//介绍和产品详情间的切换
    //productInfoRender(data1);
    //在线产品详情查询(ccCode,cityCode,provinceCode,type)  商品组合code,城市代码code,省code,用户角色
    sendProductInfoRequest( ccCode, cityCode, provinceCode, roleType );	
    //根据商品组合id查询保费试算项 (ccId)           商品组合Id
    sendCalOptionsRequest( ccId );
    console.log(calChoices);
    for( var i = 0; i < calChoices.length; i++ ){
    	choiceBind( calChoices[i] );
    }
	getServiceTime()
    //根据保费试算项进行保费试算
    sendCaldoRequest( ccId );
    //calOptionsRender(data4);
});
//根据保费试算项进行保费试算
function sendCaldoRequest(ccId){
	 var url = requestUrl.calDoUrl;
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": ""
		},
		"body" : {
            "commodityCombinationId": ccId,
            "versions": "02",
            "insuredAge":19,
            "insuredAmount":500000
		} 
     }
	 
	 sendJson.body["versions"]      = "02"; //versions;
	 sendJson.body["insuredAge"]    = 19;
	 sendJson.body["insuredAmount"] = 500000;
     $.reqAjaxsFalse( url, sendJson, calDoRender ); 
}
//根据商品组合id查询保费试算项
function sendCalOptionsRequest(ccId){
    var url = requestUrl.calOptionsUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationId": ccId//11-商务飞人  9-健康安详
        }
    }
    $.reqAjaxsFalse( url, sendJson, calOptionsRender ); 
}
//在线产品详情查询
function sendProductInfoRequest(ccCode,cityCode,provinceCode,type){
    var url = requestUrl.onlineProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "commodityCombinationCode": ccCode,//
            "cityCode":cityCode,//"220001",
            "type":type,//"04",
            "provinceCode":provinceCode//"220000"
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
           var calCode    = calOptionDtos[i].calCode;
           var isCal	  = calOptionDtos[i].isCal;
           var showType   = calOptionDtos[i].showType;
           var calOptions = calOptionDtos[i].calOptions;
           var calDetails = calOptionDetails(calOptions,calCode);
           addChoice( isCal, calCode );//将试算条件放入试算组           
           var str = "";
           str += '<div class="d1">';
           str += '<div class="label">' + calName+ '：</div>';
           str += '<div class="conter">';
           if( showType == 'date'){
        	   str += '<input id="' + calCode+ '" type="text" readonly="readonly">';
           }else if( showType == 'listArea' ){
        	   str += calDetails;
           }else if( showType == 'label' ){
        	   str += calOptions[0].enuContent
           }           
           str += '</div>';
           $(".insurance-choice").append(str);         
        }
        
    }else{
        modelAlert( message.requestFail );
    }
}
//试算枚举
function calOptionDetails(calOptions,calOptionId){
    var optionsLength = calOptions.length;
    var str = "";
    str += '<ul class="radio" id="'+calOptionId+'">'
    for(var i = 0; i < optionsLength; i++){
       if( calOptions[i].isDefalut == "1" ){
        	str += '<li class="on" data-value="' + calOptions[i].enuCode + '">' + calOptions[i].enuContent + '</li>'
       }else{
        	str += '<li data-value="' + calOptions[i].enuCode + '">' + calOptions[i].enuContent + '</li>'
       }
    }
    str += '</ul>'   
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
        var companyProfile 					 = body.companyProfile;
        $("#commodityCombinationName").text(commodityCombination.commodityCombinationName);
        $("#companyName").text(companyProfile.companyName);
        for(var i = 0; i < commodityCombinationModuleMapper.length; i++){
            moduleStr(commodityCombinationModuleMapper[i])
        }
    }else{
        modelAlert( message.requestFail );
    }
}
//防癌险页面模块配置
function moduleStr(mapperList){	
	var str = "";
	if( mapperList.moduleName == "图片介绍" ){
		str += '<img src="' + mapperList.modueInfo + '" class="mb10">';
	}else {
		str += '<dl class="mb10 whitebackground">';
		str += '<dt class="dt">' + mapperList.moduleName + '</dt>';
		str += '<dd class="dd">';	
		if( mapperList.moduleType == "02" ){
			if( mapperList.moduleName == "保障责任" ){
				str += tableGener(mapperList.modueInfo);
			}else{
				str += mapperList.modueInfo;	
			}	    
		}else if( mapperList.moduleType == "03" ){//链接
			str += '<span class="btn1 fl" onclick="toArticle()">合同条款</span><a href="'+mapperList.modueInfo+'" class="btn1 ri" id="hetongDemo">合同样张</a>'
		}      								
		str += '</dd></dl>';
	}
	  
    if( mapperList.bigModuleName == "产品介绍" ){//属于产品介绍的进jieshao
        $(".jieshao").append(str);
    }else if( mapperList.bigModuleName == "详细说明" ){//属于详细说明的进shuoming
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
//往试算组里面加条件
function addChoice ( flag, chioceName ){
	if( flag == "1" ){
		calChoices.push( chioceName )
	}	
	return calChoices;
} 
//绑定不同条件项的枚举选项
function choiceBind( calName ){
	$("#"+calName).find("li").bind("tap",function(){
		tab($(this),"on");
		console.log(calName +":"+$(this).attr("data-value"));
	});
}
/**获取服务器时间*/
function getServiceTime(){
	var url = requestUrl.getServeTimeUrl;
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":mobile,
			"transTime":$.getTimeStr()
		},"body":{ }
	}	
	$.reqAjaxsFalse( url, reqData, timeRender );
}
//初始化时间控件
function timeRender(data){
    if(data.statusCode == "000000") {
    	var currTime=new Date(data.returns.serviceTime);
    	var currentTime=new Date(data.returns.serviceTime);	    	
    	currTime.setFullYear(currTime.getFullYear()-17, currTime.getMonth(), currTime.getDate()+1);//55周岁
    	currentTime.setFullYear(currentTime.getFullYear()-0, currentTime.getMonth(), currentTime.getDate());//18周岁
    	var year = currTime.getFullYear(),month= currTime.getMonth()+1,day = currTime.getDate();
    	defaultTime=$.getTimeStr2(currentTime);
    	var endYear = currentTime.getFullYear(),endMonth = currentTime.getMonth()+1,endDay = currentTime.getDate();
    	$("#insuredAge").attr("data-options",'{"type":"date","value":"'+defaultTime+'","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":'+endYear+',"endMonth":'+endMonth+',"endDay":'+endDay+'}');	
    	$("#insuredAge").val(defaultTime);
//    	//premiumCalculation();
//    	var homeAge = ages(defaultTime);//
//    	jkaxCalculation(homeAge,"1");
    	changeDate("insuredAge");
    }else {
	   modelAlert(data.statusMessage);
	}
}
/**---出生日期 时间控件---*/
function changeDate(id){
	var result = document.getElementById(id);
	if(result){
		result.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				result.value = rs.text;
//				var age = ages(rs.text);
//				var gender = $("#gender").find(".on").attr("data-value");
//				jkaxCalculation(age,gender);
//				console.log(ages(rs.text));
				console.log(id + ":" + rs.text);
				console.log($.getAge(rs.text));
				picker.dispose();
			});		
		});	
	}
	
}