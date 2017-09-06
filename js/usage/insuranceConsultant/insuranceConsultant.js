mui.init();
/*获取数据*/
/*var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	postcard=urlParm.postcardField,
	postcardFieid=urlParm.postcardFieid;*/
	
var transToken = 'transToken',
	userCode = '13800000000',
	insuranceConsultantId = '1',
	postcardField='1',
	customerId = '8';

var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {}
	}
})
$(function() {
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
		$('.note-div-btn').unbind("tap").bind("tap", function() {
			var postcardPhone=$('#yan').val();
			if(postcardPhone!=null&&postcardPhone!=""){
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(postcardPhone))){
					chaxun(userCode, transToken, postcardPhone, insuranceConsultantId);
				}else{
					modelAlert('请输入正确的手机号');
				}
			}else{
				modelAlert('顾问手机号不能为空');
			}
			
		})
	})
	mui('.man-div-body-ul ').on('tap', '.man-div-body-li', function() {
		$('.man-div-body-li').children('.xuan').attr('style', 'opacity:0');
		$(this).children('.xuan').attr('style', 'opacity:1');
	})
})
/*查询保险人和保险顾问地区是否一致*/
function chaxun(userCode, transToken, postcardPhone, insuranceConsultantId) {
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"postcardPhone": postcardPhone
		}
	}
	var url = base.url + 'insuranceConsultantInfo/getInsuranceConsultantInfo.do';
	console.log(reqData);
	$.reqAjaxsFalse(url, reqData, getInsuranceConsultantInfo);
}
/*新增保险顾问*/
function xinzeng(userCode, transToken, customerId, insuranceConsultantId){
	var reqData = {
		"head": {
			"channel": "1",
			"transTime": $.getTimeStr(),
			"transToken": transToken,
			"userCode": userCode
		},
		"body": {
			"insuranceConsultantId": insuranceConsultantId,
			"customerId":customerId
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
function updateInsuranceConsultantInfo(data){
	modelAlert("添加保险顾问成功","",guanbi);
}
/*查询判断保险顾问地区*/
function getInsuranceConsultantInfo(data) {
	if(!data.returns.insuranceConsultantInfo.postcardField){
		var diqu=data.returns.insuranceConsultantInfo.postcardField;
		var insuranceConsultantId=data.returns.insuranceConsultantInfo.customerId;
		if(diqu==postcardField){
			xinzeng(userCode, transToken, customerId, insuranceConsultantId);
		}
	}
}
/*点击关闭*/
$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
})

function guanbi() {
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