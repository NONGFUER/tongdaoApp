$(function(){
	willProductRequest();
});

//即将上线产品
function willProductRequest(){
	var url = base.url + 'comingSoon/getComingSoonCommodityList.do';
	var reqData = {
	        "head":{
	            "channel"  :"01",
	            "userCode" :"",
	            "transTime":"",
	            "transToken": ""
	        },
	        "body":{}
	}
	$.reqAjaxs( url, reqData, willProductCallback );
}

//即将上线列表渲染
function willProductCallback(data){
	console.log(data);
	if( data.statusCode == "000000" ){
		var resultList = data.returns.resultList;
		var listLength = resultList.length;		
		for( var i = 0; i < listLength; i++ ){
			var ccimag = resultList[i].commodityCombination.commodityCombinationImage;
			var ccabbr = resultList[i].commodityCombination.commodityCombinationName;
			var ccid   = resultList[i].commodityCombination.id + '';
			var linkUrl = resultList[i].commodityCombination.linkUrl;
			var str = '';
			str += '<li class="list display-box" data-ccid="' + ccid + '" data-url="' + linkUrl + '" onclick="toProduct(this)">'
			str += '<img src="' + ccimag + '" class="pic box-flex0" onerror="zwt(this)">'
			str += '<div class="cont box-flex1">'
			str += '<h3>' + ccabbr + '</h3>'
			str += '<p class="tips"></p>'
			str += '<p class="price-box">即将上线</p>'				
			str += '</div>'
			str += '</li>'
			$(".product-items").append(str);
		}
		
	}else{
		modelAlert(data.statusMessage);
	}
}

function zwt(obj){
	var errimg = '../../../image/common/zwt.png';
	$(obj).attr("src",errimg);
}

function toProduct(obj){
	var urlto = $(obj).attr("data-url");
	urlParm.ccId = $(obj).attr("data-ccid");	
	urlParm.commodityCombinationId = $(obj).attr("data-ccid");
	urlParm.isComing = '1';
	urlParm.mobile = '';
	urlParm.cityCode = '';
	urlParm.provinceCode = ''; 
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + urlto +'?jsonKey='+jsonStr;
}