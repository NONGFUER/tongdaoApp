mui.init();
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				chuli();
			})
		})
	},
	watch: {
		Objectlist: function(val) {
			this.$nextTick(function() {
				$(function() {
					chuli();
				})
			})
		}
	}
})
$(function() {
	/*获取数据*/
	var userCode = '2835';
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": ""
		},
		"body": {
			"commodityComId": "4",
			"flag": "",
			"pageNo": "1",
			"pageSize": "10",
			"customerId": "3"
		}
	}
	var url = base.url + 'moneyManage/policyQueryList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var orderStatus = $(this).attr('orderStatus');
		/*获取数据*/
		var reqData = {
			"head": {
				"channel": "01",
				"userCode": "2835",
				"transTime": ""
			},
			"body": {
				"commodityComId": "4",
				"flag": orderStatus,
				"pageNo": "1",
				"pageSize": "10",
				"customerId": "3"
			}
		}
		var url = base.url + 'moneyManage/policyQueryList.do';
		console.log("根据选择获取数据");
		console.log(orderStatus);
		$.reqAjaxsFalse(url, reqData, policyQueryListInfo);

	})
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
	mui('.man-div-body-ul ').on('tap', 'li', function() {
		var policyNo = $(this).attr('policyNo');
		var orderNo = $(this).attr('orderNo');
		var insureNo = $(this).attr('insureNo');
		var param = {
			"userCode": userCode,
			"policyNo": policyNo,
			"orderNo":orderNo,
			"insureNo":insureNo
			/*订单编号*/
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		window.location.href = "warrantyDetail.html?jsonKey=" + jsonStr;
	})
});

function policyQueryListInfo(data) {
	console.log(data);
	vm.Objectlist = data.returns.pager.entities;
}

function chuli() {
	$('.baozhang').each(function() {
		if($(this).html() == '01') {
			$(this).attr('class', 'baozhang dai');
			$(this).html('待生效');
		} else if($(this).html() == '02') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('保障中');
		} else if($(this).html() == '03') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('已领取');
		} else if($(this).html() == '99') {
			$(this).attr('class', 'baozhang');
			$(this).html('已失效');
		}
	})
}