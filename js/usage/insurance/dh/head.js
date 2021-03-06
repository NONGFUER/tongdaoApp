
// 全局常量
/*全局常量*/
var CERTIFICATENO_LENGTH = 18;
var COMMODITYCOMBINE_ID ={
		"MCAN" : "1",	//男性防癌险
		"PMCAN": "1",	//
		"FCAN" : "2",	//女性防癌险
		"PFCAN": "2",	//
		"BCAN" : "3",	//少儿防癌险
		"PBCAN": "3",	//
		"JXJS" : "6",	//锦绣吉顺
	    "QCWY" : "7",	//全车无忧
	    "JKJR" : "8",	//健康佳人
	    "JKAX" : "9",	//健康安享
	    "LLHM" : "10",	//邻里和睦	    
	    "SWFR" : "11",	//商务飞人
	    "XPXSX": "12",   //码上长大(省心版)
	    "XPXAX": "12",   //码上长大(省心版)
	    "GHX"  : "14",
	    "LYX"  : "16",	 //旅意险
	    "ZHX"  : "18",	 //账号险
	    "JDX"  : "19",	 //借贷险
	    "LRX"  : "20",	 //老人险
	    "BQJ"  : "21",    //易安保全家疾病保险
	    "BWYL" : "22",    //易安百万医疗险
	    "AXYW" : "23",    //易安安心意外险
	    "BWZJ" : "27",     //天安百万重疾
	    "JKAX_GZ":"29",		//天安健康安享百万重疾保障（贵州银保专属）
	    "JKAX_GZ":"30",		//乐享全能幸福家庭家主综合保障保险 
	    "JKAX_GZ":"31",		//安享无忧个人资金账户安全保险
	    "JKAX_GZ":"32",		//尊享一生愉快人身意外伤害保险
	    "JKAX_GZ":"33",		//跃享至尊航空旅客人身意外伤害保险
	    "JKAX_GZ":"34",		//逸享畅行锦程交通意外伤害保险
	}
var COMMODITY_ID ={
		"MCAN" : "1",
		"PMCAN": "2",
		"FCAN" : "3",
		"PFCAN": "4",
		"BCAN" : "5",
		"PBCAN": "6",
		"JXJS" : "9",	//锦绣吉顺
	    "QCWY" : "10",	//全车无忧
	    "JKJR" : "11",	//健康佳人
	    "JKAX" : "12",	//健康安享
	    "LLHM" : "13",	//邻里和睦	    
	    "SWFR" : "14",	//商务飞人
	    "XPXSX": "15",    //码上长大(省心版)
	    "XPXAX": "16"    //码上长大(安心版)
	}

var ajaxStatus = {
    success : "000000",
    relogin : "123456"
} 

