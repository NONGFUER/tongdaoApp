mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	riskType = null,
	transToken = urlParm.transToken,
	policyStatus = null,
	customerId = urlParm.customerId;
/*if(riskType == "") {
	riskType = null;
}
if(policyStatus == "") {
	policyStatus = null;
}*/
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
	xinzhen(userCode, transToken, customerId, policyStatus, riskType)
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

})

function getPolicyList(data) {
	console.log(data);
	var datas = new Array();
	if(data.status_code == '000000') {
		if(data.returns.length > 0) {
			data.returns.forEach(function(index, element) {
				datas.push(index);
				if(index.underWrite != null && index.underWrite != "") {
					if(index.underWrite.time != null && index.underWrite.time != "" && index.prem != "" && index.prem != null) {
						datas[element].underWrite = ($.getTimeStr2(index.underWrite.time));
						datas[element].prem = toDecimal2(datas[element].prem);
					}
				} else {
					datas[element].underWrite = ("----");
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
}

mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function xinzhen(userCode, transToken, customerId, policyStatus, riskType) {
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
	var url = base.url + 'agent/getAgentPolicy.do';
	$.reqAjaxs(url, reqData, getPolicyList);
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
	var url = base.url + 'agent/deleteAgentPolicy.do';
	$.reqAjaxs(url, reqData, deleteMyPolicy);
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
/*壳上调用的方法*/
function mylist(userCode, transToken, customerId, policyStatus, riskType) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	riskType = riskType;
	policyStatus = policyStatus;
	if(policyStatus == '') {
		policyStatus = null;
	}
	if(riskType == '') {
		riskType = null;
	}
	xinzhen(userCode, transToken, customerId, policyStatus, riskType);
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var policyStatus = $(this).attr('policyStatus');
		if(policyStatus == '') {
			policyStatus = null;
		}
		xinzhen(userCode, transToken, customerId, policyStatus, riskType);
	})
}

mui('.man-div-title ul').on('tap', 'li', function() {
	$('.man-div-title ul').children('li').removeClass('li_xuan');
	$(this).addClass('li_xuan');
	var policyStatus = $(this).attr('policyStatus');
	if(policyStatus == '') {
		policyStatus = null;
	}
	xinzhen(userCode, transToken, customerId, policyStatus, riskType);
})
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}