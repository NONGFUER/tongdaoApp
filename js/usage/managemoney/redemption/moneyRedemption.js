var data = {
	"userCode": "2835",
	"channel": "01",
	"transTime": "2017-08-25 09:58:03",
	"transToken": "",
	"statusCode": "000000",
	"statusMessage": "",
	"returns": {
		"list": [{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"4",
				"commodityCommId":"1503383193733"
			},
			{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"8",
				"commodityCommId":"1503383193733"
			},{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"2",
				"commodityCommId":"1503383193733"
			},{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"1",
				"commodityCommId":"1503383193733"
			},{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"6",
				"commodityCommId":"1503383193733"
			},{
				"commdityComName": "弘康安溢保两全保险",
				"policyNo": "86000020171310001180",
				"orderStatus": "02",
				"accountValue": "null",
				"investmentPri": "4000.0000",
				"totalProfit": "2000.00",
				"freeDateStart": '2017/08/25',
				"freeDateEnd": '2017/08/25',
				"hesitationFlag": "1",
				"orderNo":"5",
				"commodityCommId":"1503383193733"
			}
		]
	}
};

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
	var url = '../moneyManage/redemptionList.do';
	console.log("页面初始化，发送请求报文--");
	/*$.reqAjaxsFalse(url, reqData, redemptionList);*/
	vm.Objectlist = data.returns.list;
	console.log(vm.Objectlist)
})

function redemptionList(data) {
	vm.Objectlist = data.returns.pager.entities;
}