/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
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
	channel = urlParm.channel,
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
testType = toRiskType(riskSupportAbility); //类型
if(bankCode != null && bankCode != "") {
	$('.bank').attr('bankCode', bankCode);
}
var orderNo = "",
	insureNo = "",
	buyPrem = '';

$('#risktype').html(testType);
console.log("页面初始化，获取上个页面传值报文--");
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
	}
})
if(pieces) {
	$("#goumai").val(pieces);
	$('#mymoney').html(997 * pieces);
	$("#money").html(1000 * pieces);
}
$(function() {
	if(channel == '02') {
		$('#tou').show();
		$('.mui-content').css('padding-top', '44px');
	}
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
	/*点击购买弹出发送短信框*/
	$("#huifang").unbind("tap").bind("tap", function() {
		var huiclass = $('#huifang').attr('class')
		if(huiclass == 'div_btn') {
			var chengshi = $('#chengshi').html();
			var datawhere = $('#chengshi').attr('data-where');
			var dizhi = $('#dizhi').val();
			var email = $('#email').val();
			var yinhang = $('#yinhangka').val();
			bankName = $('.bank').html();
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
			}
			if(dui) {
				var dizhi = $('#dizhi').val(),
					email = $('#email').val();
				var where = $("#chengshi").html();
				where = where.split(" ");
				if(where == "请选择所在城市") {
					where = ""
				}
				var whereCode = $("#chengshi").attr("data-where");
				whereCode = whereCode.split(",");
				buyPrem = $('#money').html().split('.');
				var startPrem = Number(buyPrem[0]) * Number(vm.feilvshuzi);
				beiName = vm.Objectitle.insureInfo.insureName;
				var redata = {
					"head": {
						"userCode": userCode,
						"channel": channel,
						"transTime": $.getTimeStr(),
						"transToken": transToken
					},
					"body": {
						"insuranceNum": $('#goumai').val(),
						"startPrem": startPrem + "",
						"bankCode": $('.bank').attr('bankCode'),
						"buyPrem": buyPrem[0],
						"cardNo": $('#yinhangka').val(),
						"bankName": bankName,
						"commodityCombinationId": commodityCombinationId,
						"commodityId": commodityId,
						"touName": beiName,
						"touPwd": vm.Objectitle.insureInfo.insureIdNO,
						"touPhone": vm.Objectitle.insureInfo.insurePhone,
						"touSex": $.getSexHong(vm.Objectitle.insureInfo.insureIdNO) + "",
						"touProvince": where[0], //投保人所属地区的省名称
						"touCity": where[1], //投保人所属地区的市名称
						"touArea": where[2], //投保人所属地区的区名称
						"touProvinceCode": whereCode[0], //投保人所属地区的省代码
						"touCityCode": whereCode[1], //投保人所属地区的市代码
						"touAreaCode": whereCode[2], //投保人所属地区的区代码
						"touAddress": dizhi, //投保人地址"开福区德雅路109号"
						"touEmail": email, //投保人电子邮箱
						"beiName": beiName, //被投保人姓名
						"beiPwd": vm.Objectitle.insureInfo.insureIdNO, //被投保人身份证
						"beiPhone": vm.Objectitle.insureInfo.insurePhone, //被投保人手机号
						"beiSex": $.getSexHong(vm.Objectitle.insureInfo.insureIdNO) + "", //性别
						"beiProvince": where[0], //被投保人所属地区的省名称
						"beiCity": where[1], //被投保人所属地区的市名称
						"beiArea": where[2], //被投保人所属地区的区名称
						"beiProvinceCode": whereCode[0], //被投保人所属地区的省代码
						"beiCityCode": whereCode[1], //被投保人所属地区的省代码
						"beiAreaCode": whereCode[2], //被投保人所属地区的省代码				
						"beiAddress": dizhi, //被投保人地址
						"beiEmail": email, //被投保人电子邮箱 	
						"bankMaxMoney": bankMaxMoney + "", //银行最大金额
						"invitePhone": invMobie, //引荐人手机号
						"inFlag": inFlag, //来源渠道
						"buyType": '1', //1直接购买，2分享购买
						"customerId": customerId,
					}
				};
				var url = base.url + 'hkunderwrit/saveOrder.do';
				$.reqAjaxs(url, redata, saveOrder);
			}
		} else {
			mui.alert('请勾选已阅读协议');
		}
	})
	if(pieces != null) {
		$('#goumai').val(pieces);
	}
	/*发送短信*/
	$(".dianji").unbind("tap").bind("tap", function() {
		sendMessage();
	})

	function getInsureInfo(data) {
		console.log(data);
		vm.Objectitle = data.returns;
		console.log(vm.Objectitle);

		vm.feilv = '本产品初始费用' + Number(vm.Objectitle.insureInfo.firstRate) * 100 + '%,进入账户金额';
		vm.comComName = title;
		vm.feilvshuzi = Number(vm.Objectitle.insureInfo.firstRate);
		vm.Objectitle = data.returns;
		if(pieces) {
			vm.mymoney = intToFloat(997 * pieces);
			vm.startPiece = intToFloat(1000 * pieces);
		} else {
			vm.mymoney = intToFloat(Number(vm.Objectitle.insureInfo.upPrice) - (Number(vm.Objectitle.insureInfo.upPrice) * Number(vm.Objectitle.insureInfo.firstRate))); /*进入账户金额*/
			vm.startPiece = intToFloat(vm.Objectitle.insureInfo.upPrice);
		}
		vm.startPiecechushi = intToFloat(vm.Objectitle.insureInfo.upPrice);
		console.log(vm.mymoney);

		vm.CommodityCombinationModuleList = data.returns.CommodityCombinationModuleList;

		vm.fenshu = vm.Objectitle.insureInfo.salesNum;
		if(vm.Objectitle.insureInfo.insureIdNO != null && vm.Objectitle.insureInfo.insureIdNO != "") {
			vm.shenfenzheng = shenfen(vm.Objectitle.insureInfo.insureIdNO);
		} else {
			vm.shenfenzheng = '';
		}
		if(vm.Objectitle.insureInfo.insurePhone != null && vm.Objectitle.insureInfo.insurePhone != "") {
			vm.phone = phoneyin(vm.Objectitle.insureInfo.insurePhone);
		} else {
			vm.phone = '';
		}
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
		$("#money").html(1000 * pieces);
		/*点击+-*/
		$(".up").unbind("tap").bind("tap", function() {
			var fenshu = $('.fenshu_input').children('input').val();
			var money = $('#money').html().split('元')[0];
			var mymoney = $('#mymoney').html();
			fenshu = Number(fenshu) + 1;
			if(fenshu > vm.fenshu) {
				fenshu = vm.fenshu;
			} else {
				money = intToFloat((Number(money) + Number(vm.startPiecechushi)));
				mymoney = intToFloat(Number(mymoney) + (Number(vm.startPiecechushi) - (Number(vm.startPiecechushi) * Number(vm.feilvshuzi))));
			}
			$('.fenshu_input').children('input').val(fenshu);
			$('#money').html(money + '元');
			$('#mymoney').html(mymoney);
		})
		$(".minus").unbind("tap").bind("tap", function() {
			var fenshu = $('.fenshu_input').children('input').val();
			var money = $('#money').html().split('元')[0];
			console.log(money)
			var mymoney = $('#mymoney').html();
			fenshu = Number(fenshu) - 1;
			console.log(fenshu)
			if(fenshu < 1) {
				fenshu = '1';
			} else {
				money = intToFloat((Number(money) - Number(vm.startPiecechushi)));
				mymoney = intToFloat(Number(mymoney) - (Number(vm.startPiecechushi) - (Number(vm.startPiecechushi) * Number(vm.feilvshuzi))));
			}
			$('.fenshu_input').children('input').val(fenshu);
			$('#money').html(money + '元');
			$('#mymoney').html(mymoney);
		})
	}
	getProvinceReq();
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
	/*点击X关发送短信窗口*/
	$(".note-div_title_right").unbind("tap").bind("tap", function() {
		$('.note').hide();
		window.clearInterval(InterValObj); //停止计时器  
		$(".dianji").removeClass("mui-disabled"); //启用按钮  
		$(".dianji").attr("style", "color:#333");
		$(".dianji").html("获取验证码");
	});
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
	/*隐藏身份证中间几位*/
	function shenfen(shenfen) {
		var mphone = shenfen.substr(0, 3) + '**************' + shenfen.substr(-4);
		return mphone;
	}
	/*保留二位小数*/
	function intToFloat(val) {
		return new Number(val).toFixed(2);
	}
	/*点击银行卡*/
	$(".bank").unbind("tap").bind("tap", function() {
		urlParm.title = '银行卡信息';
		urlParm.pieces = $('#goumai').val();
		urlParm.titles = vm.comComName;
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href = "../cardList/cardList.html?jsonKey=" + jsonStr;
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
			"body": {
				"customerId": customerId,
			}
		};
		var url = base.url + 'investmentLinkedInsurance/getSelection.do';
		$.reqAjaxs(url, reqData, getSelection);
	}

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

})

