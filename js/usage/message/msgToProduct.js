/**
 * http://usejsdoc.org/
 */
var roleType = '';
var idAuth = '';
var provinceCode = '';
var cityCode = '';
$(function(){
	getTypeRequest(customerId)
});
//消息详情跳转产品链接
function mesToProduct(ccId){
	urlParm.ccId = ccId + "";	
	urlParm.mobile = userCode;
	urlParm.title = '产品详情';
	urlParm.downIco = "0"
	urlParm.leftIco = "1"
	urlParm.rightIco = "0"
	urlParm.commodityCombinationId = ccId + "";
	urlParm.isComing = '0'
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	if( ccId == "14"){//挂号险
		window.location.href = base.url + 'tongdaoApp/html/insurance/ghx/ghxProductDetail.html?jsonKey='+jsonStr;		
	}else if(  ccId == "13" ){//车险
		urlParm.ccCode = "00400011"
		urlParm.title  = "车辆信息"
		urlParm.provinceCode = 	provinceCode;
		urlParm.cityCode = cityCode;
		urlParm.idAuth = idAuth;
		urlParm.roleType = roleType;
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'tongdaoApp/html/insurance/car/carMes.html?jsonKey='+jsonStr;
	}else if(  ccId == "26" ){//阳光
		urlParm.provinceCode = 	provinceCode;
		urlParm.cityCode = cityCode;
		urlParm.idAuth = idAuth;
		urlParm.roleType = roleType;
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'tongdaoApp/html/managemoney/productDetails/goldsunshineDetails.html?jsonKey='+jsonStr;
	}else if(  ccId == "28" ){//昆仑聚宝盆
		urlParm.provinceCode = 	provinceCode;
		urlParm.cityCode = cityCode;
		urlParm.idAuth = idAuth;
		urlParm.roleType = roleType;
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'tongdaoApp/html/managemoney/productDetails/cornucopiaDetails.html?jsonKey='+jsonStr;
	}else if(ccId == "4"||ccId == "5"){//弘康1年期
		urlParm.provinceCode = 	provinceCode;
		urlParm.cityCode = cityCode;
		urlParm.idAuth = idAuth;
		urlParm.roleType = roleType;
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + 'tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey='+jsonStr;
	}else{
		window.location.href = base.url + 'tongdaoApp/html/insurance/main/productDetail.html?jsonKey='+jsonStr;					
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
		idAuth = data.returns.customerBasic.idAuth;
		provinceCode = data.returns.customerBasic.provinceCode;
		cityCode = data.returns.customerBasic.cityCode;
	}else{
		roleType = '00'
	}
	
}

