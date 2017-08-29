//获取代理人id
var agentId = '';
var phone = '';
var pageNo = 1;
var totalpage = 1;
var parm = '';
var dateText = null;
var orderKind = 0;
var flag = '';
var stuValue = 0;
var orderStatus="";//订单状态
var productCode="";//险种代码
var  norecord = '<div id="noRecord" class="noRecord"><div class="noRecordimg"><img src="../../images/gzpt_noRecord.png"></div><div class="noRecordfont">没有相关记录</div></div>';
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);	
	phone = parm.mobile;
	stuValue = parm.stuValue;
	productCode = parm.productCode;
	if(stuValue){backInit(stuValue);}
	/*phone="15721114668";
	productCode="00519900603";*/
	
	$.tabStatusActive();
	$.pulluptoRefresmui();
	$.setscroll();
	$(".h_back").unbind("tap").bind("tap",function(){		
		var sendData={
				"mobile":phone,
				"productCode":productCode
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url+"App/html/jiachengxian/jcxshouye.html?jsonKey="+jsonStr;			
	})		
});

/**
 * 页面只有一个上拉区域需要上拉加载 
 * 使用方法：$.pulluptoRefreshmui(id1, id2, pageNo,totalpage,method);
 * id1:所要上拉的区域；
 * id2:所要赋值的区域；
 * pageNo： 当前页数
 * totalpage： 总页数
 * method：上拉后执行的方法；
 * 此方法依赖组件
 * mui，请在页面中先引入 mui.min.css、mui.min.js
 */
$.pulluptoRefresmui = function() {
	//加载下一个页面
	mui.init({
		pullRefresh: {
			container: '#order_index',
			up: {
				height: 50, // 可选.默认50.触发上拉加载拖动距离
				callback: pullupRefresh,
				contentrefresh: '正在刷新...',
				auto: true
			}
		}
	});
	$('.mui-pull-bottom-pocket').remove();
	//上拉加载回调方法
	function pullupRefresh() {
		if(pageNo > totalpage) {
			mui.toast('没有更多数据了！');
		}
		setTimeout(function() {
			mui('#order_index').pullRefresh().endPullupToRefresh();
			if(totalpage >= pageNo) {
					propertyorder(flag)											
			}
		}, 100);
	}
}
/**
 * @function 请求
 * @parm null
 * 
 */
function propertyorder(flagValue){
	var url = base.share_sxyurl+'jcxPolicy/customerQuery.do';
	if(flagValue==""){
		orderStatus="01,02,03,04,05,99";//全部
	}else if(flagValue=="1"){
		orderStatus="01,02,05";//待支付
	}else if(flagValue=="2"){
		orderStatus="03";//已承保
	}else if(flagValue=="3"){
		orderStatus="04";//已生效
	}else if(flagValue=="4"){
		orderStatus="99";//已失效
	}
	var reqData = {
			'head':{
				'userCode': '',
				'transTime':$.getTimeStr(),
				'channel':'1'//1-App 2-微信
			},'body':{
				'pageNo' : pageNo+'',
				'pageSize' : '4',
				'mobile' : phone,
				'orderStatus' : orderStatus,
				'productCode':productCode
			}
		};
	console.log(reqData);
	$.reqAjaxsFalse(url,reqData,$.getPropertyorderList);
}
/**
 * @function 设置滚动区域
 * @parm null
 * 
 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - 82;
	$("#order_index").height(Scrollheight + "px");
	mui("#order_index").scroll();
};
/**
 * @function tab切换效果
 */
$.tabStatusActive = function(){
	$(".status_tab").each(
			function(i){
				$(this).unbind("tap").bind("tap",function(){
					$(this).addClass("active1");
					$(this).siblings().removeClass("active1");
					//console.log(i);					
					if(i === 0){
						flag = '';
					}else{
						flag = i+'';
					}
					$('.mui-scroll').html('');									
					pageNo = 1;
					totalpage = 1;
					propertyorder(flag);
					$('.mui-scroll').css('transform','translate3d(0px, 0px, 0px)');	
				});
			}
	);
}
/**
 * @function 获取【短险出单】列表信息,渲染到页面上去
 * 
 */
