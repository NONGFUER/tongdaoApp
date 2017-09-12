/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	commodityCommId = urlParm.commodityComId,
	policyNo = urlParm.policyNo;
console.log("页面初始化，获取上个页面传值报文--");
var flag = '1';
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
		bao: {},
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
	list(userCode, transToken, customerId, commodityCommId, flag);
})

function policyDetail(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		if(data.returns.list1.length > 0) {
			//vm.Objectlist = data.returns.list1;
			var datas = new Array();
			data.returns.list1.forEach(function(value, key) {
				datas.push(value);
				datas[key].orderStatus = panding(datas[key].insureSurrender, datas[key].orderStatus);
				datas[key].money=toDecimal2(datas[key].money);
			})
			vm.Objectlist = datas;
		} else {
			vm.Objectlist = {};
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function chuli() {
	$('.man-div-body-ul_li').each(function() {
		if($(this).attr('orderStatus') == '未核保') {
			$(this).addClass('lanseli');
		} else if($(this).attr('orderStatus') == '核保失败') {
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '处理中') {
			$(this).addClass('lanseli');
		} else if($(this).attr('orderStatus') == '核保成功') {
			$(this).addClass('lanseli');
		} else if($(this).attr('orderStatus') == '待生效') {
			$(this).addClass('lanseli');
		} else if($(this).attr('orderStatus') == '投保成功') {
			$(this).addClass('lanseli');
		} else if($(this).attr('orderStatus') == '已退保') {
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '投保失败') {
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '领取成功') {
			$(this).addClass('huangseli');
		} else if($(this).attr('orderStatus') == '领取失败') {
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '处理中') {
			$(this).addClass('huangseli');
		} else if($(this).attr('orderStatus') == '赎回试算成功') {
			$(this).addClass('huangseli');
		} else if($(this).attr('orderStatus') == '赎回试算失败') {
			$(this).addClass('lanseli');
		}
	})
}

function panding(insureSurrender, orderStatus) {
	if(insureSurrender == '1') {
		if(orderStatus == '01') {
			return '未核保';
		} else if(orderStatus == '03') {
			return '核保失败';
		} else if(orderStatus == '08' || orderStatus == '13') {
			return '处理中';
		} else if(orderStatus == '05') {
			return '核保成功';
		} else if(orderStatus == '09') {
			return '待生效';
		} else if(orderStatus == '10') {
			return '投保成功';
			$(this).children('money').addClass('lanse');
		} else if(orderStatus == '12') {
			return '已退保';
		} else if(orderStatus == '11') {
			return '投保失败';
		}
	} else if(insureSurrender == '2') {
		if(orderStatus == '01') {
			return '领取成功';
		} else if(orderStatus == '02') {
			return '领取失败';
		} else if(orderStatus == '03') {
			return '处理中';
		} else if(orderStatus == '04') {
			return '赎回试算成功';
		} else if(orderStatus == '05') {
			return '赎回试算失败';
		}
	}
}

function backlast() {
	sysback();
}

function mylist(userCode, transToken, customerId, commodityCommId, flag) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	commodityComId = commodityCommId;
	flag='1';
	list(userCode, transToken, customerId, commodityCommId, flag);
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		flag = $(this).attr('flag');
		list(userCode, transToken, customerId, commodityCommId, flag);
	})
}

function list(userCode, transToken, customerId, commodityCommId, flag) {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"customerId": customerId,
			"commodityCommId": commodityCommId,
			"flag": flag
		}
	}
	var url = base.url + 'moneyManage/policyDetail.do';
	$.reqAjaxsFalse(url, reqData, policyDetail);
}
mui('.man-div-title ul').on('tap', 'li', function() {
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$(this).addClass('li_xuan');
	flag = $(this).attr('flag');
	list(userCode, transToken, customerId, commodityCommId, flag);
})
/*保留后2位*/
function toDecimal2(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + 2) {
		s += '0';
	}
	return s;
}
/*登录失效*/
function lognCont() {
	loginControl();
}