var message = {
    requestFail : "网络好像开小差了呢，请设置给力一点儿网络吧！",
    phoneNull   : "手机号不能为空！",
    nameNull    : "姓名不能为空！",
    phoneError  : "手机号格式不正确！",
    nameError   : "姓名必须为汉字！"
}
var requestUrl = {
	//系统时间
	getServeTimeUrl      : base.url + 'communal/getServiceTime.do',
    //线下产品模块    
    cusAndAgenInfoUrl    : base.url + 'customerBasic/getCustomerAndAgentInfo.do',              // //APP用户及客户经理信息查询@gxj
    liveProductInfoUrl   : base.url + 'offlineCommodityComDetail/getOfflineComComDetail.do',   //(完成)APP产品模块线下产品详情查询 @gxj
    commodityListUrl     : base.url + 'commodityCombination/getCommodityList.do',              //APP产品模块商品列表查询 @gxj
    commissionInfoUrl    : base.url + 'commodityCombination/getCommodityCommissionInfos.do',   //APP产品模块产品条款佣金比例列表查询 @gxj
    cusInsConsultantUrl  : base.url + 'cusInsuranceConsultant/getCusInsuranceConsultant.do',   //（完成）APP产品模块线下产品详情页保险顾问查询 @gxj
    addYuyueInfoUrl      : base.url + 'yuyue/addYuyueInfo.do',                                 //（完成）预约新增 @gxj
    //线上产品模块
    onlineProductInfoUrl : base.url + 'product/getOnlineProductDetail.do',
    calOptionsUrl        : base.url + 'cal/getCalOptions.do',   //根据商品组合id查询保费试算项@chengcheng
    calDoUrl             : base.url + 'cal/cal.do',             //根据保费试算项进行保费试算@chengcheng
    //线上投保模块
    //ecard投保
    ecardInsure          : base.url + 'ecard/toubao.do',     //投保接口@mjp
    ecardPay             : base.url + 'ecard/pay.do',        //投保支付@mjp
    ecardPayBack         : base.url + 'ecard/payBack.do',    //投保地区查询@mjp
    defalultArea  		 : base.url + "ecard/selectDefaulInsuredArea.do",  //@mjp  默认地区
    chooseArea			 : base.url + "ecard/selectAreaByParams.do",		//@mjp 选择地区
    //防癌险投保
    cancerInsure         : base.url + 'cancerRisk/toubao.do',     //防癌险投保接口@cc
    cancerPay            : base.url + 'cancerRisk/pay.do',      //防癌险支付@cc
    cancerPayBack        : base.url + 'cancerRisk/payBack.do',//投保地区查询@cc
    //挂号险投保
    ghxProductInfo		 : base.url + 'ghxProduct/yianGhxProductInfo.do',//@wxw
    ghxAddOrder			 : base.url + 'ghxOrder/addOrder.do',			//@wxw
    ghxPay				 : base.url + 'ghxOrder/pay.do',				//@wxw
    //健康告知
    heathTold			 : base.url + 'commodityCombination/getHealthTold.do',//@gxj
    notice				 : base.url + 'commodityCombination/getNotice.do',//@gxj
    //易安保全家
    bqjInsure			 : base.url + 'preservation/bqjcreateOrder.do',	//保全家投保接口@wxw
    bqjPay				 : base.url + 'preservation/bqjPay.do',				//保全家支付@wxw
    //议案百万医疗
	yianInsure           : base.url + "yiAn/insure.do",						//百万医疗投保接口
	channelTb            : base.url + "ecardChannel/toubao.do"
}
//全局变量
if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
}else{
	var urlParm = {};
	urlParm.openid = getUrlQueryString("openid");
	urlParm.roleType = getUrlQueryString("roletype");
	urlParm.shareMobile = getUrlQueryString("shareMobile");
	urlParm.shareCusId = getUrlQueryString("shareCusId");
	urlParm.provinceCode = getUrlQueryString("provinceCode");
	urlParm.cityCode = getUrlQueryString("cityCode");
	urlParm.ccId = getUrlQueryString("ccId");
	urlParm.customerId = getUrlQueryString("customerId") ? getUrlQueryString("customerId"):"";
	urlParm.shareFlag = getUrlQueryString("shareFlag");
	urlParm.mobile = getUrlQueryString("mobile") ? getUrlQueryString("mobile") : "";
	urlParm.entry = getUrlQueryString("entry") ? getUrlQueryString("entry") : "dh";
}

//微信比app多（不同）的字段
var openid = urlParm.openid ? urlParm.openid : "";
var shareMobile = urlParm.shareMobile ? urlParm.shareMobile : "";
var shareCusId = urlParm.shareCusId ? urlParm.shareCusId : "";
var shareFlag = urlParm.shareFlag ? urlParm.shareFlag : "";

var isComing    = urlParm.isComing ? urlParm.isComing : "";; 			//即将上线

