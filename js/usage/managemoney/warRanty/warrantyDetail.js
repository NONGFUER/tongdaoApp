mui.init();
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
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
		userCode = urlParm.userCode,
		policyNo = urlParm.policyNo;
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
	var url =  base.url +'moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	/*vm.Objectitle = data.returns;*/
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		alert(1);
		/*接口请求位子*/
	})
	mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
		alert(2);
		/*接口请求位子*/
	})
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = base.url+vm.Objectitle.bxPolicyFinance.policyForm;
		/*window.location.href = vm.Objectitle.bxPolicyFinance.policyForm;*/
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var commodityCombinationId = vm.Objectitle.bxPolicyFinance.commodityCombinationId
		var reqData = {
			"commodityCombinationId": commodityCombinationId,
			"userCode": userCode,
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
	})
})

function policyQueryListInfo(data) {
	console.log(data)
	vm.Objectitle = data.returns;
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
	} else if($('.baozhang').html() == '99') {
		$('.baozhang').html('已失效')
	}
	bankweihao();
	$('.phoneyin').html(phoneyin($('.phoneyin').html()));
}