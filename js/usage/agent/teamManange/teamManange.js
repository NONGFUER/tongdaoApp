mui.init();
/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	commodityComId = urlParm.commodityComId,
	customerPhone = urlParm.customerPhone,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;*/
var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';
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
			"loggingCustomerId": "20",
			"customerId": "20",
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
			"loggingCustomerId": "20",
			"customerId": "20",
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
			"loggingCustomerId": "20",
			"customerId": "20",
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
	vm.tuanduinumber = data.returns;
}

function getAmountMyTeam(data) {
	console.log(data);
	vm.zongmoney = data.returns;
}

function getMyTeam(data) {
	console.log(data);
	var datas = new Array();
	if(data.returns.length > 0) {
		vm.objectlist.$each(function(index, element) {
			datas.push(index);
			datas.recentDate.push(timestampformat(index.recentDate));
		})
		vm.objectlist = datas;
	} else if(data.status_code == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		modelAlert(data.status_code);
		$('#noRecord').show();
	}

}
Date.prototype.format = function(format) {
	var o = {
		"M + ": this.getMonth() + 1,
		// month
		"d + ": this.getDate(),
		// day
		"h + ": this.getHours(),
		// hour
		"m + ": this.getMinutes(),
		// minute
		"s + ": this.getSeconds(),
		// second
		"q + ": Math.floor((this.getMonth() + 3) / 3),
		// quarter
		"S": this.getMilliseconds()
		// millisecond
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
	return(new Date(DATE.time * 1000)).format("yyyy - MM - dd hh: mm: ss");
}
/*登录失效*/
function lognCont() {
	loginControl();
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});