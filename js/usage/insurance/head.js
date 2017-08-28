// 全局常量
var ajaxStatus = {
    success : "000000"
} 

var message = {
    requestFail : "网络好像开小差了呢，请设置给力一点儿网络吧！",
    phoneNull   : "手机号不能为空！",
    nameNull    : "姓名不能为空！",
    phoneError  : "手机号格式不正确！",
    nameError   : "姓名必须为汉字！"
}
var requestUrl = {
    
    //线下产品模块    
    cusAndAgenInfoUrl    : base.url + 'customerBasic/getCustomerAndAgentInfo.do',              // 
    liveProductInfoUrl   : base.url + 'offlineCommodityComDetail/getOfflineComComDetail.do',   //(完成)APP产品模块线下产品详情查询
    commodityListUrl     : base.url + 'commodityCombination/getCommodityList.do',              //APP产品模块商品列表查询
    commissionInfoUrl    : base.url + 'commodityCombination/getCommodityCommissionInfos.do',   //APP产品模块产品条款佣金比例列表查询
    cusInsConsultantUrl  : base.url + 'cusInsuranceConsultant/getCusInsuranceConsultant.do',   //（完成）APP产品模块线下产品详情页保险顾问查询
    addYuyueInfoUrl      : base.url + 'yuyue/addYuyueInfo.do',                                 //（完成）
    //线上产品模块
    onlineProductInfoUrl : base.url + "product/getOnlineProductDetail.do",
    calOptions           : base.url + 'cal/getCalOptions.do'
}
//全局变量
//var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));

var mobile     = "13800000000"//urlParm.mobile;//用户手机号
var customerId = "8"//urlParm.customerId;//用户id