/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;*/
	var transToken='059876d99ec46c490953d04d4993da56';
	var userCode='13601460140';
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
					"customerId": "6",
					"customerPhone": "13601460140",
					"roleType": "03"

				},
				"head": {
					"channel": "01",
					"userCode": "",
					"transTime": "",
					"transToken": transToken
				}
			}
			var url = base.url + 'yuyueOrder/getYuyueOrderList.do';
			console.log("页面初始化，发送请求报文--");
			/*console.log(urlParm);*/
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
			"customerId":customerId,
			"commodityCombinationId":commodityCombinationId,
			"yuyueNo":yuyueNo,
			"yuyuePhone":yuyuePhone,
			"yuyueName":yuyueName,
			"transToken":transToken,
			"userCode":'13601460140'
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/agent/myBookings/bookingDetails.html?jsonKey=" + jsonStr;
	})
})

function getYuyueOrderList(data) {
	console.log(data.returns.yuyueOrderList);
	vm.objectlist = data.returns.yuyueOrderList;
}