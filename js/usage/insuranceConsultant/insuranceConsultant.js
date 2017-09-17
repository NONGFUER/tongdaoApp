mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	agentId = urlParm.agentId,
	type = urlParm.type,
	postcardField = urlParm.postcardField;
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {},
		urlimg: {},
		dianji: "",
	},
})
$(function() {
	vm.urlimg = base.url;
	if(type == '02' || type == '03' || type == '04' || type == '05' || type == '06') {
		$('.baoxian').hide();
	} //普通01.02代理人、03客户经理 。04.内勤。05 团队 。06.RK
	chaxunend(userCode, transToken, customerId);
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
	mui('#list').on('tap', '.mui-btn', function() {
		var elem = this;
		var li = elem.parentNode.parentNode;
		var insuranceConsultantId = $(elem).attr('insuranceConsultantId');
		var agc = $(elem).attr('agentId');
		mui.confirm('确认删除该保险顾问吗？', '', ['确认', '取消'], function(e) {
			if(e.index == 0) {
				shanchu(userCode, transToken, customerId, insuranceConsultantId, agc);
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	})
	mui('.man-div-body-ul ').on('tap', '.man-div-body-li', function() {
		var isDefault = $(this).attr('isDefault');
		if(isDefault != '01') {
			$('.man-div-body-li').children('.xuan').hide();
			$(this).children('.xuan').show();
			insuranceConsultantId = $(this).attr('insuranceConsultantId');
			qiehuan(userCode, transToken, customerId, insuranceConsultantId);
		}
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
			"phone": postcardPhone
		}
	}
	var url = base.url + 'insuranceConsultantInfo/getInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxs(url, reqData, getInsuranceConsultantInfo);
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
			"insuranceConsultantId": insuranceConsultantId + "",
			"customerId": customerId
		}
	}
	var url = base.url + 'insuranceConsultantInfo/updateInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxs(url, reqData, updateInsuranceConsultantInfo);
}

function qiehuan(userCode, transToken, customerId, insuranceConsultantId) {
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"insuranceConsultantId": insuranceConsultantId + "",
			"customerId": customerId
		}
	}
	var url = base.url + 'insuranceConsultantInfo/updateInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxs(url, reqData, qiehuandata);
}

function qiehuandata(data) {
	chaxunend(userCode, transToken, customerId);
}
/*页面信息*/
function getInsuranceConsultantInfos(data) {
	console.log(data)
	if(data.statusCode == '000000') {
		if(data.returns.insuranceConsultantInfos.length > 0) {
			if(data.returns.insuranceConsultantInfos != null) {
				var datas = new Array();
				data.returns.insuranceConsultantInfos.forEach(function(value, key) {
					datas.push(value);
					var imgs = baoxianimg(datas[key].userPhone);
					if(imgs == null) {
						imgs = "";
					}
					datas[key].postcardWxImage = imgs;
				})
				vm.Objectitle = datas;
			}
		}
		if(type != '02' || type != '03' || type != '04' || type != '05' || type != '06') {
			$('.baoxian').show();
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		modelAlert(data.statusMessage)
	}
}
/*根据手机号查询保险顾问头像*/
function baoxianimg(username) {
	var img = false;
	$.ajax({
		async: false,
		type: "get",
		url: base.url + "customerBasic/getAppImage.do",
		data: "userName=" + username,
		success: function(data) {
			if(data != '' && data != null) {
				img = true;
			} else {
				img = false;
			}
		},
		error: function() {
			img = false;
		}
	});
	if(img) {
		return "customerBasic/getAppImage.do?userName=" + username;
	} else {
		return "";
	}
}
/*新增保险顾问*/
function updateInsuranceConsultantInfo(data) {
	/*chaxunend(userCode, transToken, customerId);*/
	location.reload();
	/*	modelAlert(data.statusMessage, '', guanbi);*/
}
/*查询判断保险顾问地区*/
function getInsuranceConsultantInfo(data) {
	console.log(data);
	if(data.returns.insuranceConsultantInfo != null && data.returns.insuranceConsultantInfo != "") {
		if(data.returns.insuranceConsultantInfo.agentId != null && data.returns.insuranceConsultantInfo.agentId != "") {
			var diqu = data.returns.insuranceConsultantInfo.agentId;
			var insuranceConsultantId = data.returns.insuranceConsultantInfo.id;
			if(diqu == agentId) {
				modelAlert('新增保险顾问成功', '', function() {
					xinzeng(userCode, transToken, customerId, insuranceConsultantId);
				});
			} else {
				modelAlert('保险顾问服务地区不符', '', function() {
					xinzeng(userCode, transToken, customerId, insuranceConsultantId);
				});
			}
		} else {
			modelAlert('您输入的不是保险顾问手机号');
		}
	} else {
		modelAlert('您输入的不是保险顾问手机号');
	}
}
/*删除*/
function shanchu(userCode, transToken, customerId, insuranceConsultantId, agc) {
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"customerId": customerId,
			"insuranceConsultantId": insuranceConsultantId,
			"agentId": agc,
		}
	}
	var url = base.url + 'insuranceConsultantInfo/deleteInsuranceConsultantInfo.do';
	$.reqAjaxs(url, reqData, deleteInsuranceConsultantInfo);
}
/*查询*/
function chaxunend(userCode, transToken, customerId) {
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
	} //普通01.02代理人、03客户经理 。04.内勤。05 团队 。06.RK
	var url = base.url + 'insuranceConsultantInfo/getInsuranceConsultantInfos.do';
	console.log(reqData);
	$.reqAjaxs(url, reqData, getInsuranceConsultantInfos);
}

function deleteInsuranceConsultantInfo(data) {
	console.log(data);
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