/*核保*/
function saveOrder(data) {
	console.log(data.statusCode);
	if(data.statusCode == '000000') {
		orderNo = data.returns.OrderNo;
		insureNo = data.returns.ProposalNo;
		$('.note').show();
		/*触发短信接口*/
		$(".note-div-btn").unbind("tap").bind("tap", function() {
			if($('#yan').val() != null && $('#yan').val() != "") {
				if(ma == $('#yan').val()) {
					var reqData = {
						"head": {
							"userCode": userCode,
							"channel": channel,
							"transTime": $.getTimeStr(),
							"transToken": transToken
						},
						"body": {
							"bankCode": $('.bank').attr('bankCode'),
							"holderName": beiName,
							"cardNo": $('#yinhangka').val(),
							"orderNo": orderNo,
							"insureNo": insureNo,
							"payAmount": buyPrem[0],
							"productFlag": productFlag,
							"customerId": customerId,
						}
					}
					var url = base.url + 'hkunderwrit/getinsure.do';
					$.reqAjaxs(url, reqData, getinsure);
				} else {
					mui.alert('验证码错误!');
				}
			} else {
				mui.alert('验证码不能为空!');
			}
		})
	} else {
		mui.alert(data.statusMessage);
	}
}

function getinsure(data) {
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
}
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
		return 2; //女
	} else {
		return 1; //男
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
	window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
}