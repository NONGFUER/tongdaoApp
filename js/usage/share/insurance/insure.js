var calChoices = urlParm.calChoices;
var ageCal = "";
var genderCal = "";
var code = ghxRemark.split(",");
var insureList = [];
var holder = urlParm.holder;
var holderbr = urlParm.holderbr;//被保人常用保险人
var shareType = '';
var buyType = "";
var channelResource = "";
for(var i = 0; i < code.length; i++) {
	var pro = {
		"productId": code[i]
	}
	insureList.push(pro)
}
$(function(){
	if($.isNull(shareMobile)||$.isNull(shareCusId)||$.isNull(shareFlag)|| shareFlag == 'N'){
		buyType = "1";
		channelResource = "1";
	}else{
		buyType = "2";
		channelResource = "2";
	}
	if($.isNull(shareCusId)){
		shareCusId = customerId;
	}
	if($.isNull(shareMobile)){
		shareMobile = mobile;
	}	
	formItemControl( ccId )
	if( ccId != "1" && ccId != "2" && ccId != "3" && ccId != "14" && ccId != "22" && ccId != "23" ){//除防癌险,挂号险之外的ecard，会调默认投保地区接口
		getTypeRequest(shareCusId)
		console.log(shareType)
		if(shareType == "01"){
			sendFeeCityRequest( customerId, ccId );
		}else{
			sendFeeCityRequest( shareCusId, ccId );
		}
	}
	getServiceTime();
	$("#insuranceName").val(cName);					//渲染商品名称
	$("#jwx_foot_price").html("价格：￥"+cPrem);		//渲染价格
	if(urlParm.bzPic){
		if( ccId == "22"){
			var picStr =  '<a style="position: absolute;top: 0; left: 0;right: 0; bottom: 0;z-index: 2;" ></a><img src="'+urlParm.bzPic+'" />';
		}else{
			var picStr =  '<img src="'+urlParm.bzPic+'" />'
		}
		$(".duty").html(picStr);
	}
	if(holderbr) {
		$("#isSame").removeClass("on")
		$('#isSame').find('img').attr('src', '../../../../image/common/meigou.png');
		$('.beiNone').show();
		$('.mytitle').show();
		var insuIden1 = holderbr.idNo;
		var insuName1 = holderbr.name;
		var insuPhone1 = holderbr.phone;
		var insuEmail1 = holderbr.email;
		var insuSex1 = $.getSex(insuIden1) == 1 ? "男" : "女";
		var insuBirth1 = $.getBirthDay(insuIden1);
		$("#recognizeeName").val(insuName1); //投保人姓名
		$("#recogCertificateNo").val(insuIden1); //证件号码
		$("#recogTelNo").val(insuPhone1); //手机号码*/
		$("#recogGender").val(insuSex1); //性别
		$("#recogBirthDate").val(insuBirth1); //出生日期
		ageCal = $.getAge($.getBirthDay(insuIden1),now);
		genderCal = $.getSex(insuIden1) + "";
		if( ccId != "14"){			
			productCalculate( ccId, ageCal, genderCal);			      	
        }	
	}
	if(holder){		
		var insuIden  = holder.idNo;		
		var insuName  = holder.name;
		var insuPhone = holder.phone;
		var insuEmail = holder.email;
		var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";
		var	insuBirth = $.getBirthDay(insuIden);
		$("#insureName").val(insuName);				//投保人姓名
		$("#certificateNo").val(insuIden);			//证件号码
		$("#telNo").val(insuPhone);					//手机号码
		$("#gender").val(insuSex);
		$("#birthDate").val(insuBirth);
		$("#email").val(insuEmail);
		ageCal = $.getAge($.getBirthDay(insuIden),now);
		genderCal = $.getSex(insuIden) + "";
		if( ccId != "14"){
        	productCalculate( ccId, ageCal, genderCal);
        }	
	}

    
	//监控投保人身份证
	$(document).on("input propertychange","#certificateNo",function(e){
	    if(this.value.length == CERTIFICATENO_LENGTH){
	        if ($.checkIdCard(this.value.toLocaleUpperCase()) != 0) {
	            modelAlert("请输入合法的投保人身份证号！");
	            this.value = "";
	            return false;
	        }else{
	            var gender = $.getSex(this.value) == 1 ? "男" :"女";
	            $("#gender").val(gender);
	            $("#birthDate").val($.getBirthDay(this.value));
	            if($("#isSame").hasClass("on")){
	                ageCal = $.getAge($.getBirthDay(this.value),now);
	                genderCal = $.getSex(this.value) + "";
	                if( ccId != "14"){
	                	productCalculate( ccId, ageCal, genderCal);
	                }	                
	            }
	        }			
	    }else{
	        $("#gender").val("");
	        $("#birthDate").val("");
	    }		
	});	
	//监控被保人身份证号
	$(document).on("input propertychange","#recogCertificateNo",function(e){
	    if(this.value.length == CERTIFICATENO_LENGTH){
	        if ($.checkIdCard(this.value.toLocaleUpperCase()) != 0) {
	            modelAlert("请输入合法的被保人身份证号！");
	            this.value = "";
	            return false;
	        }else{
	            var gender = $.getSex(this.value) == 1 ? "男" :"女";
	            $("#recogGender").val(gender);
	            $("#recogBirthDate").val($.getBirthDay(this.value));
	            ageCal = $.getAge($.getBirthDay(this.value),now);
	            genderCal = $.getSex(this.value) + "";
	            if( ccId != "14"){
	            	productCalculate( ccId, ageCal, genderCal);
	            }            
	        }
	    }else{
	        $("#recogGender").val("");
	        $("#recogBirthDate").val("");
	    }		
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
	
	//点击"承保职业"
	$("#profession,.prdown").unbind("tap").bind("tap",function(){
	    var selectPicker = new mui.PopPicker();
	    var popArray = [{value:'1',text:'一类'},{value:'2',text:'二类'}, {value:'3',text:'三类'},{value:'4',text:'四类'},{value:'5',text:'五类'},{value:'6',text:'六类'}]							    
	    if( ccId == COMMODITYCOMBINE_ID.LRX ){
	    	var tempArr = {value:'7',text:'退休人员'};
	    	popArray.push(tempArr);
	    }
	    selectPicker.setData(popArray);
	    selectPicker.show(function(item){
	        $("#profession").text(item[0].text);
	        $("#profession").attr("data-value",item[0].value);
	    });
	});
	$("#relation").unbind("tap").bind("tap",function(){
	    var selectPicker1 = new mui.PopPicker();
	    var popArray1 = [{"text":"配偶","value":"10"},{"text":"子女","value":"40"},{"text":"父母","value":"50"},{"text":"与投保人有赡养或者扶养关系的家庭其他成员、近亲属","value":"99"}];
	    selectPicker1.setData(popArray1);
	    selectPicker1.show(function(item){
	        $("#relation").text(item[0].text);
	        $("#relation").attr("name",item[0].value);
	    });
	});
	//页面主体区域滚动
	$.setscroll("bodyMuiScroll");
	//premiumCalculation();
	//点击"立即投保"页面
	$("#toubao").unbind("tap").bind("tap",function(){
		if( ccId == "14"){
			sendGhxInsureRequest();
		}else if( ccId == COMMODITYCOMBINE_ID.BWYL || ccId == COMMODITYCOMBINE_ID.AXYW ){
			sendBwylRequest();
		}else{
			sendInsureRequest();	//发送投保请求
		}
	    
	});
	//点击"查询职业"
	$(".search").unbind("tap").bind("tap",function(){
		urlParm.title = '职业风险类别表';
		urlParm.leftIco = "1";
		urlParm.rightIco = "0";
		urlParm.downIco = "0"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href = base.url + "tongdaoApp/html/agreement/profession.html?jsonKey="+jsonStr;
	});
	//点击"返回按钮"
	$(".h_back").unbind("tap").bind("tap",function(){
	   
	});
	//点击新车未上牌
	$("#chooseicon,.xinche").unbind("tap").bind("tap",function(){
	    if($("#chooseicon").hasClass("on")){
	        $("#chooseicon").removeClass("on");
	        $("#chooseicon").attr("src","../../../../image/insurance/gouxuankuang.png");
	        $(".xinche").css("color","black");
	        $("#FieldAI").val("");
	        document.getElementById("FieldAI").readOnly=false;
	    }else{
	        $("#chooseicon").addClass("on");
	        $("#chooseicon").attr("src","../../../../image/insurance/gouxuankuang1.png");
	        $(".xinche").css("color","#1b6bb8");
	        $("#FieldAI").val(" ");
	        document.getElementById("FieldAI").readOnly=true;
	    }
	});
	//点击同投保人
	$("#isSame").unbind("tap").bind("tap",function(){
	    if($(this).hasClass("on")){
	    	if(ccId == COMMODITYCOMBINE_ID.JDX){//借贷险被保人必是同一人
	    		return false;
	    	}else{
		        $(this).removeClass("on");
		        $(this).find("img").attr("src","../../../../image/common/meigou.png");
		        $(".beiNone").show(1000);
	    	}
	    	$('.mytitle').show();
	    }else{
	        var sameName    = $.trim($("#insureName").val());		//投保人姓名
	        var sameNo      = $.trim($("#certificateNo").val());	//证件号码
	        var sameTelNo   = $.trim($("#telNo").val());			//手机号码
	        var sameGender  = $.getSex(sameNo) == 1 ? "男" :"女";
	        if(insureValidate(sameName,sameNo,sameTelNo) == false){
	            return false;
	        };
	        $(this).addClass("on");
	        $(this).find("img").attr("src","../../../../image/common/gou.png");
	        $(".beiNone").hide(1000);
	        
	        ageCal = $.getAge($.getBirthDay(sameNo),now);
	        genderCal = $.getSex(sameNo) + "";
	        if( ccId != "14" ){
	        	productCalculate( ccId, ageCal, genderCal);
	        }
	        $('.mytitle').hide();
	        urlParm.holderbr='';
	    }
	});
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
		urlParm.frompage = "insureHtmlShare"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
	    window.location.href= base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey="+jsonStr;
	});
	//跳转到常用被保人
	$("#commonHoldersto").unbind("tap").bind("tap", function() {
		urlParm.userCode = mobile;
		urlParm.title = "常用被保人";
		urlParm.rightIco = "4";
		urlParm.frompage = "insureHtmlShare"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey=" + jsonStr;
		return false;
	});
	//选择座位数
	$("#FieldAN,.zdown").unbind("tap").bind("tap",function(){
	    var selectPicker4 = new mui.PopPicker();
	    var popArray = [{value:'5',text:'5座'},{value:'6',text:'6座'}, {value:'7',text:'7座'},{value:'8',text:'8座'},{value:'9',text:'9座'}]						
	    selectPicker4.setData(popArray);
	    selectPicker4.show(function(item){
	        $("#FieldAN").text(item[0].text);
	        $("#FieldAN").attr("name",item[0].value);
	    });
	});
	/**拨打电话*/
	$(".kefu").unbind("tap").bind("tap",function(){
	    callService("4006895505",".kefuPhone");
	})
	//贷款起期
	$("#cDaiBegin").unbind("tap").bind("tap",function(){
		var picker = new mui.DtPicker({type:'date'});
		picker.show(function(rs) {
			$("#cDaiBegin").val(rs.text);		
			picker.dispose();
		});	
	})
	//贷款止期
	$("#cDaiEnd").unbind("tap").bind("tap",function(){
		var picker = new mui.DtPicker({type:'date'});
		picker.show(function(rs) {
			$("#cDaiEnd").val(rs.text);		
			picker.dispose();
		});	
	})
});

