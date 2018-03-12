var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
console.log(JSON.stringify(urlParm))
var customerId = urlParm.customerId ? urlParm.customerId : '';
var diff = 0;
var timeReal = ''
/**
 * http://usejsdoc.org/
 */
$(function(){
	getServiceTime();
	queryDrawList()
});

function queryDrawList(){
	var url = base.url + 'openDoor/queryDrawList.do';
	var reqData = {"request":{"date":""}};
	$.reqAjaxs( url, reqData,function(data){
		var obj = data.returns;
		var p=0;
		for(var k in obj) {
			if( diff < 0 && timeReal == k){
				continue;
			}
		    //遍历对象，k即为key，obj[k]为当前k对应的值
		    var lastObj = obj[k]
		    var itemStr = '';
		    itemStr += '<dl class="module mb10 whitebackground">'		    
		   if(p == 0){
			   itemStr += '<dt class="content-title on" onclick="rollup(this)"><img src="../../../image/agent/openDoorRed/dateIco.png">'+k+'中奖结果<img  class="xiajiantou"  style="width:14px;height:8px;float:right;margin-top:8px;" src="../../../image/managemoney/productDetails/shangjiantou.png"></dt>' 
			   itemStr +=	'<dd class="content-info padding15 ">'
		   }else{
			   itemStr += '<dt class="content-title" onclick="rollup(this)"><img src="../../../image/agent/openDoorRed/dateIco.png">'+k+'中奖结果<img  class="xiajiantou"  style="width:14px;height:8px;float:right;margin-top:8px;"  src="../../../image/managemoney/productDetails/xiajiantou.png"></dt>' 
			   itemStr +=	'<dd class="content-info padding15 hidden">'
		   }		    	    
		    if(lastObj.length!=0){
		    	itemStr +=	'<div class="table winnerList" id="winTable'+p+'">'
			    itemStr +=	'	<div class="table-tr scale-1px"> ' 
			    itemStr +=	'<div class="table-th grayBcak">序号</div> '
			    itemStr +=  '<div class="table-th grayBcak">奖项</div>'
			    itemStr +=	' <div class="table-th grayBcak">姓名</div> ' 
			    itemStr +=	'<div class="table-th grayBcak">工号</div>  '          
			    itemStr +=	' </div>  </div>'
			    itemStr += '</dd></dl>'	
		    	$('#board').append(itemStr);
	           for(var i = 0; i < lastObj.length; i++){
	        	   var trStr = '';
	        	   trStr += '<div class="table-tr scale-1px"> ' 
	        	   trStr += '<div class="table-td">'+(i+1)+'</div>  '
	        	   if(lastObj[i].isWin == '10'){
	        		   trStr += 	'<div class="table-td">一等奖</div>';
	        	   }else{
	        		   trStr += 	'<div class="table-td">二等奖</div>';
	        	   }
	        	   trStr +=  '<div class="table-td">'+lastObj[i].name+'</div> ' 
	        	   trStr += '<div class="table-td">'+lastObj[i].agentCode+'</div> </div> '  
	        	   $('#winTable'+p).append(trStr);
	           }	           
		    }else{
		    	itemStr +=	'<div class="table winnerList" id="winTable'+p+'">'			    			          
			    itemStr +=	' 无人中奖</div>'
			    itemStr += '</dd></dl>'	
		    	$('#board').append(itemStr);
		    }
		    p++;
		}
		if($(".module").length < 1){
			var itemStr1 = '';
			itemStr1 += '<img src="../../../image/common/null.png" style="width:122px;margin:240px auto 10px auto;display:block">'
			itemStr1 += '<p style="width:50%;margin:0 auto;text-align:center;color:#b2b2b2;font-size:12px;font-weight:bold">暂时没有内容</p>'
			$("#board").html(itemStr1)
		}
	} );
}

function getServiceTime(){
	var url = base.url + 'openDoor/queryServerTime.do';
	var reqData = {}	
	$.reqAjaxsFalse(url,reqData,function(data){
		var currentTimes = data;						//服务器时间
		 timeReal =  timeFormatDate(currentTimes,"yyyy-MM-dd");
		var currentDate = new Date(currentTimes);		//服务器时间转为Date类型	
		var twelweTime = currentDate.setHours( 12, 0, 0, 0 )
		diff = currentTimes - twelweTime;//>=0 则公布  
	})
}

//
function rollup(obj){
	if($(obj).next().hasClass('hidden')){
		$(obj).next().removeClass("hidden");
		$(obj).find('.xiajiantou').attr('src','../../../image/managemoney/productDetails/shangjiantou.png')
	}else{
		$(obj).next().addClass("hidden");
		$(obj).find('.xiajiantou').attr('src','../../../image/managemoney/productDetails/xiajiantou.png')
	}
}
//返回
function backlast(){
	urlParm.title = '开门红';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = 'activity.html?jsonKey='+jsonStr;
}