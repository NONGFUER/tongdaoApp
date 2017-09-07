$(function(){
    $.setscroll("bodyMuiScroll");
    sendProductInfoRequest("14");
    jieshaoToshuomingBind()
    $("#versions").find("li").bind("tap",function(){
    	tab($(this),"on");
    	calPrem()
    });
    $("#expandperson").find("li").bind("tap",function(){
    	muitab($(this),"on");
    	calPrem()
    });
    $("#diagnosis").find("li").bind("tap",function(){
    	muitab($(this),"on");
    	calPrem()
    });
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
//产品介绍 详情说明切换
function jieshaoToshuomingBind(){
    $(".insurance-tab").find("li").bind("click", function() {
        tab($(this),'on1');					
        $(".insurance-tab_content").hide().eq($(this).index()).show();					
    })
}

function calPrem(){
	var  aPrem= $("#versions").find(".on").attr("data-value");
	var bLength = $("#expandperson").find(".on").length;
	var cLength = $("#diagnosis").find(".on").length;
	if( bLength != 0 ){
		for( var i = 0; i < bLength; i++ ){
			
		}
	}else{
		
	}
	if( cLength != 0 ){
		
	}
	var  bPrem= $("#expandperson").find(".on").attr("data-value");
	var  cPrem= $("#diagnosis").find(".on").attr("data-value");
	console.log(aPrem+" "+bPrem+" "+cPrem);
}

function tab(a, flag) {
	$(a).siblings().removeClass(flag); 
	$(a).addClass(flag);
};
function muitab(a, flag) {
	if($(a).hasClass(flag)){
		$(a).removeClass(flag);
	}else{
		$(a).addClass(flag);
	}
	
};