function getFormData(){
	var formData = {};
	var insureName    = $.trim($("#insureName").val());		//投保人姓名
	var certificateNo = $.trim($("#certificateNo").val());	//证件号码
	var telNo		  = $.trim($("#telNo").val());			//手机号码
	var email		  = $.trim($("#email").val()); 
	
	var provinceCode  = $("#orgProvinceCode").attr("name");	//省
	var cityCode      = $("#orgCityCode").attr("name");		//市
	var address		  = $("#orgCityCode").text();		//地址/住址
	var agentCode	  =	$("#orgCityCode").attr("agentCode");//中介
	var teamCode	  = $("#orgCityCode").attr("teamCode");	//团队
	var certiNo       = $("#orgCityCode").attr("certiNo");	//业务员
	var businessSource= $("#orgCityCode").attr("businessSource");//业务来源
	var agentName	  = $("#orgCityCode").attr("agentName");
	
	var FieldAA       = $.trim($("#FieldAA").val());
	var FieldAJ		  = $.trim($("#FieldAJ").val().toLocaleUpperCase());
	var FieldAI		  = $.trim($("#FieldAI").val().toLocaleUpperCase());
	var FieldAN		  = $("#FieldAN").attr("name");
	
	//借贷险动态标
	var jdxFieldAI    = $.trim($("#cBankName").val())	// 贷款发放金融机构
	var jdxFieldAJ    = $.trim($("#cHtNo").val()) // 借款合同号
	var jdxfieldAM    = $.trim($("#cDaiBegin").val())	// 贷款起期
	var jdxfieldAN    = $.trim($("#cDaiEnd").val())	// 贷款止期
	
	if($(".isSame").hasClass("on")){
	    var relation      = "01";	 		                        //与投保人关系
	    var recogName     = insureName;	 							//被保人姓名
	    var recogCertiNo  = certificateNo; 							//被保人证件号码
	    var recogTelNo	  = telNo;									//被保人手机号
	}else{
	    var relation      = $("#relation").attr("name");	 		//与投保人关系
	    var recogName     = $.trim($("#recognizeeName").val());	 	//被保人姓名
	    var recogCertiNo  = $.trim($("#recogCertificateNo").val()); //被保人证件号码
	    var recogTelNo	  = $.trim($("#recogTelNo").val());	//被保人手机号	
	}
	
	if(cId == COMMODITY_ID.JKJR || cId == COMMODITY_ID.QCWY || cId == COMMODITY_ID.JXJS || ccId == COMMODITYCOMBINE_ID.LRX ){
	    var profession = $("#profession").attr("data-value");	//承保职业
	}else{
	    var profession = "1";	//承保职业
	}
	    
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
	    if($.getAge($.getBirthDay(certificateNo),now)<18){
	        modelAlert("投保人年龄需满十八周岁！");
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
	if( ccId == "14" || ccId =="22" || ccId == "23"){
		if($.isNull(email)){
			 modelAlert("投保人邮箱不能为空！");
			 return false;
		}else if(tit.regExp.isEmail(email) == false){
			 modelAlert("请输入正确的投保人邮箱！");
			 return false;
		}
	}
	//投保地区校验
	if( ccId != "1" && ccId != "2" && ccId != "3" && ccId != "14" && ccId != "22" && ccId != "23" ){
		if($.isNull(provinceCode)){
			modelAlert("投保地区省份不能为空！");
			return false;
		}
		//投保地区校验
		if($.isNull(cityCode)){
		    modelAlert("投保地区市区不能为空！");
		    return false;
		}
		// 投保人地址校验
		if($.isNull(address)){
		    modelAlert("投保人地址不能为空！");
		    return false;
		}
	}else{
		address = "";
	}
	
	// 与投保人关系校验
	if($.isNull(relation)){
	    modelAlert("与投保人关系不能为空！");
	    return false;
	}
	//被保人姓名校验
	if ($.isNull(recogName)) {
	    modelAlert("被保人姓名不能为空！");
	    return false;
	} else if (tit.regExp.isChinese(recogName) == false) {
	    modelAlert("被保人姓名必须为汉字！");
	    return false;
	}
	// 被保人证件号码校验
	if ($.isNull(recogCertiNo)) {
	    modelAlert("被保人身份证号不能为空！");
	    return false;
	} else if ($.checkIdCard(recogCertiNo.toLocaleUpperCase()) != 0) {
	    modelAlert("请输入合法的被保人身份证号！");
	    return false;
	}else{
		if(cId == COMMODITY_ID.FCAN || cId == COMMODITY_ID.PFCAN){
			if($.getSex(recogCertiNo) != 2){
	            modelAlert("该被保人性别与规则不符！");
	            return false;
	        }
		}else if(cId == COMMODITY_ID.JKJR){
	        if($.getSex(recogCertiNo) != 2){
	            modelAlert("该被保人性别与规则不符！");
	            return false;
	        }
	        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 55 ){//16~55
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.JKAX){
	        if($.getAge($.getBirthDay(recogCertiNo),now) < 18 || $.getAge($.getBirthDay(recogCertiNo),now) > 55 ){//18~55
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.QCWY){
	        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 65 ){//16~65
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.LLHM){
	        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 65 ){//16~65
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.JXJS){
	        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo)) > 65 ){//16~65
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.SWFR){
	        if($.getAge($.getBirthDay(recogCertiNo),now) > 75 ||$.getAge($.getBirthDay(recogCertiNo),now) < 0 ){//0~75
	            modelAlert("该被保人年龄与规则不符！");
	            return false;
	        }
	    }
	}
	// 被保人手机号码校验
	if ($.isNull(recogTelNo)) {
	    modelAlert("被保人手机号不能为空！");
	    return false;
	} else if (tit.regExp.isMobile(recogTelNo) == false) {
	    modelAlert("请输入正确的被保人手机号码！");
	    return false;
	}
	//承保职业
	if($.isNull(profession)){
	    modelAlert("被保人承保职业不能为空！");
	    return false;
	}else{
	    if(cId == COMMODITY_ID.JKJR){		//1~3
	        if( profession>3  ){
	            modelAlert("该被保人承保职业与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.QCWY){//1~4
	        if( profession>4  ){//16~65
	            modelAlert("该被保人承保职业与规则不符！");
	            return false;
	        }
	    }else if(cId == COMMODITY_ID.JXJS){//1~4
	        if( profession>4  ){//16~65
	            modelAlert("该被保人承保职业与规则不符！");
	            return false;
	        }
	    }else if(ccId == COMMODITYCOMBINE_ID.LRX){
	    	if( profession>4 && profession != 7  ){//1-4 7
	            modelAlert("该被保人承保职业与规则不符！");
	            return false;
	        }
	    }
	}
	if( cId == COMMODITY_ID.QCWY ){
	    if($.isNull(FieldAJ)){
	        modelAlert("请输入车架号！");
	        return false;
	    }else if(tit.regExp.isVehicleIdentification(FieldAJ) == false) {
	        modelAlert("请输入正确的车架号！车架号由17位字符组成，需填写大写字母或下划线或数字");
	        return false;
	    }
	    if($("#chooseicon").hasClass("on")){
	        
	    }else{
	        if($.isNull(FieldAI)){
	            modelAlert("请输入车牌号码，或者选择新车未上牌！");
	            return false;
	        }else if(tit.regExp.isPlateNumber(FieldAI) == false) {
	            modelAlert("请输入正确的车牌号！车牌号输入规则：第一位填写中文，第二位填写大写字母，后面5到6位填写为大写字母或数字！");
	            return false;
	        }
	    }
	    
	    if($.isNull(FieldAN)){
	        modelAlert("核定座位数不能为空！");
	        return false;
	    }
	}else if( cId == COMMODITY_ID.LLHM ){
	    if($.isNull(FieldAA)){
	        modelAlert("房屋坐落地址不能为空！");
	        return false;
	    }
	}else if( ccId == COMMODITYCOMBINE_ID.JDX  ){	//借贷险中动态标的非空校验
		if($.isNull(jdxFieldAI)){
	        modelAlert("发放贷款银行名称不能为空！");
	        return false;
	    }
		if($.isNull(jdxFieldAJ)){
	        modelAlert("贷款合同号不能为空！");
	        return false;
	    }
		if($.isNull(jdxfieldAM)){
	        modelAlert("贷款起期不能为空！");
	        return false;
	    }
		if($.isNull(jdxfieldAN)){
	        modelAlert("贷款止期不能为空！");
	        return false;
	    }
	}
	formData.insureName 	= insureName;
	formData.certificateNo  = certificateNo;
	formData.telNo 			= telNo;
	formData.email			= email;
	formData.address 		= address;
	formData.cityCode       = cityCode;
	formData.provinceCode   = provinceCode;
	formData.agentCode      = agentCode;	 
	formData.teamCode       = teamCode;	 
	formData.certiNo        = certiNo;      
	formData.businessSource = businessSource;
	formData.agentName		= agentName;
	
	formData.FieldAA        = FieldAA;
	formData.FieldAJ		= FieldAJ;
	formData.FieldAI		= FieldAI;
	formData.FieldAN		= FieldAN;
	
	formData.relation 		= relation;
	formData.recogName 		= recogName;
	formData.recogCertiNo 	= recogCertiNo;	
	formData.recogTelNo  	= recogTelNo;
	
	formData.jdxFieldAI     = jdxFieldAI	// 贷款发放金融机构
	formData.jdxFieldAJ     = jdxFieldAJ 	// 借款合同号
	formData.jdxfieldAM     = jdxfieldAM	// 贷款起期
	formData.jdxfieldAN     = jdxfieldAN	// 贷款止期
	
	return formData;
}

//customerId查询落地城市
function sendFeeCityRequest( cusId, ccId){		
		var url = requestUrl.defalultArea;		
		var reqData = {
		        "head":{
		            "channel"  :"02",
		            "userCode" :mobile,
		            "transTime":$.getTimeStr()
		        },
		        "body":{
		            "customerId":cusId,//customerId,//773  198980 250
		            "commodityCombinationId" : ccId,
		            'salesChannels': '01'
		        }
		}
		$.reqAjaxs(url,reqData,feeCityReponse);	
}

//落地城市返回
function feeCityReponse(data){
	console.log(data);
	if(data.statusCode == "000000"){
		var body = data.returns;
		var lsf = body.landingServiceFee;
		if( lsf ){		
				var orgCityCode     = lsf.orgCityCode;
				var orgCityName 	= lsf.orgCityName;
				var orgProvinceCode = lsf.orgProvinceCode;
				var orgProvinceName = lsf.orgProvinceName;
				var agentCode	    = lsf.intermediaryCode;
	            var teamCode	    = lsf.teamCode;	
	            var certiNo			= lsf.agentCode;
	            var businessSource  = lsf.yewuSource;
	            var agentName		= lsf.agnetName;			
				$("#orgCityCode").text(orgCityName);
				$("#orgProvinceCode").text(orgProvinceName);
				$("#address").val(orgCityName);					//0822将地址定死
				$("#orgCityCode").attr("name",orgCityCode);
				$("#orgProvinceCode").attr("name",orgProvinceCode);
				$("#orgCityCode").attr("agentCode",agentCode);
				$("#orgCityCode").attr("teamCode",teamCode);
				$("#orgCityCode").attr("certiNo",certiNo);
				$("#orgCityCode").attr("businessSource",businessSource);
				$("#orgCityCode").attr("agentName",agentName);
				if(shareType == '01'){
					sendCityRequest( "", "", ccId );
				}						
		}else{
			sendCityRequest( "", "", ccId );
		}    
	}else{
		sendCityRequest( "", "", ccId );
	}
}

//落地市
function sendCityRequest(provinceCode,cityCode,ccId){	
		var url = requestUrl.chooseArea;
		var reqData = {
		        "head":{
		            "channel"  :"02",
		            "userCode" :mobile,
		            "transTime":$.getTimeStr()
		        },
		        "body":{
		            "provinceCode":provinceCode,
		            "commodityCombinationId": ccId,//commodityCombinationId,
		            "cityCode" : cityCode,
		            "salesChannels" :'01'	//佰赢渠道
		        }
		}
		if( provinceCode == "" && cityCode == "" ){
			$.reqAjaxs(url,reqData,provinceReponse);
		}else if( provinceCode != "" && cityCode == "" ){
			$.reqAjaxs(url,reqData,cityReponse);
		}else if( provinceCode != "" && cityCode != "" ){
			$.reqAjaxs(url,reqData,getAllReponse);		
		}		
}

//落地省份响应
function provinceReponse(data){
	if(data.statusCode == "000000"){
		$(".orgProvinceCode").unbind("tap").bind("tap",function(){
			var selectPicker2 = new mui.PopPicker();
			var ccsa = data.returns.commodityCombinationSaleAreas;
			var popArray = [];
			for( var i = 0; i < ccsa.length; i++ ){
				var item ={ 
						"text":ccsa[i].provinceName,
						"value":ccsa[i].provinceCode
						}
				popArray.push(item);
			}
			selectPicker2.setData(popArray);
			selectPicker2.show(function(item){
				$("#orgProvinceCode").text(item[0].text);
				$("#orgProvinceCode").attr("name",item[0].value);
				$("#orgCityCode").text("请选择");
				$("#orgCityCode").attr("name","");	
				provinceCode = item[0].value;
				sendCityRequest(item[0].value, "", ccId);
			});
		});		
	}
}
function cityReponse(data){
	if(data.statusCode == "000000"){
	    console.log(data);
	    $("#orgCityCode").unbind("tap").bind("tap",function(){
	        var selectPicker3 = new mui.PopPicker();
	        var ccsa = data.returns.commodityCombinationSaleAreas;
	        var cityArray = [];
	        for( var i = 0; i < ccsa.length; i++ ){
	        	if( ccsa[i].cityCode != ""){
		            var item ={ 
		                    "text":ccsa[i].cityName,
		                    "value":ccsa[i].cityCode,
		                    "agentCode":ccsa[i].intermediaryCode,//中介代码
		                    "teamCode":ccsa[i].teamCode,//团队代码
		                    "certiNo":ccsa[i].agentCode,
		                    "businessSource":ccsa[i].yewuSource,
		                    "agentName":ccsa[i].agnetName
		                    }
		            cityArray.push(item);
	        	}
	        }
	        selectPicker3.setData(cityArray);
	        selectPicker3.show(function(item){
	            $("#orgCityCode").text(item[0].text);
	            $("#orgCityCode").attr("name",item[0].value);           
	            cityCode = item[0].value;
	            sendCityRequest( provinceCode, item[0].value, ccId);
	            selectPicker3.dispose();
	        });
	    });
	}else{
	    
	}
}
function getAllReponse(data){
	if(data.statusCode == "000000"){
		 var lsf = data.returns.landingServiceFee;
		 var agentCode	    = lsf.intermediaryCode;
         var teamCode	    = lsf.teamCode;	
         var certiNo			= lsf.agentCode;
         var businessSource  = lsf.yewuSource;
         var agentName		= lsf.agnetName;
		 $("#orgCityCode").attr("agentCode",agentCode);
		 $("#orgCityCode").attr("teamCode",teamCode);
		 $("#orgCityCode").attr("certiNo",certiNo);
		 $("#orgCityCode").attr("businessSource",businessSource);
		 $("#orgCityCode").attr("agentName",agentName);
	}else{
		modelAlert("获取业务员信息异常!");
	}
}
//投保请求
/*投保方法*/
function sendInsureRequest(){
	if(!$("#word").hasClass("on")){return false;}
	var formData = getFormData();
	if(!formData){return false;}
	var reqData = {
	    "head":{
	        "channel"  :"02",
	        "userCode" :mobile,
	        "transTime":$.getTimeStr(),
	        "transToken":transToken
	    },
	    "body":{
	        "shortRiskOrder":{
	        	"commodityCombinationId" : ccId,
	        	"commodityId"            : cId,
	            "insureName"			 : formData.insureName,
	            "customerId"             : customerId,
	            "insurePhone"            : formData.telNo,
	            "insureIdentitycard"     : formData.certificateNo,				
	            "coverage"               : coverage,
	            "invitrerPhone"          : shareMobile,
	            "insureAddress"          : formData.address,
	            "totalPieces"            : cPieces,//parseInt(peices),
	            "channelResource"        : channelResource// '渠道来源,1-微信公众号，2-分享进入，3-App',	
	        },
	        "shortRiskInsured":{
	            "apRelation"  			 : formData.relation,
	            "insuredname"            : formData.recogName,
	            "insuredidno"            : formData.recogCertiNo,
	            "insuredmobile"          : formData.recogTelNo
	        },
	        "customerId"				 : customerId,
	        "buyType"					 : buyType,
	        "recommendId"                : shareCusId
	    }
	}
	if(ccId != "1" && ccId != "2" && ccId != "3"){
		reqData.body.customerId    = customerId;
		reqData.body.belongORGCode = formData.agentName;
		reqData.body.agentCode     = formData.agentCode;
		reqData.body.teamCode      = formData.teamCode;
		reqData.body.certiNo       = formData.certiNo;
		reqData.body.businessSource= formData.businessSource;
		reqData.body.cityCode = formData.cityCode;
		reqData.body.provinceCode = formData.provinceCode;
		reqData.body.shortRiskOrder.startTime = $("#effectivDate").val();		//BYRM-1069  BYRM-1081可修改生效日期			
		if(ccId == "16"){
			reqData.body.shortRiskOrder.type = cVersion;
			reqData.body.guaranteeTerm = cGuaranteeTerm;
		}else if( ccId == COMMODITYCOMBINE_ID.LRX ){	//老人险
			reqData.body.shortRiskOrder.type = cVersion;
		}else if( ccId == COMMODITYCOMBINE_ID.ZHX ){	//账户险
			reqData.body.insuredAmount = cAmount;
		}else if( ccId == COMMODITYCOMBINE_ID.JDX ){	//借贷险
			reqData.body.fieldAI = formData.jdxFieldAI;	// 贷款发放金融机构
			reqData.body.fieldAJ = formData.jdxFieldAJ; // 借款合同号
			reqData.body.fieldAM = formData.jdxfieldAM; // 贷款起期
			reqData.body.fieldAN = formData.jdxfieldAN; // 贷款止期
			reqData.body.fieldAL = cPieces*1000;
			reqData.body.shortRiskOrder.totalPieces = cPieces;
			reqData.body.shortRiskOrder.coverage = cPieces*1000
			reqData.body.guaranteeTerm = '1';			
		}else if(ccId == COMMODITYCOMBINE_ID.BWZJ){
			reqData.body.fieldAA ='';
			reqData.body.shortRiskOrder.type = cVersion;
		}
	}else{
		reqData.body.versions = cVersion;//版本
	}
	if( cId == COMMODITY_ID.LLHM ){
		reqData.body.FieldAA = formData.FieldAA;
	}else if( cId == COMMODITY_ID.QCWY ){
		reqData.body.FieldAJ = formData.FieldAJ;
		reqData.body.FieldAI = formData.FieldAI;
		reqData.body.FieldAN = formData.FieldAN;
	}else if(cId == COMMODITY_ID.XPXSX ){
		reqData.body.shortRiskOrder.type = "01";		
	}else if(cId == COMMODITY_ID.XPXAX){
		reqData.body.shortRiskOrder.type = "02";		
	}
	console.log("====== 请求数据 ======");
	console.log(reqData);
	console.log("... ... ...");
	if( ccId != "1" && ccId != "2" && ccId != "3"){		
		var url = requestUrl.ecardInsure;			
		$.reqAjaxs(url,reqData,insureReponse);
	}else{
		var url = requestUrl.cancerInsure;
		$.toreqAjaxs(url,reqData,insureReponse);
	}	
}

/*投保返回，调用支付接口*/
function insureReponse(data){
	console.log("====== 返回数据 ======");
	console.log(data);
	console.log("--- --- ---");
	if(data.statusCode == "000000"){
		if(ccId != "1" && ccId != "2" && ccId != "3"){
			var serialNo = data.returns.shortRiskOrder.yuyueId;
		}else{
			 var serialNo = data.returns.bxOrder.yuyueId;//获取序列号
		}	   
	    payRequest(serialNo)//核保成功,调支付接口
	}else{
	    modelAlert(data.statusMessage);
	    return false;
	}
}

/*支付接口*/
function payRequest(serialNo){
	if( ccId != "1" && ccId != "2" && ccId != "3"){
		var url = requestUrl.ecardPay;
	}else{
		var url = requestUrl.cancerPay;
	}
	var reqData = {
	    "head":{
	        "channel":"02",
	        "userCode":mobile,
	        "transTime":$.getTimeStr()
	    },"body":{
	        "serialNo":serialNo	       
	    }
	}
	if( ccId != "1" && ccId != "2" && ccId != "3"){
		reqData.body.payType = "3";
	}else{
		reqData.body.orderResource = "5";
	}	
	$.toAjaxs(url,reqData,payReturnReponse);
}

//支付回调
function payReturnReponse(data){
	if(data.statusCode == "000000") {
	    $("#requestDoc").val(data.returns.pay);
	    $("#f1").attr("action", data.returns.payUrl);
	    $("form").submit();
	}else {
	    modelAlert(data.statusMessage);
	}
}

/*获取服务器时间*/
function getServiceTime(){
	var url = requestUrl.getServeTimeUrl;
	var reqData = {
	    "head":{
	        "channel":"02",
	        "userCode":"",
	        "transTime":$.getTimeStr()
	    },"body":{}
	}	
	$.reqAjaxsFalse(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	nowday = data.returns.serviceTime;
	        startDate=new Date(data.returns.serviceTime);
	        endDate=new Date(data.returns.serviceTime);
	        now=new Date(data.returns.serviceTime);
	        nDate	  = new Date(data.returns.serviceTime);
	        if( ccId == COMMODITYCOMBINE_ID.XPXSX ){
	        	nDate.setDate( nDate.getDate() + 3 );
	        }else{
	        	nDate.setDate( nDate.getDate() + 90 );	//界定最大日期值
	        }
	        startDate.setDate(startDate.getDate() +1);//生效日期T+1
	        var sYear     = startDate.getFullYear(),
        		sMonth    = startDate.getMonth()+1,
        		sDay      = startDate.getDate(),
        		eYear	  = nDate.getFullYear(),
        		eMonth	  = nDate.getMonth()+1,
        		eDay	  = nDate.getDate(),
        		defaultTime = $.getTimeStr2( now );//mui控件需要的 最小值 最大值 以及默认值
	        var optionStr = '{"type":"date","value":"'+defaultTime 
							+'","beginYear":'+sYear
							+',"beginMonth":'+sMonth
							+',"beginDay":'+sDay
							+',"endYear":'+eYear
							+',"endMonth":'+eMonth
							+',"endDay":'+eDay+'}';	//拼接成mui时间控件需要的样子
	        $("#effectivDate").val($.getTimeStr2(startDate));//生效日期T+1
	        if( ccId != "14" && ccId != "1" && ccId != "2" && ccId != "3" && ccId != "22" && ccId != "23" ){ //
	        	$("#effectivDate").addClass("riqi");//添加控件样式
	        	endDateChange(endDate);
	        	chooseDate("effectivDate",optionStr);
	        }else{
	        	if( ccId == "23"){
	        		endDateChange(endDate);
	        	}else{
	        		endDate.setFullYear(endDate.getFullYear()+1, endDate.getMonth(), endDate.getDate());//终止日期
		        	$("#endDate").val($.getTimeStr2(endDate));//终止日期
	        	}	        	
	        }       
	    }else {
	       modelAlert(data.statusMessage);
	       return false;
	    }
	});
}

