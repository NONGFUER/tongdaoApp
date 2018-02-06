var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
//console.log(JSON.stringify(urlParm))
var customerId = urlParm.customerId ? urlParm.customerId : '';
/**
 * http://usejsdoc.org/
 */
var currentTimes = '';
var activityTimes = 0;
var temp1 = ''
var preDate = new Date(2018,0,29,0,0,0);	//初始化活动公布时间	
var startDate = new Date(2018,1,9,0,0,0);	//初始化开始日期2018,1,9,0,0,0
var endDate = new Date(2018,1,15,23,59,59);	//初始化结束日期2018,1,15,23,59,59
var startDay = '9'
var endDay = '15'
var startTime   = new Date(2018,1,9,10,0,0);//初始化开始时间  2018,1,9,10,0,0
var endTime     = new Date(2018,1,9,10,10,0);//初始化结束时间  2018,1,9,10,10,0
var publishTime = new Date(2018,1,9,10,18,0);//初始化结果公布时间 2018,1,9,10,18,0
var dayInit = '';							//当天日期
var countTime = startTime;					//
var joined = '';
var chouStateTxt = '下次抽奖开始';
var buttonFontTxt = '活动未开始';
var bgTxt = '../../../image/agent/openDoorRed/unstart.png'
$(function(){
	mui.init({  
	    pullRefresh: {  
	        container: "#bodyMuiScroll",//下拉加载容器标识，querySelector能定位的css选择器均可，比如：id、.class等  
	        down:{  
	            style:"cirecle",//必选,下拉刷新样式,目前支持原生5+"cirecle"样式  
	            color:"#2BD009", //可选，默认“#2BD009” 下拉刷新控件颜色  
	            height:50,//可选,默认50.触发下拉刷新拖动距离  
	            auto:false,//可选,默认false.首次加载自动上拉刷新一次  
	            callback:getServiceTime//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；  
	        }  
	    }  
	});  
	getDrawDate()
	queryDrawChance()
	getServiceTime()//获取服务器时间，获取时差	
	layout()
	$(window).resize(function() {
		layout()
	});
	$('.lookResult').unbind('tap').bind('tap',function(){
		urlParm.title = '往期中奖结果';		
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = 'historyLucky.html?jsonKey=' + jsonStr;
	});
	$('#luckyDetail').unbind('tap').bind('tap',function(){
		urlParm.title = '抽奖明细';		
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = 'luckyDetail.html?jsonKey='+ jsonStr;
	});
	
	setInterval(function(){
		//getServiceTime();//每秒刷，防止切手机后台js停止
		var nowTime = $(".timeShow").attr("date-time");
		if( nowTime == "2018-01-29 00:00:00" ){
			getServiceTime();
		}
		temp1 = temp1-1000 > 0 ? (temp1-1000) : 0;	
		if(temp1 == 0){				
			getServiceTime();
		}
		countDown(temp1)
	},1000);
});
//
//1.获取服务器时间
//2.与活动公布日期，活动开始日期，活动结束日期做比较
//  ##1.1月29号前，礼盒图案（默认），文字未公布，活动详情第三条敬请期待，按钮置灰，活动未开始
//	##2.1.29号之后，手机礼盒（背景），iphone文字，有奖品栏，活动第三条huawei
//		##
//	##3.2.15之后，手机礼盒（背景），iphone文字，有奖品栏，活动第三条huawei，按钮置灰，活动已结束
function getServiceTime(){
	var url = base.url + 'openDoor/queryServerTime.do';
	var reqData = {}	
	$.reqAjaxsFalse(url,reqData,function(data){
		//获取服务器时间
		currentTimes = data;						//服务器时间
		var currentDate = new Date(currentTimes);		//服务器时间转为Date类型
		
		var diffPreDate = currentDate - preDate;	
		var diffStartDate = currentDate - startDate;
		var diffEndDate = currentDate - endDate;
		$('.rewards').removeClass('hidden');
		$(".redDoor").css('background-image','url("../../../image/agent/openDoorRed/iphoneBg.jpg")');
		$(".wenzi img").attr('src','../../../image/agent/openDoorRed/truth.png');		
		if(diffPreDate < 0){	//1月29号之前（不含1月29）
			$('#mingdanTable').hide();		
		}else if(diffStartDate < 0){	//1月29号~2月8号
			$('#mingdanTable').hide();			
			bgTxt = "../../../image/agent/openDoorRed/unstart.png"			
		}else if(diffEndDate<0){	//2月9号~2月15号（活动期间）			
			bgTxt = "../../../image/agent/openDoorRed/unstart.png"
			dayInit = currentDate.getDate();				//获取服务器现在日期是几号
			var monthInit = currentDate.getMonth();
			startTime.setMonth(monthInit);
			endTime.setMonth(monthInit);
			publishTime.setMonth(monthInit);
			startTime.setDate(dayInit);
			endTime.setDate(dayInit);
			publishTime.setDate(dayInit);
			var diffStartTime = currentTimes-startTime;		//开始时间距离当前时间差
			var diffEndTime = currentTimes-endTime;			//结束时间距离当前时间差			
			var diffPublishTime = currentTimes-publishTime; //公布时间距离当前时间差
			var sj = timeFormatDate(currentTimes,"yyyy-MM-dd");
			var gqsj =  timeFormatDate(currentTimes-86400000,"yyyy-MM-dd");
			console.log("今天："+sj);
			console.log("昨天："+gqsj);			
			if( diffStartTime < 0 ){//10点之前
				if(dayInit != startDay){queryDrawList('昨日',gqsj)}
				chouStateTxt ='下次抽奖开始';
				buttonFontTxt = '立即参与抽奖'				
				countTime = startTime;
				$('.startButton').unbind('tap').bind('tap',function(){
					modelAlert("今日抽奖还未开始，每日10点开始抽奖!");
				});
			}else if (diffEndTime < 0){		//10:00~10:10
				$('#mingdanTable').hide();
				chouStateTxt ='抽奖结束';				
				if( joined == 1){
					buttonFontTxt = '今日抽奖成功，稍后公布中奖结果'
					$('.startButton').unbind('tap').bind('tap',function(){
						modelAlert("今日抽奖成功，稍后公布中奖结果。");
					});
				}else{
					buttonFontTxt = '立即参与抽奖'
					if(chance == 0){
						$('.startButton').unbind('tap').bind('tap',function(){
							modelAlert("您今天没有抽奖机会可用。【业务员在一天内完成1万元寿险标准保费，在下一日可获得一次的抽奖资格。】");
						});
					}else{
						bgTxt = "../../../image/agent/openDoorRed/start.png"
						$('.startButton').unbind('tap').bind('tap',function(){
							getDraw()
						});
					}												
				}								
				countTime = endTime;
			}else if(diffPublishTime < 0){//10:00~10:18	
				$('#mingdanTable').hide();
				chouStateTxt ='公布中奖结果';			
				buttonFontTxt = '今日抽奖活动已结束，稍后公布中奖结果'				
				countTime = publishTime;
				$('.startButton').unbind('tap').bind('tap',function(){
					modelAlert("今日抽奖活动已结束，稍后公布中奖结果。");
				});
			}else{				
				queryDrawList('今日',sj)
				chouStateTxt ='下次抽奖开始';
				buttonFontTxt = '今日抽奖活动已结束，请明天再来'
				if(dayInit == endDay){
					$(".timeShow").hide();
					buttonFontTxt = '活动已结束'
				}
				dayInit = dayInit + 1;			
				startTime.setDate(dayInit);
				endTime.setDate(dayInit);
				publishTime.setDate(dayInit);
				countTime = startTime;
				$('.startButton').unbind('tap').bind('tap',function(){
					modelAlert(buttonFontTxt+"。");
				});
				
			}
		}else{//2月16号以后
			queryDrawList(timeFormatDate(endDate.getTime(),"MM月dd日"),timeFormatDate(endDate.getTime(),"yyyy-MM-dd"))
			$('.rewards').removeClass('hidden');
			$(".timeShow").hide();
			buttonFontTxt = '活动已结束'
			$(".redDoor").css('background-image','url("../../../image/agent/openDoorRed/iphoneBg.jpg")');
			$(".wenzi img").attr('src','../../../image/agent/openDoorRed/truth.png');			
			bgTxt = "../../../image/agent/openDoorRed/unstart.png"	
		}
		$('#chouState').text(chouStateTxt);
		$(".buttonFont").text(buttonFontTxt);
		$('.startButton').css('background-image','url('+bgTxt+')');
		layout()
		var activityTime = countTime;
		activityTimes = activityTime.getTime();
		var diffTime = activityTimes-currentTimes > 0 ? (activityTimes-currentTimes):0;//距离		
		temp1 = diffTime;
		countDown(diffTime)
		 mui('#bodyMuiScroll').pullRefresh().endPulldownToRefresh();
	});
}

