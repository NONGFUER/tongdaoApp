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
var userCode = "",
	commodityComId = "",
	transToken = "",
	customerId = "";
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	userCode = urlParm.userCode;
	commodityComId = urlParm.commodityComId;
	transToken = urlParm.transToken;
	customerId = urlParm.customerId;
	list(userCode, transToken, customerId, commodityComId, "")
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
	mui('.man-div-body-ul ').on('tap', '.man-div-body-ul_li', function() {
		var policyNo = $(this).attr('policyNo');
		var orderNo = $(this).attr('orderNo');
		var insureNo = $(this).attr('insureNo');
		var commditycomname = $(this).attr('commdityComName');
		console.log($(this));
		var param = {
			"userCode": userCode,
			"policyNo": policyNo,
			"orderNo": orderNo,
			"insureNo": insureNo,
			"customerId": customerId,
			"transToken":transToken,
			"commodityComId": commodityComId,
			"title": commditycomname,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
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
		if($(this).html() == '11') {
			$(this).attr('class', 'baozhang dai');
			$(this).html('待生效');
		} else if($(this).html() == '2') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('保障中');
		} else if($(this).html() == '4') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('已领取');
		}
		/*else if($(this).html() == '04') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('核保中');
		} else if($(this).html() == '05') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('核保成功');
		} else if($(this).html() == '06') {
			$(this).attr('class', 'baozhang');
			$(this).html('支付失败');
		} else if($(this).html() == '07') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('支付成功');
		} else if($(this).html() == '08') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('承保处理中');
		} else if($(this).html() == '09') {
			$(this).attr('class', 'baozhang dai');
			$(this).html('待生效');
		} else if($(this).html() == '10') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('承保成功');
		} else if($(this).html() == '11') {
			$(this).attr('class', 'baozhang');
			$(this).html('承保失败');
		} else if($(this).html() == '12') {
			$(this).attr('class', 'baozhang');
			$(this).html('已退保');
		} else if($(this).html() == '99') {
			$(this).attr('class', 'baozhang');
			$(this).html('已失效');
		}*/
	})
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}

function mylist(userCode, transToken, customerId, commodityComId, flag) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	commodityComId = commodityComId;
	list(userCode, transToken, customerId, commodityComId, flag);
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var flag = $(this).attr('orderStatus');
		/*获取数据*/
		list(userCode, transToken, customerId, commodityComId, flag);
	})
}

function list(userCode, transToken, customerId, commodityComId, flag) {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"commodityComId": commodityComId,
			"flag": flag,
			"pageNo": "1",
			"pageSize": "10",
			"customerId": customerId
		}
	}
	var url = base.url + 'moneyManage/policyQueryList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
}
mui('.man-div-title ul').on('tap', 'li', function() {
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$(this).addClass('li_xuan');
	var flag = $(this).attr('orderStatus');
	/*获取数据*/
	list(userCode, transToken, customerId, commodityComId, flag);
})