//根据前面传回的试算结果
function productCalculate(ccId, age, gender ){
	var ageFlag = calChoices.indexOf('insuredAge');
	var genderFlag = calChoices.indexOf('gender');
	var piecesFlag = calChoices.indexOf('pieces');
	var versionFlag = calChoices.indexOf('versions');
	var guaranteeTermFlag = calChoices.indexOf('guaranteeTerm');
	var insureAmountFlag = calChoices.indexOf('insuredAmount');
	var insuranceCoverage1 = calChoices.indexOf('insuranceCoverage1');
	var insuranceCoverage2 = calChoices.indexOf('insuranceCoverage2');
	var insuranceCoverage3 = calChoices.indexOf('insuranceCoverage3');
	if( ageFlag != -1){
		calChoices[ageFlag+1] = age;
	}
	if( genderFlag != -1 ){
		calChoices[genderFlag+1] = gender;
	}
	if( piecesFlag != -1 ){
		cPieces = calChoices[piecesFlag+1]
	}
	if( versionFlag != -1){
		cVersion = calChoices[versionFlag+1]
	}
	if( guaranteeTermFlag != -1 ){
		cGuaranteeTerm = calChoices[guaranteeTermFlag+1]
	}
	if( insureAmountFlag != -1 ){
		cAmount = calChoices[insureAmountFlag+1] 
	}
	if( insuranceCoverage1 != -1 ){
		cCoverage1 = calChoices[insuranceCoverage1+1] 
	}
	if( insuranceCoverage2 != -1 ){
		cCoverage2 = calChoices[insuranceCoverage2+1] 
	}
	if( insuranceCoverage3 != -1 ){
		cCoverage3 = calChoices[insuranceCoverage3+1] 
	}
	sendCaldoRequest(ccId);
}

