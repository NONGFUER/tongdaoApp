/*获取数据*/
var userCode = getUrlQueryString('userCode'),
	shareMobile = getUrlQueryString('shareMobile'),
	customerId = getUrlQueryString('customerId'),
	ccId = getUrlQueryString('ccId'),
	commodityCombinationId = getUrlQueryString('ccId'),
	shareFlag = getUrlQueryString('shareFlag'),
	roleType = getUrlQueryString('roletype'),
	openid = getUrlQueryString('openid'),
	orderStatus = getUrlQueryString('orderStatus'),
	tagId = getUrlQueryString('tagId'),
	channel = getUrlQueryString('channel'),
	idAuth = getUrlQueryString('idAuth'),
	riskType = null,
	fromtype = 'baodan',
	transToken = '';
var jsonKey = getUrlQueryString("jsonKey");
if(jsonKey) {
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
		userCode = urlParm.userCode,
		roleType = urlParm.roleType,
		transToken = urlParm.transToken,
		idAuth = urlParm.idAuth,
		orderStatus = urlParm.orderStatus,
		tagId = urlParm.tagId,
		channel = '02',
		riskType = null,
		orderStatus = null,
		customerId = urlParm.customerId;
}
var shanchucheng = '';
if(tagId == "全部" || tagId == '  ') {
	tagId = null;
}
if(orderStatus == '') {
	orderStatus = null;
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
	if(roleType == "" || roleType == "00") {
		modelAlert('请先登录', '', function() {
			var sendData = {
				"userCode": userCode,
				"shareMobile": shareMobile,
				"customerId": customerId,
				"commodityCombinationId": commodityCombinationId,
				"ccId": ccId,
				"fromtype": '2',
				"shareFlag": shareFlag,
				"roleType": roleType,
				"channel": '02',
			}
			var jsonStr1 = JSON.stringify(sendData);
			jsonStr1 = UrlEncode(jsonStr1);
			window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype=" + fromtype + "&openid=" + openid + "&jsonKey=" + jsonStr1;
		});
	} else if(idAuth == '0') {
		modelAlert('请先实名', '', function() {
			var sendData = {
				"userCode": userCode,
				"shareMobile": shareMobile,
				"customerId": customerId,
				"commodityCombinationId": commodityCombinationId,
				"ccId": ccId,
				"fromtype": '2',
				"shareFlag": shareFlag,
				"roleType": roleType,
			}
			var jsonStr1 = JSON.stringify(sendData);
			jsonStr1 = UrlEncode(jsonStr1);
			window.location.href = base.url + "weixin/wxusers/html/users/certification.html?fromtype=" + fromtype + "&openid=" + openid + "&customerId=" + customerId + "&mobile=" + userCode + "&jsonKey=" + jsonStr1;
		});
	}
	chaxun(userCode, transToken, customerId, riskType, orderStatus, tagId)
	mui('#list').on('tap', '.mui-btn', function() {
		var elem = this;
		var li = elem.parentNode.parentNode;
		var orderNo = $(elem).attr('orderNo');
		mui.confirm('确认删除该保单吗？', '', ['确认', '取消'], function(e) {
			if(e.index == 0) {
				shanchu(userCode, transToken, customerId, orderNo);
				if(shanchucheng == '1') {
					mui.alert('删除成功');
					li.parentNode.removeChild(li);
				}
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	})
	mui('.man-div-body-ul').on('tap', '.man-div-body-ul_li', function() {
		var orderNo = $(this).attr('orderNo');
		var policyNo = $(this).attr('policyNo');
		var riskType = $(this).attr('risktype');
		var insureNo = $(this).attr('insureNo');
		var commodityCombinationId = $(this).attr('commodityCombinationId');
		var orderStatus = $(this).attr('orderStatus');
		if(commodityCombinationId == '4') {
			var productFlag = '01';
		} else {
			var productFlag = '02';
		}
		var param = {
			"userCode": userCode,
			"mobile": userCode,
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo": insureNo,
			"riskType": riskType,
			"commodityCombinationId": commodityCombinationId,
			"commodityComId": commodityCombinationId,
			"customerId": customerId,
			"transToken": transToken,
			"orderStatus": orderStatus,
			"idAuth": idAuth,
			"channel": '02',
			"productFlag": productFlag,
			"cxflag": '1',
			"tagId": tagId,
			"title": '产品详情',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		if(riskType == '03') {
			window.location.href = base.url + "weixin/wxcar/html/carinsure/orderDetail.html?jsonKey=" + jsonStr;
		} else if(riskType == '01') {
			window.location.href = "orderInfo.html?jsonKey=" + jsonStr;
		} else if(riskType == '04') {
			mui.alert('寿险');
		} else if(riskType == '02') {
			window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/orderDetails.html?jsonKey=" + jsonStr;
		}
	})

})

function shanchu(userCode, transToken, customerId, orderNo) {
	var reqData = {
		"body": {
			"channel": "",
			"customerId": customerId,
			"loggingCustomerId": customerId,
			"orderNo": orderNo,
		},
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transToken": transToken
		}
	}
	var url = base.url + 'personal/deleteMyOrder.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, deleteMyOrder);
}

function deleteMyOrder(data) {
	console.log(data);
	if(data.status_code == '000000') {
		shanchucheng = '1';
	} else if(data.status_code == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function getOrderList(data) {
	console.log(data);
	var datas = new Array();
	if(data.status_code == '000000') {
		if(data.returns.length > 0) {
			data.returns.forEach(function(index, element) {
				datas.push(index);
				if(index.prem != "" && index.prem != null) {
					datas[element].prem = toDecimal2(datas[element].prem);
				} else {
					datas[element].prem = '0.00';
				}
				if(index.insertTime != null && index.insertTime != "") {
					if(index.insertTime.time != null && index.insertTime.time != "") {
						datas[element].insertTime = ($.getTimeStr2(index.insertTime.time));
					}
				} else {
					datas[element].insertTime = ("--");
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
		if($(this).html() == '已支付') {
			$(this).attr('class', 'baozhang bao');
		} else if($(this).html() == '待支付') {
			$(this).attr('class', 'baozhang dai');
		} else if($(this).html() == '已关闭') {
			$(this).attr('class', 'baozhang');
		}
	})
}

function mylist(userCode, transToken, customerId, tagId, orderStatus) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	riskType = null;
	orderStatus = orderStatus;
	tagId = tagId;
	if(tagId == "全部") {
		tagId = null;
	}
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
			"channel": channel,
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

function backlast() {
	sysback();
}