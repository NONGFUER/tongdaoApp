/*
*英雄榜周50强，年50强
*/
//接口地址
var urlObj = {
	"rankMonthUrl":base.url + "theArmory/getTheArmory.do",//月
	"rankYearUrl":base.url + "theArmory/getTheArmory.do"//年
}
var customerId='20';
var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';
$(function(){
/*	var rankParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));	
	var customerId = rankParm.customerId;*/
	rankMonthReq(customerId);
	rankYearReq(customerId);
	rankTab();
	$.setscroll();
	$(".monthMore").bind("tap",function(){
		if($(this).hasClass('dui')){
			$(".aftertwo").show();
			$(this).removeClass("dui");	
			$(this).html("收起");
		}else{
			$(".aftertwo").hide();
			$(this).addClass("dui");
			$(this).html("点击加载更多");
			$('.mui-scroll').css('transform','translate3d(0px, 0px, 0px)');
		}	
	});
	$(".yearMore").bind("tap",function(){
		if($(this).hasClass('dui')){
			$(".aftertwoyear").show();
			$(this).removeClass("dui");	
			$(this).html("收起");
		}else{
			$(".aftertwoyear").hide();
			$(this).addClass("dui");
			$(this).html("点击加载更多");
			$('.mui-scroll').css('transform','translate3d(0px, 0px, 0px)');
		}	
	});
	$(".h_back").unbind("tap").bind("tap",function(){
		sysback();
	});
});
/*
 * @参数：customerId
 * @功能：发送“月50强”请求，返回数据交给rankMonthDataRender()函数渲染
 * @触发条件：1.初始化进入页面的时候
 * 			 2.点击“当月50强”的时候
 * 
 * */
function rankMonthReq(id){
	var url = urlObj.rankMonthUrl;
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body":{
			"loggingCustomerId":id,//customerId
			"rankType":'01'
		}
	}
	$.reqAjaxs(url,reqData,rankMonthDataRender);
}
/*
 * 
 * @参数：rankMonthReq()函数返回的数据
 * @功能：渲染”当月50强列表“
 * 		渲染我的排名
 * 
 * */
function rankMonthDataRender(dataValue){
	console.log(dataValue);
	if(dataValue.statusCode == "000000"){
		var renderStr = "";
		var ranklist = dataValue.returns.agentArmory;
		var agentArmory = dataValue.returns.agentArmory;
		var paihang='';
		agentArmory.forEach(function(key,value){
			if(key.id==customerId){
			 paiming=key.rankOrder;
			}
		})
		if(agentArmory){
			var count = dataValue.returns.count; //您当月签单：count单
			var prem = toDecimal2(dataValue.returns.amount);		//您当月保费：prem.00元
			var rank = paiming;		//你的排名
			$("#count").data("count",count);
			$("#prem").data("prem",prem);
			$('#message').data("rank",rank);
			$("#count").html('您当月签单：'+count+'单');
			$("#prem").html('您当月保费：'+prem+'元');			
			if(rank >50||rank == 0){
				$(".rankImg img").attr("src","../../../image/agent/myRank/loser.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/left.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/right.png");
				$('#message').html('很遗憾，您未进入排行榜');
				$('#message').removeClass('on');
			}else {
				$(".rankImg img").attr("src","../../../image/agent/myRank/winer.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/leftlight.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/rightlight.png");
				$('#message').html('恭喜您，您排行第'+rank+'位');
				$('#message').addClass('on');
			}
		}
		if(ranklist.length > 0){
			if(ranklist.length <=20){
				$(".monthMore").hide();
				$(".monthMore").data("monthMore","no");
			}
			for(var i=0;i<ranklist.length;i++){
				var heroName = ranklist[i].name;
				var heroCity = ranklist[i].workProvinceName+''+ranklist[i].workCityName;
				if(!heroCity){
					heroCity = "不详"
				}
				if(!heroName){
					heroName = "未知"
				}
				var heroPrem = toDecimal2(ranklist[i].prem);
				if(i<20){
					renderStr += '<div class="rank_bar clearfix">';
				}else{
					renderStr += '<div class="rank_bar clearfix aftertwo">';
				}					
				if(i>=0&&i<=2){
					renderStr += '<div class="rank_no"><img src="../../../image/agent/myRank/first'+i+'.png"></div>';
				}else{
					renderStr += '<div class="rank_no">'+(i+1)+'</div>';
				}	
				renderStr += '<div class="rank_name">'+heroName+'</div>';
				renderStr += '<div class="rank_city">'+heroCity+'</div>';
				renderStr += '<div class="rank_money">'+heroPrem+'元</div></div>';
			}
		}else{
			//没有数据的时候
			$(".monthMore").hide();
			$(".monthMore").data("monthMore","no");
		}
		$("#monthRank").html(renderStr);					
	}else{
		modelAlert(dataValue.statusMessage);
		return false;
	}
}
/*
 * @参数：customerId
 * @功能：发送“当年50强”请求，返回数据交给rankYearDataRender()函数渲染
 * @触发条件：1.点击“当年50强”的时候
 * 			
 * 
 * */
