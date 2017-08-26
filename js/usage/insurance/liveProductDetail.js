
$(function(){
    $.setscroll( "bodyMuiScroll" );
    sendLiveProductInfoRequest();//APP产品模块线下产品详情查询
    sendCusInsConsultantRequest();//APP产品模块线下产品详情页保险顾问查询
    sendAddYuyueInfoRequest();//APP产品模块线下产品预约新增
    sendCustomerAndAgentInfoRequest();
});
//APP用户及客户经理信息查询
function sendCustomerAndAgentInfoRequest(){
    var url = requestUrl.cusAndAgenInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "customerId": "8"
        }
    }
    $.reqAjaxs( url, sendJson, cusAndAgenInfoRender ); 
}
// 获取线下产品请求方法
function sendLiveProductInfoRequest(){
    var url = requestUrl.liveProductInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "commodityCombinationId" : "105"
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
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "customerId" : "8"
        }
    }
    $.reqAjaxs( url, sendJson, cusInsConsultantRender );
}
// APP产品模块线下产品预约新增
function sendAddYuyueInfoRequest(){
	var url = requestUrl.addYuyueInfoUrl;
	var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr(),
            "transToken": ""
        },
        "body" : {
            "customerId": "6",
            "commodityCombinationId": "105",
            "yuyuePhone": "18749187491",
            "yuyueName": "月饼"
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
       
    }else{
        modelAlert( message.requestFail );
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
    }else{
        modelAlert( message.requestFail );
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

    }else{
        modelAlert( message.requestFail );
    }
}
/**
 * @function 试算条件展示
 */
function calChoice( calList ){
    var calName = calList.calName;
    var calDetails = calList.calDetails;
    var str = "";
    str += '<div class="d1">'
    str += '<div class="label">'+calName+'：</div>'
    str += '<div class="conter">'
    for(var i = 0; i < calDetails.length; i++ ){
        
    }
   // str +=   0周岁（出生满28天）至54周岁
    str += '</div></div>';
    $("#insurance-choice").append(str);
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