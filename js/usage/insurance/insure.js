/*全局常量*/
var REQUEST_URL = {
    "INSURE_URL" : base.url + "ecard/toubao.do",
    "PAY_URL"    : base.url + "ecard/pay.do",
    "FEECITY_URL": base.url + "ecard/selectDefaulInsuredArea.do",
    // "PROVIN_URL" : base.url + "ecard/selectOrgProvince.do",
    "CITY_URL"   : base.url + "ecard/selectAreaByParams.do"
}
var CERTIFICATENO_LENGTH = 18;
var PRODUCT_CODE ={
    "JKJR" : "00400009",	//健康佳人
    "JKAX" : "00400010",	//健康安享
    "QCWY" : "00400008",	//全车无忧
    "LLHM" : "00400011",	//邻里和睦
    "JXJS" : "00400007",	//锦绣吉顺
    "SWFR" : "00400012",	//商务飞人
    "XPXSX": "00400013",    //码上长大(省心版)
    "XPXAX": "00400014",    //码上长大(省心版)
}

/*全局变量*/
//上个页面收的参数
var urlParm     = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile      = urlParm.mobile,
productCode = urlParm.productCode,
customerId  = urlParm.customerId,
duty        = urlParm.duty,
productName = urlParm.productName,
premCal     = urlParm.prem,
peices      = urlParm.pieces;
var holder      = urlParm.holder;
var insuredAmount = "";
//试算条件
var ageCal = "";
var genderCal = "";
var premiunCal = "5000000";
var now = "";
var path = window.location.pathname.split("/").pop();
var pathName = window.location.pathname.split("/").pop().split(".")[0];
if(productCode == PRODUCT_CODE.JKJR){
$(".zhiye").show();
}else if(productCode == PRODUCT_CODE.QCWY){
$(".zhiye").show();
$(".Field").show();
}else if(productCode == PRODUCT_CODE.JXJS){
$(".zhiye").show();
}else if(productCode == PRODUCT_CODE.LLHM){
$(".llhmAddress").show();
}
$(function(){
sendFeeCityRequest();
//getServiceTime();
$(".duty").html(tableGener(duty));
$("#insuranceName").val(productName);
$("#jwx_foot_price").html("价格：￥"+premCal);
if(holder){		
    var insuIden  = holder.insureIdentitycard;		
    var insuName  = holder.insureName;
    var insuPhone = holder.insurePhone;
    var insuSex   = $.getSex(insuIden) == 1 ? "男" :"女";
    var	insuBirth = $.getBirthDay(insuIden);
    $("#insureName").val(insuName);				//投保人姓名
    $("#certificateNo").val(insuIden);			//证件号码
    $("#telNo").val(insuPhone);					//手机号码
    $("#gender").val(insuSex);
    $("#birthDate").val(insuBirth);
    ageCal = $.getAge($.getBirthDay(insuIden),now);
    genderCal = $.getSex(insuIden) + "";
    productCalculate(productCode);
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
                productCalculate(productCode);
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
            modelAlert("请输入合法的投保人身份证号！");
            this.value = "";
            return false;
        }else{
            var gender = $.getSex(this.value) == 1 ? "男" :"女";
            $("#recogGender").val(gender);
            $("#recogBirthDate").val($.getBirthDay(this.value));
            ageCal = $.getAge($.getBirthDay(this.value),now);
            genderCal = $.getSex(this.value) + "";
            productCalculate(productCode);
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
    selectPicker.setData(popArray);
    selectPicker.show(function(item){
        $("#profession").text(item[0].text);
        $("#profession").attr("data-value",item[0].value);
    });
});
$("#relation").unbind("tap").bind("tap",function(){
    var selectPicker1 = new mui.PopPicker();
    var popArray1 = [{"text":"配偶","value":"10"},{"text":"子女","value":"40"},{"text":"父母","value":"50"},{"text":"其他","value":"99"}];
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
    sendInsureRequest();	//发送投保请求
});
//点击"查询职业"
$(".search").unbind("tap").bind("tap",function(){
    window.location.href = "../../html/tiaokuan/profession.html"
});
//点击"返回按钮"
$(".h_back").unbind("tap").bind("tap",function(){
    toProductDetail();
});
//点击新车未上牌
$("#chooseicon,.xinche").unbind("tap").bind("tap",function(){
    if($("#chooseicon").hasClass("on")){
        $("#chooseicon").removeClass("on");
        $("#chooseicon").attr("src","../../image/gouxuankuang.png");
        $(".xinche").css("color","black");
        $("#FieldAI").val("");
        document.getElementById("FieldAI").readOnly=false;
    }else{
        $("#chooseicon").addClass("on");
        $("#chooseicon").attr("src","../../image/gouxuankuang1.png");
        $(".xinche").css("color","#1b6bb8");
        $("#FieldAI").val(" ");
        document.getElementById("FieldAI").readOnly=true;
    }
});
//点击同投保人
$("#isSame").unbind("tap").bind("tap",function(){
    if($(this).hasClass("on")){
        $(this).removeClass("on");
        $(this).find("img").attr("src","../../image/cancerRisk/meigou.png");
        $(".beiNone").show(1000);
    }else{
        var sameName    = $.trim($("#insureName").val());		//投保人姓名
        var sameNo      = $.trim($("#certificateNo").val());	//证件号码
        var sameTelNo   = $.trim($("#telNo").val());			//手机号码
        var sameGender  = $.getSex(sameNo) == 1 ? "男" :"女";
        if(insureValidate(sameName,sameNo,sameTelNo) == false){
            return false;
        };
        $(this).addClass("on");
        $(this).find("img").attr("src","../../image/cancerRisk/gou.png");
        $(".beiNone").hide(1000);
        
        ageCal = $.getAge($.getBirthDay(sameNo),now);
        genderCal = $.getSex(sameNo) + "";
        productCalculate(productCode);
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
    window.location.href= base.url + "tongdaoApp/page/html/cancerRisk/holder.html"+window.location.search+"&pageFrom="+pathName;
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
});

function getFormData(){
var formData = {};
var insureName    = $.trim($("#insureName").val());		//投保人姓名
var certificateNo = $.trim($("#certificateNo").val());	//证件号码
var telNo		  = $.trim($("#telNo").val());			//手机号码

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
if($(".isSame").hasClass("on")){
    var relation      = "01";	 		                        //与投保人关系
    var recogName     = insureName;	 							//被保人姓名
    var recogCertiNo  = certificateNo; 							//被保人证件号码
    var recogTelNo	  = telNo;									//被保人手机号
}else{
    var relation      = $("#relation").attr("name");	 		//与投保人关系
    var recogName     = $.trim($("#recognizeeName").val());	 	//被保人姓名
    var recogCertiNo  = $.trim($("#recogCertificateNo").val()); //被保人证件号码
    var recogTelNo	  = telNo;//$.trim($("#recogTelNo").val());	//被保人手机号	
}

if(productCode == PRODUCT_CODE.JKJR || productCode == PRODUCT_CODE.QCWY || productCode == PRODUCT_CODE.JXJS){
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
//投保地区校验
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
    if(productCode == PRODUCT_CODE.JKJR){
        if($.getSex(recogCertiNo) != 2){
            modelAlert("该被保人性别与规则不符！");
            return false;
        }
        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 55 ){//16~55
            modelAlert("该被保人年龄与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.JKAX){
        if($.getAge($.getBirthDay(recogCertiNo),now) < 18 || $.getAge($.getBirthDay(recogCertiNo),now) > 55 ){//18~55
            modelAlert("该被保人年龄与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.QCWY){
        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 65 ){//16~65
            modelAlert("该被保人年龄与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.LLHM){
        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo),now) > 65 ){//16~65
            modelAlert("该被保人年龄与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.JXJS){
        if($.getAge($.getBirthDay(recogCertiNo),now) < 16 || $.getAge($.getBirthDay(recogCertiNo)) > 65 ){//16~65
            modelAlert("该被保人年龄与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.SWFR){
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
    if(productCode == PRODUCT_CODE.JKJR){		//1~3
        if( profession>3  ){
            modelAlert("该被保人承保职业与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.QCWY){//1~4
        if( profession>4  ){//16~65
            modelAlert("该被保人承保职业与规则不符！");
            return false;
        }
    }else if(productCode == PRODUCT_CODE.JXJS){//1~4
        if( profession>4  ){//16~65
            modelAlert("该被保人承保职业与规则不符！");
            return false;
        }
    }else {
        
    }
}
if( productCode == PRODUCT_CODE.QCWY ){
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
}else if( productCode == PRODUCT_CODE.LLHM ){
    if($.isNull(FieldAA)){
        modelAlert("房屋坐落地址不能为空！");
        return false;
    }
}
formData.insureName 	= insureName;
formData.certificateNo  = certificateNo;
formData.telNo 			= telNo;
formData.address 		= address;
formData.cityCode       = cityCode;
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
return formData;
}
//customerId查询落地城市
function sendFeeCityRequest(){
var url = REQUEST_URL.FEECITY_URL;
var reqData = {
        "head":{
            "channel"  :"01",
            "userCode" :mobile,
            "transTime":$.getTimeStr()
        },
        "body":{
            "customerId":"14",//customerId,//773  198980 250
            "commodityCombinationId" : '6' //
        }
}
$.reqAjaxs(url,reqData,feeCityReponse);
}
//落地城市返回
function feeCityReponse(data){
console.log(data);
if(data.statusCode == "000000"){
	var body = data.returns;
	var ccsa = body.commodityCombinationSaleArea;
	if( ccsa && ccsa.length != 0 ){
		if( ccsa.length == 1 ){
			var cityCode     = ccsa["0"].cityCode;
			var cityName 	 = ccsa["0"].cityName;
			var provinceCode = ccsa["0"].provinceCode;
			var provinceName = ccsa["0"].provinceName;
			$("#orgCityCode").text(cityName);				//城市名称
			$("#orgProvinceCode").text(provinceName);		//省名称
			$("#orgCityCode").attr("name",cityCode);		//城市代码
			$("#orgProvinceCode").attr("name",provinceCode);//省代码
			$("#address").val(cityName);
			sendCityRequest( provinceCode, cityCode );
		}else if( ccsa.length > 1 ){
			var provinceCode = ccsa["0"].provinceCode;
			var provinceName = ccsa["0"].provinceName;
		}
	}else{
		
	}
//    if( bxLandingServiceFees && bxLandingServiceFees.length != 0  ){
//        if(bxLandingServiceFees.length == "1"){
//-            var orgCityCode	    = bxLandingServiceFees["0"].orgCityCode;
//-            var orgProvinceCode	= bxLandingServiceFees["0"].orgProvinceCode;
//-           var orgProvinceName	= bxLandingServiceFees["0"].orgProvinceName;				
//-            var orgCityName		= bxLandingServiceFees["0"].orgCityName;
//            var agentCode		= bxLandingServiceFees["0"].intermediaryCode;
//            var teamCode		= bxLandingServiceFees["0"].teamCode;	
//            var certiNo			= bxLandingServiceFees["0"].agentCode;
//            var businessSource  = bxLandingServiceFees["0"].yewuSource;
//            var agentName		= bxLandingServiceFees["0"].agnetName;
//-            $("#orgCityCode").text(orgCityName);
//-            $("#orgProvinceCode").text(orgProvinceName);
//-            $("#address").val(orgCityName);//0822将地址定死
//-            $("#orgCityCode").attr("name",orgCityCode);
//-            $("#orgProvinceCode").attr("name",orgProvinceCode);
//            $("#orgCityCode").attr("agentCode",agentCode);
//            $("#orgCityCode").attr("teamCode",teamCode);
//            $("#orgCityCode").attr("certiNo",certiNo);
//            $("#orgCityCode").attr("businessSource",businessSource);
//            $("#orgCityCode").attr("agentName",agentName);
//            $(".down1").show();
//            sendProvinceRequest();
//        }else if(bxLandingServiceFees.length > 1){
//            $(".cdown").show();
//            var orgProvinceCode	= bxLandingServiceFees["0"].orgProvinceCode;
//            var orgProvinceName	= bxLandingServiceFees["0"].orgProvinceName	
//            $("#orgProvinceCode").text(orgProvinceName);
//            $("#orgProvinceCode").attr("name",orgProvinceCode);
//            sendCityRequest(orgProvinceCode);
//        }
//        
//    }else{
//        $(".down1").show();
//        sendProvinceRequest();
//    }
    
}


}

//落地市
function sendCityRequest(provinceCode,cityCode){
var url = REQUEST_URL.CITY_URL;
var reqData = {
        "head":{
            "channel"  :"01",
            "userCode" :mobile,
            "transTime":$.getTimeStr()
        },
        "body":{
            "orgProvinceCode":provinceCode,
            "commodityCombinationId": '6',//commodityCombinationId,
            "cityCode" : cityCode
        }
}
$.reqAjaxs(url,reqData,cityReponse);
}
function cityReponse(data){
if(data.statusCode == "000000"){
    console.log(data);
    $("#orgCityCode").unbind("tap").bind("tap",function(){
        var selectPicker3 = new mui.PopPicker();
        var bxLandingServiceFees = data.returns.bxLandingServiceFees;
        var cityArray = [];
        for( var i = 0; i < bxLandingServiceFees.length; i++ ){
            var item ={ 
                    "text":bxLandingServiceFees[i].orgCityName,
                    "value":bxLandingServiceFees[i].orgCityCode,
                    "agentCode":bxLandingServiceFees[i].intermediaryCode,//中介代码
                    "teamCode":bxLandingServiceFees[i].teamCode,//团队代码
                    "certiNo":bxLandingServiceFees[i].agentCode,
                    "businessSource":bxLandingServiceFees[i].yewuSource,
                    "agentName":bxLandingServiceFees[i].agnetName
                    }
            cityArray.push(item);
        }
        selectPicker3.setData(cityArray);
        selectPicker3.show(function(item){
            $("#orgCityCode").text(item[0].text);
            $("#orgCityCode").attr("name",item[0].value);
            $("#orgCityCode").attr("agentCode",item[0].agentCode);
            $("#orgCityCode").attr("teamCode",item[0].teamCode);
            $("#orgCityCode").attr("certiNo",item[0].certiNo);
            $("#orgCityCode").attr("businessSource",item[0].businessSource);
            $("#orgCityCode").attr("agentName",item[0].agentName);
        });
    });
}else{
    
}
}
//投保请求
/*投保方法*/
function sendInsureRequest(){
if(!$("#word").hasClass("on")){return false;}
var url = REQUEST_URL.INSURE_URL;
var formData = getFormData();
if(!formData){return false;}
var reqData = {
    "head":{
        "channel"  :"01",
        "userCode" :mobile,
        "transTime":$.getTimeStr()
    },
    "body":{
        "bxOrder":{
            "productId" :productCode,
            "insureName":formData.insureName,
            "customerId":customerId,
            "insurePhone":formData.telNo,
            "insureIdentitycard": formData.certificateNo,				
            "coverage":insuredAmount+"",
            "inviterPhone":mobile,
            "insureAddress":formData.address,
            "totalPieces":parseInt(peices),
            "channelResource":'3'// '渠道来源,1-微信公众号，2-分享进入，3-App',	
        },
        "bxInsured":{
            "apRelation" : formData.relation,
            "insuredname": formData.recogName,
            "insuredidno": formData.recogCertiNo,
            "insuredmobile":formData.recogTelNo
        },
        "belongORGCode":formData.agentName,
        "agentCode":formData.agentCode,
        "teamCode":formData.teamCode,
        "certiNo":formData.certiNo,
        "businessSource":formData.businessSource
        
    }
}
if( productCode == PRODUCT_CODE.LLHM ){
    reqData.body.FieldAA = formData.FieldAA;
}else if( productCode == PRODUCT_CODE.QCWY ){
    reqData.body.FieldAJ = formData.FieldAJ;
    reqData.body.FieldAI = formData.FieldAI;
    reqData.body.FieldAN = formData.FieldAN;
}
console.log("====== 请求数据 ======");
console.log(reqData);
console.log("... ... ...");
$.toreqAjaxs(url,reqData,insureReponse);

}
/*投保返回，调用支付接口*/
function insureReponse(data){
console.log("====== 返回数据 ======");
console.log(data);
console.log("--- --- ---");
if(data.statusCode == "000000"){
    var serialNo = data.returns.bxOrder.orderNo;//获取序列号
    payRequest(serialNo)//核保成功,调支付接口
}else{
    modelAlert(data.statusMessage);
    return false;
}
}
/*支付接口*/
function payRequest(serialNo){
var url = REQUEST_URL.PAY_URL;
var reqData = {
    "head":{
        "channel":"01",
        "userCode":mobile,
        "transTime":$.getTimeStr()
    },"body":{
        "serialNo":serialNo,
        "payType" :"7"
    }
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
        "channel":"01",
        "userCode":"",
        "transTime":$.getTimeStr()
    },"body":{}
}	
$.reqAjaxsFalse(url,reqData,function(data){
    if(data.statusCode == "000000") {
        var startDate=new Date(data.returns.serviceTime);
        var endDate=new Date(data.returns.serviceTime);
        now=new Date(data.returns.serviceTime);
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
/*
* @function 健康佳丽 保费试算
*/
function jkjrCalculation(age){
var url = base.url + "calculation/calculation.do";
var reqData = {
        "head":{
            "channel":"01",
            "userCode":mobile,
            "transTime":$.getTimeStr()
        },"body":{			
            "productId":productCode,
            "insuredAge":age
        }
    }
$.reqAjaxsFalse(url,reqData,priceRender);
}
/*
* @function 健康安享
*/
function jkaxCalculation(age,gender){
var url = base.url + "calculation/calculation.do";
var reqData = {
        "head":{
            "channel":"01",
            "userCode":mobile,
            "transTime":$.getTimeStr()
        },"body":{			
            "productId":productCode,
            "insuredAge":age,
            "gender":gender
        }
    }
$.reqAjaxsFalse(url,reqData,priceRender);
}
/*
* @function 商务飞人
*/
function swfrCalculation(premium){
var url = base.url + "calculation/calculation.do";
var reqData = {
        "head":{
            "channel":"01",
            "userCode":mobile,
            "transTime":$.getTimeStr()
        },"body":{			
            "productId":productCode,
            "premium":premium
        }
    }
$.reqAjaxsFalse(url,reqData,priceRender);
}
/*
* @function 全车无忧
*/
function qcwyCalculation(num){
$("#jwx_foot_price").html("价格：￥"+200*num);	
}
/*
* @function 锦绣吉顺
*/
function jxjsCalculation(num){
$("#jwx_foot_price").html("价格：￥"+100*num);
premCal = 100*num;
}
/*
* @function 邻里和睦
*/
function otherCalculation(){
var url = base.url + "calculation/calculation.do";
var reqData = {
        "head":{
            "channel":"01",
            "userCode":mobile,
            "transTime":$.getTimeStr()
        },"body":{			
            "productId":productCode			
        }
    }
$.reqAjaxsFalse(url,reqData,insuredAmountCal);
}
//输出保额试算结果
function insuredAmountCal(data){
 if(data.statusCode == "000000") {	   
    insuredAmount = data.returns.bxRate.insuredAmount;		
}else {
    modelAlert(data.statusMessage);
}
}
//输出保费试算和保额试算结果
function priceRender(data){
 if(data.statusCode == "000000") {
    prem = data.returns.bxRate.premium;
    insuredAmount = data.returns.bxRate.insuredAmount;
    $("#jwx_foot_price").html("价格：￥"+prem);	
}else {
    modelAlert(data.statusMessage);
}
}
//根据不同的产品试算不同的
function productCalculate(productCode){
if(productCode == PRODUCT_CODE.JKJR){
    if(ageCal >= 16 && ageCal <= 55 ){
        jkjrCalculation(ageCal);
    }else{
        modelAlert("该被保人年龄与规则不符！");
        return false;
    }		
}else if(productCode == PRODUCT_CODE.JKAX){
    if(ageCal >= 18 && ageCal <= 55 ){
        jkaxCalculation(ageCal,genderCal)
    }else{
        modelAlert("该被保人年龄与规则不符！");
        return false;
    }			
}else if(productCode == PRODUCT_CODE.SWFR){
    swfrCalculation(premiunCal);
}else if(productCode == PRODUCT_CODE.QCWY){
    otherCalculation();
    //qcwyCalculation(num);
}else if(productCode == PRODUCT_CODE.JXJS){
    otherCalculation();
    //jxjsCalculation(num);
}else{
    otherCalculation();
    //otherCalculation();
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

//function toArticle(){  
//var param={
//        "head":{
//            "mobile":mobile,
//            "switchCommission":"",
//            "pageFrom":path
//        },"body":{
//            "customerId":customerId,
//            "productCode":productCode,
//            "commodityNo":"00419900802"
//        }
//    }
//var jsonStr = UrlEncode(JSON.stringify(param));
//window.location.href = "article.html?jsonKey="+jsonStr;
//}
//function toProductDetail(){
//var sendData = {
//        "head":{
//            "mobile":mobile,
//            "switchCommission":""
//        },
//        "body":{
//            "mobile":mobile,
//            "productCode":productCode,
//            "commodityNo":"00419900802",
//            "customerId":customerId
//        }
//}
//var jsonKey = UrlEncode(JSON.stringify(sendData));
//window.location.href = "productDetail.html?jsonkey="+jsonKey;
//}
//function toXuzhi(){
//var sendData = {
//        "head":{
//            "mobile":mobile,
//            "switchCommission":""
//        },
//        "body":{
//            "mobile":mobile,
//            "productCode":productCode,
//            "commodityNo":"00419900802",
//            "customerId":customerId
//        }
//}
//var jsonKey = UrlEncode(JSON.stringify(sendData));
//window.location.href = "../tiaokuan/changeXuzhi.html?jsonkey="+jsonKey;
//}