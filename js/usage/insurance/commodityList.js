$(function(){
    //$.setscroll( "bodyMuiScroll" );
    sendCommodityListRequest();//APP产品模块线下产品详情查询
});

function sendCommodityListRequest(){
    var url = requestUrl.commodityListUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "commodityCombinationId": "105"
        }
    }
    $.reqAjaxs( url, sendJson, commodityListRender );
}
function commodityListRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){

    }else{
       modelAlert( message.requestFail );
    }
}
function sendCommissionInfoRequest(){
    var url = requestUrl.commissionInfoUrl;
    var sendJson = {
        "head" : {
            "channel" : "01",
            "userCode" : mobile,
            "transTime" : $.getTimeStr()
        },
        "body" : {
            "provinceCode": "320000",
            "cityCode": "320012",
            "commodityId": "118"
        }
    }
    $.reqAjaxs( url, sendJson, commissionInfoRender );
}
function commissionInfoRender(data){
    console.log(data);
}