var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
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
						$(this).attr('class', 'baozhang yilingqu');
						$(this).html('已失效');
					}
				})
				$(".div_btn").unbind("tap").bind("tap", function() {
					var commodityCommId = $(this).attr('commodityCommId');
					var orderNo=$(this).attr('orderNo');
					var reqData = {
						"commodityCommId": commodityCommId,
						"orderNo":orderNo,
					}
					var jsonStr = UrlEncode(JSON.stringify(reqData));
					window.location.href = "policyRedemption.html?jsonKey=" + jsonStr;
				})

			})
		})
	}
})
$(function() {
	/*获取数据*/
	var userCode = '2835';
	var reqData = {
		"body": {
			"commdityCommId": "4",
			"customerId": "3"
		},
		"head": {
			"userCode": "2835",
			"transTime": "",
			"channel": "01"
		}
	}
	var url = base.url +'moneyManage/redemptionList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, redemptionList);
	console.log(vm.Objectlist);
})

function redemptionList(data) {
	console.log(data);
	vm.Objectlist = data.returns.list;
}