var agentId = '';
var transToken = '';
var userCode = '';
var customerId = "";
var parm = '';
var code = '';
var data = '';
$(function() {
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	agentId = urlParm.agentId;
	customerId = urlParm.customerId;
	userCode = urlParm.userCode;
	transToken = urlParm.transToken;
	$.init();
	$.setscroll();
});
$.init = function() {
	datalist()
	$(".h_back").unbind("tap").bind("tap", function() {
		window.location.href = base.url + 'myCommission.html'; //由移动原生监控
	})
	$(".popupshow").unbind("tap").bind("tap", function() {
		$(".popup").show();
	});

	$(".pophide").unbind("tap").bind("tap", function() {
		$(".popup").hide(1000);
	});
	$.getCommission();
	$.getYearandMonth();
}
/*默认获取前一个月的佣金信息*/
function datalist() {
	var url = base.url + "agent/getMyCommission.do"
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"loggingCustomerId": customerId,
			'insuredId': customerId,
			"date": datetimes(),
		}
	}
	$.reqAjaxsFalse(url, reqData, function(datas) {
		console.log(datas);
		if(datas.status_code == '000000') {
			data = datas;
		} else {
			modelAlert(datas.status_message);
		}
	});
}
/*按照时间来获取*/
function datelist(date) {
	var url = base.url + "agent/getMyCommission.do"
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"loggingCustomerId": customerId,
			'insuredId': customerId,
			"date": date,
		}
	}
	$.reqAjaxsFalse(url, reqData, function(datas) {
		console.log(datas);
		if(data.status_code == '000000') {
			data = datas;
		} else {
			modelAlert(data.status_message);
		}
	});
}
/**
 * @function 获取已发放佣金总额
 * 
 */
$.getCommission = function() {

	if(data.status_code == '000000') {
		if(data.returns.allCommission != null && data.returns.allCommission != "") {
			$('#myCommission').text(toDecimal2(data.returns.allCommission))
		} else {
			$('#myCommission').text('--.--')
		}
	} else {
		modelAlert(data.status_message);
	}
}
/**
 * @function 获取发放月份列表
 * 
 */
$.getYearandMonth = function() {
	if(data.status_code == '000000') {
		var dateLongList = data.returns.commissionCollectPolicRg;
		if(dateLongList && dateLongList.length != 0) {
			var lastYear = dateLongList[0].tjYears;
			var lastMonth = dateLongList[0].tjMonth;
			var yearAndMonth = lastYear + '-' + lastMonth;
			$('#choosedate').text(yearAndMonth)
			$.getLastCommission(lastYear, lastMonth);
			$.getLastCommissionList(lastYear, lastMonth);
			commissionDetail(lastYear, lastMonth);
			var dateObj = [];
			for(var i = 0; i < dateLongList.length; i++) {
				var dateValue = {
					value: 'date' + i,
					text: dateLongList[i].tjYears + '-' + dateLongList[i].tjMonth
				}
				dateObj.push(dateValue);
			}
			$('#yearAndMonth').unbind('tap').bind('tap', function() {
				var selectPicker = new mui.PopPicker();
				selectPicker.setData(dateObj);
				selectPicker.show(function(item) {
					var dateArray = item[0].text.split('-');
					var yearPick = dateArray[0];
					var monthPick = dateArray[1];
					$('#choosedate').text(item[0].text)
					$.getLastCommission(yearPick, monthPick);
					$.getLastCommissionList(yearPick, monthPick);
					commissionDetail(yearPick, monthPick);
				});
			});
		}
	} else {
		modelAlert(data.status_message)
	}
}
/**
 * @function 获取本月应发
 * 
 */
$.getLastCommission = function(year, month) {
	var date = year + '-' + month;
	datelist(date)
	console.log(data);
	if(data.status_code == '000000') {
		if(!$.isEmptyObject(data.returns)) {
			code = data.returns.commissionCollectRg.insuredCode;
		} else {
			//code = "";
		}
		if(data.returns.commissionCollectRg) {
			$('#originalCommissionTotal').text(toDecimal2(data.returns.commissionCollectRg.originalCommissionTotal))
			$('#actualCommissionTotal').text(toDecimal2(data.returns.commissionCollectRg.actualCommissionTotal ? data.returns.commissionCollectRg.actualCommissionTotal : 0))
			$('#taxesTotal').text(toDecimal2(data.returns.commissionCollectRg.taxesTotal ? data.returns.commissionCollectRg.taxesTotal : 0))
		} else {
			$('#originalCommissionTotal').text("--.--")
			$('#actualCommissionTotal').text("--.--")
			$('#taxesTotal').text("--.--")
		}
	} else {
		$('#originalCommissionTotal').text("--.--")
		$('#actualCommissionTotal').text("--.--")
		$('#taxesTotal').text("--.--")
	}

}
/**
 * @function 获取保单佣金详情
 * 
 */
