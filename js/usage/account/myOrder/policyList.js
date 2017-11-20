mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	roleType = urlParm.roleType,
	idAuth = urlParm.idAuth,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	tagId = urlParm.tagId,
	policyStatus = null,
	riskType = null;
if(riskType == "") {
	riskType = null;
}
if(policyStatus == "") {
	policyStatus = null;
}
if(tagId == "") {
	tagId = null;
}

var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {},
	}
	/*,
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
		}*/
})

$(function() {
	if(idAuth == '0') {
		$('.shiming').show();
		mui('.shiming').on('tap', '.right_shiming', function() {
			register();
		})
	}
	xinzhen(userCode, transToken, customerId, policyStatus, riskType, tagId)
	mui('#list').on('tap', '.mui-btn', function() {
		var elem = this;
		var li = elem.parentNode.parentNode;
		var policyNo = $(elem).attr('policyNo');
		mui.confirm('确认删除该保单吗？', '', ['确认', '取消'], function(e) {
			if(e.index == 0) {
				shanchu(userCode, transToken, customerId, policyNo)
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	})
	mui('.man-div-body-ul ').on('tap', '.man-div-body-ul_li', function() {
		var riskType = $(this).attr('riskType');
		var policyNo = $(this).attr('policyNo');
		var orderNo = $(this).attr('orderNo');
		var insureNo = $(this).attr('insureNo');
		var commodityId = $(this).attr('commodityId');
		var param = {
			"userCode": userCode,
			"mobile": userCode,
			"policyNo": policyNo,
			"orderNo": orderNo,
			"roleType": roleType,
			"customerId": customerId,
			"transToken": transToken,
			"policyStatus": policyStatus,
			"commodityComId": commodityComId,
			"cxflag": '2',
			"tagId": tagId,
			"title": '保单详情',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		if(riskType == '03') {
			window.location.href = base.url + "tongdaoApp/html/insurance/car/orderDetail.html?jsonKey=" + jsonStr;
		} else if(riskType == '01') {
			if(commodityId != '17') {
				window.location.href = "policyInfo.html?jsonKey=" + jsonStr;
			}
		} else if(riskType == '02') {
			window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyDetail.html?jsonKey=" + jsonStr;
		}
	})
})

function getPolicyList(data) {
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
				if(index.prem != null && index.prem != "") {
					datas[element].prem = toDecimal2(datas[element].prem);
				} else {
					datas[element].prem = '0.00';
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
	vm.$nextTick(function() {
		chuli();
	})
}

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function xinzhen(userCode, transToken, customerId, policyStatus, riskType, tagId) {
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
			"policyStatus": policyStatus,
			"riskType": riskType,
			"tagId": tagId,
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
}
/*删除*/
function shanchu(userCode, transToken, customerId, policyNo) {
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
			"policyNo": policyNo,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'personal/deleteMyPolicy.do';
	$.reqAjaxsFalse(url, reqData, deleteMyPolicy);
}

function deleteMyPolicy(data) {
	if(data.status_code == '000000') {
		modelAlert('删除成功');
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, "", lognCont);
	} else {
		modelAlert(data.status_message);
	}

}

function chuli() {
	$('.baozhang').each(function() {
		if($(this).html() == '待生效') {
			$(this).attr('class', 'baozhang dai');
		} else if($(this).html() == '保障中') {
			$(this).attr('class', 'baozhang bao');
		} else if($(this).html() == '已过期') {
			$(this).attr('class', 'baozhang yilingqu');
		}
	})
}

function mylist(userCode, transToken, customerId, tagId, policyStatus) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	riskType = null;
	policyStatus = policyStatus;
	tagId = tagId;
	if(policyStatus == '') {
		policyStatus = null;
	}
	if(tagId == '全部') {
		tagId = null;
	}
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$('.man-div-title ul').find('li').eq(0).addClass('li_xuan');
	xinzhen(userCode, transToken, customerId, policyStatus, riskType, tagId);
	mui('.man-div-title ').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var policyStatus = $(this).attr('policyStatus');
		if(policyStatus == "") {
			policyStatus = null;
		}
		xinzhen(userCode, transToken, customerId, policyStatus, riskType, tagId)
	})
}
mui('.man-div-title ').on('tap', 'li', function() {
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$(this).addClass('li_xuan');
	var policyStatus = $(this).attr('policyStatus');
	if(policyStatus == "") {
		policyStatus = null;
	}
	xinzhen(userCode, transToken, customerId, policyStatus, riskType, tagId)
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
/*未实名*/
function register() {
	registerControl();
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}