mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	roleType = urlParm.roleType,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	frompage = urlParm.frompage;
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
		insuranceConsultantType: {},
		dizhi: {}, //地址
		shanchang: {}, //擅长领域
		objectlist: {},
		phone: {}, //联系我
		jiesao: {}, //个人介绍
		weixin: {}, //微信二维码
		name: {}, //姓名
	},
	/*watch: {
		data() {
			this.$nextTick(() => {
				shuaxin();
			})
		}
	}*/
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
			"channel": "02",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getBusinessCard.do';
	$.reqAjaxs(url, reqData, getBusinessCard);
	$(".wechat").unbind("tap").bind("tap", function() {
		var weixin = $(this).attr('weixin');
		if(weixin != null && weixin != "") {
			$('.popup').show();
		} else {
			modelAlert('暂无微信二维码');
		}
	})
	$(".phone").unbind("tap").bind("tap", function() {
		var phone = $(this).attr('phone');
		if(phone == "" || phone == null) {
			modelAlert('请点击编辑添加手机号');
		} else {
			callService(phone, ".kefuPhone");
		}
	})
	$(".button_share").unbind("tap").bind("tap", function() {
		shareHandle();
	})
	
	/*点击关闭*/
	$(".spanClose").unbind("tap").bind("tap", function() {
		$('.popup').hide();
	})
	vm.$nextTick(function() {
		shuaxin();
	})
})

function getBusinessCard(data) {
	console.log(data);
	if(data.status_code == '000000') {
		if(data.returns != "" && data.returns != null) {
			vm.mingpian = data.returns.insuranceConsultantInfo;
			vm.name = data.returns.name;
			vm.dizhi = data.returns.serviceArea;
			if(data.returns.insuranceConsultantInfo != "" && data.returns.insuranceConsultantInfo != null) {
				shan = data.returns.insuranceConsultantInfo.postcardField;
				jie = data.returns.insuranceConsultantInfo.postcardIntroduction;
				if(data.returns.insuranceConsultantInfo.postcardPhone==null||data.returns.insuranceConsultantInfo.postcardPhone=='') {
					vm.postcardPhone = userCode;
				} else {
					vm.postcardPhone = data.returns.insuranceConsultantInfo.postcardPhone;
				}
				vm.agentCode = data.returns.insuranceConsultantInfo.agentCode;
				vm.practiceCode = data.returns.insuranceConsultantInfo.practiceCode;
				vm.insuranceConsultantType = insurantype(data.returns.insuranceConsultantInfo.insuranceConsultantType);
				if(data.returns.insuranceConsultantInfo.postcardWxImage != null && data.returns.insuranceConsultantInfo.postcardWxImage != "") {
					vm.weixin = base.url + 'tongdaoApp/img/wxQRCode/' + data.returns.insuranceConsultantInfo.postcardWxImage;
					$('.popup_content img').attr('src', vm.weixin);
				} else {
					vm.weixin = '';
					$('.popup_content').attr('src', vm.weixin);
				}
			}
			if(shan != null && shan != "") {
				vm.shanchang = htmlp(kuo, kuo2, kuo3, dou, shan, biaoqian);
			} else {
				vm.shanchang = "<p>请点击编辑,选择您的擅长领域</p>";
			}
			if(jie != null && jie != "") {
				vm.jiesao = data.returns.insuranceConsultantInfo.postcardIntroduction;
			} else {
				vm.jiesao = "<span style='color: #8f8f94;font-size: 14px;'>请点击编辑,撰写您的个人介绍</span>";
			}
		}
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, '', lognCont);
	} else {
		modelAlert(data.status_message);
	}
}
function shareHandle() {
	var title = '我是天安佰盈保险代理人'+vm.name;
	var desc = '愿用我的保险专业为您保驾护航,立刻点击查看我的名片。';
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var shareurl = base.url + "tongdaoApp/html/agent/myCard/myCardwx.html?jsonKey=" + jsonStr;
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	shareMethod(shareurl, title, desc, "mingpian", picUrl);
};
/*登录失效*/
function lognCont() {
	loginControl();
}
/*分割*/
function htmlp(kuo, kuo2, kuo3, dou, str, biaoqian) {
	var one = kuo + biaoqian + kuo2;
	var two = kuo3 + biaoqian + kuo2;
	var str = str;
	arr = str.split(dou);
	var m = new Array();
	for(var i = 0; i < arr.length; i++) {
		m += one + toField(arr[i]) + two;
	}
	return m;
}
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006 
});

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
/*擅长领域*/
function toField(str) {
	var field = "";
	if(str == "01") {
		field = "意外险"
	} else if(str == "02") {
		field = "少儿险"
	} else if(str == "03") {
		field = "养老险"
	} else if(str == "04") {
		field = "重疾险"
	} else if(str == "05") {
		field = "医疗险"
	} else if(str == "06") {
		field = "人寿险"
	} else if(str == "07") {
		field = "理财险"
	} else if(str == "08") {
		field = "车辆险"
	} else if(str == "09") {
		field = "家财险"
	} else if(str == "10") {
		field = "企业财产险"
	} else if(str == "11") {
		field = "农业险"
	}
	return field;
}
/*保险顾问类型*/
function insurantype(str) {
	var field = "";
	if(str == "02") {
		field = "代理人"
	} else if(str == "03") {
		field = "客户经理"
	} else if(str == "04") {
		field = "同道内勤"
	} else if(str == "05") {
		field = "团队人员"
	} else if(str == "06") {
		field = "代理人"
	}
	return field;
}

function shuaxin() {
	var reqData = {
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
		},
		"head": {
			"channel": "02",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	var url = base.url + 'agent/getBusinessCard.do';
	$.reqAjaxs(url, reqData, getBusinessCard);
}

/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	if( frompage == "liveProductHtml" ){
		urlParm.title = "产品详情";
		urlParm.rightIco = "1";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = base.url + "tongdaoApp/html/insurance/main/liveProductDetail.html?jsonKey="+jsonStr;
	}else{
		sysback();
	}
	
}