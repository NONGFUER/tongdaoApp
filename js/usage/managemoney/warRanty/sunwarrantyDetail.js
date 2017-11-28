mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	cxflag=urlParm.cxflag,
	title = urlParm.title,
	ccName=urlParm.ccName,
	commodityId=urlParm.commodityId,
	orderNo = urlParm.orderNo;
var channel = urlParm.channel;
var commodityComId = urlParm.commodityCombinationId;
if(typeof(commodityComId) == 'undefined') {
	commodityComId = urlParm.commodityComId;
}
if(typeof(commodityComId) == 'undefined') {
	commodityComId = "";
}
if(channel == '' || channel == null) {
	channel = '01';
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			bxPolicyFinance: {},
		},
		Objecbody: null,
		baozhang: null,
		returnVisit: {},
		commodityComId: "",
		channel: "",
		ccName:'',
		bdjiazhi:'',
		dianzibaodan:'',
	},
/*	mounted() {
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
	}*/
})
$(function() {
	vm.ccName=ccName;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"customerId": customerId+'',
		}
	}
	var url = base.url + 'ygBasic/ygPolicyQueryInfo.do';
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	/*保单价值*/
	var reqDatas = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"orderNo":orderNo,
			"customerId":customerId+'',
		}
	}
	var urls = base.url + 'ygRedemption/getYgPolicyValue.do';
	$.reqAjaxsFalse(urls, reqDatas, getYgPolicyValue);
	/*电子保单*/
	var reqDatadian = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"orderNo":orderNo,
			"customerId":customerId+'',
		}
	}
	var urldian = base.url + 'ygBasic/getYgDownloadUrl.do';
	$.reqAjaxsFalse(urldian, reqDatadian, getYgDownloadUrl);
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = vm.dianzibaodan;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var reqData = {
			"commodityCombinationId": commodityComId + "",
			"ccId":commodityComId+'',
			"userCode": userCode,
			"customerId": customerId,
			"transToken": transToken,
			"insurePhone": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": title,
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/sunshineDetails.html?jsonKey=" + jsonStr;
	})
	vm.commodityComId = commodityComId;
	vm.channel = channel;
})

/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns;
		vm.returnVisit = data.returns.bxPolicyFinance.returnVisit;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	vm.$nextTick(function() {
		chuli();
	})
}
/*保单价值*/
function getYgPolicyValue(data){
	if(data.statusCode == '000000') {
		vm.bdjiazhi=data.returns.policyValue;
	}else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*电子保单*/
function getYgDownloadUrl(data){
	if(data.statusCode == '000000') {
		vm.dianzibaodan=data.returns.DownloadUrl;
	}else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*退保试算*/
function getRedemption(data) {
	if(data.statusCode == '000000') {
		var reqData = {
			"orderNo": orderNo,
			"insureNo": insureNo,
			"policyNo": policyNo,
			"customerId": customerId,
			"commodityComId": commodityComId,
			"userCode": userCode,
			"ccName":ccName,
			"remark":vm.Objectitle.commodityCombination.remark,
			"transTime": "",
			"channel": channel,
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/sunpolicyCancellation.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function chuli() {
	if($('.baozhang').html() == '11') {
		$('.baozhang').html('待生效')
	} else if($('.baozhang').html() == '2') {
		$('.baozhang').html('保障中')
	} else if($('.baozhang').html() == '4') {
		$('.baozhang').html('已领取')
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('#huifang').addClass('huisebtn');
		vm.returnVisit == '1';
	}
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}
	if($('.baozhang').html() != '03' && $('.baozhang').html() != '已领取') {
		mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
			var url = base.url + 'ygRedemption/getYgRedemption.do';
			var reqData = {
				"head": {
					"userCode": userCode,
					"channel": channel,
					"transTime": $.getTimeStr(),
					"transToken": transToken
				},
				"body": {
					"orderNo": orderNo,
					"policyNo": policyNo,
					"insureNo": insureNo,
					"customerId": customerId+'',
				}
			}
			$.reqAjaxsFalse(url, reqData, getRedemption);
		})
		mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
			/*接口请求位子*/
			if(vm.returnVisit == '0' && $('.baozhang').html() != '已领取') {
				var reqData = {
					"userCode": userCode,
					"customerId": customerId,
					"transToken": transToken,
					"insurePhone": userCode,
					"policyNo": policyNo,
					"orderNo": orderNo,
					"leftIco": '1',
					"rightIco": '0',
					"downIco": '0',
					"title": title,
				}
				var jsonStr = UrlEncode(JSON.stringify(reqData));
				window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/returnVisit.html?jsonKey=" + jsonStr;
			} else {
				$('#huifang').addClass('huisebtn');
			}
		})
	}
}
$(".wenhaoico").unbind("tap").bind("tap", function() {
	$('.note').show();
})
$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
})

function backlast() {
	/*if(commodityComId != "" && channel == '01'&&cxflag!='2'&&cxflag!='3'&&cxflag!='10') {
		var sendData = {
			"userCode": userCode,
			"commodityComId": commodityComId,
			"flag": '',
			"pageNo": '',
			"customerId": customerId,
			"transToken": transToken,
			"title": '保单列表',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '1',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyList.html?jsonKey=" + jsonStr;
	} else {
		if(channel == '01'&&cxflag=='2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyList.html?jsonKey=" + jsonStr;
		}else if(channel == '02'&&cxflag=='2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyListWeChat.html?jsonKey=" + jsonStr;
		}else if(cxflag=='3'){
			urlParm.title = '我的出单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/mysingle.html?jsonKey=" + jsonStr;
		}else if(cxflag=='10'){
			urlParm.title = '我的出单';
			urlParm.downIco = '0';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/teaMmysingle.html?jsonKey=" + jsonStr;
		}
	}*/
	sysback();
}
/*登录失效*/
function lognCont() {
	loginControl();
}