$.getPropertyorderList = function(data){
	console.log(data);
	pageNo++;
	totalpage = data.returns.pager.pageCount;
	if(data.statusCode == '000000') {
		var propertyorderList = data.returns.pager.entities;
		var propertyorderListDom = propertyorderListDomGenerator(propertyorderList);
		 $('.mui-scroll').append(propertyorderListDom);
		 $('#noRecord').show();
		 toDuanDetail();
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
}
/**
 * @function 【短险出单】dom结构
 */
function propertyorderListDomGenerator(parmList){
	 var listString = '';
	 if(parmList){
		 if(parmList.length != 0){
			 for(var i = 0; i < parmList.length ; i++){
					listString += '<div class="content-wrap duanxian" orderNo="'+parmList[i].orderNo+'" >'
					listString +='<div class="policy-title"><div class="policy-title-wrap">'
					listString +=   '<span class="orderproductName blueColor">'+parmList[i].productName+'</span><span class="orderDate blueColor"></span>'
					listString +='</div></div>'
					listString +='<div class="policy-body"><div class="policy-body-wrap clearfix">'			
					listString +=  '<div class="policy-split policy-split-1"><div class="info-up">'+parmList[i].insureName+'</div><div class="info-down">投保人</div></div>'
					listString +=  '<div class="policy-split policy-split-2"><div class="info-up">赠险</div><div class="info-down">保费</div></div>'
					listString +=  '<div class="policy-split policy-split-3"><div class="info-up">'+getDuanStatus(parmList[i].policyStatus)+'</div><div class="info-down">订单状态</div></div>'
					listString +='</div></div>'
					listString +='<div class="policy-footer">保障时间：30天'
					if(parmList[i].underWrite){
				        listString +='<div class="policy-date">承保日期:  <span>'+parmList[i].underWrite+'</span></div>'
				    }	
					listString +='</div></div>';
				 }
		 }else{
			 listString = norecord;
		 }		 
	 }else{
		listString = norecord;
	 }
	 return listString;
}
/*
 * @function 
 */
function toDuanDetail(){
	$('.duanxian').each(function(){
		$(this).unbind('tap').bind('tap', function() {
			/*if(flag==""){
				stuValue=0;
			}else{
				stuValue=flag;
			}*/
			/*var sendData={
					"mobile":phone,
					"orderNo":$(this).attr("orderNo"),
					"pageFrom":'om',
					"status":flag,
					"stuValue":stuValue,
					"comeFlag":"1"//1:由产品页进入列表；2：由APP首页我的出单进入列表；3：由微信公众号我的保单进入列表
			};
			var jsonStr = UrlEncode(JSON.stringify(sendData));*/
			var orderNo=$(this).attr("orderNo");
			window.location.href = "jcxPolicyInfo.html?orderNo="+orderNo+"&phone="+phone;
		});
	});
}
function getDuanStatus(value){
	var status = '';
	if(value=="00"){		
		status="失效";
	}
	else if(value=="01"){
		status="核保成功";
	}
	else if(value=="02"){
		status="支付失败";
	}
	else if(value=="03"){		
		status="待生效";
	}
	else if(value=="04"){	
		status="承保成功";
	}
	else if(value=="05"){		
		status="支付中";
	}
	else if(value=="99"){		
		status="已过期";
	}
	return status;
}
function backInit(value2){	
	$('.status_tab').eq(value2).addClass("active1");
	$('.status_tab').eq(value2).siblings().removeClass("active1");
	if(value2 === 0){
		flag = '';
	}else{
		flag = value2+'';
	}	
	$('.mui-scroll').html('');	
	propertyorder(flag);
}
$.reqAjaxsFalse = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	$.ajax({
		url : url,
		type : 'POST',
		data : "jsonKey=" + requestJson,
		dataType : "json",
		timeout : 60000,
		success : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			if (!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error : function(data) {
			$(".ajax_prevent").remove();// 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend : function(xhr) {
			$.ajaxPrevent();
		},
		async : false,
	});
};	