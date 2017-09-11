var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
$(function(){	
	var cId = urlParm.cId;
	getArticlesReq(cId);
});
function backlast(){
	toProductDetail();
}
function toProductDetail(){	
	urlParm.title = "产品详情";
	urlParm.leftIco = "1";
	urlParm.rightIco = "1";
	urlParm.downIco = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/insurance/main/insure.html?jsonKey="+jsonStr;
}
function getArticlesReq(cId){
	var url = base.url+'offlineCommodityComDetail/getOfflineCommodityClauseList.do';	
		var reqData = {
				'head':{
					'userCode': '',
					'transTime':$.getTimeStr(),
					'channel':'01',//01-App 02-微信
					'transToken':''
				},'body':{
					"commodityId": cId
				}
			};
	$.reqAjaxsFalse(url,reqData,getArticleRender);
}

function getArticleRender(data){
	if(data.statusCode == "000000"){
		var clauseList = data.returns.commodityClauseList;
		if(clauseList.length != 0){
			var clauseString = "";
			for(var i = 0;i<clauseList.length;i++){
				clauseString += '<div class="bar"  data-clause="'+clauseList[i].insurancClauseDownload+'" onclick="tiaokuan(this)"><span>'+clauseList[i].insurancClause+'</span><div class="icon_bxtk"><img class="" src="../../image/insurance/tkright.png"></div></div>';
			}
			$(".tiaokuan").html(clauseString);
		}
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}
function tiaokuan(obj){
	window.location.href = $(obj).attr("data-clause");
}