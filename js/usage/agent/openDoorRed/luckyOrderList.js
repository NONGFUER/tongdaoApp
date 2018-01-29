var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
console.log(JSON.stringify(urlParm))
var activityId = urlParm.activityId;
var day = urlParm.day;
var amount = urlParm.amount;
/**
 * http://usejsdoc.org/
 */
$(function(){
	$("#day").text('2018年'+day);
	$("#amount").text(amount);
	queryTicketPageDetail();//获取数据并且渲染
});

//获取订单列表
//openDoor/queryToubaoPageDetail.do
function queryTicketPageDetail(){
	var url = base.url + 'openDoor/queryToubaoPageDetail.do';
	var reqData = {"request":{"activityId":activityId+""}}
	$.reqAjaxsFalse( url, reqData, function(data){
		if(data.statusCode == '000000'){
			var orderList = data.returns.list;
			if(orderList.length != 0){
				for(var i = 0; i < orderList.length;i++){
					var itemStr = '';
					itemStr += '<div class="detailItem">';
					itemStr += '<div>投保单号：<span id="insureNo">'+orderList[i].insureNo+'</span>';
					if( orderList[i].isDrawChance == 1 ){
						itemStr += '<span class="liitleTag">计入抽奖</span>'
					}else{
						itemStr += '<span class="liitleRedTag">不计入抽奖</span>'
					}				
					itemStr += '</div><div>保单创建时间：<span id="createTime">'+orderList[i].insureCreateDate.split('-').join('.')+'</span></div>'
					itemStr += '<div>标准保费：<span id="priem">'+toDecimal2(orderList[i].standardPrem)+'元</span></div>'
					if( orderList[i].isDrawChance == 0 ){
						itemStr += '<div>不计入说明：保单审核通过时间与保单创建时间不是同一天</div>'
					}
					itemStr += '</div>'
					$("#orderList").append(itemStr);
				}
			}else{
				var itemStr = '';
				itemStr += '<img src="../../../image/common/null.png" style="width:122px;margin:120px auto 10px auto;display:block">'
				itemStr += '<p style="width:50%;margin:0 auto;text-align:center;color:#b2b2b2;font-size:12px;font-weight:bold">暂时没有内容</p>'
				$("#orderList").append(itemStr);
			}						
		}else{
			modelAert(data.statusMessage);
			var itemStr = '';
			itemStr += '<img src="../../../image/common/null.png" style="width:122px;margin:120px auto 10px auto;display:block">'
			itemStr += '<p style="width:50%;margin:0 auto;text-align:center;color:#b2b2b2;font-size:12px;font-weight:bold">暂时没有内容</p>'
			$("#orderList").append(itemStr);
		}
	});
}

//返回
function backlast(){
	urlParm.title = '抽奖明细';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = 'luckyDetail.html?jsonKey='+jsonStr;
}