/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	phone = urlParm.insurePhone;
$('.phone').html(phoneyin(phone));
console.log("页面初始化，获取上个页面传值报文--");
console.log(urlParm);
var ma = null;
var riskSupportAbility = "";
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			CommCombLinkList: {},
			CommodityCombinationModuleList: {},
			commodityInfo: {},
			commodityCombination: {},
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
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {

			})
		})
	}
})
$(function() {
	var reqData = {
		"body": {
			"commodityCombinationId": commodityCombinationId.toString()
		},
		"head": {
			"userCode": userCode,
			"transTime": "",
			"channel": "01"
		}
	};
	var url = base.url + 'firstPage/goldProductInfo.do';
	$.reqAjaxsFalse(url, reqData, goldProductInfo);
	/*伸缩按钮*/
	$(".body_title").unbind("tap").bind("tap", function() {
		console.log($(this).siblings('ul'));
		$(this).children('.jiantou').toggleClass('shangjiantou');
		$(this).siblings('ul').toggle();
	})
	/*点击购买弹出发送短信框*/
	$("#huifang").unbind("tap").bind("tap", function() {
		var reqData = {
			"body": {
				"userPhone": phone
			},
			"head": {
				"userCode": userCode,
				"transTime": "",
				"channel": "01"
			}
		}
		var url = base.url + 'investmentLinkedInsurance/getRiskAble.do';
		$.reqAjaxsFalse(url, reqData, getRiskAble);
	})
	$(".cancle").unbind("tap").bind("tap", function() {
		$('#shadow').hide();
	})
})
/*购买*/
function buy() {	
	var sendData = {
		"riskSupportAbility": $('.retest').attr('testType'),
		"insurePhone": phone,
		"userCode": userCode,
		"commodityCombinationId": commodityCombinationId.toString(),
		"testType": $('.retest').attr('testType')
	}
	var jsonStr = JSON.stringify(sendData);
	jsonStr = UrlEncode(jsonStr);
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
}

function goldProductInfo(data) {
	console.log(data);
	vm.Objectitle = data.returns;
	vm.CommodityCombinationModuleList = data.returns.CommodityCombinationModuleList;
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
		mui.alert('网络繁忙');
	}
}
/*风险评估*/
function getRiskAble(data) {
	console.log(data);
	if(data.returns.isRisk == "0") {
		$('#shadow').show();
		$('.retest').attr('testType',data.returns.riskble);
	} else if(data.returns.isRisk == "1") {
		var sendData = {
			"head": {
				"riskSupportAbility": riskSupportAbility
			},
			"body": {
				"returnflag": "",
				"testType": "",
				"mobile": phone,
				"customerId": commodityCombinationId.toString(),
				"productCode": userCode
			}
		}
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/riskQuestion.html?jsonKey=" + jsonStr;
	} else if(data.returns.isRisk == "2") {
		mui.alert(data.statusMessage)
	}
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}