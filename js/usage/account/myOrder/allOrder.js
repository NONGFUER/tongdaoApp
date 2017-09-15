/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	idAuth=urlParm.idAuth,
	orderStatus = urlParm.orderStatus,
	tagId = urlParm.tagId,
	provinceCode = urlParm.provinceCode,
	cityCode = urlParm.cityCode,
	riskType = urlParm.riskType,
	orderStatus = null,
	tagId = null,
	customerId = urlParm.customerId;
if(tagId == "全部") {
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
	/*立即支付*/
	mui('.man-div-body-ul').on('tap', '#liji', function() {
		var orderNo = $(this).attr('orderNo');
		var policyNo= $(this).attr('policyNo');
		var riskType = $(this).attr('risktype');
		var insureNo = $(this).attr('insureNo');
		var commodityCombinationId = $(this).attr('commodityCombinationId');
		var orderStatus = $(this).attr('orderStatus');
		var commodityName=$(this).attr('commodityName');
		if(commodityCombinationId == '4') {
			var productFlag='01';
		}else{
			var productFlag='02';
		}
		var param = {
			"userCode": userCode,
			"mobile": userCode,
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo":insureNo,
			"riskType": riskType,
			"riskSupportAbility":riskType,
			"commodityCombinationId": commodityCombinationId,
			"commodityComId":commodityCombinationId,
			"customerId": customerId,
			"commodityId":commodityCombinationId,
			"transToken": transToken,
			"orderStatus": orderStatus,
			"idAuth":idAuth,
			"productFlag":productFlag,
			"cxflag": '1',
			"tagId": tagId,
			"title": commodityName,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		if(riskType == '03') {
			if(orderStatus == '01') {
				window.location.href = base.url + "tongdaoApp/html/insurance/car/quotationDetail.html?jsonKey=" + jsonStr;
			} else {
				window.location.href = base.url + "tongdaoApp/html/insurance/car/orderDetail.html?jsonKey=" + jsonStr;
			}
		} else if(riskType == '01') {
			window.location.href = "orderInfo.html?jsonKey=" + jsonStr;
		} else if(riskType == '04') {
			mui.alert('寿险');
		} else if(riskType == '02') {
			window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
		}

		return false;
	})
	/*再次购买*/
	mui('.man-div-body-ul').on('tap', '#zaici', function() {
		var orderStatus = $(this).attr('orderStatus');
		var commodityCombinationId = $(this).attr('commodityCombinationId');
		var name = $(this).attr('name');
		var commodityName = $(this).attr('commodityName');
		var riskType=$(this).attr('risktype');
		var orderNo = $(this).attr('orderNo');
		var policyNo= $(this).attr('policyNo');
		var insureNo = $(this).attr('insureNo');
		if(commodityCombinationId == '4') {
			var productFlag='01';
		}else{
			var productFlag='02';
		}
		var param = {
			"userCode": userCode,
			"mobile": userCode,
			"orderNo": orderNo,
			"policyNo": policyNo,
			"roleType": roleType,
			"insureNo":insureNo,
			"customerId": customerId,
			"transToken": transToken,
			"orderStatus": orderStatus,
			"idAuth":idAuth,
			"productFlag":productFlag,
			"idNo": "",
			"riskType": riskType,
			"ccId": commodityCombinationId,
			"commodityComId":commodityCombinationId,
			"commodityCombinationId": commodityCombinationId,
			"ccCode": "",
			"cityCode": cityCode,
			"provinceCode": provinceCode,
			"cxflag": '1',
			"tagId": tagId,
			"title": '产品详情',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		if(riskType == '01') {
			if(commodityCombinationId == '14') {
				window.location.href = base.url + "tongdaoApp/html/insurance/ghx/ghxProductDetail.html?jsonKey=" + jsonStr;
			} else if(commodityCombinationId == '15') {
				window.location.href = base.url + "tongdaoApp/html/insurance/jiachengxian/zhuanqu.html?jsonKey=" + jsonStr;
			} else {
				window.location.href = base.url + "tongdaoApp/html/insurance/main/productDetail.html?jsonKey=" + jsonStr;
			}
		} else if(riskType == '03') {

		}else if(riskType=='02'){
			window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
		}
		return false;
	})
	mui('.man-div-body-ul').on('tap', '.man-div-body-ul_li', function() {
		var orderNo = $(this).attr('orderNo');
		var policyNo= $(this).attr('policyNo');
		var riskType = $(this).attr('risktype');
		var insureNo = $(this).attr('insureNo');
		var commodityCombinationId = $(this).attr('commodityCombinationId');
		var orderStatus = $(this).attr('orderStatus');
		if(commodityCombinationId == '4') {
			var productFlag='01';
		}else{
			var productFlag='02';
		}
		var param = {
			"userCode": userCode,
			"mobile": userCode,
			"orderNo": orderNo,
			"policyNo": policyNo,
			"insureNo":insureNo,
			"riskType": riskType,
			"commodityCombinationId": commodityCombinationId,
			"commodityComId":commodityCombinationId,
			"customerId": customerId,
			"transToken": transToken,
			"orderStatus": orderStatus,
			"idAuth":idAuth,
			"productFlag":productFlag,
			"cxflag": '1',
			"tagId": tagId,
			"title": '产品详情',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(param));
		if(riskType == '03') {
			if(orderStatus == '01') {
				window.location.href = base.url + "tongdaoApp/html/insurance/car/quotationDetail.html?jsonKey=" + jsonStr;
			} else {
				window.location.href = base.url + "tongdaoApp/html/insurance/car/orderDetail.html?jsonKey=" + jsonStr;
			}
		} else if(riskType == '01') {
			window.location.href = "orderInfo.html?jsonKey=" + jsonStr;
		} else if(riskType == '04') {
			mui.alert('寿险');
		} else if(riskType == '02') {
			window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyDetail.html?jsonKey=" + jsonStr;
		}
	})

})

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
			"channel": "01",
			"transToken": transToken
		}
	}
	var url = base.url + 'personal/getOrderList.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxs(url, reqData, getOrderList);
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