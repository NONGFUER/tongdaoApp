var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
			hKCalculate: {},
		},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				bankweihao()
			})
		})
	}
})
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
		commodityCommId = urlParm.commodityCommId,
		title=urlParm.title,
		transToken = urlParm.transToken,
		orderNo = urlParm.orderNo;
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": "2835",
			"transTime": ""
		},
		"body": {
			"commodityCommId": commodityCommId,
			"orderNo": orderNo
		}
	}
	var url = base.url + 'moneyManage/redemptionTrial.do';
	$.reqAjaxsFalse(url, reqData, redemptionTrial);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		mui.alert('赎回成功');
		/*接口请求位子*/
	})
})

function redemptionTrial(data) {
	console.log(data);
	vm.Objectlist = data.returns;
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}
/*返回*/
function backlast() {
	var sendData = {
		"commdityCommId": commdityCommId,
		"customerId": customerId,
		"userCode": userCode,
		"channel": "01",
		"transTime": $.getTimeStr(),
		"transToken": transToken,
		"title":title
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyDetail.html?jsonKey=" + jsonStr;
}