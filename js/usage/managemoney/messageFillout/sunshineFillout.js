/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	productFlag = urlParm.productFlag,
	phone = urlParm.userCode,
	bankName = urlParm.bankName,
	commodityId = urlParm.commodityId,
	bankCode = urlParm.bankCode,
	roleType = urlParm.roleType,
	idAuth = urlParm.idAuth,
	customerId = urlParm.customerId,
	bankMaxMoney = urlParm.dayLimit,
	transToken = urlParm.transToken,
	invMobie = urlParm.invMobie, //引荐人手机号
	riskSupportAbility = urlParm.riskSupportAbility, //类型
	pieces = urlParm.pieces,
	holderbr = urlParm.holderbr,
	channel = urlParm.channel,
	remark = urlParm.remark,
	title = urlParm.title;
var inFlag = '1';
if(title == null || title == "") {
	title = urlParm.titles;
}
if(roleType != '00') {
	rightIco = '1';
} else {
	rightIco = '0';
}
if(channel == '01') {
	inFlag = '3';
} else {
	inFlag = '2';
}
if(bankCode != null && bankCode != "") {
	$('.bank').attr('bankCode', bankCode);
}
var orderNo = "",
	insureNo = "",
	buyPrem = '';
console.log(urlParm);
var ma = null;
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			insureInfo: {
				yearRate: "",
			}
		},
		goumaishuoming: "",
		xiangguanxieyi: "",
		feilv: "", //初始费率带文字
		feilvshuzi: "", //初始费率值
		mymoney: "", //进入账户金额
		startPiece: "", //购买金额
		startPiecechushi: "", //单价
		fenshu: "", //份数
		shenfenzheng: "", //身份证
		phone: "", //手机号
		bankCode: "", //银行代码
		bankname: "",
		comComName: "",
		remark: '', //
		diqu: "",
		youxiaoqi: '', //身份证有效期
		holderbr: {
			name: '',
			idNo: '',
			phone: '',
			email: '',
			address: '',
		},
		channel:'',
	}
})
if(pieces) {
	$("#goumai").val(pieces);
	$("#money").html(1000 * pieces);
}
$(function() {
	vm.remark = remark;
	if(channel == '02') {
		$('#tou').show();
		$('.mui-content').css('padding-top', '44px');
	}
	vm.channel=channel;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"commodityCombinationId": commodityCombinationId,
			"customerId": customerId,
			"commodityId": commodityId,
		}
	}
	var url = base.url + 'inureProduct/getInsureInfo.do';
	$.reqAjaxs(url, reqData, getInsureInfo);
})
/*点击购买弹出发送短信框*/
$("#huifang").unbind("tap").bind("tap", function() {
	var huiclass = $('#huifang').attr('class')
	if(huiclass == 'div_btn') {
		var phonezz = /^[0-9]+.?[0-9]*$/;
		var shenfenz = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		var chengshi = $('#chengshi').html();
		var datawhere = $('#chengshi').attr('data-where');
		var dizhi = $('#dizhi').val();
		var email = $('#email').val();
		var yinhang = $('#yinhangka').val();
		var youxiaoqi = $('#shenfenzhengyxq').html();
		var beiName = $('#name').val();
		var isphone=$('#phone').val();
		var yinhang = $('#yinhangka').val();
		var bankName = $('.bank').html();
		var isidNo=$('#idNo').val();
		var reg = new RegExp("^[0-9]*$");
		var dui = true;
		if(chengshi == '请选择') {
			mui.alert("请选择地区");
			dui = false;
		} else if(datawhere == "" || datawhere == null) {
			mui.alert("请填写完整地区");
			dui = false;
		} else if(dizhi == "" || dizhi == null) {
			mui.alert("请输入地址！");
			dui = false;
		} else if(dizhi.length < 8) {
			mui.alert("地址输入格式不正确！");
			dui = false;
		} else if(email == null || email == '') {
			mui.alert("请输入邮箱！");
			dui = false;
		} else if(tit.regExp.isEmail(email) == false) {
			mui.alert("邮箱输入格式不正确！");
			dui = false;
		} else if(bankName == null || bankName == "") {
			mui.alert("请选择银行");
			dui = false;
		} else if(yinhang == null || yinhang == "") {
			mui.alert("请填写银行卡号");
			dui = false;
		} else if(!reg.test(yinhang)) {
			mui.alert("请填写正确的银行卡号");
			dui = false;
		} else if(bankName == "请选择银行") {
			mui.alert("请选择银行");
			dui = false;
		} else if(youxiaoqi == null || youxiaoqi == "" || youxiaoqi == '请选择') {
			mui.alert("请输入选择身份证有效期");
			dui = false;
		} else if($.isNull(beiName)) {
			mui.alert("姓名不能为空");
			dui = false;
		} else if(!tit.regExp.isChinese(beiName)) {
			mui.alert("姓名必须为汉字");
			dui = false;
		} else if($.isNull(isphone)) {
			mui.alert("手机号码不能为空");
			dui = false;
		} else if(!tit.regExp.isMobile(isphone)) {
			modelAlert("请输入正确的手机号码！");
			dui = false;
		} else if($.isNull(isidNo)) {
			modelAlert("身份证号不能为空！");
			dui = false;
		} else if($.checkIdCard(isidNo.toLocaleUpperCase()) != 0) {
			modelAlert("请输入合法的身份证号！");
			dui = false;
		}
		if(dui) {
			var where = $("#chengshi").html();
			where = where.split(" ");
			if(where == "请选择所在城市") {
				where = ""
			}
			var whereCode = $("#chengshi").attr("data-where");
			whereCode = whereCode.split(",");
			buyPrem = $('#money').html().split('.');
			//var startPrem = Number(buyPrem[0]) * Number(vm.feilvshuzi);
			var redata = {
				"head": {
					"userCode": userCode,
					"channel": channel,
					"transTime": $.getTimeStr(),
					"transToken": transToken
				},
				"body": {
					"applyNum": $('#goumai').val(), //份数
					/*"startPrem": startPrem + "",*/ //费率
					"renewalBankCode": $('.bank').attr('bankCode'), //续期开户行 银行卡类型ICBC
					"premium": buyPrem[0], //保费
					"totalPremium": buyPrem[0], //总投保金额
					"renewalBankName": bankName, //开户银行名称
					"renewalBankAccount": $('#yinhangka').val(), //银行卡号
					"payType": "D", //期缴方式（趸交传D）
					"commodityCombinationId": commodityCombinationId, //商品组合id
					"commodityId": commodityId, //商品id
					"paymentPeriod": "", //缴费年限（趸交时则为空）
					"holderResidentProvince": whereCode[0], //投保人所属地区的省代码
					"holderResidentCounty": whereCode[1], //投保人所属地区的市代码
					"holderResidentCity": whereCode[2], //投保人所属地区的区代码
					"holderAddress": $('#dizhi').val(), //投保人地址"开福区德雅路109号"
					"holderEmail": $('#email').val(), //投保人电子邮箱
					"holderName": beiName, //被投保人姓名
					"holderCardType": "SFZ", //证件类型（SFZ：身份证）
					"holderCardNo": $('#idNo').val(), //被投保人身份证
					"holderMobile": $('#phone').val(), //被投保人手机号
					"holderSex": $.getSexHong($('#idNo').val()) + "", //性别
					"holderBirthday": $.getBirthDay($('#idNo').val()) + '', //出生日期
					"holderCardValid": vm.youxiaoqi, //证件有效期
					"holderResidentProvinceName": where[0], //被投保人所属地区的省名称
					"holderResidentCityName": where[1], //被投保人所属地区的市名称
					"holderResidentCountyName": where[2], //被投保人所属地区的区名称
					"bankMaxMoney": bankMaxMoney + "", //银行最大金额
					"invitePhone": invMobie, //分享人手机号
					"orderResource": inFlag, //来源渠道
					"buyType": '1', //1直接购买，2分享购买
					"customerId": customerId, //用户id
					"age": getAge_premium($.getBirthDay($('#idNo').val())) + '',
				}
			};
			var url = base.url + 'sunLife/sunLifeSaveOrder.do';
			$.reqAjaxs(url, redata, saveOrder);
		}
	}
	else {
		mui.alert('请勾选已阅读协议');
	}
})
if(pieces != null) {
	$('#goumai').val(pieces);
}
/*发送短信*/
/*$(".dianji").unbind("tap").bind("tap", function() {
	sendMessage();
})*/

