
$(function(){
	//setTitleMethod("1","产品详情","0")
    $.setscroll( "bodyMuiScroll" );
    sendCustomerAndAgentInfoRequest( customerId);
    $("#mobile").val(mobile);
    $("#name").val(name);
    //点击预约出单
    yuyueClickBind();	
    //点击确定按钮
    yuyueSubmit( customerId, ccId);		   
    sendLiveProductInfoRequest(ccId, provinceCode, cityCode, roleType )	//APP产品模块线下产品详情查询
    if( roleType == "02" || roleType == "06" ){					//如果是代理人
    	$(".insurance-customer").removeClass("none");
    	$(".single-footer").removeClass("yincang");
    	sendCusInsConsultantRequest();
    }
    showRight();
    // sendCusInsConsultantRequest();//APP产品模块线下产品详情页保险顾问查询
    // sendAddYuyueInfoRequest();//APP产品模块线下产品预约新增
    // sendCustomerAndAgentInfoRequest();
});
//点击预约出单
function yuyueClickBind(){
    $("#chudan").unbind("tap").bind("tap",function(){
        $(".popup-shadow").css({"opacity":"1","display":"block"});
    });
}
//关闭弹窗
function closeShadow(){
    $(".popup-shadow").css({"opacity":"0","display":"none"});
    $("#name").val(name);
    $("#mobile").val(mobile);
}
//点击提交预约
function yuyueSubmit( cusId, ccId){
    $("#yuyue").unbind("tap").bind("tap",function(){
        var phone = $("#mobile").val();
        var name = $("#name").val();
        if( $.isNull(name) ){
            modelAlert( message.nameNull );
        }else if( tit.regExp.isChinese(name) == false ){
            modelAlert( message.nameError );
        }else if( $.isNull(phone) ){
            modelAlert( message.phoneNull );
        }else if( tit.regExp.isMobile(phone) == false ){
            modelAlert( message.phoneError );
        }else{
            sendAddYuyueInfoRequest(cusId,ccId,phone,name);
        }
        
    });
}
//APP用户及客户经理信息查询
function sendCustomerAndAgentInfoRequest(cusId){
    var url = requestUrl.cusAndAgenInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken" :transToken
        },
        "body" : {
            "customerId": cusId
        }
    }
    $.reqAjaxs( url, sendJson, cusAndAgenInfoRender ); 
}
// 获取线下产品请求方法
function sendLiveProductInfoRequest(ccId,provinceCode,cityCode,roleType){
    var url = requestUrl.liveProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": transToken
        },
        "body" : {
        	"provinceCode"			 : provinceCode,
        	"cityCode"				 : cityCode,
            "commodityCombinationId" : ccId,
            "roleType"				 : roleType
        }
    }
    $.reqAjaxs( url, sendJson, liveProductInfoRender );
}
// 获取保险顾问信息
function sendCusInsConsultantRequest(){
	var url = requestUrl.cusInsConsultantUrl;
	var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken" :transToken
        },
        "body" : {
            "customerId" : "8"
        }
    }
    $.reqAjaxs( url, sendJson, cusInsConsultantRender );
}
// APP产品模块线下产品预约新增
function sendAddYuyueInfoRequest( cusId, ccId, phone, name){
	var url = requestUrl.addYuyueInfoUrl;
	var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": transToken
        },
        "body" : {
            "customerId": cusId,
            "commodityCombinationId": ccId,
            "yuyuePhone": phone,
            "yuyueName": name
        }
    }
    $.reqAjaxs( url, sendJson, addYuyueInfoRender );
}
/**
 * @function 请求响应的产品预约新增数据处理
 * @param {*} data 
 */
function cusAndAgenInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var customerBasic = body.customerBasic;
        var agent         = body.agent;
        $("#name").val(customerBasic.name);
        $("#mobile").val(customerBasic.userName);
        $("#kehuName").text(agent.recommendAgentName);
        $("#kehuPhone").text(agent.recommendAgentMobile);
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
function toLogin(){
	alert("跳转中。。。");
	//loginControl();	
}
/**
 * @function 请求响应的产品预约新增数据处理
 * @param {*} data 
 */
function addYuyueInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var yuyueNo  = body.yuyueNo;//获取预约号
        //alert(yuyueNo);
        closeShadow();
        modelAlert("预约成功！");
       
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
/**
 * @function 请求响应的线下产品详情数据处理
 * @param {*} data 
 */
 function cusInsConsultantRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var cusInfo = data.returns.customerBasic;
        var mobile  = cusInfo.mobile;//获取姓名
        var name    = cusInfo.name;//获取手机号
        var userImg = cusInfo.userImage;//获取用户头像
    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
    
 }
/**
 * @function 请求响应的线下产品详情数据处理
 * @param {*} data 
 */
