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
	/*mounted() {
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
	}*/
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
				datas[key].money = toDecimal2(datas[key].money);
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
	vm.$nextTick(function() {
		chuli();
	})
	/*mui('.man-div-body-ul').on('tap', 'li', function() {
		var policyNo = $(this).attr('policyNo');
		var insureNo = $(this).attr('insureNo');
		var orderNo = $(this).attr('orderNo');
		var reqData = {
			"userCode":userCode,
			"policyNo":policyNo,
			"insureNo":insureNo,
			"transToken":transToken,
			"channel":'01',
			"commodityComId":commodityCommId,
			"customerId":customerId,
			"title":'交易详情',
			"leixing":'jiaoyi',
			"orderNo":orderNo,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/orderDetails.html?jsonKey=" + jsonStr;
	})*/
}

function chuli() {
	$('.man-div-body-ul_li').each(function() {
		if($(this).attr('orderStatus') == '购买处理中') {
			$(this).removeClass('huangseli');
			$(this).addClass('lanseli');
		}else if($(this).attr('orderStatus') == '购买成功') {
			$(this).removeClass('huangseli');
			$(this).addClass('lanseli');
		}else if($(this).attr('orderStatus') == '购买失败') {
			$(this).removeClass('lanseli');
			$(this).removeClass('huangseli');
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '领取成功') {
			$(this).removeClass('lanseli');
			$(this).addClass('huangseli');
		} else if($(this).attr('orderStatus') == '领取失败') {
			$(this).removeClass('lanseli');
			$(this).removeClass('huangseli');
			$(this).addClass('huiseli');
		} else if($(this).attr('orderStatus') == '领取处理中') {
			$(this).removeClass('lanseli');
			$(this).addClass('huangseli');
		}
	})
}

function panding(insureSurrender, orderStatus) {
	if(insureSurrender == '1') {
		if(orderStatus == '01') {
			return '购买失败';
		}else if(orderStatus == '02'){
			return '购买失败';
		}else if(orderStatus == '03') {
			return '购买失败';
		} else if(orderStatus == '08' || orderStatus == '13') {
			return '购买处理中';
		} else if(orderStatus == '05') {
			return '购买处理中';
		} else if(orderStatus == '09') {
			return '购买成功';
		} else if(orderStatus == '10') {
			return '购买成功';
		} else if(orderStatus == '11') {
			return '购买失败';
		}
	} else if(insureSurrender == '2') {
		if(orderStatus == '01') {
			return '领取成功';
		} else if(orderStatus == '02') {
			return '领取失败';
		} else if(orderStatus == '03') {
			return '领取处理中';
		} /*else if(orderStatus == '04') {
			return '赎回试算成功';
		} else if(orderStatus == '05') {
			return '赎回试算失败';
		}*/
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
	flag = '1';
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
	$.reqAjaxs(url, reqData, policyDetail);
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