function getInsureInfo(data) {
	getProvinceReq();
	console.log(data);
	vm.Objectitle = data.returns;
	console.log(vm.Objectitle);

	//vm.feilv = '本产品初始费用' + Number(vm.Objectitle.insureInfo.firstRate) * 100 + '%,进入账户金额';
	if(pieces == null || pieces == '') {
		pieces = $('#goumai').val();
	}
	vm.comComName = title;
	vm.feilvshuzi = 0;
	vm.Objectitle = data.returns;
	if(holderbr) {
		vm.holderbr = holderbr;
	}
	/*vm.$nextTick(function() {
		var yinphone = $('#phone').val();
		var yinidNo = $('#idNo').val();
		$('#phone').val(phoneyin(yinphone));
		$('#idNo').val(shenfen(yinidNo));
	})*/

	if(pieces) {
		vm.mymoney = intToFloat(1000 * pieces);
		vm.startPiece = intToFloat(1000 * pieces);
	} else {
		vm.mymoney = intToFloat(Number(vm.Objectitle.insureInfo.upPrice) - (Number(vm.Objectitle.insureInfo.upPrice) * Number(vm.Objectitle.insureInfo.firstRate))); /*进入账户金额*/
		vm.startPiece = intToFloat(vm.Objectitle.insureInfo.upPrice);
	}
	vm.startPiecechushi = intToFloat(vm.Objectitle.insureInfo.upPrice);
	console.log(vm.mymoney);

	vm.CommodityCombinationModuleList = data.returns.CommodityCombinationModuleList;

	vm.fenshu = vm.Objectitle.insureInfo.salesNum;
	$('.phone').html(vm.phone);
	vm.bankCode = $('.bank').attr('bankCode');
	if(vm.Objectitle.insureInfo.dayLimit != null && vm.Objectitle.insureInfo.dayLimit != "") {
		bankMaxMoney = vm.Objectitle.insureInfo.dayLimit;
	}
	if(vm.Objectitle.insureInfo.bankName != null && vm.Objectitle.insureInfo.bankName != "") {

		vm.bankname = vm.Objectitle.insureInfo.bankName;
	} else {
		vm.bankname = '请选择开户行';
	}
	if(bankName != null && bankName != "") {
		vm.bankname = bankName;
	}

	/*点击+-*/
	$(".up").unbind("tap").bind("tap", function() {
		var fenshu = $('.fenshu_input').children('input').val();
		var money = $('#money').html().split('元')[0];
		//var mymoney = $('#mymoney').html();
		fenshu = Number(fenshu) + 1;
		if(fenshu > vm.fenshu) {
			fenshu = vm.fenshu;
		} else {
			money = intToFloat((Number(money) + Number(vm.startPiecechushi)));
			//mymoney = intToFloat(Number(mymoney) + (Number(vm.startPiecechushi) - (Number(vm.startPiecechushi) * Number(vm.feilvshuzi))));
		}
		$('.fenshu_input').children('input').val(fenshu);
		$('#money').html(money + '元');
		//$('#mymoney').html(mymoney);
	})
	$(".minus").unbind("tap").bind("tap", function() {
		var fenshu = $('.fenshu_input').children('input').val();
		var money = $('#money').html().split('元')[0];
		console.log(money)
		//var mymoney = $('#mymoney').html();
		fenshu = Number(fenshu) - 1;
		console.log(fenshu)
		if(fenshu < 1) {
			fenshu = '1';
		} else {
			money = intToFloat((Number(money) - Number(vm.startPiecechushi)));
			///mymoney = intToFloat(Number(mymoney) - (Number(vm.startPiecechushi) - (Number(vm.startPiecechushi) * Number(vm.feilvshuzi))));
		}
		$('.fenshu_input').children('input').val(fenshu);
		$('#money').html(money + '元');
		//$('#mymoney').html(mymoney);
	})
}
/*var InterValObj; //timer变量，控制时间
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
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"userName": phone,
			"type": '103',
		}
	};
	var url = base.url + 'commonMethod/GetRegCode.do';
	$.reqAjaxs(url, reqData, GetRegCode);
}*/
/*验证码倒计时*/
/*function SetRemainTime() {
	if(curCount == 0) {
		window.clearInterval(InterValObj); //停止计时器  
		$(".dianji").removeClass("mui-disabled"); //启用按钮  
		$(".dianji").attr("style", "color:#333");
		$(".dianji").html("获取验证码");
	} else {
		curCount--;
		$(".dianji").html(curCount);
	}
}*/
/*点击X关发送短信窗口*/
/*$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
	window.clearInterval(InterValObj); //停止计时器  
	$(".dianji").removeClass("mui-disabled"); //启用按钮  
	$(".dianji").attr("style", "color:#333");
	$(".dianji").html("获取验证码");
});*/
/*发送短信*/
/*function GetRegCode(data) {
	mui.alert(data.statusMessage);
	ma = data.returns.validateCode;
}*/
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	if(phone) {
		var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
		return mphone;
	}
}
/*隐藏身份证中间几位*/
function shenfen(shenfen) {
	if(shenfen) {
		var mphone = shenfen.substr(0, 3) + '**************' + shenfen.substr(-4);
		return mphone;
	}
}
/*保留二位小数*/
function intToFloat(val) {
	return new Number(val).toFixed(2);
}
/*点击银行卡*/
$(".bank").unbind("tap").bind("tap", function() {
	vm.holderbr.name = $('#name').val();
	vm.holderbr.idNo = $('#idNo').val();
	vm.holderbr.phone = $('#phone').val();
	vm.holderbr.address = $('#dizhi').val();
	vm.holderbr.email = $('#email').val();
	urlParm.title = '银行卡信息';
	urlParm.holderbr = vm.holderbr;
	urlParm.pieces = $('#goumai').val();
	urlParm.titles = vm.comComName;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "../cardList/suncardList.html?jsonKey=" + jsonStr;
})
//获取联动列表
function getProvinceReq() {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {}
	};
	var url = base.url + 'ygBasic/getYgSelection.do';
	$.reqAjaxs(url, reqData, getSelection);
}
//跳转到常用保险人
$("#commonHoldersto").unbind("tap").bind("tap", function() {
	urlParm.userCode = userCode;
	urlParm.pieces = $('#goumai').val();
	urlParm.title = "常用被保人";
	urlParm.titles = vm.comComName;
	urlParm.rightIco = "4";
	urlParm.frompage = "sunshineFilloutHtml";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey=" + jsonStr;
});

