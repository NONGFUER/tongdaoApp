mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	cxflag = urlParm.cxflag,
	title = urlParm.title,
	ccName = urlParm.ccName,
	commodityId = urlParm.commodityId,
	orderNo = urlParm.orderNo;
var channel = urlParm.channel;
var commodityComId = urlParm.commodityCombinationId;
if(typeof(commodityComId) == 'undefined') {
	commodityComId = urlParm.commodityComId;
}
if(typeof(ccName) == 'undefined') {
	ccName = urlParm.comComName;
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
			lifeRiskPolicy: {},
		},
		Objecbody: null,
		baozhang: null,
		returnVisit: {},
		commodityComId: "",
		channel: "",
		ccName: '',
		bdjiazhi: '',
		dianzibaodan: '',
		insureNo: '',
		bankName: '', //银行名称
		insurelist:'',//投人信息
		recognizeelist:'',//被保人信息
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
	vm.ccName = ccName;
	vm.insureNo = insureNo;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"customerId": customerId + '',
		}
	}
	var url = base.url + 'klBasic/klPolicyQueryInfo.do';
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = vm.dianzibaodan;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var reqData = {
			"commodityCombinationId": commodityComId + "",
			"ccId": commodityComId + '',
			"userCode": userCode,
			"customerId": customerId,
			"transToken": transToken,
			"channel": channel,
			"insurePhone": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": '产品详情',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/goldsunshineDetails.html?jsonKey=" + jsonStr;
	})
	vm.commodityComId = commodityComId;
	vm.channel = channel;

})

/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns;
		vm.bankName = data.returns.bankName;
		vm.dianzibaodan=data.returns.lifeRiskPolicy.epolicyUrl;
		vm.returnVisit = '0';
		for(i = 0; i < vm.Objectitle.listRiskPartys.length; i++) {
			if(vm.Objectitle.listRiskPartys[i].partyType=='1'){
				vm.insurelist=vm.Objectitle.listRiskPartys[i];
			}else if(vm.Objectitle.listRiskPartys[i].partyType=='2'){
				vm.recognizeelist=vm.Objectitle.listRiskPartys[i];
			}
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	vm.$nextTick(function() {
		chuli();
	})
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
			var reqData = {
			"orderNo": orderNo,
			"insureNo": insureNo,
			"policyNo": policyNo,
			"customerId": customerId,
			"commodityComId": commodityComId,
			"userCode": userCode,
			"ccName": ccName,
			"remark": vm.Objectitle.commodityCombination.remark,
			"prem":vm.Objectitle.lifeRiskPolicy.prem,
			"bankName":vm.bankName,
			"bankAccNo":vm.Objectitle.lifeRiskPolicy.bankAccNo,
			"transTime": "",
			"channel": channel,
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/cornucopiaCancellation.html?jsonKey=" + jsonStr;
		})
		mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
			/*接口请求位子*/
			if(vm.returnVisit == '0' && $('.baozhang').html() != '已领取') {
				
			} else {
				$('#huifang').addClass('huisebtn');
			}
		})
	}
	bankweihao();
}
$('.wenhaoico').unbind("tap").bind("tap", function() {
	modelAlert('该银行账户将用于领取保费或者退保，要求该银行账号所有人必须为投保人本人');
})

function backlast() {
	sysback();
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}