$.getLastCommissionList = function(year, month) {
	var date = year + '-' + month;
	datelist(date)
	console.log(data);
	if(data.status_code == '000000') {
		var listStr = '';
		var policyComCollect = data.returns.commissionCollectPolicRg;
		if(policyComCollect && policyComCollect.length != 0) {
			for(var i = 0; i < policyComCollect.length; i++) {
				listStr += '<div class="content-wrap" ><div class="cm-title"><div class="cm-title-wrap">'
				listStr += '<span class="productName blueColor">' + policyComCollect[i].riskName + '</span>'
				if(policyComCollect[i].riskClassBig == "寿险") {
					listStr += '<span class="policyNumber"><img src="../../image/account/shouxian.png"></span>'
				} else if(policyComCollect[i].riskClassBig == "财险" || policyComCollect[i].riskClassBig == "财产险") {
					listStr += '<span class="policyNumber"><img src="../../image/account/caixian.png"></span>'
				}

				listStr += '</div></div><div class="cm-body"><div class="cm-body-wrap">'
				listStr += '<div class="cm-split policy-split-2"><div class="info-up">' + toDecimal2(policyComCollect[i].premium) + '元/年</div><div class="info-down">保险费(元)</div></div>'
				listStr += '<div class="cm-split policy-split-3"><div class="info-up">' + toDecimal2(policyComCollect[i].commissionTotal) + '</div><div class="info-down">佣金(元)</div></div>'
				listStr += '</div></div><div class="cm-footer"><div class="cm-date">保单号：' + policyComCollect[i].policyNo + '</div></div></div>'
			}
		} else {
			listStr = '<div id="noRecord" class="noRecord"><div class="noRecordimg"><img src="../../image/gzpt_noRecord.png"></div><div class="noRecordfont">没有相关记录</div></div>';
		}
		$('.commissionDetail').html(listStr);
	}
}
/**
 * @function 获取个人佣金明细
 * 
 */
function commissionDetail(tjYears, tjMonth) {
	var date = tjYears + '-' + tjMonth;
	datelist(date)
	console.log(data);
	if(data.status_code == "000000") {
		var dataReturn = data.returns.commissionCollectRg;
		if(dataReturn && dataReturn.length != 0) {
			var lifeBase = dataReturn.lifeBaseCommission; //寿险首年基础佣金
			var lifeArea = dataReturn.lifeAreaCommission; //寿险首年奖励佣金
			var lifeRenewal = dataReturn.lifeRenewalCommission; //寿险续年佣金
			var lifeCompetition = dataReturn.lifeCompetitionCommission; //寿险竞赛佣金
			var propertyl = dataReturn.propertylCommission; //财产险佣金
			var propertylCompetition = dataReturn.propertylCompetitionCommission; //财险竞赛佣金
			var otherAdjust = dataReturn.otherAdjustCommission; //其他调整
			var originalTotal = dataReturn.originalCommissionTotal; //合计	
			$("#lifeBase").text(toDecimal2(lifeBase));
			$("#lifeArea").text(toDecimal2(lifeArea));
			$("#lifeRenewal").text(toDecimal2(lifeRenewal));
			$("#lifeCompetition").text(toDecimal2(lifeCompetition));
			$("#propertyl").text(toDecimal2(propertyl));
			$("#propertylCompetition").text(toDecimal2(propertylCompetition));
			$("#otherAdjust").text(toDecimal2(otherAdjust));
			$("#originalTotal").text(toDecimal2(originalTotal));
		} else {
			$("#lifeBase").text("0.00");
			$("#lifeArea").text("0.00");
			$("#lifeRenewal").text("0.00");
			$("#lifeCompetition").text("0.00");
			$("#propertyl").text("0.00");
			$("#propertylCompetition").text("0.00");
			$("#otherAdjust").text("0.00");
			$("#originalTotal").text("0.00");
		}
	} else {
		modelAlert("系统异常！");
		return false;
	}
}
$.reqAjaxsFalse = function(url, requestData, callBack) {
	var requestJson = aesEncrypt(JSON.stringify(requestData), secretKey, secretKey);
	requestJson = URLencodeForBase64(requestJson);
	$.ajax({
		url: url,
		type: 'POST',
		data: "jsonKey=" + requestJson,
		dataType: "json",
		timeout: 60000,
		success: function(data) {
			$(".ajax_prevent").remove(); // 去除遮罩
			if(!$.isNull(callBack)) {
				callBack(data);
			}
		},
		error: function(data) {
			$(".ajax_prevent").remove(); // 去除遮罩
			modelAlert("网络好像开小差了呢，请设置给力一点儿网络吧！");
		},
		beforeSend: function(xhr) {
			$.ajaxPrevent();
		},
		async: false,
	});
};

/**
 * @function 设置滚动区域
 * @parm null
 * 
 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight + "px");
	mui("#order_index").scroll();
};

function datetimes() {
	function p(s) {
		return s < 10 ? '0' + s : s;
	}
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	//获取当前日
	var date = myDate.getDate();
	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();

	var now = year + '-' + p(month - 1) + "-" + p('15');

	return now;
}

function backlast() {
	sysback();
}