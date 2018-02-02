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
	shareMobile = urlParm.shareMobile, //分享人手机号
	riskSupportAbility = urlParm.riskSupportAbility, //类型
	pieces = urlParm.pieces,
	holderbr = urlParm.holderbr,
	holderbrto = urlParm.holderbrto,
	channel = urlParm.channel,
	remark = urlParm.remark,
	level = urlParm.level,
	youxiaoqi = urlParm.youxiaoqi,
	diqu = urlParm.diqu,
	diquccod = urlParm.diquccod,
	ccod = urlParm.ccod,
	zhiyename = urlParm.zhiyename,
	baoxiantiaokuan = urlParm.baoxiantiaokuan,
	toubaoguize = urlParm.toubaoguize,
	title = urlParm.title;

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
/*if(isWeiXin()) {
	$(".changyongbaoxian").hide();
}*/
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
	buyType = '1';
} else {
	inFlag = '2';
	buyType = '2';
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
			emsbianma: '', //邮政编码
			income: '', //年收入
			zhiyeleibie: '', //职业类别
			zhiyeleibiecod: '', //职业类别代码
		},
		holderbrto: {
			name: '',
			idNo: '',
			phone: '',
			email: '',
			address: '',
			emsbianma: '', //邮政编码
			income: '', //年收入
			guanxi: '',
		},
		channel: '',
		baoxiantiaokuan: '',
		toubaoguize: '',
		myhoder: true, //判定是否是个
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
	vm.toubaoguize = toubaoguize;
	vm.baoxiantiaokuan = baoxiantiaokuan;
	vm.channel = channel;
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
	if(level == '' || level == null) {
		$('#zhiyeleibie').html('请选择');
	} else {
		$('#zhiyeleibie').html(zhiyename);
		$('#zhiyeleibie').attr('data-where', ccod);
	}
	if(youxiaoqi != null && youxiaoqi != '') {
		$('#shenfenzhengyxq').html(youxiaoqi);
	}
	if(diqu != null && diqu != '') {
		$('#chengshi').html(diqu);
	}
	if(diquccod != null && diquccod != '') {
		$('#chengshi').attr('data-where', diquccod);
	}

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
		var beiName = $('#name').val();
		var isphone = $('#phone').val();
		var yinhang = $('#yinhangka').val();
		var bankName = $('.bank').html();
		var isidNo = $('#idNo').val();
		var reg = new RegExp("^[0-9]*$");
		var panage = getAge_premium($.getBirthDay($('#idNo').val()));
		var emsbianma = $('#emsbianma').val();
		var income = $('#income').val();
		var guanxicod = $('#guanxi').attr('data-where');
		var dengji = $('#zhiyeleibie').attr('dengji');
		var zhiye = $('#zhiyeleibie').attr('data-where');
		var zongfenshu = $('#goumai').val();
		var dui = true;
		if(vm.myhoder) {
			vm.holderbrto = vm.holderbr;
			$('#nameto').val(vm.holderbrto.name);
			$('#idNoto').val(vm.holderbrto.idNo);
			$('#phoneto').val(vm.holderbrto.phone);
			$('#guanxi').html('本人');
			$('#guanxi').attr('data-where', '00');
		} else {
			var guanxi = $('#guanxi').html();
			var nameto = $('#nameto').val();
			var idNoto = $('#idNoto').val();
			var phoneto = $('#phoneto').val();
			if($.isNull(nameto)) {
				mui.alert("被保人名称不能为空");
				dui = false;
			} else if($.isNull(idNoto)) {
				mui.alert("被保人身份证号不能为空");
				dui = false;
			} else if($.isNull(phoneto)) {
				mui.alert("被保人手机号不能为空");
				dui = false;
			} else if(!tit.regExp.isMobile(phoneto)) {
				modelAlert("请输入正确的手机号码！");
				dui = false;
			}
			vm.holderbrto.guanxi = $('#guanxi').html();
			vm.holderbrto.guanxicod = $('#guanxi').attr('data-where');
			vm.holderbrto.name = $('#nameto').val();
			vm.holderbrto.idNo = $('#idNoto').val();
			vm.holderbrto.phone = $('#phoneto').val();
		}
		if(chengshi == '请选择') {
			mui.alert("请选择地区");
			dui = false;
		} else if(zongfenshu < 10) {
			mui.alert("单笔最少购买10份，最多可购买5000份");
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
		} else if($.isNull(emsbianma)) {
			modelAlert("邮政编码不能为空!");
			dui = false;
		} else if(emsbianma.length != 6) {
			modelAlert("邮政编码必须为6位数字!");
			dui = false;
		} else if($.isNull(income)) {
			modelAlert("年收入不能为空!");
			dui = false;
		} else if(guanxicod == '' || guanxicod == null) {
			modelAlert("请选择投被保人关系！");
			dui = false;
		} else if(dengji == '12100309' || dengji == '12020205') {
			modelAlert("五类,六类职业类别无法投保！");
			dui = false;
		} else if(zhiye == '' || zhiye == null) {
			modelAlert("请选择职业类别！");
			dui = false;
		} else if(panage > 65 || panage <= 0) {
			if(panage <= 0) {
				var shengri = $.getBirthDay($('#idNoto').val());
				var date2 = new Date();
				var date3 = date2.getTime() - new Date(shengri).getTime();
				var zong = Math.floor(date3 / (24 * 3600 * 1000))
				if(zong < 28) {
					modelAlert("投保人年龄必须为28天至65周岁");
					dui = false;
				}
			}
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
					"totalPremium": buyPrem[0], //总保费
					"commodityCombinationId": commodityCombinationId, //商品组合id
					"commodityId": commodityId,
					"bankAccNo": $('#yinhangka').val(), //银行卡号
					"bankCode": $('.bank').attr('bankCode'), //banCode 
					"accName": beiName, //交费帐户名
					"customerId": customerId, //用户id
					"order_resource": "3", //1.微信公众号2、分享进入3、APP
					"applicant_name": beiName, //投保人姓名
					"applicant_id_no": $('#idNo').val(),
					"applicant_sex": $.getSexHong($('#idNo').val()) + '',
					"applicant_birthDay": $.getBirthDay($('#idNo').val()),
					"applicant_address": $('#dizhi').val(), //投保人家庭地址
					"applicant_zipCode": $('#emsbianma').val(), //投保人邮编
					"applicant_email": $('#email').val(), //投保人邮编
					"applicant_age": getAge_premium($.getBirthDay($('#idNo').val())) + '',
					"applicant_phone": $('#phone').val(), //投保人手机号
					"salary": $('#income').val(),
					"insured_name": $('#nameto').val(),
					"insured_id_no": $('#idNoto').val(),
					"insured_sex": $.getSexHong($('#idNoto').val()) + '',
					"insured_birthDay": $.getBirthDay($('#idNoto').val()),
					"insured_phone": $('#phoneto').val(),
					"insured_jobCode": zhiye, //被保人职业
					"insured_age": getAge_premium($.getBirthDay($('#idNoto').val())) + '', //被保人年龄
					"relaToAppnt": guanxicod, //被保人和投保人关系
					"buyType": buyType, //1直接购买，2分享购买
					"provinceCode": whereCode[0], //投保人所属地区的省代码
					"cityCode": whereCode[1], //投保人所属地区的市代码
					"invitePhone": shareMobile,
				}
			}
			var url = base.url + 'insuredkunlun/insured.do';
			$.reqAjaxs(url, redata, saveOrder);
		}
	} else {
		mui.alert('请勾选已阅读协议');
	}
})
if(pieces != null) {
	$('#goumai').val(pieces);
}

