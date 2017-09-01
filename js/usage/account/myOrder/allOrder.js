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
		Objectlist: null
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				$('.baozhang').each(function() {
					if($(this).html() == '待支付') {
						$(this).attr('class', 'baozhang dai');
						$(this).attr('class', 'baozhang dai');
					} else if($(this).html() == '已支付') {
						$(this).attr('class', 'baozhang bao');
					}
				})

			})
		})
	}
})
$(function() {
	var reqData = {
		"body": {
			"userCode": "13888888888",
			"channel":"",
			"transToken": ""

		},
		"head": {
			"channel": "01",
			"userCode": "",
			"transTime": "",
			"transToken": ""
		}
	}
	var url = base.url + 'personal/getOrderList.do';
	console.log("页面初始化，发送请求报文--");
	/*console.log(urlParm);*/
	$.reqAjaxsFalse(url, reqData, getOrderList);
	mui('#list').on('tap', '.mui-btn', function() {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该保单吗？', '', ['确认', '取消'], function(e) {
			if(e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	})

})
function getOrderList(data){
	console.log(data);
	vm.Objectlist = data;
}