function getSelection(data) {
	if(data.status_code == "000000") {
		var cityPicker3 = new mui.PopPicker({
			layer: 3
		});
		cityPicker3.setData(data.returns);
		$("#chengshi").bind("tap", function() {
			cityPicker3.show(function(item) {
				var cityText = item[0].text + " " + item[1].text + " " + item[2].text;
				var cityValue = item[0].value + "," + item[1].value + "," + item[2].value;
				$("#chengshi").html(cityText);
				$("#chengshi").attr("data-where", cityValue);
			});
		});
	} else {
		modelAlert(data.statusMessage);
	}
}
/*已阅读*/
$("#word").unbind("tap").bind("tap", function() {
	$('#word').toggleClass('no');
	$('#huifang').toggleClass('xiehuise');
})
$("#shenfenzhengyxq").bind("tap", function() {
	var mydate = new Date();
	var yue = mydate.getMonth();
	var nian = mydate.getFullYear() + 5;
	var nianto = mydate.getFullYear() + 10;
	var ri = mydate.getDate() + 1;
	var dtpicker = new mui.DtPicker({
		type: "date", //设置日历初始视图模式 
		beginDate: new Date(nian, 0, 01), //设置开始日期 
		endDate: new Date(nianto, 11, 31), //设置结束日期 
		labels: ['年', '月', '日', ], //设置默认标签区域提示语 
	})
	dtpicker.show(function(rs) {
		var datatext = rs.text;
		$('#shenfenzhengyxq').html(datatext);
		vm.youxiaoqi = datatext;
	})
});

