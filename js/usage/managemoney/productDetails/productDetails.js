/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	phone = urlParm.insurePhone;
	$('.phone').html(phoneyin(phone));
console.log("页面初始化，获取上个页面传值报文--");
console.log(urlParm);
var ma = null;

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
			"transTime": "2017-08-26",
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
		$('.note').show();
	})
	/*发送短信*/
	$(".dianji").unbind("tap").bind("tap", function() {
		sendMessage();
	})
	/*点击确定关闭提交数据*/
	$(".note-div-btn").unbind("tap").bind("tap", function() {
		if($('#yan').val() != null && $('#yan').val() != "") {
			if(ma == $('#yan').val()) {
				$('.note').hide();
				var policyNo = $(this).attr('policyNo');
				var orderNo = $(this).attr('orderNo');
				var insureNo = $(this).attr('insureNo');
				var param = {
					"userCode": userCode,
					"policyNo": policyNo,
					"orderNo": orderNo,
					"insureNo": insureNo
					/*订单编号*/
				}
				var jsonStr = UrlEncode(JSON.stringify(param));
				window.location.href =  base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
			} else {
				mui.alert('验证码错误!');
			}
		} else {
			mui.alert('验证码不能为空!');
		}

	})
	/*点击X关发送短信窗口*/
	$(".note-div_title_right").unbind("tap").bind("tap", function() {
		$('.note').hide();
	})
})

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
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行  
var curCount; //当前剩余秒数  
function sendMessage() {　
	curCount = count;
	$(".dianji").addClass("mui-disabled");
	$(".dianji").html("60");
	$(".dianji").attr("style", "color:#E0E0E0");
	$(".dianji").html(curCount);
	InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次  
	var reqData = {
		"head": {
			"userCode": userCode,
			"transTime": "",
			"channel": '01',
			"transToken": ""
		},
		"body": {
			"userName": phone,
			"type": '103'
		}
	};
	var url = base.url + 'commonMethod/GetRegCode.do';
	$.reqAjaxsFalse(url, reqData, GetRegCode);
}
/*验证码倒计时*/
function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器  
		$(".dianji").removeClass("mui-disabled"); //启用按钮  
		$(".dianji").attr("style", "color:#333");
		$(".dianji").html("获取验证码");
	} else {
		curCount--;
		$(".dianji").html(curCount);
	}
}
/*发送短信*/
function GetRegCode(data) {
	mui.alert(data.statusMessage);
	ma = data.returns.validateCode;
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}