var mobile      = urlParm.mobile;                //"18900001111";  //urlParm.mobile;//用户手机号
var customerId  = urlParm.customerId;            //"8";            //urlParm.customerId;//用户id
var name		= urlParm.name;					 //姓名
var idAuth		= urlParm.idAuth;				 //是否实名
var idNo		= urlParm.idNo;					 //身份证号
var roleType    = urlParm.roleType;              //"04";				//urlParm.roleType用户角色
var transToken  = urlParm.transToken ? urlParm.transToken : '' ;//"40d1ef064f3259d6501dc15e69fb8d1c"//urlParm.transToken;			 //
var ccId        = urlParm.ccId;                  //"3";             //urlParm.ccId;商品组合id
var ccCode      = urlParm.ccCode;                //"00400003";      //urlParm.ccCode;商品组合code
var cCode       = urlParm.cCode;				 //
var cId			= urlParm.cId + "";					 //
var cityCode    = urlParm.cityCode;              //"220001"			//urlParm.cityCode	市代码
var	provinceCode= urlParm.provinceCode;          //"220000"			//	urlParm.provinceCode	省代码
var cName = urlParm.cName ? urlParm.cName : "";
var ccName = urlParm.ccName ? urlParm.ccName : "";
var cPrem = urlParm.cPrem ? urlParm.cPrem : "";
var cPieces	= urlParm.cPieces ? urlParm.cPieces : "1";
var cVersion = urlParm.cVersion ? urlParm.cVersion : "01";
var coverage = "";
var title = "";
var leftIco = "";
var rightIco = "";

var shareDesc = "";
var shareTitle = "";

//挂号线
var ghxDicChannel = urlParm.ghxDicChannel ? urlParm.ghxDicChannel : "";
var ghxDicCode = urlParm.ghxDicCode ? urlParm.ghxDicCode : "";
var ghxRemark = urlParm.ghxRemark ? urlParm.ghxRemark : "";
var isA = urlParm.isA ? urlParm.isA : "0";
var fumuFlag = urlParm.fumuFlag ? urlParm.fumuFlag : "0";
var peiouFlag = urlParm.peiouFlag ? urlParm.peiouFlag : "0";
var zinvFlag = urlParm.zinvFlag ? urlParm.zinvFlag : "0";
var qitaFlag = urlParm.qitaFlag ? urlParm.qitaFlag : "0";
var banbenFlag = urlParm.banbenFlag ? urlParm.banbenFlag : "01";