function rankYearReq(id){
	var url = urlObj.rankYearUrl;
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body":{
			"loggingCustomerId":id,//customerId
			"rankType":'02'
		}
	}
	$.reqAjaxs(url,reqData,rankYearDataRender);
}
/*
 * 
 * @参数：rankMonthReq()函数返回的数据
 * @功能：渲染”当年50强列表“
 * 
 * */
function rankYearDataRender(dataValue){
	console.log(dataValue);
	if(dataValue.statusCode == "000000"){
		var renderStr = "";
		var ranklist = dataValue.returns.agentArmory;
		var agentArmory = dataValue.returns.agentArmory;
		var count=dataValue.returns.count;
		var amount=dataValue.returns.amount;
		var paihang='';
		agentArmory.forEach(function(key,value){
			if(key.id==customerId){
				paiming=key.rankOrder;
			}
		})
		if(agentArmory){
			var countYear = count; //您当月签单：count单
			var premYear = toDecimal2(amount);		//您当月保费：prem.00元
			var rankYear = paiming;		//你的排名
			$("#count").data("countYear",countYear);
			$("#prem").data("premYear",premYear);
			$('#message').data("rankYear",rankYear);			
		}		
		if(ranklist.length > 0){
			if(ranklist.length <=20){
				$(".yearMore").data("yearMore","no");
				$(".yearMore").hide();
			}
			for(var i=0;i<ranklist.length;i++){
				var heroName = ranklist[i].name;
				var heroCity = ranklist[i].workProvinceName+''+ranklist[i].workCityName;
				if(!heroCity){
					heroCity = "不详"
				}
				if(!heroName){
					heroName = "未知"
				}
				var heroPrem = toDecimal2(ranklist[i].prem);
					if(i<20){
						renderStr += '<div class="rank_bar clearfix">';
					}else{
						renderStr += '<div class="rank_bar clearfix aftertwoyear">';
					}					
					if(i>=0&&i<=2){
						renderStr += '<div class="rank_no"><img src="../../../image/agent/myRank/first'+i+'.png"></div>';
					}else{
						renderStr += '<div class="rank_no">'+(i+1)+'</div>';
					}				
					renderStr += '<div class="rank_name">'+heroName+'</div>';
					renderStr += '<div class="rank_city">'+heroCity+'</div>';
					renderStr += '<div class="rank_money">'+heroPrem+'元</div></div>';												
			}
		}else{
			$(".yearMore").data("yearMore","no");
			$(".yearMore").hide();
		}
		$("#yearRank").html(renderStr);					
	}else{
		modelAlert(dataValue.statusMessage);
		return false;
	}
}


/*
 * 
 * @功能：点击切换
 * 
 */
function rankTab(){
	$(".rank_tab").find("li").bind("click", function() {//产品介绍 详情说明切换
		$(this).siblings().removeClass("on"); 
		$(this).addClass("on");
		$(".rank_list").hide().eq($(this).index()).show();
		var tabIndex=$(this).index();
		if(tabIndex == 0){
			var count = $("#count").data("count");
			var prem = $("#prem").attr("data-prem");
			var message = $('#message').data("rank");
			if(count||count == 0){$("#count").html('您当月签单：'+count+'单');}
			if(prem){$("#prem").html('您当月保费：'+prem+'元');}						
			if(message <=50&&message >= 1){
				$(".rankImg img").attr("src","../../../image/agent/myRank/winer.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/leftlight.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/rightlight.png");
				if(message){$('#message').html('恭喜您，您排行第'+message+'位');}				
				$('#message').addClass('on');
			}else {
				$(".rankImg img").attr("src","../../../image/agent/myRank/loser.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/left.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/right.png");
				$('#message').html('很遗憾，您未进入排行榜');
				$('#message').removeClass('on');			
			}
			if($(".monthMore").data("monthMore") == "no"){
				$(".monthMore").hide();
				$(".yearMore").hide();
			}else{
				$(".monthMore").show();
				$(".yearMore").hide();
			}
			
		}else if(tabIndex == 1){
			var countYear = $("#count").data("countYear");
			var premYear = $("#prem").attr("data-prem-year");
			var rankYear = $('#message').data("rankYear");			
			if(countYear ||countYear ==0){$("#count").html('您当年签单：'+countYear+'单');}
			if(premYear){$("#prem").html('您当年保费：'+premYear+'元');}			
			if(rankYear <=50&&rankYear >= 1){
				$(".rankImg img").attr("src","../../../image/agent/myRank/winer.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/leftlight.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/rightlight.png");
				if(rankYear){$('#message').html('恭喜您，您排行第'+rankYear+'位');}				
				$('#message').addClass('on');			
			}else {
				$(".rankImg img").attr("src","../../../image/agent/myRank/loser.png");
				$(".leftImg").attr("src","../../../image/agent/myRank/left.png");
				$(".rightImg").attr("src","../../../image/agent/myRank/right.png");
				$('#message').html('很遗憾，您未进入排行榜');
				$('#message').removeClass('on');
			}
			if($(".yearMore").data("yearMore") == "no"){
				$(".monthMore").hide();
				$(".yearMore").hide();
			}else{
				$(".monthMore").hide();
				$(".yearMore").show();
			}
			
		}
	})
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header");
	$("#rank_scroll").height(Scrollheight + "px");
	mui("#rank_scroll").scroll();
};