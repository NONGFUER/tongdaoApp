var dicChannelList = [];
var dicCodeList    = [];
var remarkList	   = [];
$(function(){
    $.setscroll("bodyMuiScroll"); 
    sendProductInfoRequest("14");
    
    jieshaoToshuomingBind()
    $("#versions").find("li").bind("tap",function(){
    	tab($(this),"on");
    	calPrem()
    });
    $("#expandperson").find("li").bind("tap",function(){
    	muitab1($(this),"on");
    	calPrem()
    });
    $("#diagnosis").find("li").bind("tap",function(){
    	muitab($(this),"on");	
    	calPrem()
    });
    $("#toubao").bind("tap",function(){
    	toFillPolicyHtml();//跳转到投保信息
    });
    /**拨打电话*/
	$(".kefu").unbind("tap").bind("tap",function(){
    	callService("4006895505",".kefuPhone");
    })
    $(".rexian").unbind("tap").bind("tap",function(){
    	callService("95505",".rexian");
    })
});

function sendProductInfoRequest(ccId){
	 var url = requestUrl.ghxProductInfo;	 
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": ""
		},
		"body" : {
           "commodityComId": ccId
		} 
    }
    $.reqAjaxs( url, sendJson, sendProductInfoCallBack ); 
}

function sendProductInfoCallBack(data){
	console.log(data);
	if( data.statusCode == "000000" ){
		var body = data.returns;
		var listProductCode      = body.listProductCode;
		var CommodityCombination = body.CommodityCombination;
		var CompanyProfile		 = body.CompanyProfile;
		for( var i = 0; i < listProductCode.length; i++){
			dicChannelList.push( listProductCode[i].dicChannel );
			dicCodeList.push( listProductCode[i].dicCode );
			remarkList.push( listProductCode[i].remark );
		}
		console.log(dicChannelList);
		console.log(dicCodeList);
		console.log(remarkList);
		urlParm.cName =  CommodityCombination.commodityCombinationName;
		calPrem();
		
	}else{
		modelAlert(data.statusMessage);
	}
}

//产品介绍 详情说明切换
function jieshaoToshuomingBind(){
    $(".insurance-tab").find("li").bind("click", function() {
        tab($(this),'on1');					
        $(".insurance-tab_content").hide().eq($(this).index()).show();					
    })
}

function calPrem(){
	var  aPrem= $("#versions").find(".on").attr("data-value");
	var  bPrem = 0;
	var  cPrem = 0;
	var bLength = $("#expandperson").find(".on").length;
	var cLength = $("#diagnosis").find(".on").length;
	if( bLength != 0 ){
		for( var i = 0; i < bLength; i++ ){
			bPrem += parseInt($("#expandperson").find(".on").eq(i).attr("data-value"));
		}
	}else{
		bPrem = 0;
	}
	if( cLength != 0 ){
		cPrem = parseInt($("#diagnosis").find(".on").attr("data-value"));
		var index = $("#versions").find(".on").data("index") + 1;
		urlParm.isA = "1";
	}else{
		cPrem = 0;
		var index = $("#versions").find(".on").data("index");
		urlParm.isA = "0";
	}
	var  totalPrem = parseInt(aPrem) + parseInt(bPrem) + parseInt(cPrem);
	var premStr = "价格￥"+totalPrem;
	$("#jwx_foot_price").text(premStr);

	ghxDicChannel = dicChannelList[index];
	ghxDicCode = dicCodeList[index];
	ghxRemark = remarkList[index];
	urlParm.fumuFlag = $("#fumu").attr("data-flag");
	urlParm.peiouFlag = $("#peiou").attr("data-flag");
	urlParm.zinvFlag = $("#zinv").attr("data-flag");
	urlParm.qitaFlag = $("#qita").attr("data-flag");
	urlParm.banbenFlag = $("#versions").find(".on").attr("data-banben");
	urlParm.cId = $("#versions").find(".on").attr("data-cid");
	console.log(aPrem+" "+bPrem+" "+cPrem + " " +premStr);
	console.log(ghxDicChannel+" "+ghxDicCode+" "+ghxRemark );
	urlParm.ghxDicChannel = ghxDicChannel;
	urlParm.ghxDicCode    = ghxDicCode;
	urlParm.ghxRemark     = ghxRemark;
	urlParm.cPrem         = totalPrem;
	return totalPrem;
}

function tab(a, flag) {
	$(a).siblings().removeClass(flag); 
	$(a).addClass(flag);
};
function muitab(a, flag) {
	if($(a).hasClass(flag)){
		$(a).removeClass(flag);
	}else{
		$(a).addClass(flag);
	}
	
};
function muitab1(a, flag) {
	if($(a).hasClass(flag)){
		$(a).removeClass(flag);
		$(a).attr("data-flag","0")
	}else{
		$(a).addClass(flag);
		$(a).attr("data-flag","1")
	}
	
};

//跳转到投保填写
function toFillPolicyHtml(){
	urlParm.title    = "投保信息";
	urlParm.leftIcon = "1";
	urlParm.rightIco = "0";
	urlParm.downIco  = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( roleType == "00" || roleType == "" ){
		window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?jsonKey="+jsonStr+"&fromtype=ghx&openid="+openid;
	}else{
		window.location.href = base.url + "tongdaoApp/html/share/insurance/main/insure.html?jsonKey=" + jsonStr;
	}
	
}

function shareHandle(){
	var title = "易安挂号险";
	var desc  = "绿色通道挂号服务，就诊咨询，就医陪诊" ;	
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type=6';
	var picUrl = "";
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};

function backlast(){
	sysback();
}