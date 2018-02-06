var dicChannelList = [];
var dicCodeList    = [];
var remarkList	   = [];
var ccStayus = '';
$(function(){
	if( isComing == "1"){
		$("#toubao").css({background:"#ccc"});
	}
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
    	if( isComing == "1"){
			return false;
		}
    	if(ccStayus == '0'){
			modelAlert("此产品已下架！");
			return false;
		}
    	isLogin(roleType,toFillPolicyHtml);
    	//toFillPolicyHtml();//跳转到投保信息
    });
    /**拨打电话*/
	$(".kefu").unbind("tap").bind("tap",function(){
    	callService("4006895505",".kefuPhone");
    })
    $(".rexian").unbind("tap").bind("tap",function(){
    	callService("95505",".rexian");
    })
    $(".hospital").unbind("tap").bind("tap",function(){
    	toHospital();
    });
	if(roleType != '00' && shareFlag == 'Y'){       //二次分享（即分享页面中也可分享，满足登陆用户）
        var title = "易安挂号险";
    	var desc = "绿色通道挂号服务，就诊咨询，就医陪诊";
    	var picUrl = getProductSharePic('14');
    	var shareUrl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId=14&type=6';
    	wechatShare(title,desc,picUrl,shareUrl);
    }
	if( roleType != "00" && isComing != "1"){
	   	 showRightIcon();
	}
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
		ccStayus = commodityCombination.commodityCombinationStatus;	//上下架状态 1-上架 0-下架
	    if( ccStayus == "0"){
	    	$("#toubao").css({background:"#ccc"});
	    }
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
	//var  cPrem = 0;
	var bLength = $("#expandperson").find(".on").length;
	//var cLength = $("#diagnosis").find(".on").length;
	if( bLength != 0 ){
		for( var i = 0; i < bLength; i++ ){
			bPrem += parseInt($("#expandperson").find(".on").eq(i).attr("data-value"));
		}
	}else{
		bPrem = 0;
	}
//	if( cLength != 0 ){
//		cPrem = parseInt($("#diagnosis").find(".on").attr("data-value"));
//		var index = $("#versions").find(".on").data("index") + 1;
//		urlParm.isA = "1";
//	}else{
//		cPrem = 0;
//		var index = $("#versions").find(".on").data("index");
//		urlParm.isA = "0";
//	}
	var index = $("#versions").find(".on").data("index");
	if( index == '0' || index == '2' || index == '4' ){
		urlParm.isA = "0";
	}else{
		urlParm.isA = "1";
	}
	var  totalPrem = parseInt(aPrem) + parseInt(bPrem);
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
	console.log(aPrem+" "+bPrem+" "+premStr);
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
	urlParm.ccId     = "14";
	var indax = $("#versions").find(".on").data("index");
	if( indax == "0" || indax == "1" ){		
		urlParm.bzPic = "http://jichupro.oss-cn-szfinance.aliyuncs.com/commodityCombination/commodityBaoZhang/00500001.png"
	}else if( indax == "2" || indax == "3" ){		
		urlParm.bzPic = "http://jichupro.oss-cn-szfinance.aliyuncs.com/commodityCombination/commodityBaoZhang/00500002.png"
	}else if( indax == "4" || indax == "5" ){		
		urlParm.bzPic = "http://jichupro.oss-cn-szfinance.aliyuncs.com/commodityCombination/commodityBaoZhang/00500003.png"
	}
	
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/main/insure.html?jsonKey=" + jsonStr;
}
//
function toHospital(){
	urlParm.title    = "医院列表";
	urlParm.leftIcon = "1";
	urlParm.rightIco = "0";
	urlParm.downIco  = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/ghx/hospitalList.html?jsonKey=" + jsonStr;
}

/*function shareHandle(){
	var title = "易安挂号险";
	var desc  = "绿色通道挂号服务，就诊咨询，就医陪诊" ;	
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type=6';
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};*/

function backlast(){
	if(entry == 'mall' && shareFlag == "Y"){
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href =  base.url + 'tongdaoApp/html/share/insurance/insuranceMall.html?openid='+openid +'&roletype='+roleType +'&mobile='+mobile+'&shareMobile='+shareMobile+'&shareCusId='+shareCusId+'&provinceCode='+provinceCode+'&cityCode='+cityCode+'&cusId='+customerId+'&shareFlag=Y'
	}else{
		sysback();
	}
	
}
function shareHandle(){		
	urlParm.fl='2';				//判断是否是产品详情
	urlParm.ccName="易安挂号险";		//产品名称
	urlParm.ccId=ccId;			//产品编号
	urlParm.name = "易安挂号险";
	urlParm.desc= "绿色通道挂号服务，就诊咨询，就医陪诊";	
	var title = "易安挂号险";
	var desc  = "绿色通道挂号服务，就诊咨询，就医陪诊" ;	
	var picUrl = getProductSharePic(ccId);	
	var flag = '3';		
	urlParm.state='6';
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type=6';	
	//shareMethod(shareurl,title,desc,"baodan",picUrl);
	urlParm.picUrl=picUrl;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink=base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+jsonStr;
	shareMethod(shareurl, title, desc,flag,picUrl,twolink);
};
function toQrcodeUrl(){
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink = base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+jsonStr;
	window.location.href = twolink;
}