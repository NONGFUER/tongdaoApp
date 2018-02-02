var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
console.log(JSON.stringify(urlParm))
var customerId = urlParm.customerId ? urlParm.customerId : '';
var dayInit = '';
/**
 * http://usejsdoc.org/
 */
$(function(){
	getDrawDate();
	getServiceTime()
	queryTicketPageDetail();	//抽奖券明细页信息查询
});

//抽奖券明细页信息查询
function queryTicketPageDetail(){
	var url = base.url + 'openDoor/queryTicketPageDetail.do';
	var reqData = {"request":{"customerId":customerId}}
	$.reqAjaxsFalse(url,reqData,function(data){
		if( data.statusCode == '000000'){
			var usedTickets = data.returns.used;//用过的券数量
			var unuseTickets = data.returns.unuse;//未用的券数量
			var total = data.returns.total;		//总数
			var win = data.returns.win;			 //获奖次数
			var ticketList = data.returns.ticketList;
			//渲染
			$('#total').text(total+'张');				
			$('#usedTickets').text(usedTickets+'张');
			$('#win').text(win+'次');
			if(ticketList.length != 0){
				for(var i = 0; i < ticketList.length; i++){	
					var listStr = '';
					listStr += '<div class="table-tr scale-1px" data-id="'+ticketList[i].activityId+'" onclick="toOrderList(this)">' 
					listStr += '<div class="table-td" id="day">'+ ticketList[i].day +'</div>' //交单时间
					listStr += '<div class="table-td decoration" id="amount">' + toDecimal2(ticketList[i].amount) + '(元)</div>'  //当日交单金额
					listStr += '<div class="table-td">' + ticketList[i].ticketNo + '</div>'//抽奖券号
					if( ticketList[i].statu == '已中奖' || ticketList[i].statu == '一等奖' || ticketList[i].statu == '二等奖' ){
						listStr += '<div class="table-td red">' + ticketList[i].statu + '</div>'    //抽奖券状态
					}else{
						listStr += '<div class="table-td">' + ticketList[i].statu + '</div>'    //抽奖券状态
					}	
					listStr += '</div>'
					$("#listTable").append(listStr);
				}
			}else{
				var bflag = isDateBetween(now,end,start);
				if(bflag){
					for(var i = 0; i < 7; i++){	
						var listStr = '';
						listStr += '<div class="table-tr scale-1px" data-id="" >' 
						listStr += '<div class="table-td" id="day">2月'+ (8+i)+'日</div>' //交单时间
						listStr += '<div class="table-td " id="amount">-</div>'  //当日交单金额
						listStr += '<div class="table-td">-</div>'//抽奖券号
						listStr += '<div class="table-td">-</div>'    //抽奖券状态
						listStr += '</div>'
						$("#listTable").append(listStr);
						if( (8+i) == dayInit-1 ){break;}
					}
				}else{
					var itemStr1 = '<div>';
					itemStr1 += '<img src="../../../image/common/null.png" style="width:122px;margin:120px auto 10px auto;display:block">'
					itemStr1 += '<p style="width:50%;margin:0 auto;text-align:center;color:#b2b2b2;font-size:12px;font-weight:bold">暂时没有内容</p></div>'
					$("body").append(itemStr1)
				}
			}
		}else{
			modelAlert(data.statusMessage);
		}
	});
}

function toOrderList(obj){
	urlParm.title = '抽奖明细';
	urlParm.activityId = $(obj).attr("data-id");
	urlParm.day = $(obj).find('#day').text();
	urlParm.amount =  $(obj).find('#amount').text();
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = 'luckyOrderList.html?jsonKey='+jsonStr;
}

function getServiceTime(){
	var url = base.url + 'openDoor/queryServerTime.do';
	var reqData = {}	
	$.reqAjaxsFalse(url,reqData,function(data){
		var currentTimes = data;						//服务器时间
		var currentDate = new Date(currentTimes);		//服务器时间转为Date类型
		dayInit = currentDate.getDate();
		now = timeFormatDate(currentTimes,"yyyy-MM-dd")
	})
}
function getDrawDate(){
	var url = base.url+'openDoor/getDrawDate.do';
	var reqData = {}
	$.reqAjaxsFalse( url, reqData, function(data){
		if(data.statusCode == '000000'){			
			start = data.returns.start;			
			end = data.returns.end;
			
		}
	});
}
/*
* 日期解析，字符串转日期 
* @param dateString 可以为2017-02-16，2017/02/16，2017.02.16 
* @returns {Date} 返回对应的日期对象 
*/  
function dateParse(dateString){  
   var SEPARATOR_BAR = "-";  
   var SEPARATOR_SLASH = "/";  
   var SEPARATOR_DOT = ".";  
   var dateArray;  
   if(dateString.indexOf(SEPARATOR_BAR) > -1){  
       dateArray = dateString.split(SEPARATOR_BAR);    
   }else if(dateString.indexOf(SEPARATOR_SLASH) > -1){  
       dateArray = dateString.split(SEPARATOR_SLASH);  
   }else{  
       dateArray = dateString.split(SEPARATOR_DOT);  
   }  
   return new Date(dateArray[0], dateArray[1]-1, dateArray[2]);   
};  
 
/** 
* 日期比较大小 
* compareDateString大于dateString，返回1； 
* 等于返回0； 
* compareDateString小于dateString，返回-1 
* @param dateString 日期 
* @param compareDateString 比较的日期 
*/  
function dateCompare(dateString, compareDateString){  
   var dateTime = dateParse(dateString).getTime();  
   var compareDateTime = dateParse(compareDateString).getTime();  
   if(compareDateTime > dateTime){  
       return 1;  
   }else if(compareDateTime == dateTime){  
       return 0;  
   }else{  
       return -1;  
   }  
};  
 
/** 
* 判断日期是否在区间内，在区间内返回true，否返回false 
* @param dateString 日期字符串 
* @param startDateString 区间开始日期字符串 
* @param endDateString 区间结束日期字符串 
* @returns {Number} 
*/  
function isDateBetween(dateString, startDateString, endDateString){   
   var flag = false;  
   var startFlag = (dateCompare(dateString, startDateString) < 1);  
   var endFlag = (dateCompare(dateString, endDateString) > -1);  
   if(startFlag && endFlag){  
       flag = true;  
   }  
   return flag;  
};  

//返回
function backlast(){
	urlParm.title = '开门红';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = 'activity.html?jsonKey='+jsonStr;
}