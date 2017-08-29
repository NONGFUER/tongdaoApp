var mobile="";//电话号码
var productCode="";//产品编码
var kuang="";//底部条款框的图片名字
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	mobile=parm.mobile;
	productCode=parm.productCode;
	/*mobile="13111111111";
	productCode="1213";*/
	
	
	window.onresize = function () {

        var h = $(window).height();
        //console.log(h+','+window.screen.availHeight)
        var u = navigator.userAgent;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            if(h <= window.screen.availHeight/2){
                $('.anniumen').css({'position':'absoult',"margin-top":"-.5rem",'display':'none'});
            }else{
                $('.anniumen').css({'position':'fixed','display':'block'});

            }
        }

    }
    $('input').on('focus',function(){
        $('.anniumen').hide();
    })
    $('input').on('blur',function(){
        $('.anniumen').show();
    })
	
	/* 设置滑动区域 */
	$.setscroll();
	$.replacePlaceholder($("#nameValue"), "请输入姓名");
	$.replacePlaceholder($("#IDcardValue"), "请输入身份证号码");
	$.replacePlaceholder($("#mobileValue"), "请输入手机号码");
	$.replacePlaceholder($("#chepaiValue"), "请输入车牌号码");
	$.replacePlaceholder($("#mailValue"), "请输入电子邮箱（选填）");
	//获取剩余份数
	$.getShengyu();
	//返回
	$(".h_back").unbind("tap").bind("tap",function(){
		WeixinJSBridge.call('closeWindow');
	})
	//投保成功点确定,和点关注服务号，引导用户关注服务号
	$(".successAnniu,.guanzhu").unbind("tap").bind("tap",function(){
		/*$(".success").hide();
		$(".shadow").hide();*/
		window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI5NzQzNjc0Mw==&scene=124#wechat_redirect";
	})
	/**拨打电话*/
	$(".kefu").unbind("tap").bind("tap",function(){
    	callService("4006895505",".kefuPhone");
    })
    //条款
    $(".tiaokuan").unbind("tap").bind("tap",function(){
    	//window.location.href="jcxtiaokuan.html"+window.location.search;
    	$(".PageInfo").hide();
    	$(".xuzhiInfo").hide();
    	$(".tiaokuanInfo").show();
    	$("body").css("background-color","#f2eff6");
    	/* 设置滑动区域 */
    	$.setscroll3();
    })
    //须知
    $(".xuzhi").unbind("tap").bind("tap",function(){
    	//window.location.href="jcxxuzhi.html"+window.location.search;
    	$(".PageInfo").hide();
    	$(".tiaokuanInfo").hide();
    	$(".xuzhiInfo").show();
    	$("body").css("background-color","#f2eff6");
    	/* 设置滑动区域 */
    	$.setscroll2();
    })
    //条款、须知页面返回
    $(".h_back3,.h_back2").unbind("tap").bind("tap",function(){
    	$(".tiaokuanInfo").hide();
    	$(".xuzhiInfo").hide();
    	$(".PageInfo").show();
    	$("body").css("background-color","#fff");
    	/* 设置滑动区域 */
    	$.setscroll();
    })
	//底部条款
	$("#kuang").unbind("tap").bind("tap",function() {
		var str=$("#kuang").attr("src");
		var index= str.lastIndexOf("/");
		kuang=str.substring(index+1,str.length);
		if(kuang=="jcxyigouxuan.png"){
			$("#kuang").attr("src","../../images/jcxweigouxuan.png")
		}else{
			$("#kuang").attr("src","../../images/jcxyigouxuan.png")
		}
	})
	//投保
	$(".toubao").unbind("tap").bind("tap",function(){
		var str=$("#kuang").attr("src");
		var index= str.lastIndexOf("/");
		kuang=str.substring(index+1,str.length);
		if(kuang=="jcxweigouxuan.png"){
			//$(".shadow").show();
			modelAlert("请阅读投保须知与条款，勾选后可进行下一步操作！");
		}else{
			checkInfo();
			if(checkFlag){
				var name=$("#nameValue").val();//姓名
				var ID=$("#IDcardValue").val();//身份证号
				var TBRmobile=$("#mobileValue").val();//手机号
				var mail=$("#mailValue").val();//邮箱
				var chepai=$("#chepaiValue").val().toUpperCase();//车牌号 
				var sex="";//性别
				if(parseInt(ID.substr(16, 1)) % 2 == 1){
					sex="1";//男
				}else{
					sex="2";//女
				}
				if(mail==""||mail==null||mail=="请输入电子邮箱（选填）"){
					mail="";
				}
				
				var url=base.share_sxyurl+"insuranceSave/insuranceSaveInfo.do"
				var reqData={
						"head":{
							"channel": "01",
						    "userCode": "2835",
						    "transTime": ""
						},"body":{
							"carCode": chepai, //车牌号
						    "email": mail,  //邮箱
						    "name": name, //投保人姓名
						    "phone": TBRmobile, //投保人手机号
						    "sex": sex, //投保人性别
						    "pwd": ID,  //投保人身份证
						    "productCode": productCode, //产品编号
						    "customePhone": mobile,  //登录用户手机号
						    "flag":"2"//1 app  2 分享
						}
				}
				$.reqAjaxs(url,reqData,function(data){
					if(data.statusCode=="000000"){
						$(".shadow").show();
						$(".success").show();
					}else{
						modelAlert(data.statusMessage);
					}
				})
			}
		}
	})
})
//投保前校验信息
function checkInfo(){
	var name=$("#nameValue").val();//姓名
	var ID=$("#IDcardValue").val();//身份证号
	var TBRmobile=$("#mobileValue").val();//手机号
	var mail=$("#mailValue").val();//邮箱
	var chepai=$("#chepaiValue").val().toUpperCase();//车牌号
	if(name=="" || name==null ||name=="请输入姓名"){
		$(".shadow").hide();
		modelAlert("姓名不能为空");
		checkFlag = false;
		return false;
	}else if(checkInputChar("nameValue",/^[\u4e00-\u9fa5a-zA-Z·]+$/)==false){
		$(".shadow").hide();
		modelAlert("姓名格式不正确");
		checkFlag = false;
		return false;
	}
	if(ID=="" || ID==null ||ID=="请输入身份证号码"){
		$(".shadow").hide();
		modelAlert("身份证号不能为空");
		checkFlag =  false;
		return false;
	}else if(tit.regExp.isIdcard(ID)==false){
		$(".shadow").hide();
		modelAlert("身份证号码格式不正确");
		checkFlag =  false;
		return false;
	}else if($.checkIdCard(ID.toLocaleUpperCase()) != 0){
		$(".shadow").hide();
		modelAlert("身份证号码规则不正确");
		checkFlag =  false;
		return false;
	}else if($.checkAge(ID)==false){
		$(".shadow").hide();
		modelAlert("投保年龄必须在18周岁~60周岁");
		checkFlag =  false;
		return false;
	}
	if(TBRmobile=="" || TBRmobile==null ||TBRmobile=="请输入手机号码"){
		$(".shadow").hide();
		modelAlert("手机号码不能为空");
		checkFlag =  false;
		return false;
	}else if(tit.regExp.isMobile(TBRmobile)==false){
		$(".shadow").hide();
		modelAlert("手机号码格式不正确");
		checkFlag =  false;
		return false;
	}
	if(mail != "" && mail != null && mail != "请输入电子邮箱（选填）" ){
		$(".shadow").hide();
		if(tit.regExp.isEmail(mail)==false){
			modelAlert("邮箱格式不正确");
			checkFlag =  false;
			return false;
		}
	}
	if ($.isNull(chepai) || chepai == "请输入车牌号码") {
		modelAlert("车牌号不能为空");
		checkFlag =  false;
		return false;
	}
	if (chepai.length == 7||chepai.length == 8) {
		if(!checkCarNo($.trim(chepai))){
			modelAlert("车牌号码格式不正确！");
			checkFlag =  false;
			return false;
		}
	}else{
		modelAlert("车牌号码长度不正确");
		checkFlag =  false;
		return false;
	}
	checkFlag =  true;
}
//获取剩余份数
$.getShengyu=function(){
	var url= base.share_sxyurl + "giveInsuranceAll/giveProductCount.do";
	var reqData = {
			"head": {
				    "channel": "01",
				    "userCode": "2835",
				    "transTime": ""
			},"body": {
				    "productCode": productCode
			}

	}
	$.reqAjaxs(url,reqData,function(data){
		//console.log(data);
		$(".shengyuNum").html(data.returns.surplusNum);
	})
}
//校验年龄
$.checkAge=function(ID){
	var myDate = new Date(); 
	var month = myDate.getMonth() + 1; 
	var day = myDate.getDate();

	var age = myDate.getFullYear() - ID.substring(6, 10) - 1; 
	if (ID.substring(10, 12) < month || ID.substring(10, 12) == month && ID.substring(12, 14) <= day) { 
	age++; 
	}
	if(age<18|| age>60){
		return false;
	}
}
//车牌号
//输入一个汉字一个字母和5个数字
function checkCarNo(param) {
	reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/;
	return reg.test(param);
}
/**createOrder/check.do
 * ZT
 * 
 * 1.控件Id 2.正则表达式 3.提示信息
 */
function checkInputChar(kongjianId,zhengze){
	var inputChar = zhengze;
	var ziduanming = $("#"+kongjianId+"").val();
	if (ziduanming != null && ziduanming != '') {
		if (!inputChar.test(ziduanming)) {
			return false;
		}
	}
	return true;
}

$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height()-$(".anniumen").height();
	$("#contentHead1").height(Scrollheight);
	mui("#contentHead1").scroll();
};
$.setscroll2 = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead2").height(Scrollheight-46);
	mui("#contentHead2").scroll();
};
$.setscroll3 = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead3").height(Scrollheight-46);
	mui("#contentHead3").scroll();
};