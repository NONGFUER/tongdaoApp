//试算条件
var calChoices = []; 
var calNames	= [];
var choiceEdit = [];
var lowAge = "";
var upAge = "";
$(function(){
    $.setscroll("bodyMuiScroll");
    buyBind();
    jieshaoToshuomingBind();		//介绍和产品详情间的切换
    //productInfoRender(data1);
    //在线产品详情查询(ccCode,cityCode,provinceCode,type)  商品组合code,城市代码code,省code,用户角色
    sendProductInfoRequest( ccCode, cityCode, provinceCode, roleType );	
    //根据商品组合id查询保费试算项 (ccId)           商品组合Id
    sendCalOptionsRequest( ccId );       
	getServiceTime()
	addChoice();
	for( var i = 0; i < calChoices.length; i++ ){
    	choiceBind( calNames[i] );
    }
	console.log(calChoices);
	console.log(choiceEdit);
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
            "commodityCombinationId": ccId
		} 
     }
	 for(var i = 0; i < calChoices.length/2; i++){
		 var propName  = calChoices[2*i];
		 var propValue = calChoices[2*i+1];
		 sendJson.body[propName] = propValue;
	 }
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
    cPrem = data.returns.premiun;
    $("#jwx_foot_price").text("价格：￥" + data.returns.premiun);
}
//试算条件
function calOptionsRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var calOptionDtos = body.calOptionDtos;
        var j = 0;
        for(var i = 0; i < calOptionDtos.length; i++){
           var calName    = calOptionDtos[i].calName;
           var calCode    = calOptionDtos[i].calCode;
           var isCal	  = calOptionDtos[i].isCal;
           var showType   = calOptionDtos[i].showType;
           var calOptions = calOptionDtos[i].calOptions;
           var calDetails = calOptionDetails(calOptions,calCode);
           //addChoice( isCal, calCode );//将试算条件放入试算组 
           upAndLowDate( calCode, calOptions );
           var str = "";
           if( isCal == "1" ){      	   
        	   str += '<div class="d1 biCal" id="cal'+j+'" name="'+calCode+'">';
        	   j++
           }else{
        	   str += '<div class="d1">';
           }          
           str += '<div class="label">' + calName+ '：</div>';
           str += '<div class="conter" id="' + calCode + '">';
           if( showType == 'date'){
        	   
        	   str += '<input id="birthdate" type="text" readonly="readonly">';
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
function calOptionDetails(calOptions){
    var optionsLength = calOptions.length;
    var str = "";
    str += '<ul class="radio" >'
    for(var i = 0; i < optionsLength; i++){
    	//addChoiceValue(calOptions[i].isCal, calOptions[i].isDefalut, calOptions[i].enuCode );
       if( calOptions[i].isDefalut == "1" ){   	   
    	   str += '<li class="on" data-value="' + calOptions[i].enuCode + '" data-cid="' + calOptions[i].commodityId + '" >' + calOptions[i].enuContent + '</li>'
       }else{
           str += '<li data-value="' + calOptions[i].enuCode + '" data-cid="' + calOptions[i].commodityId + '" >' + calOptions[i].enuContent + '</li>'
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
        cId   = body.CommodityInfo[0].id;
        cName = body.CommodityInfo[0].commodityName;
        ccName = commodityCombination.commodityCombinationName;
        $(".banner-img").attr("src",commodityCombination.banner);
        $("#commodityCombinationName").text(ccName);
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
function addChoice(){
	calChoices = [];
	$(".biCal").each(function(index,obj){
		var chioceName  = $(this).attr("name");//试算条件名
		calChoices.push(chioceName);
		calNames.push(chioceName);
		if( chioceName == "insuredAge"){
			var chioceValue =  $(this).attr("data-value");
		}else{
			var chioceValue = $(this).find('.on').attr("data-value");//试算值
		}
		var calObj = {
				name  : chioceName,
				value : chioceValue
		}
		choiceEdit.push(calObj);
		calChoices.push(chioceValue);
	});
} 
//往试算组里面加条件值
function addChoiceValue( flag,flag1, chioceValue){
	if( flag == "1" && flag1 == "1" ){
		calChoices.push( chioceValue )
	}
}
//绑定不同条件项的枚举选项
function choiceBind( calName ){
	$("#"+calName).find("li").bind("tap",function(){
		tab($(this),"on");
		addChoice();
		console.log(calName +":"+$(this).attr("data-value"));//
		sendCaldoRequest( ccId );
	});
}
//取得最大最小值
function upAndLowDate( code, options){
	if( code == "insuredAge"){
		lowAge = parseInt(options[0].enuContent);
		upAge  = parseInt(options[1].enuContent);
	}
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
    	if( lowAge == 0 ){
    		currentTime.setDate(currentTime.getDate() - 30);//出生30天
    	}else{
    		currentTime.setFullYear(currentTime.getFullYear()-lowAge, currentTime.getMonth(), currentTime.getDate());
    	}
    	currTime.setFullYear(currTime.getFullYear()-upAge+1, currTime.getMonth(), currTime.getDate()+1);//55周岁    	
    	//currentTime.setFullYear(currentTime.getFullYear()-0, currentTime.getMonth(), currentTime.getDate()-30);//18周岁
    	var year = currTime.getFullYear(),month= currTime.getMonth()+1,day = currTime.getDate();
    	defaultTime=$.getTimeStr2(currentTime);
    	var endYear = currentTime.getFullYear(),endMonth = currentTime.getMonth()+1,endDay = currentTime.getDate();
    	$("#insuredAge input").attr("data-options",'{"type":"date","value":"'+defaultTime+'","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":'+endYear+',"endMonth":'+endMonth+',"endDay":'+endDay+'}');	
    	$("#insuredAge input").val(defaultTime);
    	var age = $.getAge(defaultTime);
		console.log(":" + age);
		$("div[name='insuredAge']").attr("data-value",age);
//    	//premiumCalculation();
//    	var homeAge = ages(defaultTime);//
//    	jkaxCalculation(homeAge,"1");
    	changeDate("birthdate");
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
				var age = $.getAge(rs.text);
				console.log(id + ":" + age);
				$("div[name='insuredAge']").attr("data-value",age);
				//console.log($.getAge(rs.text));
				//
				addChoice();
				sendCaldoRequest( ccId );
				picker.dispose();
			});		
		});	
	}	
}
function buyBind(){
	$("#toubao").unbind('tap').bind('tap',function(){
		toInsure();
	});	
}
function toInsure(){
	if($("div[name='versions']").length != 0){
		cId = $("div[name='versions']").find(".on").attr("data-cid");
		cName = ccName + "" + $("div[name='versions']").find(".on").html() ;
		alert(cId+":"+cName);
	}
	title = "投保"
	urlParm.cId = cId;
	urlParm.cName = cName;
	urlParm.cPrem = cPrem;
	urlParm.title = title; 
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "insure.html?jsonKey="+jsonStr;
}