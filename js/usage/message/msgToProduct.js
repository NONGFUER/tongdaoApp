/**
 * http://usejsdoc.org/
 */
var roleType = '';
$(function(){
	getTypeRequest(customerId)
});
function mesToProduct(ccId){
	urlParm.ccId = ccId + "";
	urlParm.isComing = '1';
	urlParm.mobile = userCode;
	urlParm.title = '产品详情';
	urlParm.downIco = "0"
	urlParm.leftIco = "1"
	urlParm.rightIco = "0"
	urlParm.commodityCombinationId = ccId + "";
	urlParm.isComing = '0'
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( ccId != "14"){
		window.location.href = base.url + 'tongdaoApp/html/insurance/main/productDetail.html?jsonKey='+jsonStr;
	}else{
		window.location.href = base.url + 'tongdaoApp/html/insurance/ghx/ghxProductDetail.html?jsonKey='+jsonStr;
	}
	
}
//@time 2018-01-22 09:09
//消息详情跳转开门红活动( •̀ ω •́ )y
function toOpenDoorRed(){
	if( roleType == '01' || roleType == '04' || roleType == '00'){
		modelAlert("您的角色不符合此次活动条件!");
		return false;
	}
	urlParm.title = '开门红';
	urlParm.downIco = "0"
	urlParm.leftIco = "1"
	urlParm.rightIco = "0"
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + 'tongdaoApp/html/agent/openDoorRed/activity.html?jsonKey=' + jsonStr
}


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
	if(data.statusCode == '000000'){
		roleType = data.returns.customerBasic.type;
	}else{
		roleType = '00'
	}
	
}