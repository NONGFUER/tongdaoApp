/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	riskType = null,
	transToken = urlParm.transToken,
	orderStatus = null,
	tagId = urlParm.tagId,
	customerId = urlParm.customerId;
if(tagId == "") {
	tagId = null;
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null
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
	chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId)
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

function getOrderList(data) {
	console.log(data);
	var datas = new Array();
	if(data.status_code == '000000') {
		if(data.returns.length > 0) {
			data.returns.forEach(function(index, element) {
				datas.push(index);
				if(index.startTime != null && index.startTime != "" && index.endTime != null && index.endTime != "") {
					if(index.startTime.time != null && index.startTime.time != "" && index.endTime.time != null && index.endTime.time != "") {
						datas[element].startTime = ($.getTimeStr2(index.startTime.time));
						datas[element].endTime = ($.getTimeStr2(index.endTime.time));
					}
				} else {
					datas[element].startTime = ("");
					datas[element].endTime = ("");
				}
			})
			vm.Objectlist = datas;
		} else {
			vm.Objectlist = {};
		}
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, '', lognCont);
	} else {
		modelAlert(data.status_message);
	}
}

function chuli() {
	$('.baozhang').each(function() {
		if($(this).html() == '01') {
			$(this).attr('class', 'baozhang');
			$(this).html('未提交核保');
		} else if($(this).html() == '02') {
			$(this).attr('class', 'baozhang');
			$(this).html('已过期');
			$(this).children('.div_btn').html('已关闭');
		} else if($(this).html() == '03') {
			$(this).attr('class', 'baozhang ');
			$(this).html('核保失败');
		} else if($(this).html() == '04') {
			$(this).attr('class', 'baozhang yilingqu');
			$(this).html('核保中');
		} else if($(this).html() == '05') {
			$(this).attr('class', 'baozhang bao');
			$(this).html('核保成功');
			$(this).children('.div_btn').html('待支付');
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
			$(this).children('.div_btn').html('已支付');
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

function mylist(userCode, transToken, customerId, riskType, orderStatus, tagId) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	riskType = riskType;
	orderStatus = orderStatus;
	tagId = tagId;
	if(orderStatus == '') {
		orderStatus = null;
	}
	if(riskType == '') {
		riskType = null;
	}
	chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId);
	mui('.man-div-title ').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var orderStatus = $(this).attr('orderStatus');
		if(orderStatus == "") {
			orderStatus = null;
		}
		chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId)
	})
}

function chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId) {
	var reqData = {
		"body": {
			"channel": "",
			"customerId": customerId,
			"loggingCustomerId": customerId,
			"riskType": riskType,
			"orderStatus": orderStatus,
			'tagId': tagId,
		},
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transToken": transToken
		}
	}
	var url = base.url + 'personal/getOrderList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, getOrderList);
}
mui('.man-div-title ').on('tap', 'li', function() {
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$(this).addClass('li_xuan');
	var orderStatus = $(this).attr('orderStatus');
	if(orderStatus == "") {
		orderStatus = null;
	}
	chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId)
})
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}