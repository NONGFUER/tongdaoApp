mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	agentCode=urlParm.agentId,
	postcardField = urlParm.postcardField;
/*	insuranceConsultantId=urlParm.insuranceConsultantId;*/

/*var transToken = 'transToken',
	userCode = '13800000000',
	insuranceConsultantId = '1',
	postcardField='1',
	customerId = '8';*/

var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {},
		urlimg:{},
	}
})
$(function() {
	vm.urlimg=base.url;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"customerId": customerId
		}
	}
	var url = base.url + 'insuranceConsultantInfo/getInsuranceConsultantInfos.do';
	console.log(reqData);
	$.reqAjaxsFalse(url, reqData, getInsuranceConsultantInfos);
	/*添加顾问*/
	$(".tianjia").unbind("tap").bind("tap", function() {
		$('.note').show();
		$('.queding').unbind("tap").bind("tap", function() {
			var postcardPhone = $('#yan').val();
			if(postcardPhone != null && postcardPhone != "") {
				if(tit.regExp.isMobile(postcardPhone) == false) {
					modelAlert("请输入正确的手机号码！");
				} else {
					chaxun(userCode, transToken, postcardPhone);
				}
			} else {
				modelAlert('顾问手机号不能为空');
			}
		})
		$('.quxiao').unbind("tap").bind("tap", function() {
			$('.note').hide();
		})
	})
	mui('.man-div-body-ul ').on('tap', '.man-div-body-li', function() {
		$('.man-div-body-li').children('.xuan').attr('style', 'opacity:0');
		$(this).children('.xuan').attr('style', 'opacity:1');
	})
})
/*查询保险人和保险顾问地区是否一致*/
function chaxun(userCode, transToken, postcardPhone) {
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"Phone": postcardPhone
		}
	}
	var url = base.url + 'insuranceConsultantInfo/getInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxsFalse(url, reqData, getInsuranceConsultantInfo);
}
/*新增保险顾问*/
function xinzeng(userCode, transToken, customerId, insuranceConsultantId) {
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"insuranceConsultantId": insuranceConsultantId,
			"customerId": customerId
		}
	}
	var url = base.url + 'insuranceConsultantInfo/updateInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxsFalse(url, reqData, updateInsuranceConsultantInfo);
}

/*页面信息*/
function getInsuranceConsultantInfos(data) {
	console.log(data)
	if(data.statusCode == '000000') {
		if(data.returns.insuranceConsultantInfos.length > 0) {
			vm.Objectitle = data.returns.insuranceConsultantInfos;
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		modelAlert(data.statusMessage)
	}
}
/*新增保险顾问*/
function updateInsuranceConsultantInfo(data) {
	modelAlert("添加保险顾问成功", "", backlast);
}
/*查询判断保险顾问地区*/
function getInsuranceConsultantInfo(data) {
	console.log(data);
	if(data.returns.insuranceConsultantInfo!= null && data.returns.insuranceConsultantInfo!= "") {
		if(data.returns.insuranceConsultantInfo.agentId != null && data.returns.insuranceConsultantInfo.agentId != "") {
			var diqu = data.returns.insuranceConsultantInfo.agentId;
			var insuranceConsultantId = data.returns.insuranceConsultantInfo.customerId;
			if(diqu == agentCode) {
				xinzeng(userCode, transToken, customerId, insuranceConsultantId);
			}else{
				modelAlert('保险顾问服务地区不符','',guanbi);
			}
		} else {
			modelAlert('您输入的不是保险顾问手机号');
		}
	} else {
		modelAlert('您输入的不是保险顾问手机号');
	}
}
/*点击关闭*/
$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
})

function guanbi() {
	$('#yan').val('');
	$('.note').hide()
}

/*登录失效*/
function lognCont() {
	loginControl();
}
/*返回*/
function backlast() {
	sysback();
}