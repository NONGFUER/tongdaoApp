mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
var vm = new Vue({
	el: '#order',
	data: {
		tuanduinumber: "0",
		zongmoney: "0",
		objectlist: {},
	}
})

$(function() {
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getCountMyTeam.do';
	$.reqAjaxs(url, reqData, getCountMyTeam);
	var getAmountMyTeamdata = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getAmountMyTeam.do';
	$.reqAjaxs(url, getAmountMyTeamdata, getAmountMyTeam);
	/*↑以上初始化团队总信息*/
	var getMyTeamdata = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getMyTeam.do';
	$.reqAjaxs(url, getMyTeamdata, getMyTeam);
})

function getCountMyTeam(data) {
	console.log(data.returns);
	if(data.status_code == '000000') {
		if(data.returns != null && data.returns != "") {
			vm.tuanduinumber = data.returns;
		} else {
			vm.tuanduinumber = '0';
		}
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, '', lognCont);
	} else {
		modelAlert(data.status_message);
	}
}

function getAmountMyTeam(data) {
	console.log(data);
	if(data.status_code == '000000') {
		if(data.returns != null && data.returns != "") {
			vm.zongmoney = data.returns;
		} else {
			vm.zongmoney = '0';
		}
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, '', lognCont);
	} else {
		modelAlert(data.status_message);
	}
}

function getMyTeam(data) {
	console.log(data);
	var datas = new Array();
	if(data.returns.length > 0) {
		data.returns.forEach(function(index, element) {
			datas.push(index);
			if(index.recentDate != null) {
				datas[element].recentDate = $.getTimeStr2(index.recentDate.time);
			}
		})
		vm.objectlist = datas;
		mui('.personList').on('tap', '.content-wrap', function() {
			var customerIds = $(this).attr('customerId');
			urlParm.channel = '02';
			urlParm.riskType = null;
			urlParm.userCode = userCode;
			urlParm.policyStatus = null;
			urlParm.logincustomerId = customerId;
			urlParm.customerId = customerIds;
			urlParm.title='我的出单';
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/teaMmysingle.html?jsonKey=" + jsonStr;
		})
	} else if(data.status_code == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		if(data.status_message != null && data.status_message != "") {
			modelAlert(data.status_message);
		}
		$('#noRecord').show();
	}
}
Date.prototype.format = function(format) {
	var o = {
		"M + ": this.getMonth() + 1,

		"d + ": this.getDate(),

		"h + ": this.getHours(),

		"m + ": this.getMinutes(),

		"s + ": this.getSeconds(),

		"q + ": Math.floor((this.getMonth() + 3) / 3),

		"S": this.getMilliseconds()

	};
	if(/(y+)/.test(format) || /(Y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

function timestampformat(DATE) {
	return(new Date(DATE.time * 1000)).format("yyyy - MM - dd");
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}