function queryDrawChance(){
	var url = base.url + 'openDoor/queryDrawChance.do';
	var reqData = {"request":{"customerId":customerId}}
	$.reqAjaxsFalse(url,reqData,function(data){
		if( data.statusCode == '000000'){
			chance = data.returns.unused;
			joined = data.returns.join;
			$("#chance").text(data.returns.unused);
			var joinState = data.returns.join;//今日是否参与
		}else{
			
		}
	});
	}
function queryDrawList(str,date){
	$('#mingdanTable').show();
	var url = base.url + 'openDoor/queryDrawList.do';
	var reqData = {"request":{"date":date}}
	$.reqAjaxsFalse(url,reqData,function(data){
		if( data.statusCode == "000000"){
			var lastObj = data.returns.list;
			if( lastObj != 0 ){
				var itemStr = '<p>'+str+'中奖结果：</p>';
				  	itemStr +=	'<div class="table winnerList" id="wintt">'
				    itemStr +=	'<div class="table-tr scale-1px">' 
				    itemStr +=	'<div class="table-th grayBcak">序号</div>' 
				    itemStr +=	'<div class="table-th grayBcak">奖项</div>'	
				    itemStr +=	'<div class="table-th grayBcak">姓名</div>' 
				    itemStr +=	'<div class="table-th grayBcak">工号</div>'          
				    itemStr +=	' </div>  '
				for(var i = 0; i < lastObj.length; i++){		        	
					itemStr += 	'<div class="table-tr scale-1px">'; 
					itemStr += 	'<div class="table-td">'+(i+1)+'</div>';
					if(lastObj[i].isWin == '10'){
						itemStr += 	'<div class="table-td">一等奖</div>';
					}else{
						itemStr += 	'<div class="table-td">二等奖</div>';
					}					
					itemStr +=  '<div class="table-td">'+lastObj[i].name+'</div>';
					itemStr += 	'<div class="table-td">'+lastObj[i].agentCode+'</div></div>';  
		        }
				  	itemStr += 	'</div>'
				  	$(".mingdan").html(itemStr);
			}else{
				$(".mingdan").html("<p>"+str+"中奖结果：</p><p>无人得奖！</p>");
			}
			
		}
	});
	}