//根据保费试算项进行保费试算
function sendCaldoRequest(ccId){
	 var url = requestUrl.calDoUrl;
	 var sendJson = {
		"head" : {
		  "channel" : "02",
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

/**
 * @function 试算
 */
function calDoRender(data){
	 console.log(data);
	 if(data.statusCode == "000000"){
	    cPrem = data.returns.premiun;
	    coverage = data.returns.insuredAmount;
	    $("#jwx_foot_price").text("价格：￥" + data.returns.premiun);
	 }else{
	    modelAlert(data.statusMessage);
	 }   
}

/*姓名，手机号，身份证校验*/
function insureValidate(insureName,certificateNo,telNo){
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
	}else{
	    if($.getAge($.getBirthDay(certificateNo),now)<18){
	        modelAlert("投保人年龄需满十八周岁！");
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
}
function sendGhxInsureRequest(){
	if(!$("#word").hasClass("on")){return false;}
	var formData = getFormData();
	if(!formData){return false;}
	var url = requestUrl.ghxAddOrder;
	if( formData.relation == "01"){
		var sameFlag = "1";
	}else{
		var sameFlag = "0";
	}
	var reqData = {
			"head": {
				"userCode": mobile,
				"transTime": $.getTimeStr(),
				"channel": "02",
				"transToken":transToken
			},
			"body": {
				"ejxInfo": {
					"agrtCode": ghxDicChannel, //dicchannel1
					"data": {
						"customerList": [{
							"birthDate": $.getBirthDay(formData.certificateNo),
							"customerAddress": "",
							"customerFlag": "1",
							"customerName": formData.insureName,
							"customerSameInd": sameFlag,
							"customerType": "1",
							"docNo": formData.certificateNo,
							"docType": "01",
							"email": formData.email,
							"phoneNo": formData.telNo,
							"sex": $.getSex(formData.certificateNo)+""
						}, {
							"birthDate": $.getBirthDay(formData.recogCertiNo),
							"customerAddress": "",
							"customerFlag": "2",
							"customerName": formData.recogName,
							"customerSameInd": sameFlag,
							"customerType": "1",
							"docNo": formData.recogCertiNo,
							"docType": "01",
							"email": formData.email,
							"phoneNo": formData.recogTelNo,
							"sex": $.getSex(formData.recogCertiNo)+""
						}],
						"insuredObject": {
							"fieldAA": "01",
							"fieldAC": "01",
							"fieldAE": banbenFlag, //11
							"fieldAF": $.getTimeStr2(startDate) //当前日期的下一任
							
						},
						"orderDynamicDto": { //扩展被保险人
							"fieldAA": peiouFlag + "",
							"fieldAB": zinvFlag + "",
							"fieldAC": fumuFlag + "",
							"fieldAD": qitaFlag + ""

						},
						"projectCode": ghxDicCode, //2 diccode
						"riskCode": "1014"
					},
					"dataSource": "O-BY",
					"interfaceCode": "createOrder",
					"requestTime": nowday+"" //gettime
				},
				"other": {
					"customerId": customerId, //代理人ID
					"prem": cPrem + "", //总保费
					"productId": code[0], //	险种代码
					"commodityCombinationId": ccId,
				    "commodityId": cId,
					//"orderResources": "1", //渠道来源  
					"ghProductIds": ghxRemark, //主险代码+附加险代码
					"ghOptionalFlag": isA, // '可选保障项代码1：附加，0不附加',
					//"inviterCode":"",
					"inviterPhone":shareMobile,
				    "channelResource":channelResource,//渠道来源  
					"insureList": insureList,
					"buyType":buyType//2分享
				},
				"customerId":customerId

			}
		}
		$.reqAjaxs(url, reqData, sendGhxInsureCallback)			
}

function sendGhxInsureCallback(data){
	if( data.statusCode == "000000"){
		var agrtCode = data.returns.agrtCode;
		var insureNo = data.returns.insureNo;
		var orderNo = data.returns.orderNo;
		var projectCode = data.returns.projectCode;
		sendGhxPayRequest(orderNo)
	}else{
		modelAlert(data.statusMessage);
	}
}

function sendGhxPayRequest(orderNo){
	var url = requestUrl.ghxPay;
	var sendJson = {
		  "head": {
		    "channel": "02",
		    "userCode": mobile,
		    "transTime": $.getTimeStr(),
		    "transToken":transToken
		  },
		  "body": {
		    "orderNo": orderNo,
		    "payWay": "01",
		    "redirectUrl": base.url + "tongdaoApp/html/insurance/main/payResult.html?orderNo="+orderNo,
		    "customerId": customerId
		  }
		}
	$.reqAjaxs( url, sendJson, ghxPayBackCall );
}

function ghxPayBackCall(data){
	console.log(data);
	if(data.statusCode == "000000"){
		window.location.href=data.returns.payUrl;
	}else{
		modelAlert(data.statusMessage);
	}
}


//百万医疗险
function sendBwylRequest(){
	if(!$("#word").hasClass("on")){return false;}
	var formData = getFormData();
	if(!formData){return false;}
	var url = requestUrl.yianInsure;
	var reqData =
	{
		    "head": {
		        "userCode": mobile,
		        "transtime": $.getTimeStr(),
		        "channel": "02",
		        "transToken": transToken
		    },
		    "body": {
		        "customerId"             : customerId,
		        "premium"                : cPrem+"",
		        "inviterPhone"           : shareMobile,
		        "buyType"                : buyType,	//1app2分享
		        "commodityId"            : cId, // 33 有社保  // 34 无社保
		        "commodityCombinationId" : ccId,		   
		        "channelResource"        : channelResource,  // '渠道来源,1-微信公众号，2-分享进入，3-App',
		        "applicant": {
		            "name"               : formData.insureName,
		            "idNo"               : formData.certificateNo,
		            "phoneNo"            : formData.telNo,
		            "email"				 : formData.email
		        },
		        "recognizee": [
		            {
		                "name"           : formData.recogName,
		                "idNo"           : formData.recogCertiNo,
		                "relation"       : formData.relation,
		                "phoneNo"        : formData.recogTelNo
		            }
		        ]
		    }
	}
	if( ccId == COMMODITYCOMBINE_ID.AXYW ){
		if(cCoverage1 > 10 && ageCal < 18){
			modelAlert('该被保人未满18周岁，身故残疾保额最高不超过10万，请确认后投保！');
			return false;
		}
		reqData.body.order = {}
		reqData.body.order.guaranteeTerm = cGuaranteeTerm;			// 保障期限
		reqData.body.order.insuranceCoverage1 = cCoverage1;		// insuranceCoverage1意外身故残疾
		reqData.body.order.insuranceCoverage2 = cCoverage2;		// insuranceCoverage2 意外住院津贴
		reqData.body.order.insuranceCoverage3 = cCoverage3;		// 意外医疗
     }
	$.reqAjaxs(url, reqData, insureBwylReponse)			
}

function insureBwylReponse(data){	
	if( data.statusCode == "000000" ){		
		var orderNo	 = data.returns.orderNo;
		sendPayRequest(orderNo)
		console.log(data);
	}else{
		modelAlert(data.statusMessage);
	}
}

function sendPayRequest(orderNo){
	var url = requestUrl.bqjPay;
	var sendJson = {
		  "head": {
		    "channel": "02",
		    "userCode": mobile,
		    "transTime": $.getTimeStr(),
		    "transToken":transToken
		  },
		  "body": {
			 "orderNo": orderNo+"",		   
		     "payWay": "01",
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

//不同的商品组合判断，选填表单项
function formItemControl( ccId ){
	if( ccId != "3" && ccId != "12"){
		$("#isSame").removeClass("yincang");
	}
	if(ccId == COMMODITYCOMBINE_ID.JKJR){
		$(".zhiye").show();$(".diqu").show();
	}else if(ccId == COMMODITYCOMBINE_ID.QCWY){
		$(".zhiye").show();$(".Field").show();$(".diqu").show();
	}else if(ccId == COMMODITYCOMBINE_ID.JXJS){
		$(".zhiye").show();$(".diqu").show();
	}else if(ccId == COMMODITYCOMBINE_ID.LLHM){
		$(".llhmAddress").show();$(".diqu").show();
	}else if(ccId == COMMODITYCOMBINE_ID.JKAX){
		$(".diqu").show();
	}else if(ccId == COMMODITYCOMBINE_ID.SWFR){
		$(".diqu").show();
	}else if( ccId == COMMODITYCOMBINE_ID.XPXSX){
		$("#isSame").removeClass("on");$(".beiNone").show();$(".diqu").show();
	}else if( ccId == COMMODITYCOMBINE_ID.GHX ){
		$(".email").show();
	}else if( ccId == "3" ){
		$("#isSame").removeClass("on");$(".beiNone").show();
	}else if( ccId == "16" ){//旅游险
		$(".diqu").show();
	}else if( ccId == COMMODITYCOMBINE_ID.ZHX ){//账号险
		$(".diqu").show();
	}else if( ccId == COMMODITYCOMBINE_ID.JDX){//借贷险
		$(".diqu").show();
		$("#dai").show();//借贷合同信息
	}else if( ccId == COMMODITYCOMBINE_ID.LRX){//老人险
		$(".diqu").show();$(".zhiye").show();
	}else if( ccId == COMMODITYCOMBINE_ID.BWYL ){//百万医疗
		$(".email").show();
	}else if( ccId == COMMODITYCOMBINE_ID.AXYW ){//
		$(".email").show();
	}else if( ccId == COMMODITYCOMBINE_ID.BWZJ ){//
		$(".diqu").show();
	}				
}

//旅意险截止日期动态变化
function endDateChange(jzdate){
	if( ccId == "16" ){	
		var guaranteeTermFlag = calChoices.indexOf('guaranteeTerm');
		if( guaranteeTermFlag!= -1 ){
			cGuaranteeTerm = calChoices[guaranteeTermFlag+1];
			var intTerm = parseInt(cGuaranteeTerm);
			jzdate.setFullYear(jzdate.getFullYear(), jzdate.getMonth(), jzdate.getDate()+intTerm);//旅意险终止日期根据试算项保障期限					    
		}
	}else if( ccId == "23" ){
		var guaranteeTermFlag = calChoices.indexOf('guaranteeTerm');
		if( guaranteeTermFlag!= -1 ){
			cGuaranteeTerm = calChoices[guaranteeTermFlag+1];
			var intTerm = parseInt(cGuaranteeTerm);
			if( intTerm % 30 == 0){
				intTerm = intTerm/30;
				jzdate.setFullYear(jzdate.getFullYear(), jzdate.getMonth()+ intTerm, jzdate.getDate());
			}else{
				jzdate.setFullYear(jzdate.getFullYear(), jzdate.getMonth(), jzdate.getDate()+intTerm);//安心意外终止日期根据试算项保障期限	
			}							    
		}
	}else{
		jzdate.setFullYear(jzdate.getFullYear()+1, jzdate.getMonth(), jzdate.getDate());//ecard终止日期默认一年
	}
	$("#endDate").val($.getTimeStr2(jzdate));//终止日期文本显示
}

//触发修改日期控件
function chooseDate(id,options){	
	var result = document.getElementById(id);
	if( result ){
		$(result).attr("data-options",options);
		result.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);			
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				result.value = rs.text;
				dieDate   = new Date(result.value);
				dieDate.setDate( dieDate.getDate() - 1)
				endDateChange(dieDate);				
				picker.dispose();
			});		
		});	
	}
}

//获取姓名
function getTypeRequest(cusid){
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var sendJson = {
			"head":{
				"channel" : "02",
	            "userCode" : "",
	            "transTime" : $.getTimeStr(),
	            "transToken": ""
			},
			"body":{
				"customerId":cusid
			}
	}
	$.reqAjaxsFalse( url, sendJson, getTypeCallback );
}

function getTypeCallback(data){
	console.log(data)
	if(data.statusCode == '000000'){
		shareType = data.returns.customerBasic.type;
	}else{
		shareType = '01'
	}
	
}

function backlast(){
	urlParm.title = '产品详情';
	urlParm.leftIco = "1";
	urlParm.rightIco = "1";
	urlParm.downIco = "0";
	if(urlParm.holder){delete urlParm.holder}
	if(urlParm.holderbr){delete urlParm.holderbr}
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( ccId != "14" ){
		window.location.href = 'productDetail.html?jsonKey='+jsonStr;
	}else{
		window.location.href = base.url + 'tongdaoApp/html/share/insurance/ghx/ghxProductDetail.html?jsonKey='+jsonStr;
	}
	
};
function toArticle(){ 
	urlParm.title = "保险条款列表";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";	
	urlParm.frompage = "insureHtml"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/article.html?jsonKey="+jsonStr;
}

function toXuzhi(){
	urlParm.title = "投保须知";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";	
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/agreement/changeXuzhi.html?jsonKey="+jsonStr;
}




