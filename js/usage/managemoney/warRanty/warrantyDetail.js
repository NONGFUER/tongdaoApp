mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	orderNo = urlParm.orderNo;
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			bxPolicyFinance: {}
		},
		Objecbody: null,
		baozhang: null,
	},
	mounted() {
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
	}
})
$(function() {
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": ""
		},
		"body": {
			"policyNo": policyNo
		}
	}
	var url = base.url + 'moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		mui.alert('确认');
		/*接口请求位子*/
	})

	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = base.url + vm.Objectitle.bxPolicyFinance.policyForm;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var commodityCombinationId = vm.Objectitle.bxPolicyFinance.commodityCombinationId
		var reqData = {
			"commodityCombinationId": commodityCombinationId,
			"userCode": userCode,
			"insurePhone":vm.Objectitle.bxPolicyFinance.insurePhone
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
	})
})
/*页面信息*/
function policyQueryListInfo(data) {
	console.log(data)
	vm.Objectitle = data.returns;
}
/*退保试算*/
function getRedemption(data) {
	console.log(data);
	if(data.statusCode != '000000') {
		mui.alert(data.statusMessage);
	} else {
		var reqData = {
			"body": {
				"orderNo": data.returns.redemptionDto.orderNo,
				"insureNo": insureNo,
				"policyNo": data.returns.redemptionDto.policyNo,
				"commmodityComId":data.returns.redemptionDto.commmodityComId
			},
			"head": {
				"userCode": data.userCode,
				"transTime": "",
				"channel": "01"
			}
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/policyCancellation.html?jsonKey=" + jsonStr;
	}
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}
function chuli() {
	if($('.baozhang').html() == '01') {
		$('.baozhang').html('待生效')
	} else if($('.baozhang').html() == '02') {
		$('.baozhang').html('保障中')
	} else if($('.baozhang').html() == '03') {
		$('.baozhang').html('已领取')
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
	} else if($('.baozhang').html() == '99') {
		$('.baozhang').html('已失效')
	}
	if($('.baozhang').html() != '03' && $('.baozhang').html() != '已领取') {
		mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
			var url = base.url + 'hkRedemption/getRedemption.do';
			var reqData = {
				"head": {
					"channel": "01",
					"userCode": "2835",
					"transTime": ""
				},
				"body": {
					"orderNo": orderNo,
					"policyNo": policyNo,
					"insureNo": insureNo
				}
			}
			$.reqAjaxsFalse(url, reqData, getRedemption);
		})
	}
	bankweihao();
	$('.phoneyin').html(phoneyin($('.phoneyin').html()));
}