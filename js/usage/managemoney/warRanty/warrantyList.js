var data = '{"body": [{"commdityComName": "安溢保两全保险(一年期)","policyNo": "1","orderStatus": "02","shaoer": "弘康人寿","chengbao":"投资连结险","accountValue":"223213.00元","investmentPri":"223213.00元","yesterdayProfit":"223213.00元","totalProfit":"223213.00元","initialFee":"223213.00元","underWrite":"2017/05/29 15:30"},{"commdityComName": "安溢保两全保险(一年期)","policyNo": "2","orderStatus": "03","shaoer": "弘康人寿","chengbao":"投资连结险","accountValue":"223213.00元","investmentPri":"223213.00元","yesterdayProfit":"223213.00元","totalProfit":"223213.00元","initialFee":"223213.00元","underWrite":"2017/05/29 15:30"},{"commdityComName": "安溢保两全保险(一年期)","policyNo": "3","orderStatus": "01","shaoer": "弘康人寿","chengbao":"投资连结险","accountValue":"223213.00元","investmentPri":"223213.00元","yesterdayProfit":"223213.00元","totalProfit":"223213.00元","initialFee":"223213.00元","underWrite":"2017/05/29 15:30"},{"commdityComName": "安溢保两全保险(一年期)","policyNo": "4","orderStatus": "02","shaoer": "弘康人寿","chengbao":"投资连结险","accountValue":"223213.00元","investmentPri":"223213.00元","yesterdayProfit":"223213.00元","totalProfit":"223213.00元","initialFee":"223213.00元","underWrite":"2017/05/29 15:30"},{"commdityComName": "安溢保两全保险(一年期)","policyNo": "5","orderStatus": "99","shaoer": "弘康人寿","chengbao":"投资连结险","accountValue":"223213.00元","investmentPri":"223213.00元","yesterdayProfit":"223213.00元","totalProfit":"223213.00元","initialFee":"223213.00元","underWrite":"2017/05/29 15:30"},]}';

function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null,
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
						$(this).attr('class', 'baozhang');
						$(this).html('已失效');
					}
				})

			})
		})
	}
})
$(function() {
	/*获取数据*/
	var userCode='2835';
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
	var url = '../moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	/*$.reqAjaxsFalse(url, reqData, policyQueryListInfo);*/
	vm.Objectlist = strToJson(data).body;
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
		var url = '../moneyManage/policyQueryListInfo.do';
		console.log("根据选择获取数据");
		console.log(orderStatus);
		/*$.reqAjaxsFalse(url, reqData, policyQueryListInfo);*/
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
		var param = {
			"userCode": userCode,
			"policyNo": policyNo,/*订单编号*/
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		window.location.href = "warrantyDetail.html?jsonKey=" + jsonStr;
	})
});

function policyQueryListInfo(data) {
	vm.Objectlist = data.returns.pager.entities;
}
