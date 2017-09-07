mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId;
/*var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';*/
var username = userCode + "";
var shan = "";
var jie = "";
var vm = new Vue({
	el: '#card_scroll',
	data: {
		mingpian: {}, //名片list
		agentCode: {},
		practiceCode: {},
		postcardPhone: {},
		postcardWxImage: {},
		insuranceConsultantType:{},
		dizhi: {}, //地址
		shanchang: {}, //擅长领域
		objectlist: {},
		phone: {}, //联系我
		jiesao: {}, //个人介绍
		weixin: {}, //微信二维码
		name:{}, //姓名
	}
})
var kuo = "<",
	kuo2 = ">",
	kuo3 = '</',
	biaoqian = 'span',
	dou = ',',
	ju = '@#！#@！#@！@！￥'; //过滤器

$(function() {
	getTouxiang();
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getBusinessCard.do';
	$.reqAjaxsFalse(url, reqData, getBusinessCard);
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getBusinessCard.do';

	$(".wechat").unbind("tap").bind("tap", function() {
		var weixin = $(this).attr('weixin');
		if(weixin != null && weixin != "") {
			$('.popup').show();
		} else {
			modelAlert('请点击编辑添加微信二维码');
		}
	})
	$(".phone").unbind("tap").bind("tap", function() {
		var phone = $(this).attr('phone');
		callService(phone, ".kefuPhone");
	})
})

function getBusinessCard(data) {
	console.log(data);
	vm.mingpian = data.returns.insuranceConsultantInfo;
	vm.name = data.returns.name;
	vm.dizhi = data.returns.serviceArea;
	if(data.returns.insuranceConsultantInfo != "" && data.returns.insuranceConsultantInfo != null) {
		shan = data.returns.insuranceConsultantInfo.postcardField;
		jie = data.returns.insuranceConsultantInfo.postcardIntroduction;
		vm.phone = data.returns.insuranceConsultantInfo.postcardPhone;
		if(data.returns.insuranceConsultantInfo.postcardWxImage != null && data.returns.insuranceConsultantInfo.postcardWxImage != "") {
			vm.weixin = base.url + data.returns.insuranceConsultantInfo.postcardWxImage;
		} else {
			vm.weixin = '';
		}
	}
	if(shan != null && shan != "") {
		vm.shanchang = htmlp(kuo, kuo2, kuo3, dou, ju, shan, biaoqian);
	} else {
		vm.shanchang = "<p>请点击编辑,选择您的擅长领域</p>";
	}
	if(jie != null && jie != "") {
		vm.jiesao = data.returns.insuranceConsultantInfo.postcardIntroduction;
	} else {
		vm.jiesao = "<span style='color: #8f8f94;font-size: 14px;'>请点击编辑,撰写您的个人介绍</span>";
	}
}

/*登录失效*/
function lognCont() {
	loginControl();
}
/*分割*/
function htmlp(kuo, kuo2, kuo3, dou, ju, str, biaoqian) {
	var one = kuo + biaoqian + kuo2;
	var two = kuo3 + biaoqian + kuo2;
	var str = str;
	arr = str.split(dou);
	var m = new Array();
	for(var i = 0; i < arr.length; i++) {
		m += one + arr[i] + two;
	}
	var s = new String();
	s = m.toString();

	ju = s.split(ju);
	var f = new Array();
	for(var i = 0; i < ju.length; i++) {
		f += one + ju[i] + two;
	}
	return f;
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

function bianji() {
	alert(1);
	var sendData = {
		"BxWxAgent": {
			"name": vm.name,
			"iden": vm.insuranceConsultantType,
			"area": vm.dizhi,
			"cardmobile": vm.phone,
			"agentCode": vm.agentCode,
			"practiceCode": vm.practiceCode,
			"introinfo": jie,
			"field": shan,
		},
		"touxiang": $(".tou img").attr("src"),
		"customerId": customerId,
		"transToken": transToken,
		"userCode": userCode,
		"leftIco": '1',
		"rightIco": '5',
		"downIco": '0',
		"title": '我的名片',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/agent/myCard/myCardEdit.html?jsonKey=" + jsonStr;
}

function getTouxiang() {
	$.ajax({
		type: "get",
		url: base.url + "customerBasic/getAppImage.do",
		data: "userName=" + username,
		success: function(data) {
			if(data) {
				$(".tou img").attr("src", base.url + "customerBasic/getAppImage.do?userName=" + username);
			} else {
				$(".tou img").attr("src", "../../../image/account/tou.png");
			}
		},
		error: function() {
			$(".tou img").attr("src", "../../../image/account/tou.png");
		}
	})
}
/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	sysback();
}