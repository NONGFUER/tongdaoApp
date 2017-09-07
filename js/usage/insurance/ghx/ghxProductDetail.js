$(function(){
    $.setscroll("bodyMuiScroll");
    sendProductInfoRequest("14");
});

function sendProductInfoRequest(ccId){
	 var url = requestUrl.ghxProductInfo;	 
	 var sendJson = {
		"head" : {
		  "channel" : "01",
		  "userCode" : mobile,
		  "transTime" : $.getTimeStr(),
		  "transToken": ""
		},
		"body" : {
           "commodityComId": ccId
		} 
    }
    $.reqAjaxs( url, sendJson, sendProductInfoCallBack ); 
}

function sendProductInfoCallBack(data){
	console.log(data);
}
function toFillPolicyHtml(){
	var jsonStr = "";
	window.location.href = "fillInPolicyHolder.html?jsonKey=" + jsonStr;
}