//驴意险
var cGuaranteeTerm = '';
//微信公众号 渠道出单qudao 保险商城mall
var entry = urlParm.entry ? urlParm.entry : 'app';
if( entry == 'app' ){	
	//modelAlert("native");
	var channel = "01"
	var channelResource = "3"
	var payWay = '02'
	var buyType = '1'
	var payType = "7"//短险支付方式
}else{	
	//modelAlert("浏览器或微信端");
	var payType = "3"//短险支付方式
	var channel = "02"
	if( shareFlag == 'Y'){
		var channelResource = "2"
		var buyType = '2'
	}else{
		var channelResource = "1"
		var buyType = '1'	
	}	
	var payWay = '01'
	$("header").show();
	$(".mui-scroll-wrapper").css("margin-top", "44px");
}
if(urlParm.productCode == '00400015' || urlParm.ccCode == '00400015'){
	ccId = '20'//暂时性元旦活动补老人先
}
if(urlParm.productCode == '00400017' || urlParm.ccCode == '00400017'){
	ccId = '27'//天安百万重疾
}
if(urlParm.productCode == '00400010' || urlParm.ccCode == '00400010'){
	ccId = '12'//学平险
}
var PRODUCT_PICURL ={
		"BASE" : base.url + "tongdaoApp/image/share/tongdaoic.png",
		"MCAN" : base.url + "tongdaoApp/image/share/fangainan.png",
		"FCAN" : base.url + "tongdaoApp/image/share/fangainv.png",
		"BCAN" : base.url + "tongdaoApp/image/share/fangaihai.png",
		"JKJR" : base.url + "tongdaoApp/image/share/jkjr.png",	//健康佳人
		"JKAX" : base.url + "tongdaoApp/image/share/jkax.png",	//健康安享
		"JKAX_GZ" : base.url + "tongdaoApp/image/share/jkax.png",	//天安健康安享百万重疾保障（贵州银保专属）
		"QCWY" : base.url + "tongdaoApp/image/share/qcwy.png",	//全车无忧
		"LLHM" : base.url + "tongdaoApp/image/share/llhm.png",	//邻里和睦
		"JXJS" : base.url + "tongdaoApp/image/share/jxjs.png",	//锦绣吉顺
		"SWFR" : base.url + "tongdaoApp/image/share/swfr.png",	//商务飞人
		"LYX"  : base.url + "tongdaoApp/image/share/lyx.png",	//旅意险
		"LRX"  : base.url + "tongdaoApp/image/share/lrx.png",   //老人险
		"ZHX"  : base.url + "tongdaoApp/image/share/zhx.png",   //账户险
		"JDX"  : base.url + "tongdaoApp/image/share/jdx.png",   //借贷险	
		"BQJ"  : base.url + "tongdaoApp/image/share/bqj.png",	//保全家
		"BWYL" : base.url + "tongdaoApp/image/share/bwyl.png",   //百万医疗
		"AXYW" : base.url + "tongdaoApp/image/share/axyw.png",	//安心意外险
		"BWZJ" : base.url + "tongdaoApp/image/share/bwzj.png"	//百万重疾
}
//根据不同的产品获取分享信息
function getProductSharePic(productCode){
	var picUrl = "";
	if( productCode == COMMODITYCOMBINE_ID.JKJR ){
		picUrl = PRODUCT_PICURL.JKJR;
	}else if( productCode == COMMODITYCOMBINE_ID.JKAX ){
		picUrl = PRODUCT_PICURL.JKAX;
	}else if( productCode == COMMODITYCOMBINE_ID.JKAX_GZ ){
		picUrl = PRODUCT_PICURL.JKAX_GZ;
	}else if( productCode == COMMODITYCOMBINE_ID.LLHM ){
		picUrl = PRODUCT_PICURL.LLHM;
	}else if( productCode == COMMODITYCOMBINE_ID.QCWY ){
		picUrl = PRODUCT_PICURL.QCWY;
	}else if( productCode == COMMODITYCOMBINE_ID.JXJS ){
		picUrl = PRODUCT_PICURL.JXJS;
	}else if( productCode == COMMODITYCOMBINE_ID.SWFR ){
		picUrl = PRODUCT_PICURL.SWFR;
	}else if( productCode == COMMODITYCOMBINE_ID.MCAN ){
		picUrl = PRODUCT_PICURL.MCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.FCAN ){
		picUrl = PRODUCT_PICURL.FCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.BCAN ){
		picUrl = PRODUCT_PICURL.BCAN;
	}else if( productCode == COMMODITYCOMBINE_ID.LYX ){
		picUrl = PRODUCT_PICURL.LYX;
	}else if( productCode == COMMODITYCOMBINE_ID.LRX ){
		picUrl = PRODUCT_PICURL.LRX;
	}else if( productCode == COMMODITYCOMBINE_ID.JDX ){
		picUrl = PRODUCT_PICURL.JDX;
	}else if( productCode == COMMODITYCOMBINE_ID.ZHX ){
		picUrl = PRODUCT_PICURL.ZHX;
	}else if( productCode == COMMODITYCOMBINE_ID.BQJ ){
		picUrl = PRODUCT_PICURL.BQJ;
	}else if( productCode == COMMODITYCOMBINE_ID.BWYL ){
		picUrl = PRODUCT_PICURL.BWYL;
	}else if( productCode == COMMODITYCOMBINE_ID.AXYW ){
		picUrl = PRODUCT_PICURL.AXYW;
	}else if( productCode == COMMODITYCOMBINE_ID.BWZJ ){
		picUrl = PRODUCT_PICURL.BWZJ;
	}else{
		picUrl = PRODUCT_PICURL.BASE;
	}	
	return picUrl;
}