/*核保*/
function saveOrder(data) {
	console.log(data.statusCode);
	if(data.statusCode == '000000') {
		var orderNo = data.returns.OrderNo;
		var insureNo = data.returns.ProposalNo;
		var url = base.url + 'ygBasic/getYgUrl.do';
		var redata = {
			"head": {
				"userCode": userCode,
				"channel": channel,
				"transTime": $.getTimeStr(),
				"transToken": transToken
			},
			"body": {
				"orderNo": orderNo,
			}
		}
		$.reqAjaxs(url, redata, getYgUrl);

		function getYgUrl(data) {
			if(data.statusCode == '000000') {
				window.location.href = data.returns.url;
			}
		}
	} else {
		modelAlert(data.statusMessage);
	}
}

/*function getinsure(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		var laiyuan = '1'; //1.投保页面,2.保单列表页
		$('.note').hide();
		var sendData = {
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken,
			"riskSupportAbility": riskSupportAbility,
			"orderNo": data.returns.orderNo,
			"policyNo": data.returns.policyNo,
			"comComName": vm.comComName,
			"startPiece": $('#money').html().split('.'),
			'title': vm.comComName,
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"commodityId": commodityId,
			"testType": testType,
			"channel": channel,
			"idAuth": idAuth,
			"roleType": roleType,
			'laiyuan': laiyuan, //页面来源
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/returnVisit.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else if(data.statusCode == '999998') {
		var laiyuan = '1'; //1.投保页面,2.保单列表页
		$('.note').hide();
		var sendData = {
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken,
			"riskSupportAbility": riskSupportAbility,
			"orderNo": orderNo,
			"policyNo": data.returns.policyNo,
			"comComName": vm.comComName,
			"startPiece": $('#money').html().split('.'),
			'title': vm.comComName,
			"customerId": customerId,
			"commodityCombinationId": commodityCombinationId,
			"commodityId": commodityId,
			"testType": testType,
			"channel": channel,
			"idAuth": idAuth,
			"roleType": roleType,
			'laiyuan': laiyuan, //页面来源
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/paymentFailure.html?jsonKey=" + jsonStr;
	} else {
		modelAlert(data.statusMessage);
	}
}*/
/*$("#phone").blur(function() {
	vm.holderbr.phone = $('#phone').val();
})
$("#idNo").blur(function() {
	vm.holderbr.idNo = $('#idNo').val();
})*/
$('.wenhaoico').unbind("tap").bind("tap", function() {
	modelAlert('该银行账户将用于领取保费或者退保，要求该银行账号所有人必须为投保人本人');
})
$("#risktype").unbind("tap").bind("tap", function() {
	var sendData = {
		"head": {
			"channel": channel,
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken,
			"riskSupportAbility": riskSupportAbility
		},
		"body": {
			"returnflag": "",
			"testType": "",
			"mobile": userCode,
			"customerId": customerId,
			"insurePhone": userCode,
			"commodityId": commodityId,
			"commodityCombinationId": commodityCombinationId,
			"productCode": userCode
		},
		"channel": channel,
		"roleType": roleType,
		"idAuth": idAuth,
		'title': '风险评估',
		"titles": vm.comComName,
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/riskQuestion.html?jsonKey=" + jsonStr;
})

$.getSexHong = function(data) {
	if(parseInt(data.substr(16, 1)) % 2 == 0) {
		return 1; //女
	} else {
		return 0; //男
	}
}

function toRiskType(tempScore) {
	var tp = "";
	if(tempScore == '1') {
		//保守型
		tp = "保守型";
	} else if(tempScore == '2') {
		//稳健型
		tp = "稳健型";
	} else if(tempScore == "3") {
		//平衡型
		tp = "平衡型";
	} else if(tempScore == '4') {
		//积极型
		tp = "积极型";
	} else if(tempScore == "5") {
		//进取型
		tp = "进取型";
	}
	return tp;
}

/*登录失效*/
function lognCont() {
	loginControl();
}

function backlast() {
	var sendData = {
		"userCode": userCode,
		"insurePhone": userCode,
		"bankName": bankName,
		"bankCode": bankCode,
		"commodityId": commodityId,
		"customerId": customerId,
		"dayLimit": bankMaxMoney,
		"transToken": transToken,
		"roleType": roleType,
		'idAuth': idAuth,
		"riskSupportAbility": riskSupportAbility,
		"pieces": pieces,
		"commodityCombinationId": commodityCombinationId,
		"title": title,
		"leftIco": '1',
		"rightIco": rightIco,
		"downIco": '0',
	};
	var jsonStr = UrlEncode(JSON.stringify(sendData));
	window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/sunshineDetails.html?jsonKey=" + jsonStr;
}

/**计算年龄周岁**/
function getAge_premium(birth) {
	try {
		var births = birth.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		var birthday = new Date(births[1], births[3] - 1, births[4]);
		var now = new Date();
		var age = now.getFullYear() - births[1];
		if(now.getMonth() > birthday.getMonth()) {
			return age;
		}
		if(now.getMonth() < birthday.getMonth()) {
			if(age <= 0) {
				return age;
			} else {
				return age - 1;
			}
		}
		if(now.getMonth() == birthday.getMonth()) {
			if(now.getDate() >= birthday.getDate()) {
				return age;
			} else {
				if(age <= 0) {
					return age;
				} else {
					return age - 1;
				}
			}
		}
	} catch(e) {
		return -99;
	}
}