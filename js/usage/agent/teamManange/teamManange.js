mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
/*var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';*/
var vm = new Vue({
	el: '#order_index',
	data: {
		tuanduinumber: {},
		zongmoney: {},
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
	$.reqAjaxsFalse(url, reqData, getCountMyTeam);
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
	$.reqAjaxsFalse(url, getAmountMyTeamdata, getAmountMyTeam);
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
	$.reqAjaxsFalse(url, getMyTeamdata, getMyTeam);
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
				datas[element].recentDate=$.getTimeStr2(index.recentDate.time);
			}
		})
		vm.objectlist = datas;
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
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function backlast() {
	mui.alert(1);
	sysback();
}