function show() {
	var mydate = new Date();
	var str = "" + mydate.getFullYear() + '-';
	str += (mydate.getMonth() + 1) + '-';
	str += mydate.getDate() + '-';
	return str;
}

function getInsureInfo(data) {
	getProvinceReq();
	getzhiye();
	getguanxi();
	vm.Objectitle = data.returns;
	console.log(vm.Objectitle);
	if(pieces == null || pieces == '') {
		pieces = $('#goumai').val();
	}
	vm.comComName = title;
	vm.feilvshuzi = 0;
	vm.Objectitle = data.returns;
	if(holderbr) {
		vm.holderbr = holderbr;
		$('#name').val(vm.holderbr.name);
		$('#idNo').val(vm.holderbr.idNo);
		$('#dizhi').val(vm.holderbr.address);
		$('#emsbianma').val(vm.holderbr.emsbianma);
		$('#income').val(vm.holderbr.income);
		$('#phone').val(vm.holderbr.phone);
		$('#email').val(vm.holderbr.email);
	}
	if(vm.myhoder) {
		vm.holderbrto = vm.holderbr;
	}
	if(holderbrto) {
		vm.holderbrto = holderbrto;
		$('#nameto').val(vm.holderbrto.name);
		$('#idNoto').val(vm.holderbrto.idNo);
		$('#phoneto').val(vm.holderbrto.phone);
		if(holderbrto.guanxi != null && holderbrto.guanxi != '') {
			$('#guanxi').html(holderbrto.guanxi);
		}
		if(holderbrto.guanxicod != null && holderbrto.guanxicod != '') {
			$('#guanxi').attr('data-where', holderbrto.guanxicod);
		}
		if(holderbr.zhiyeleibie != null && holderbr.zhiyeleibie != '') {
			$('#zhiyeleibie').html(holderbr.zhiyeleibie);
		}
		if(holderbr.zhiyeleibiecod != null && holderbr.zhiyeleibiecod != '') {
			$('#zhiyeleibie').attr('data-where', holderbr.zhiyeleibiecod);
		}
	}
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
		upjia();
	})
	$(".minus").unbind("tap").bind("tap", function() {
		var fenshu = $('.fenshu_input').children('input').val();
		var money = $('#money').html().split('元')[0];
		console.log(money);
		fenshu = Number(fenshu) - 1;
		console.log(fenshu)
		if(fenshu < 10) {
			fenshu = '10';
		} else {
			money = intToFloat((Number(money) - Number(vm.startPiecechushi)));
		}
		$('.fenshu_input').children('input').val(fenshu);
		$('#money').html(money + '元');
	})

	function upjia() {
		var fenshu = $('.fenshu_input').children('input').val();
		var money = $('#money').html().split('元')[0];
		fenshu = Number(fenshu) + 1;
		if(fenshu > vm.fenshu) {
			fenshu = vm.fenshu;
		} else {
			money = intToFloat((Number(money) + Number(vm.startPiecechushi)));
		}
		$('.fenshu_input').children('input').val(fenshu);
		$('#money').html(money + '元');
	}
}
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
	vm.holderbr.emsbianma = $('#emsbianma').val();
	vm.holderbr.income = $('#income').val();
	vm.holderbr.zhiyeleibie = $('#zhiyeleibie').html();
	vm.holderbr.zhiyeleibiecod = $('#zhiyeleibie').attr('data-where');

	vm.holderbrto.guanxi = $('#guanxi').html();
	vm.holderbrto.guanxidata = $('#guanxi').attr('data-where');
	vm.holderbrto.name = $('#nameto').val();
	vm.holderbrto.idNo = $('#idNoto').val();
	vm.holderbrto.phone = $('#phoneto').val();

	urlParm.title = '银行卡信息';
	urlParm.holderbr = vm.holderbr;
	urlParm.holderbrto = vm.holderbrto;
	urlParm.pieces = $('#goumai').val();
	urlParm.diqu = $('#chengshi').html();
	urlParm.diquccod = $('#chengshi').attr('data-where');
	urlParm.youxiaoqi = $('#shenfenzhengyxq').html();
	urlParm.titles = vm.comComName;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = "../cardList/cornucopiaList.html?jsonKey=" + jsonStr;
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
	var url = base.url + 'klBasic/getklSelection.do';
	$.reqAjaxs(url, reqData, getSelection);
}
//获取联动列表
function getzhiye() {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {}
	};
	var url = base.url + 'klBasic/getklJobs.do';
	$.reqAjaxs(url, reqData, getklJobs);
}
//获取联动列表关系
function getguanxi() {
	var reqData = {
		"body": {
			"dic_type": "ap_ration"
		},
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
		}
	};
	var url = base.url + 'klBasic/getklEnumer.do';
	$.reqAjaxs(url, reqData, getklEnumer);
}
/*获取被保人关系接口*/
function getklEnumer(data) {
	if(data.statusCode == "000000") {
		var cityPicker3 = new mui.PopPicker({
			layer: 1
		});
		var datalistguanxi = Array();
		datalistguanxi = data.returns.list;
		datalistguanxi.forEach(function(index, element) {
			datalistguanxi[element].text = index.dicValue;
			datalistguanxi[element].value = index.channelDicCode;
		})
		cityPicker3.setData(datalistguanxi);
		$("#guanxi").bind("tap", function() {
			cityPicker3.show(function(item) {
				var cityText = item[0].text;
				var cityValue = item[0].value;
				$("#guanxi").html(cityText);
				$("#guanxi").attr("data-where", cityValue);
			});
		});
	} else {
		modelAlert(data.statusMessage);
	}
}
/*获取职业信息接口*/
function getklJobs(data) {
	if(data.status_code == "000000") {
		var cityPicker3 = new mui.PopPicker({
			layer: 2
		});
		cityPicker3.setData(data.returns);
		$("#zhiyeleibie").bind("tap", function() {
			cityPicker3.show(function(item) {
				var cityText = item[0].text + " " + item[1].text;
				var cityValue = item[1].value;
				var risk_level = item[1].risk_level;
				$("#zhiyeleibie").html(cityText);
				$("#zhiyeleibie").attr("data-where", cityValue);
				$("#zhiyeleibie").attr("dengji", risk_level);
			});
		});
	} else {
		modelAlert(data.statusMessage);
	}
}
//跳转到常用保险人
$("#commonHoldersto").unbind("tap").bind("tap", function() {
	urlParm.userCode = userCode;
	urlParm.diqu = $('#chengshi').html();
	urlParm.diquccod = $('#chengshi').attr('data-where');
	urlParm.youxiaoqi = $('#shenfenzhengyxq').html();
	urlParm.pieces = $('#goumai').val();
	urlParm.title = "常用被保人";
	urlParm.titles = vm.comComName;
	urlParm.rightIco = "4";
	urlParm.frompage = "cornucopiaFilloutHTML";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/useApplicant/useApplicant.html?jsonKey=" + jsonStr;
});

