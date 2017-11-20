var calChoices = urlParm.calChoices;
var ageCal = "";
var genderCal = "";
var holder = urlParm.holder;
var holdertwo = urlParm.holdertwo;
var holderthree = urlParm.holderthree;
var holderfour = urlParm.holderfour;
$(function(){
	console.log(urlParm); //删
	getCalculateOptions();	//获取试算条件
	sendCaldoRequest(ccId); //进行保费试算并显示
	showProductInfo(cName,cPrem,urlParm.bzPic);		//保险信息展示
	commomHolder(holder);
	commomHoldertwo(holdertwo);
	commomHolderthree(holderthree);
	commomHolderfour(holderfour);
	idNoChange("#certificateNo","#gender","#birthDate");					//监控投保人身份证
	idNoChange("#recogCertificateNo2","#recogGender2","#recogBirthDate2");	//监控被保人信息2身份证
	idNoChange("#recogCertificateNo3","#recogGender3","#recogBirthDate3");	//监控被保人信息3身份证
	idNoChange("#recogCertificateNo4","#recogGender4","#recogBirthDate4");  //监控被保人信息4身份证
	getServiceTime()
	//跳转到保险条款页面
	$(".tiaokuan").unbind("tap").bind("tap",function(){
	    toArticle();
	});	
	//跳转到保险条款页面
	$(".xuzhi").unbind("tap").bind("tap",function(){
	    toXuzhi();
	});	
	//跳转到常用保险人
	$("#commonHolders").unbind("tap").bind("tap",function(){
		urlParm.userCode = mobile;
		urlParm.title = "常用投保人";
		urlParm.rightIco = "4";
		urlParm.frompage = "familyInsureHtml"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href= base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey="+jsonStr;
	});
	//跳转到常用保险人2
	$("#commonHolderstwo").unbind("tap").bind("tap",function(){
		urlParm.userCode = mobile;
		urlParm.title = "常用被保人二";
		urlParm.rightIco = "4";
		urlParm.frompage = "familyInsureHtml"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href= base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey="+jsonStr;
	});
	//跳转到常用保险人3
	$("#commonHoldersthree").unbind("tap").bind("tap",function(){
		urlParm.userCode = mobile;
		urlParm.title = "常用被保人三";
		urlParm.rightIco = "4";
		urlParm.frompage = "familyInsureHtml"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href= base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey="+jsonStr;
	});
	//跳转到常用保险人4
	$("#commonHoldersfour").unbind("tap").bind("tap",function(){
		urlParm.userCode = mobile;
		urlParm.title = "常用被保人四";
		urlParm.rightIco = "4";
		urlParm.frompage = "familyInsureHtml"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href= base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey="+jsonStr;
	});
	//点击条款勾选按钮
	$("#tiaokuan").unbind("tap").bind("tap",function(){
	    if($("#word").hasClass("on")){
	        $("#word").removeClass("on");
	        $(".insure_footer .a1").css("background-color","#ccc");
	    }else{
	        $("#word").addClass("on");
	        $(".insure_footer .a1").css("background-color","#1b6bb8");
	    }
	});
	//点击"立即投保"页面
	$("#toubao").unbind("tap").bind("tap",function(){	
		if(!$("#word").hasClass("on")){		//判断是否同意条款
			return false;
		}
		sendInsureRequest();	//发送投保请求	    
	});
});

//根据前面传回的试算结果
function getCalculateOptions( ){	
	var piecesFlag = calChoices.indexOf('pieces');
	var versionFlag = calChoices.indexOf('versions');		
	if( piecesFlag != -1 ){
		cPieces = calChoices[piecesFlag+1];			//保障份数
	}
	if( versionFlag != -1){
		cVersion = calChoices[versionFlag+1];		//产品方案
		showForthItem(cVersion);
	}
}

//根据产品方案显示被保人信息
function showForthItem(version){
	if( version == "02" ){				//判断产品方案，如果如果是四口之家
		$("#forthItem").removeClass("hidden");			//则将被保人信息4显示出来
	}
}