function layout(){
	var bi = window.innerWidth/375;
	var wenziTop = 365*(window.innerWidth/375);
	var timeTop = wenziTop + $('.wenzi').height() +20;
	if($('.timeShow').height() == 0){
		var chanceTop = timeTop;
	}else{
		var chanceTop = timeTop + $('.timeShow').height()+20;
	}
	var buttonTop = chanceTop +40;	
	$(".wenzi").css('top',wenziTop + 'px');
	$(".timeShow").css('top',timeTop+'px');
	$(".chance").css('top',chanceTop+'px');
	$(".startButton").css('top',buttonTop + 'px');
	$(".startButton").css('height',(40*375*bi/345)+'px');
	$(".startButton").css('line-height',(40*bi)+'px');	
	var rewardTop = buttonTop + $('.startButton').height() +10;
	$(".rewards").css('top',rewardTop + 'px');
	var rolesTop = rewardTop + $('.rewards').height() +10;
	$(".rules").css('top',rolesTop + 'px');
	var redDoorHeight = rolesTop +  $('.rules').height() + 20;
	$(".redDoor").css('height',redDoorHeight+'px');
}
function countDown(diffTime){	
	//console.log(diffTime);
	var days = Math.floor(diffTime/(1000*60*60*24));
	var hours = Math.floor(diffTime/(1000*60*60));//相差多少个小时
	var minutes = Math.floor(diffTime/(1000*60));
	var seconds = Math.floor(diffTime/1000);
	var yuMinutes =  minutes-hours*60;//第二位分
	var yuSeconds = seconds-hours*60*60-yuMinutes*60;
	//console.log(days+'天'+hours+"时"+yuMinutes+'分'+yuSeconds);
	$('#hour').text(hours);
	$('#minute').text(('0'+yuMinutes).slice(-2));
	$('#second').text(('0'+yuSeconds).slice(-2));
	//var shijian = new Date(activityTimes+diffTime);
	var shijian = timeFormatDate(activityTimes-diffTime,"yyyy-MM-dd HH:mm:ss");
	$(".timeShow").attr('date-time',shijian)
	
}
function getDraw(){
	var url = base.url+'openDoor/getDraw.do';
	var reqData = {"request":{"customerId":customerId}}
	$.reqAjaxsFalse( url, reqData, function(data){
		if(data.statusCode == '000000'){
			queryDrawChance()
			getServiceTime();
			modelAlert("今日抽奖成功，稍后公布中奖结果。");			
		}else{
			modelAlert(data.statusMessage);
		}
	})
}
function getDrawDate(){
	var url = base.url+'openDoor/getDrawDate.do';
	var reqData = {}
	$.reqAjaxsFalse( url, reqData, function(data){
		if(data.statusCode == '000000'){
			var open = data.returns.open;
			open = open.split('-');
			var start = data.returns.start;
			start = start.split('-');
			var end = data.returns.end;
			end = end.split('-');
			startDay = start[2];
			endDay = end[2];
			preDate.setFullYear(open[0],open[1]-1,open[2])
			startDate.setFullYear(start[0],start[1]-1,start[2])
			startTime.setFullYear(start[0],start[1]-1,start[2])
			endTime.setFullYear(start[0],start[1]-1,start[2])
			publishTime.setFullYear(start[0],start[1]-1,start[2])
			endDate.setFullYear(end[0],end[1]-1,end[2])
		}
	});
}

//返回代理人
function backlast(){
	sysback();
}