function getSelection(data) {
	if(data.status_code == "000000") {
		var cityPicker3 = new mui.PopPicker({
			layer: 2
		});
		cityPicker3.setData(data.returns);
		$("#chengshi").bind("tap", function() {
			cityPicker3.show(function(item) {
				var cityText = item[0].text + " " + item[1].text;
				var cityValue = item[0].value + "," + item[1].value;
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
	var nian = mydate.getFullYear();
	var nianto = mydate.getFullYear() + 50;
	var ri = mydate.getDate();
	var dtpicker = new mui.DtPicker({
		type: "date", //设置日历初始视图模式 
		beginDate: new Date(nian, yue, ri), //设置开始日期 
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
		var ProposalContNo = data.returns.ProposalContNo;
		var PrtNo = data.returns.PrtNo;
		var url = base.url + 'insuredkunlun/payCost.do';
		var datalist = data.returns;
		var redata = {
			"head": {
				"userCode": userCode,
				"channel": channel,
				"transTime": $.getTimeStr(),
				"transToken": transToken
			},
			"body": {
				"prtNo": PrtNo,
				"proposalContNo": ProposalContNo,
				"oldTranNo": orderNo,
			}
		}
		$.reqAjaxs(url, redata, payCost);

		function payCost(data) {
			if(data.statusCode == '000000') {
				var sendData = datalist;
				sendData.commodityCombinationId = commodityCombinationId;
				sendData.comComName = vm.comComName;
				sendData.startPiece = vm.startPiece;
				sendData.userCode = userCode;
				sendData.customerId = customerId;
				sendData.transToken = transToken;
				var jsonStr = UrlEncode(JSON.stringify(sendData));
				window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/cornucopiapayResult.html?jsonKey=" + jsonStr;
			} else if(data.statusCode == '123456') {
				modelAlert(data.statusMessage, '', lognCont);
			} else {
				modelAlert(data.statusMessage);
			}
		}
	} else {
		modelAlert(data.statusMessage);
	}
}

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
	window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/cornucopiaDetails.html?jsonKey=" + jsonStr;
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
$("#goumai").blur(function() {
	var goumai = $("#goumai").val();
	vm.startPiece = '1000.00';
	if(goumai > 5000) {
		$("#goumai").val('5000');
		var goumai = $("#goumai").val();
		var money = vm.startPiecechushi;
		vm.startPiece = intToFloat(goumai * money);
	} else {
		var goumai = $("#goumai").val();
		var money = vm.startPiecechushi;
		vm.startPiece = intToFloat(goumai * money);
	}
	if(goumai < 10) {
		$("#goumai").val('10');
		var goumai = $("#goumai").val();
		var money = vm.startPiecechushi;
		vm.startPiece = intToFloat(goumai * money);
	} else {
		var goumai = $("#goumai").val();
		var money = vm.startPiecechushi;
		vm.startPiece = intToFloat(goumai * money);
	}
});
$('.gou').unbind("tap").bind("tap", function() {
	$('.gou').hide();
	$('.meigou').show();
	$('.bbrul').show()
	vm.myhoder = false;
	$('#guanxi').attr('data-where', '');
	$('#guanxi').html('请选择');
})
$('.meigou').unbind("tap").bind("tap", function() {
	$('.meigou').hide();
	$('.gou').show();
	$('.bbrul').hide()
	vm.myhoder = true;
	$('#guanxi').attr('data-where', '00');
	$('#guanxi').html('本人');
})