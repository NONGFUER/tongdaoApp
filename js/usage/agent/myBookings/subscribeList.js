/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
var vm = new Vue({
	el: '#list',
	data: {
		objectlist: {},
	}
})

$(function() {
	/*下拉刷新*/
	mui.init({
		pullRefresh: {
			container: '#list',
			down: { //下拉刷新
				auto: true, //可选,默认false.自动下拉刷新一次
				contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback: pulldownRefresh
			}
		}
	});

	/*下拉刷新*/
	function pulldownRefresh() {
		setTimeout(function() {

			var reqData = {
				"body": {
					"customerId": customerId,
					"customerPhone": userCode,
					"roleType": roleType,
				},
				"head": {
					"channel": "01",
					"userCode": userCode,
					"transTime": $.getTimeStr(),
					"transToken": transToken
				}
			}
			var url = base.url + 'yuyueOrder/getYuyueOrderList.do';
			console.log("页面初始化，发送请求报文--");
			$.reqAjaxsFalse(url, reqData, getYuyueOrderList);
			mui('.mui-content').pullRefresh().endPulldownToRefresh();
		}, 500);
	}
	mui("ul").on("tap", "li", function() {
		var customerId = $(this).attr('customerId');
		var commodityCombinationId = $(this).attr('commodityCombinationId');
		var yuyuePhone = $(this).attr('yuyuePhone');
		var yuyueName = $(this).attr('yuyueName');
		var yuyueNo = $(this).attr('yuyueNo');
		var sendData = {
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"yuyueNo": yuyueNo,
			"yuyuePhone": yuyuePhone,
			"yuyueName": yuyueName,
			"transToken": transToken,
			"roleType": roleType,
			"userCode": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": '预约详细',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/agent/myBookings/bookingDetails.html?jsonKey=" + jsonStr;
	})
})

function getYuyueOrderList(data) {
	console.log(data.returns.yuyueOrderList);
	vm.objectlist = data.returns.yuyueOrderList;
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}