//发送保费试算请求
function sendCaldoRequest(ccId){
	 var url = requestUrl.calDoUrl;
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": transToken
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

//根据条件保费试算获取保费
function calDoRender(data){
	 console.log(data);
	 if(data.statusCode == "000000"){
	    cPrem = data.returns.premiun;			//保费
	    coverage = data.returns.insuredAmount;	//保额
	    $("#jwx_foot_price").text("价格：￥" + data.returns.premiun);
	 }else{
	    modelAlert(data.statusMessage);
	 }   
}

//显示保险信息
function showProductInfo(commodifyName,comPremuim,bzimg){
	$("#insuranceName").val(commodifyName);
	$("#jwx_foot_price").html("价格：￥"+comPremuim);
	if(bzimg){
		var picStr =  '<img src="'+bzimg+'" />'
		$(".duty").html(picStr);
	}
}

//从常用投保人带出投保人信息
function commomHolder(commonholder){
	if(commonholder){
		var insuIden  = holder.idNo;							//投保人身份证
		var insuName  = holder.name;							//投保人姓名
		var insuPhone = holder.phone;							//投保人手机号
		var insuEmail = holder.email;							//投保人邮箱
		var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";	//投保人性别
		var	insuBirth = $.getBirthDay(insuIden);				//生日
		$("#insureName").val(insuName);				//投保人姓名
		$("#certificateNo").val(insuIden);			//证件号码
		$("#telNo").val(insuPhone);					//手机号码
		$("#gender").val(insuSex);
		$("#birthDate").val(insuBirth);
		$("#email").val(insuEmail);
		ageCal = $.getAge($.getBirthDay(insuIden),'');
		genderCal = $.getSex(insuIden) + "";			
	}
}
//从常用投保人带出投保人信息2
function commomHoldertwo(commonholdertwo){
	if(commonholdertwo){
		var insuIden  = holdertwo.idNo;							//投保人身份证
		var insuName  = holdertwo.name;							//投保人姓名
		var insuPhone = holdertwo.phone;							//投保人手机号
		var insuEmail = holdertwo.email;							//投保人邮箱
		var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";	//投保人性别
		var	insuBirth = $.getBirthDay(insuIden);				//生日
		$("#recognizeeName2").val(insuName);				//投保人姓名
		$("#recogCertificateNo2").val(insuIden);			//证件号码
		$("#recogBirthDate2").val(insuBirth);					//手机号码
		$("#recogGender2").val(insuSex);	
	}
}
//从常用投保人带出投保人信息3
function commomHolderthree(commonholderthree){
	if(commonholderthree){
		var insuIden  = holderthree.idNo;							//投保人身份证
		var insuName  = holderthree.name;							//投保人姓名
		var insuPhone = holderthree.phone;							//投保人手机号
		var insuEmail = holderthree.email;							//投保人邮箱
		var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";	//投保人性别
		var	insuBirth = $.getBirthDay(insuIden);				//生日
		$("#recognizeeName3").val(insuName);				//投保人姓名
		$("#recogCertificateNo3").val(insuIden);			//证件号码
		$("#recogBirthDate3").val(insuBirth);					//手机号码
		$("#recogGender3").val(insuSex);	
	}
}
//从常用投保人带出投保人信息4
function commomHolderfour(commonholderfour){
	if(commonholderfour){
		var insuIden  = holderfour.idNo;							//投保人身份证
		var insuName  = holderfour.name;							//投保人姓名
		var insuPhone = holderfour.phone;							//投保人手机号
		var insuEmail = holderfour.email;							//投保人邮箱
		var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";	//投保人性别
		var	insuBirth = $.getBirthDay(insuIden);				//生日
		$("#recognizeeName4").val(insuName);				//投保人姓名
		$("#recogCertificateNo4").val(insuIden);			//证件号码
		$("#recogBirthDate4").val(insuBirth);					//手机号码
		$("#recogGender4").val(insuSex);	
	}
}

//监控身份证输入变化
function idNoChange(domid,genderid,dateid){
	$(document).on("input propertychange",domid,function(e){
	    if(this.value.length == CERTIFICATENO_LENGTH){
	        if ($.checkIdCard(this.value.toLocaleUpperCase()) != 0) {
	            modelAlert("请输入合法的投保人身份证号！");
	            this.value = "";
	            return false;
	        }else{
	            var gender = $.getSex(this.value) == 1 ? "男" :"女";
	            $(genderid).val(gender);
	            $(dateid).val($.getBirthDay(this.value));	            
	        }			
	    }else{
	        $(genderid).val("");
	        $(dateid).val("");
	    }		
	});	
}

//
function getFormData(){
	var formData = {};
	var insureName     = $.trim($("#insureName").val());		//投保人姓名
	var certificateNo  = $.trim($("#certificateNo").val());	    //证件号码
	var telNo		   = $.trim($("#telNo").val());			    //手机号码
	var email		   = $.trim($("#email").val()); 			//投保人邮箱
	
	var relation2      = $("#relation2").attr("name");	 		    //与投保人关系
    var recogName2     = $.trim($("#recognizeeName2").val());	 	//被保人姓名
    var recogCertiNo2  = $.trim($("#recogCertificateNo2").val());   //被保人证件号码
    
    var relation3      = $("#relation3").attr("name");	 		    //与投保人关系
    var recogName3     = $.trim($("#recognizeeName3").val());	 	//被保人姓名
    var recogCertiNo3  = $.trim($("#recogCertificateNo3").val());   //被保人证件号码
        
	//投保人姓名校验
	if ($.isNull(insureName)) {
	    modelAlert("投保人姓名不能为空！");
	    return false;
	} else if (tit.regExp.isChinese(insureName) == false) {
	    modelAlert("投保人姓名必须为汉字！");
	    return false;
	}
	// 投保人证件号码校验
	if ($.isNull(certificateNo)) {
	    modelAlert("投保人身份证号不能为空！");
	    return false;
	} else if ($.checkIdCard(certificateNo.toLocaleUpperCase()) != 0) {
	    modelAlert("请输入合法的投保人身份证号！");
	    return false;
	} else{
	    if( $.getAge($.getBirthDay(certificateNo),'') < 18 || $.getAge($.getBirthDay(certificateNo),'') > 50 ){
	        modelAlert("被保险人1年龄需为18~50周岁（含）！");
	        return false;
	    }
	}
	// 投保人手机号码校验
	if ($.isNull(telNo)) {
	    modelAlert("投保人手机号不能为空！");
	    return false;
	} else if (tit.regExp.isMobile(telNo) == false) {
	    modelAlert("请输入正确的投保人手机号码！");
	    return false;
	}
	//投保人邮箱校验
	if($.isNull(email)){
		 modelAlert("投保人邮箱不能为空！");
		 return false;
	}else if(tit.regExp.isEmail(email) == false){
		 modelAlert("请输入正确的投保人邮箱！");
		 return false;
	}
	
	//被保人姓名校验
	if ($.isNull(recogName2)) {
	    modelAlert("被保人姓名不能为空！");
	    return false;
	} else if (tit.regExp.isChinese(recogName2) == false) {
	    modelAlert("被保人姓名必须为汉字！");
	    return false;
	}
	// 被保人证件号码校验
	if ($.isNull(recogCertiNo2)) {
	    modelAlert("被保人身份证号不能为空！");
	    return false;
	} else if ($.checkIdCard(recogCertiNo2.toLocaleUpperCase()) != 0) {
	    modelAlert("请输入合法的被保人身份证号！");
	    return false;
	} else{
	    if($.getAge($.getBirthDay(recogCertiNo2),'') < 18 || $.getAge($.getBirthDay(recogCertiNo2),'') > 50 ){
	        modelAlert("被保险人2需为投保人配偶，年龄需为18~50周岁（含）！");
	        return false;
	    }
	}
	//被保人姓名校验
	if ($.isNull(recogName3)) {
	    modelAlert("被保人姓名不能为空！");
	    return false;
	} else if (tit.regExp.isChinese(recogName3) == false) {
	    modelAlert("被保人姓名必须为汉字！");
	    return false;
	}
	// 被保人证件号码校验
	if ($.isNull(recogCertiNo3)) {
	    modelAlert("被保人身份证号不能为空！");
	    return false;
	} else if ($.checkIdCard(recogCertiNo3.toLocaleUpperCase()) != 0) {
	    modelAlert("请输入合法的被保人身份证号！");
	    return false;
	} else{
	    if($.getAge($.getBirthDay(recogCertiNo3),'') > 18){
	        modelAlert("被保险人3需为投保人子女，年龄需为30天~18周岁（含）！");
	        return false;
	    }
	}
	
	if(!$("#forthItem").hasClass("hidden")){
    	var relation4      = $("#relation4").attr("name");	 		    //与投保人关系
        var recogName4     = $.trim($("#recognizeeName4").val());	 	//被保人姓名
        var recogCertiNo4  = $.trim($("#recogCertificateNo4").val());   //被保人证件号码
        
      //被保人姓名校验
    	if ($.isNull(recogName4)) {
    	    modelAlert("被保人姓名不能为空！");
    	    return false;
    	} else if (tit.regExp.isChinese(recogName4) == false) {
    	    modelAlert("被保人姓名必须为汉字！");
    	    return false;
    	}
    	// 被保人证件号码校验
    	if ($.isNull(recogCertiNo4)) {
    	    modelAlert("被保人身份证号不能为空！");
    	    return false;
    	} else if ($.checkIdCard(recogCertiNo4.toLocaleUpperCase()) != 0) {
    	    modelAlert("请输入合法的被保人身份证号！");
    	    return false;
    	} else{
    	    if($.getAge($.getBirthDay(recogCertiNo4),'')>18){
    	        modelAlert("被保险人4需为投保人子女，年龄需为30天~18周岁（含）！");
    	        return false;
    	    }
    	}
    	formData.recogName4 	= recogName4;
    	formData.recogCertiNo4  = recogCertiNo4;
    }
	
	formData.insureName 	= insureName;
	formData.certificateNo  = certificateNo;
	formData.telNo 			= telNo;
	formData.email          = email;
	
	formData.recogName2 	= recogName2;
	formData.recogCertiNo2  = recogCertiNo2;
	
	formData.recogName3 	= recogName3;
	formData.recogCertiNo3  = recogCertiNo3;
	
    return formData;
}

//投保请求
function sendInsureRequest(){
	var formData = getFormData();
	if(!formData){return false;}
	var reqData = {
			  "head": {
				    "channel": "01",
				    "userCode": mobile,
				    "transTime": $.getTimeStr(),
				    "transToken": transToken
				  },
				  "body": {
				    "premium"         : cPrem+"",
				    "uwCount"         : cPieces+"",
				    "toucustomerName" : formData.insureName,
				    "toudocNo"        : formData.certificateNo,
				    "tousex"          : "0"+$.getSex(formData.certificateNo),
				    "toubirthDate"    : $.getBirthDay(formData.certificateNo),
				    "touphoneNo"      : formData.telNo,
				    "touemail"        : formData.email,
				    "channelResource" : "3",
				    "commdityComId"   : ccId,
				    "comId"           : cId,
				    "buyType"         : "1",
				    "userId"          : customerId,
				    "customerId"      : customerId,
				    "inviterPhone"    : mobile,
				    "customerList": [
				      {
				        "beicustomerName": formData.insureName,
				        "beidocNo"       : formData.certificateNo,
				        "beisex"         : "0"+$.getSex(formData.certificateNo),
				        "beibirthDate"   : $.getBirthDay(formData.certificateNo),
				        "beiphoneNo"     : formData.telNo,
				        "beiemail"       : formData.email,
				        "beiApRelation"  : "01"
				      },
				      {
				        "beicustomerName": formData.recogName2,
				        "beidocNo"       : formData.recogCertiNo2,
				        "beisex"         : "0"+$.getSex(formData.recogCertiNo2),
				        "beibirthDate"   : $.getBirthDay(formData.recogCertiNo2),
				        "beiphoneNo"     : "",
				        "beiemail"       : "",
				        "beiApRelation"  : "10"
				      },
				      {
				        "beicustomerName": formData.recogName3,
				        "beidocNo"       : formData.recogCertiNo3,
				        "beisex"         : "0"+$.getSex(formData.recogCertiNo3),
				        "beibirthDate"   : $.getBirthDay(formData.recogCertiNo3),
				        "beiphoneNo"     : "",
				        "beiemail"       : "",
				        "beiApRelation"  : "40"
				      }
				    ]
				  }
			}
	if( cVersion == "02" ){
		var beibaoren4 = {
		        "beicustomerName": formData.recogName4,
		        "beidocNo"       : formData.recogCertiNo4,
		        "beisex"         : "0"+$.getSex(formData.recogCertiNo4),
		        "beibirthDate"   : $.getBirthDay(formData.recogCertiNo4),
		        "beiphoneNo"     : "",
		        "beiemail"       : "",
		        "beiApRelation"  : "40"
		}
		reqData.body.customerList.push(beibaoren4);
	}
	var url = requestUrl.bqjInsure;
	$.reqAjaxs( url, reqData, insureReponse );
}

function insureReponse(data){	
	if( data.statusCode == "000000" ){
		var insureNo = data.returns.insureNo;
		var orderExt = data.returns.orderExt;
		var orderNo	 = data.returns.orderNo;
		sendPayRequest(insureNo,orderExt,orderNo)
		console.log(data);
	}else{
		modelAlert(data.statusMessage);
	}
}

function sendPayRequest(insureNo,orderExt,orderNo){
	var url = requestUrl.bqjPay;
	var sendJson = {
		  "head": {
		    "channel": "01",
		    "userCode": mobile,
		    "transTime": $.getTimeStr(),
		    "transToken":transToken
		  },
		  "body": {
//			 "orderExt": orderExt,
//			 "orderCode": insureNo,
			 "orderNo": orderNo,		   
		     "payWay": "02",
		     "redirectUrl": base.url + "tongdaoApp/html/insurance/main/payResult.html?orderNo="+orderNo,
		     "customerId": customerId
		  }
		}
	$.reqAjaxs( url, sendJson, bqjPayBackCall );
}

function bqjPayBackCall(data){
	console.log(data);
	if(data.statusCode == "000000"){
		window.location.href=data.returns.payUrl;
	}else{
		modelAlert(data.statusMessage);
	}
}

/*获取服务器时间*/
function getServiceTime(){
	var url = requestUrl.getServeTimeUrl;
	var reqData = {
	    "head":{
	        "channel":"01",
	        "userCode":"",
	        "transTime":$.getTimeStr()
	    },"body":{}
	}	
	$.reqAjaxsFalse(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	nowday    = data.returns.serviceTime;
	        startDate = new Date(data.returns.serviceTime);
	        endDate   = new Date(data.returns.serviceTime);
	        now       = new Date(data.returns.serviceTime);	       
	        startDate.setDate(startDate.getDate() +1);//生效日期T+1	     
	        endDate.setFullYear(endDate.getFullYear()+1, endDate.getMonth(), endDate.getDate());//终止日期	        	
	        $("#effectivDate").val($.getTimeStr2(startDate));//生效日期T+1
	        $("#endDate").val($.getTimeStr2(endDate));//终止日期	            	       
	    }else {
	       modelAlert(data.statusMessage);
	       return false;
	    }
	});
}

function toArticle(){ 
	urlParm.title = "保险条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";	
	urlParm.frompage = "familyInsureHtml"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/article.html?jsonKey="+jsonStr;
}

function toXuzhi(){
	urlParm.title = "投保须知";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";	
	urlParm.frompage = "familyInsureHtml"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/changeXuzhi.html?jsonKey="+jsonStr;
}

function backlast(){
	urlParm.title = '产品详情';
	urlParm.leftIco = "1";
	if( roleType != "00" ){
		urlParm.rightIco = "1";
	}else{
		urlParm.rightIco = "0";
	}
	urlParm.downIco = "0";
	if(urlParm.holder){
		delete urlParm.holder
	}
	var jsonStr = UrlEncode(JSON.stringify(urlParm));	
	window.location.href = base.url + 'tongdaoApp/html/insurance/main/productDetail.html?jsonKey='+jsonStr;		
};