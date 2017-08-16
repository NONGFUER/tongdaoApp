function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
}
var data = '{"body": [{"title": "【10年交】华夏健康人生重大疾病保险","pid": "001","fuwu": "服务人员:罗娟","riqi":"提交日期:2017-8-16 10:28:12"},{"title": "【10年交】华夏健康人生重大疾病保险","pid": "002","fuwu": "服务人员:罗娟","riqi":"提交日期:2017-8-16 10:28:12"},{"title": "【10年交】华夏健康人生重大疾病保险","pid": "003","fuwu": "服务人员:罗娟","riqi":"提交日期:2017-8-16 10:28:12"},{"title": "【10年交】华夏健康人生重大疾病保险","pid": "004","fuwu": "服务人员:罗娟","riqi":"提交日期:2017-8-16 10:28:12"},{"title": "【10年交】华夏健康人生重大疾病保险","pid": "005","fuwu": "服务人员:罗娟","riqi":"提交日期:2017-8-16 10:28:12"},]}';

$(function() {
	var vm = new Vue({
		el: '#list',
		data: {
			objectlist: null,
			datas: null
		}
	})
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
			vm.objectlist = strToJson(data).body;
			mui('.mui-content').pullRefresh().endPulldownToRefresh();
		}, 500);
	}
	mui("ul").on("tap", "li", function() {
		var pid=$(this).attr('pid');
		mui.alert(pid);
	})
})