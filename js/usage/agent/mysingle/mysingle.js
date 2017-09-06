mui.init();
/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;*/
var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';
var username = userCode + "",
	policyStatus = null,
	customerId = '20',
	riskType = null;

var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
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
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
			"policyStatus": policyStatus,
			"riskType": riskType,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'personal/getPolicyList.do';
	$.reqAjaxsFalse(url, reqData, getPolicyList);
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
	$(".wechat").unbind("tap").bind("tap", function() {
		
	})
})

function getPolicyList(data) {
	console.log(data);
	if(data.status_code == '000000') {
		if(data.returns.length > 0) {
			vm.Objectlist = data.returns;
		}
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message,'',lognCont);
	} else {
		modelAlert(data.status_message);
	}
}

/*登录失效*/
function lognCont() {
	loginControl();
}

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function bianji() {
	var sendData = {
		"BxWxAgent": {
			"name": vm.name,
			"iden": vm.mingpian.insuranceConsultantType,
			"area": vm.dizhi,
			"cardmobile": vm.phone,
			"agentCode": vm.mingpian.agentCode,
			"practiceCode": vm.mingpian.practiceCode,
			"introinfo": jie,
			"field": shan,
		},
		"touxiang": $(".tou img").attr("src"),
		"customerId": customerId,
		"transToken": transToken,
		"userCode": userCode,
		"leftIco": '1',
		"rightIco": '3',
		"downIco": '0',
		"title": '我的名片',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyList.html?jsonKey=" + jsonStr;
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
			$(this).html('已过期');
		} else if($(this).html() == '04') {
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
		}
	})
}