/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;*/
var vm = new Vue({
	el: '#list',
	data: {
		objectlist: {},
	}
})

$(function() {
	var reqData = {
		"body": {
			"customerId": "2",
			"customerPhone": "13601460140",
			"roleType": "03"

		},
		"head": {
			"channel": "01",
			"userCode": "",
			"transTime": "",
			"transToken": ""
		}
	}
	var url = base.url + 'yuyueOrder/getYuyueOrderList.do';
	console.log("页面初始化，发送请求报文--");
	/*console.log(urlParm);*/
	$.reqAjaxsFalse(url, reqData, getYuyueOrderList);
	/*下拉刷新*/
//	mui.init({
//		pullRefresh: {
//			container: '#list',
//			down: { //下拉刷新
//				auto: true, //可选,默认false.自动下拉刷新一次
//				contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
//				contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
//				contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
//				callback: pulldownRefresh
//			}
//		}
//	});

	/*下拉刷新*/
//	function pulldownRefresh() {
//		setTimeout(function() {
//			vm.objectlist = data;
//			mui('.mui-content').pullRefresh().endPulldownToRefresh();
//		}, 500);
//	}
//	mui("ul").on("tap", "li", function() {
//		var pid = $(this).attr('pid');
//		mui.alert(pid);
//	})
})

function getYuyueOrderList(data) {
	console.log(data);
}