/*获取数据*/

var userCode = getUrlQueryString('mobile'),
	shareMobile = getUrlQueryString('shareMobile'),
	customerId = getUrlQueryString('customerId'),
	ccId = getUrlQueryString('ccId'),
	commodityCombinationId = getUrlQueryString('ccId'),
	shareFlag = getUrlQueryString('shareFlag'),
	roleType = getUrlQueryString('roletype'),
	openid = getUrlQueryString('openid'),
	idAuth = '',
	fromtype = 'licai',
	transToken = '';
var jsonKey = getUrlQueryString("jsonKey");
if(jsonKey) {
	var urlParm = JSON.parse(UrlDecode(jsonKey)),
		shareMobile = urlParm.shareMobile,
		commodityCombinationId = urlParm.commodityCombinationId,
		userCode = urlParm.userCode,
		roleType = urlParm.roleType,
		shareFlag=urlParm.shareFlag,
		openid=urlParm.openid,
		transToken = "",
		ccid = urlParm.commodityCombinationId,
		productFlag = urlParm.productFlag,
		idAuth = urlParm.idAuth,
		customerId = urlParm.customerId;
}
if(commodityCombinationId = '4'){
	productFlag = '01';
}else if(commodityCombinationId = '5'){
	productFlag = '02';
}
var phone = phoneyin(userCode);
$('.phone').html(phone);
var ma = null;
var riskSupportAbility = "";
var channel = "";
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			CommCombLinkList: {},
			CommodityCombinationModuleList: {},
			commodityInfo: {},
			commodityCombination: {
				remark: "",
			},
			productInfo: {},
		},
		CommodityCombinationModuleList: {},
		touzizhouqi: {
			youyuqi: {},
			suoding: {},
			chixu: {},
		},
		goumaishuoming: {},
		xiangguanxieyi: {},
		cid: {},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {

			})
		})
	}
})
$(function() {
	adid();
	if(roleType == "" || roleType == "00") {
		$('#huifang').addClass('btnhuise');
	} else if(idAuth == '0') {
		$('#huifang').addClass('btnhuise');
	}
	var reqData = {
		"body": {
			"commodityCombinationId": commodityCombinationId,
			"customerId": customerId,
		},
		"head": {
			"userCode": userCode,
			"channel": "02",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	};
	var url = base.url + 'firstPage/goldProductInfo.do';
	$.reqAjaxs(url, reqData, goldProductInfo);
	mui('.man-div-body-ul_li_div_three').on('tap', '.neirong', function() {
		var urls = $(this).attr('modueinfo');
		urlParm.cId = vm.cid;
		urlParm.frompage = "hongkanghtml";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = urls + "?jsonKey=" + jsonStr;
	})
	/*伸缩按钮*/
	$(".body_title").unbind("tap").bind("tap", function() {
		$(this).children('.jiantou').toggleClass('shangjiantou');
		$(this).siblings('ul').toggle();
	})
	/*点击购买*/
	$("#huifang").unbind("tap").bind("tap", function() {
		if(roleType == "" || roleType == "00") {
			modelAlert('请先登录', '', function() {
				var sendData = {
					"userCode": userCode,
					"shareMobile": shareMobile,
					"customerId": customerId,
					"commodityCombinationId": commodityCombinationId,
					"ccId": ccId,
					"fromtype": 'licai',
					"shareFlag": shareFlag,
					"roleType": roleType,
					"channel":'02',
				}
				var jsonStr1 = JSON.stringify(sendData);
				jsonStr1 = UrlEncode(jsonStr1);
				window.location.href = base.url + "weixin/wxusers/html/users/phoneValidate.html?fromtype = " + fromtype + " & openid = " + openid + " & jsonKey = " + jsonStr1;
			});
		} else if(idAuth == '0') {
			modelAlert('请先实名', '', function() {
				var sendData = {
					"userCode": userCode,
					"shareMobile": shareMobile,
					"customerId": customerId,
					"commodityCombinationId": commodityCombinationId,
					"ccId": ccId,
					"fromtype": 'licai',
					"shareFlag": shareFlag,
					"roleType": roleType,
				}
				var jsonStr1 = JSON.stringify(sendData);
				jsonStr1 = UrlEncode(jsonStr1);
				window.location.href = base.url + "weixin/wxusers/html/users/certification.html?fromtype=" + fromtype + "&openid=" + openid + "&customerId=" + customerId + "&mobile=" + userCode + "&jsonKey=" + jsonStr1;
			});
		} else {
			var reqData = {
				"body": {
					"userPhone": userCode,
					"customerId": customerId,
				},
				"head": {
					"userCode": userCode,
					"channel": "02",
					"transTime": $.getTimeStr(),
					"transToken": transToken
				}
			}
			var url = base.url + 'investmentLinkedInsurance/getRiskAble.do';
			$.reqAjaxs(url, reqData, getRiskAble);
		}
	})
	$(".cancle").unbind("tap").bind("tap", function() {
		$('#shadow').hide();
	})

})
/*购买*/
function buy() {
	var sendData = {
		"riskSupportAbility": $('.retest').attr('testType'),
		"insurePhone": userCode,
		"userCode": userCode,
		"customerId": customerId,
		"transToken": transToken,
		"commodityCombinationId": commodityCombinationId,
		"commodityId": vm.Objectitle.commodityInfo.id + "",
		"testType": $('.retest').attr('testType'),
		"title": vm.Objectitle.commodityCombination.commodityCombinationName,
		"productFlag": productFlag,
		"channel":'02',
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	}
	var jsonStr = JSON.stringify(sendData);
	jsonStr = UrlEncode(jsonStr);
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
}

function goldProductInfo(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns;
		vm.CommodityCombinationModuleList = data.returns.CommodityCombinationModuleList;
		vm.cid = data.returns.commodityInfo.id;
		/*产品基本信息*/
		var cmlist = new Array();
		/*产品投资周期*/
		var touzhi = new Array();
		/*购买详细*/
		var goumai = new Array();
		/*相关协议*/
		var xiangguan = new Array();
		if(vm.CommodityCombinationModuleList.length > 0) {
			vm.CommodityCombinationModuleList.forEach(function(index, element) {
				if(index.moduleName == '产品基本信息') {
					cmlist.push(index);
				}
				if(index.moduleName == '投资周期') {
					touzhi.push(index);
				}
				if(index.moduleName == '购买说明') {
					goumai.push(index);
				}
				if(index.moduleName == '相关协议') {
					xiangguan.push(index);
					xiangguan.forEach(function(value, key) {
						if(xiangguan[key].subModuleName == '保险条款') {
							xiangguan[key].modueInfo = base.url + 'tongdaoApp/html/agreement/article.html';
						}
					})
				}
			})
			vm.CommodityCombinationModuleList = cmlist;
			vm.touzizhouqi = touzhi;
			vm.touzizhouqi.youyuqi = vm.touzizhouqi[0].modueInfo;
			vm.touzizhouqi.suoding = vm.touzizhouqi[1].modueInfo;
			vm.touzizhouqi.chixu = vm.touzizhouqi[2].modueInfo;
			vm.goumaishuoming = goumai[0].modueInfo;
			vm.xiangguanxieyi = xiangguan;
		} else {
			modelAlert(data.statusMessage);
		}
	} else {
		modelAlert(data.statusMessage);
	}
}
/*风险评估*/
function getRiskAble(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		if(data.returns.isRisk == "0" && data.returns.riskble != '5') {
			$('#shadow').show();
			$('.retest').attr('testType', data.returns.riskble);
		} else if(data.returns.isRisk == "0" && data.returns.riskble == '5') {
			$('.retest').attr('testType', data.returns.riskble);
			buy();
		} else if(data.returns.isRisk == "1") {
			var sendData = {
				"head": {
					"userCode": userCode,
					"riskSupportAbility": riskSupportAbility,
					"transToken": transToken
				},
				"body": {
					"returnflag": "",
					"testType": "",
					"mobile": userCode,
					"customerId": customerId,
					"commodityId": vm.Objectitle.commodityInfo.id + "",
					"productCode": userCode,
					"commodityCombinationId": commodityCombinationId,
				},
				"channel":'02',
				"title": '风险评估 ',
				"productFlag": productFlag,
				"titles": vm.Objectitle.commodityCombination.commodityCombinationName,
				"leftIco": '1',
				"rightIco": '0',
				"downIco": '0',
			}
			var jsonStr = UrlEncode(JSON.stringify(sendData));
			window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/riskQuestion.html?jsonKey=" + jsonStr;
		} else if(data.returns.isRisk == "2") {
			modelAlert(data.statusMessage);
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		modelAlert(data.statusMessage, "", lognCont);
	}
}
/*获取用户信息*/
function adid() {
	var url = base.url + "customerBasic/getCustomerBasicInfo.do";
	var sendJson = {
		"head": {
			"channel": "02",
			"userCode": userCode,
			"transTime": $.getTimeStr(),
			"transToken": ""
		},
		"body": {
			"customerId": customerId,
		}
	}
	$.reqAjaxsFalse(url, sendJson, getNameCallback);
}

function getNameCallback(data) {
	if(data.statusCode == '000000') {
		idAuth = data.returns.customerBasic.idAuth;
	} else {
		modelAlert(data.statusMessage);
	}
}
/*隐藏手机号中间几位*/
function phoneyin(userCode) {
	var mphone = userCode.substr(0, 3) + '****' + userCode.substr(7);
	return mphone;
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*未实名*/
function register() {
	registerControl();
}

function backlast() {
	sysback();
}