function liveProductInfoRender( data ){
    console.log( data );
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var companyInfo          = body.companyInfo;          //保险公司信息
        var calculationInfos     = body.calculationInfos;     //保费试算展示项信息    
        console.log(calculationInfos);   
    //  var commodityInfoList    = body.commodityInfoList;    //商品列表
        var commodityClauseList  = body.commodityClauseList;  //所有产品条款列表       
        var commodityModuleList  = body.commodityModuleList;  //商品组合模块配置信息列表
        var commodityCombination = body.commodityCombination; //商品组合详情       
        var picUrl = "../../../image/banner/" + commodityCombination.banner;
        $("#banner").attr("src",picUrl);                                                        //bannner图
        $("#commodityCombinationName").text(commodityCombination.commodityCombinationName);     //商品组合名称
        $("#companyName").text(companyInfo.companyName);                                        //保险公司名称
        for(var j = 0; j < calculationInfos.length; j++){
            console.log(calculationInfos[j]);
            calChoice(calculationInfos[j]);
        }
        for( var i = 0; i < commodityModuleList.length; i++ ){
            //拼接一个模块
            moduleStr(commodityModuleList[i]);
        }
        clauseModuleStr(commodityClauseList);   //添加保险条款列表

    }else if( data.statusCode == ajaxStatus.relogin ){
        modelAlert( data.statusMessage, "", toLogin ); 
    }else{
    	modelAlert( data.statusMessage );
    }
}
/**
 * @function 试算条件展示 
 */
function calChoice( calList ){
    var calName = calList.calName;
    var calDetails = calList.calDetails;
    var calDetailsStr = detailsRender(calDetails);
    var str = "";
    str += '<div class="d1">';
    str += '<div class="label">'+calName+'：</div>';
    str += '<div class="conter">';
    str += calDetailsStr;
    str += '</div></div>';
    $("#insurance-choice").append(str);
}
function detailsRender(calDetails){
    var str = "";
    var detailLength = calDetails.length;
    if(detailLength == 1){
        str += calDetails[0].enuContent;
    }else{
        str += '<ul class="radio">';
        for(var i = 0; i < detailLength; i++ ){
            if( i == 0 ){
                str += '<li class="on">'+calDetails[i].enuContent+'</li>'
            }else{
                str += '<li>'+calDetails[i].enuContent+'</li>'
            }           
        }
        str += '</ul>';
    }   
    return str;
}
/**
 * @function 商品组合模块配置信息列表
*/
function moduleStr( moduleList ){
    var moduleInfo = moduleList.modueInfo;
    var moduleInfoList = moduleInfo.split('|');
    var str = "";
    str += '<dl class="module mb10 whitebackground ">'
    str += '<dt class="content-title"><img src="../../../image/insurance/product_detail.png">' + moduleList.moduleName + '</dt>'
    str += '<dd class="con content-info">'
    for(var i = 0; i < moduleInfoList.length; i++ ){
        str += '<p class="star">' + moduleInfoList[i] + '</p>'     
    }
    str += '</dd></dl>'
    $(".insurance-content").append(str);
}

/**
 * @function 所有产品条款列表
 */
function clauseModuleStr( clauseModuleList ){
    var moduleName = '保险产品详细说明';
    var str = "";
    str += '<dl class="module mb10 whitebackground ">'
    str += '<dt class="content-title"><img src="../../../image/insurance/product_point.png">' + moduleName + '</dt>'
    str += '<dd class="content-info"><ul class="clearfix" id="">'
    for(var i = 0; i < clauseModuleList.length; i++ ){
        if( clauseModuleList[i].isNeed == "1" ){
            str += '<li data-url="' + clauseModuleList[i].insurancClauseDownload + '" onclick="download(this)"><p class="li-left"><span class="orange">(必选)</span>' + clauseModuleList[i].productName + '</p>';
        }else if( clauseModuleList[i].isNeed == "0" ){
            str += '<li data-url="' + clauseModuleList[i].insurancClauseDownload + '" onclick="download(this)"><p class="li-left">' + clauseModuleList[i].productName + '</p>';
        } 
        if( clauseModuleList[i].riskClass == "01" ){
            str += '<p class="li-right">主险<span class="iconleft"></span></p></li>';
        }else if( clauseModuleList[i].riskClass == "02" ){
            str += '<p class="li-right">附加险<span class="iconleft"></span></p></li>';
        }    
    }
    str += '</ul></dd></dl>'
    $(".insurance-content").append(str);
}
/**
 * @function 跳转到条款页面
 * @param {*} obj 
 */
function download(obj){
    var downloadUrl = $(obj).attr("data-url");
    window.location.href = downloadUrl;
}
function backlast(){
	sysback();
}
function shareHandle(){
	var shareList = getProductShare(ccId);
	var title = shareList[0] ;
	var desc  = shareList[1] ;	
	var shareurl = base.url+"tongdaoApp/html/share/insurance/main/liveProductDetail.html"+window.location.search;
	var picUrl = getProductSharePic(ccId);
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};