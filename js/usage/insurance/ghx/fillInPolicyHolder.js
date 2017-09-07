var cxSessionId = "";
var code;
var productCode;
var flag = 1;
var s;
var parm;
var pflag;
var jsk = {};
var nowt = new Date();
var year = nowt.getFullYear();
var month = nowt.getMonth() + 1;
var day = nowt.getDate(); //当前年月日
var t = Date.parse(year + "/" + month + "/" + day);
$(function() {		
		var jsonStr = getUrlQueryString("jsonKey");		
		jsonStr = UrlDecode(jsonStr);
		parm = JSON.parse(jsonStr);
		if(parm.tbrm != "请输入姓名"&&parm.tbrm != undefined){
			$("#policyholder_name_input").val(parm.tbrm).css("color", "#585858");
		}
		if(parm.tbrzj!= "请输入证件号码"&&parm.tbrm != undefined){
			$("#policyholder_idnumber_input").val(parm.tbrzj).css("color", "#585858");
		}
		if(parm.tbrsjh!= "请输入手机号码"&&parm.tbrm != undefined){
			$("#policyholder_phone_input").val(parm.tbrsjh).css("color", "#585858");
		}
		if(parm.dzy!= "请输入电子邮箱"&&parm.tbrm != undefined){
			$("#policyholder_email_input").val(parm.dzy).css("color", "#585858");
		}
		
		if(parm.bbrm != "请输入姓名"&&parm.tbrm != undefined){
			$("#recognizee_name_input").val(parm.bbrm).css("color", "#585858");
		}else{
			$.replacePlaceholder($("#recognizee_name_input"), "请输入姓名");
		}
		if(parm.bbrzj!= "请输入证件号码"&&parm.tbrm != undefined){
			$("#recognizee_idnumber_input").val(parm.bbrzj).css("color", "#585858");
		}else{
			$.replacePlaceholder($("#recognizee_idnumber_input"), "请输入证件号码");
		}
		if(parm.bbrsjh!= "请输入手机号码"&&parm.tbrm != undefined){
			$("#recognizee_phone_input").val(parm.bbrsjh).css("color", "#585858");
		}else{
			$.replacePlaceholder($("#recognizee_phone_input"), "请输入手机号码");
		}		
		$(".btn_jump_policy_distribution").css("background-color", "#C6C6C6");
		
		s = parm.dicCode.substr(11, 1);
		if(s == "A") {
			s = "0";
		} else if(s == "B") {
			s = "1";
		}
		pflag = parm.flag;
		if(pflag == "0") { //
			flag = 0;
			$(".flt").attr("src", "../../img/no.png");
			$(".show").css("display", "block");
		} else  {
			$(".flt").attr("src", "../../img/yes.png");
			$(".show").css("display", "none");
		}
		//	console.log(parm)
		//	parm.remark = "005199002,005099004,005099003";
		code = parm.remark.split(",");	//code  数组
		productCode = parm.dicCode;
		$("#yybf").html(parm.baofeiSum + "元");		
		/* 设置滑动区域 */
		$.setscroll();
		/*投保人录入模块*/
		$.policyholderOperate();
		/*被保人录入模块*/

		//是不是同一个人
		$("#sbstr").unbind("tap").bind("tap", function() {

			var picName = $(".flt").attr("src").substring($(".flt").attr("src").lastIndexOf("/") + 1);
			if(picName == "yes.png") {
				flag = 0;
				$(".flt").attr("src", "../../img/no.png");
				$(".show").css("display", "block");
				$.replacePlaceholder($("#recognizee_name_input"), "请输入姓名");
				$("#recognizee_name_input").val("请输入姓名").css("color", "#ccc");
				$.replacePlaceholder($("#recognizee_idnumber_input"), "请输入证件号码");
				$("#recognizee_idnumber_input").val("请输入证件号码").css("color", "#ccc");
				$.replacePlaceholder($("#recognizee_phone_input"), "请输入手机号码");
				$("#recognizee_phone_input").val("请输入手机号码").css("color", "#ccc");
				$.replacePlaceholder($("#recognizee_address_input"), "请输入地址");
				$.replacePlaceholder($("#recognizee_email_input"), "请输入电子邮箱");
			} else {
				flag = 1;
				$(".flt").attr("src", "../../img/yes.png");
				$(".show").css("display", "none");
			}

			/*实时检查被保人信息*/
			blurCheackRecognizee();
		});

		$(".tbxz").unbind("tap").bind("tap", function() {
			parm.flag = flag;
			parm.tbrm = $("#policyholder_name_input").val();
			parm.tbrzj = $("#policyholder_idnumber_input").val();
			parm.tbrsjh = $("#policyholder_phone_input").val();
			parm.dzy = $("#policyholder_email_input").val();
			parm.bbrm = $("#recognizee_name_input").val()
			parm.bbrzj = $("#recognizee_idnumber_input").val();
			parm.bbrsjh = $("#recognizee_phone_input").val();
			var jsonStr = UrlEncode(JSON.stringify(parm));
			window.location.href = "toubaoxuzhi3.html?jsonKey=" + jsonStr;
		});
		//点击返回按钮操作
		$("#insureback").unbind("tap").bind("tap", function() {
			jsk.mobile = parm.userCode;
			jsk.productId = parm.productId;
			jsk.commodityNo = parm.commodityId;
			jsk.customerId = parm.customerId;
			jsk = UrlEncode(JSON.stringify(jsk));
			
			window.location.href = "ghxProductdetail.html?jsonKey="+jsk;
		});

		$(".agree").unbind("tap").bind("tap", function() {
			var picName = $(".dagou").attr("src").substring($(".dagou").attr("src").lastIndexOf("/") + 1);
			if(picName == "unchecked8.png") {
				$(".dagou").attr("src", "../../img/checked9.png");
				$(".btn_jump_policy_distribution").css("background-color", "#1b6bb8");
			} else {
				$(".dagou").attr("src", "../../img/unchecked8.png");
				$(".btn_jump_policy_distribution").css("background-color", "#C6C6C6");
			}
		});
		// 下一步
		$("#nextstep").unbind("tap").bind("tap", function() {

			// 解绑实时检查投/被保人信息
			unBindblurCheackRecognizee();
			// 校验信息
			cheackRecognizeeInfo();
			// 若校验信息通过则往下执行
			//			var cheakRecognizeeFlag = true;
			if(cheakRecognizeeFlag == true) {
				submitInfos();

			} else {

			}

		});

		//	/*证件号选择*/
		//	$("#policyholder_idtype_select").unbind("tap").bind("tap",function(){
		//		var selectval = $("#policyholder_idtype").val();
		//		openSelectList("policyholder_idtype", 
		//			selectval, $.policyholderIdtypeCallBack, true);
		//	});
	})
	// 实时检查被保人信息
function blurCheackRecognizee() {
	// 被保人姓名校验
	$("#recognizee_name_input").change(
		function() {
			if($.isNull($("#recognizee_name_input").val()) ||
				$("#recognizee_name_input").val() == "请输入姓名") {
				return false;
			} else if(tit.regExp.isChinese($("#recognizee_name_input").val()) == false) {
				mui.alert("姓名只能是汉字,请重新输入！");
//				$("#recognizee_name_input").val("请输入姓名").css("color", "#ccc");
				return false;
			}
		});

	// 校验 被保人身份证号
	$("#recognizee_idnumber_input").change(
		function() {
			if($("#recognizee_idnumber_input").val().length == 18) {
				$("#recognizee_idnumber_input").val($("#recognizee_idnumber_input").val().toUpperCase());
			}
			if($.isNull($("#recognizee_idnumber_input").val()) ||
				$("#recognizee_idnumber_input").val() == "请输入证件号码") {
				return false;
			} else if($.checkIdCard($("#recognizee_idnumber_input").val().toLocaleUpperCase()) != 0) {
				mui.alert("身份证号有误，请重新输入！");
//				$("#recognizee_idnumber_input").val("请输入证件号码").css("color", "#ccc");
				return false;
			}
		});

	// 被保人手机号码校验
	$("#recognizee_phone_input").change(
		function() {
			if($.isNull($("#recognizee_phone_input").val()) ||
				$("#recognizee_phone_input").val() == "请输入手机号码") {
				return false;
			} else if(tit.regExp.isMobile($("#recognizee_phone_input").val()) == false) {
				mui.alert("手机号有误，请重新输入！");
//				$("#recognizee_phone_input").val("请输入手机号码").css("color", "#ccc");
				return false;
			}
		});

	// 被保人电子邮箱验证
//	$("#recognizee_email_input").change(
//		function() {
//			if($.isNull($("#recognizee_email_input").val()) ||
//				$("#recognizee_email_input").val() == "输入后保单将发至该邮箱") {
//				return false;
//			} else if(tit.regExp.isEmail($("#recognizee_email_input").val()) == false) {
//				mui.alert("邮箱格式输入有误，请重新输入！");
//				$("#recognizee_email_input").val("输入后保单将发至该邮箱").css("color", "#ccc");
//				return false;
//			}
//		});

}
// 实时检查投保人信息
function blurCheackPHinfo() {
	// 投保人姓名校验
	$("#policyholder_name_input").change(
		function() {
			if($.isNull($("#policyholder_name_input").val()) ||
				$("#policyholder_name_input").val() == "请输入姓名") {
				return false;
			} else if(tit.regExp.isChinese($("#policyholder_name_input")
					.val()) == false) {
				mui.alert("姓名只能是汉字，请重新输入！");
//				$("#policyholder_name_input").val("请输入姓名").css("color",
//					"#ccc");
				return false;
			}
		});

	// 校验 投保人身份证号
	$("#policyholder_idnumber_input").change(
		function() {
			if($("#policyholder_idnumber_input").val().length == 18) {
				$("#policyholder_idnumber_input").val($("#policyholder_idnumber_input").val().toUpperCase());
			}
			if($.isNull($("#policyholder_idnumber_input").val()) ||
				$("#policyholder_idnumber_input").val() == "请输入证件号码") {
				return false;
			} else if($.checkIdCard($("#policyholder_idnumber_input").val().toLocaleUpperCase()) != 0) {
				mui.alert("身份证号有误，请重新输入！");
//				$("#policyholder_idnumber_input").val("请输入证件号码").css("color", "#ccc");
				return false;
			}
		});

	// 投保人手机号码校验
	$("#policyholder_phone_input").change(
		function() {
			if($.isNull($("#policyholder_phone_input").val()) ||
				$("#policyholder_phone_input").val() == "请输入手机号码") {
				return false;
			} else if(tit.regExp.isMobile($("#policyholder_phone_input")
					.val()) == false) {
				mui.alert("手机号有误，请重新输入！");
//				$("#policyholder_phone_input").val("请输入手机号码").css("color",
//					"#ccc");
				return false;
			}
		});
	// 投保人邮箱校验
	$("#policyholder_email_input").change(
		function() {
			if($.isNull($("#policyholder_email_input").val()) ||
				$("#policyholder_email_input").val() == "请输入电子邮箱") {
				return false;
			} else if(tit.regExp.isEmail($("#policyholder_email_input").val()) == false) {
				mui.alert("请输入正确的邮箱！");
//				$("#policyholder_email_input").val("请输入电子邮箱").css("color", "#ccc");
				return false;
			}
		});

}
$.policyholderOperate = function() {
	//提示语隐藏
	$.replacePlaceholder($("#policyholder_name_input"), "请输入姓名");
	$.replacePlaceholder($("#policyholder_idnumber_input"), "请输入证件号码");
	$.replacePlaceholder($("#policyholder_phone_input"), "请输入手机号码");
	$.replacePlaceholder($("#policyholder_address_input"), "请输入地址");
	$.replacePlaceholder($("#policyholder_email_input"), "请输入电子邮箱");
	// 实时检查投保人信息
	blurCheackPHinfo();
};
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#insure_indexs").height(Scrollheight);
	mui("#insure_indexs").scroll();
};

function unBindblurCheackRecognizee() {
	$('#policyholder_name_input').unbind('change'); // 投保人姓名取消事件
	$('#policyholder_idnumber_input').unbind('change'); // 投保人身份证号取消事件
	$('#policyholder_phone_input').unbind('change'); // 投保人手机号取消事件
	$('#policyholder_email_input').unbind('change'); // 投保人电子邮箱取消事件

	$('#recognizee_name_input').unbind('change'); // 被保人姓名取消事件
	$('#recognizee_idnumber_input').unbind('change'); // 被保人身份证号取消事件
	$('#recognizee_phone_input').unbind('change'); // 被保人手机号取消事件

}
// 校验信息
function cheackRecognizeeInfo() {
	// 勾选协议
	var picName1 = $(".dagou").attr("src").substring($(".flt").attr("src").lastIndexOf("/") + 1);
	if(picName1 == "unchecked8.png") {
		$(".btn_jump_policy_distribution").css("background-color", "#C6C6C6");
		cheakRecognizeeFlag = false;
		return false;
	} else {
		$(".btn_jump_policy_distribution").css("background-color", "#1b6bb8");
	}

	var currentTime = new Date().getTime(); // 当前时间
	var policyholder_name_input = $("#policyholder_name_input").val(); // t保人姓名
	var policyholder_idnumber_input = $("#policyholder_idnumber_input").val(); // t保人证件号码
	var policyholder_phone_input = $("#policyholder_phone_input").val(); // t保人手机号码
	var policyholder_email_input = $("#policyholder_email_input").val(); // t保人电子邮箱
	var policyholder_occ_input = $("#policyholder_occ_input").val(); // t保人电子邮箱

	var recognizee_name_input = $("#recognizee_name_input").val(); // 被保人姓名
	var recognizee_idnumber_input = $("#recognizee_idnumber_input").val(); // 被保人证件号码
	var recognizee_phone_input = $("#recognizee_phone_input").val(); // 被保人手机号码
	var recognizee_email_input = $("#recognizee_email_input").val(); // 被保人电子邮箱
	// 判断非空
	if($.isNull(policyholder_name_input) || policyholder_name_input == "请输入姓名") {
		modelAlert("请输入投保人姓名！");
		cheakRecognizeeFlag = false;
		return false;
	}
	if(tit.regExp.isChinese(policyholder_name_input) == false) {
		modelAlert("姓名只能是汉字，请重新输入！");
//		$("#policyholder_name_input").val("请输入姓名").css("color", "#ccc");
		cheakRecognizeeFlag = false;
		return false;
	}
	if($.isNull(policyholder_idnumber_input) ||
		policyholder_idnumber_input == "请输入证件号码") {
		modelAlert("请输入投保人证件号码！");
		cheakRecognizeeFlag = false;
		return false;
	}
	if($.checkIdCard($("#policyholder_idnumber_input").val().toLocaleUpperCase()) != 0) {
		modelAlert("身份证号有误，请重新输入！");
//		$("#policyholder_idnumber_input").val("请输入证件号码").css("color", "#ccc");
		cheakRecognizeeFlag = false;
		return false;
	}
	var y = $("#policyholder_idnumber_input").val().substr(6, 4);
	var m = $("#policyholder_idnumber_input").val().substr(10, 2);
	var d = $("#policyholder_idnumber_input").val().substr(12, 2);
	if(year - y >= 19) {

	} else if(year - y == 18) {
		if(month > m) {

		} else if(month == m) {
			if(day >= d) {

			} else {
				modelAlert("投保人年龄需在18周岁以上！");
				cheakRecognizeeFlag = false;
				return false;
			}
		} else {
			modelAlert("投保人年龄需在18周岁以上！");
			cheakRecognizeeFlag = false;
			return false;
		}
	} else {
		modelAlert("投保人年龄需在18周岁以上！");
		cheakRecognizeeFlag = false;
		return false;
	}

	if($.isNull(policyholder_phone_input) || policyholder_phone_input == "请输入手机号码") {
		modelAlert("请输入投保人手机号码！");
		cheakRecognizeeFlag = false;
		return false;
	}
	if(tit.regExp.isMobile(policyholder_phone_input) == false) {
		modelAlert("手机号有误，请重新输入！");
		cheakRecognizeeFlag = false;
		return false;
	}
	if($.isNull(policyholder_email_input) ||
		policyholder_email_input == "请输入电子邮箱") {
		modelAlert("请输入投保人电子邮箱！");
		cheakRecognizeeFlag = false;
		return false;
	}
	if(tit.regExp.isEmail(policyholder_email_input) == false) {
		modelAlert("邮箱格式输入有误，请重新输入！");
		cheakRecognizeeFlag = false;
		return false;
	}

	/******************被保人 *************************/
	var picName2 = $(".flt").attr("src").substring($(".flt").attr("src").lastIndexOf("/") + 1);
	if(picName2 == "no.png") {
		if(policyholder_idnumber_input == recognizee_idnumber_input) {
			modelAlert("如被保险人和投保人一致，请选择本人投保！");
			cheakRecognizeeFlag = false;
			return false;
		}

		if($.isNull(recognizee_name_input) || recognizee_name_input == "请输入姓名") {
			modelAlert("请输入被保人姓名！");
			cheakRecognizeeFlag = false;
			return false;
		}

		// 被保人姓名校验
		if(tit.regExp.isChinese(recognizee_name_input) == false) {
			modelAlert("姓名只能是汉字，请重新输入！");
//			$("#recognizee_name_input").val("请输入姓名").css("color", "#ccc");
			cheakRecognizeeFlag = false;
			return false;
		}

		// 证件号码校验
		if($.isNull(recognizee_idnumber_input) ||
			recognizee_idnumber_input == "请输入证件号码") {
			modelAlert("请输入被保人证件号码！");
			cheakRecognizeeFlag = false;
			return false;
		}

		// 被保人身份证验证
		if($.checkIdCard(recognizee_idnumber_input.toLocaleUpperCase()) != 0) {
			modelAlert("身份证号有误，请重新输入！");
//			$("#recognizee_idnumber_input").val("请输入证件号码").css("color", "#ccc");
			cheakRecognizeeFlag = false;
			return false;
		}
		//$("#recognizee_idnumber_input").val(330724201610052222);
		var ye = $("#recognizee_idnumber_input").val().substr(6, 4);
		var mo = $("#recognizee_idnumber_input").val().substr(10, 2);
		var da = $("#recognizee_idnumber_input").val().substr(12, 2);
		var u = Date.parse(ye + "/" + mo + "/" + da);
		var r = (t - u) / 60 / 60 / 24 / 1000;
		if(r >= 14) {

		} else {
			modelAlert("被保险人最低年龄为出生后14天！");
			cheakRecognizeeFlag = false;
			return false;
		}

		if($.isNull(recognizee_phone_input) || recognizee_phone_input == "请输入手机号码") {
			modelAlert("请输入被保人手机号码！");
			cheakRecognizeeFlag = false;
			return false;
		}

		// 被保人手机号码验证
		if(tit.regExp.isMobile(recognizee_phone_input) == false) {
			modelAlert("手机号有误，请重新输入！");
			cheakRecognizeeFlag = false;
			return false;
		}
	}

	cheakRecognizeeFlag = true;
}

function submitInfos() {
	//	var url= base.url+"/ghxPolicy/queryWXOnlineOrderList.do";

	var tbrName = $("#policyholder_name_input").val();
	var tbrId = $("#policyholder_idnumber_input").val();
	var tbrPhone = $("#policyholder_phone_input").val();
	var tbrEmail = $("#policyholder_email_input").val();

	var b = tbrId.substr(6, 4);
	var i = tbrId.substr(10, 2);
	var r = tbrId.substr(12, 2);
	var tbrBir = b + '-' + i + '-' + r;
	var tbrSex = tbrId.substr(16, 1);

	var picName = $(".flt").attr("src").substring($(".flt").attr("src").lastIndexOf("/") + 1);
	if(picName == "yes.png") {
		var tbrCsi = "1";
		var bbrCsi = "1";

		var bbrName = tbrName;
		var bbrId = tbrId;
		var bbrPhone = tbrPhone;
		var bbrEmail = tbrEmail;
		var bbrBir = tbrBir;
		var bbrSex = tbrSex;

	} else {
		var tbrCsi = "0";
		var bbrCsi = "0";

		var bbrName = $("#recognizee_name_input").val();
		var bbrId = $("#recognizee_idnumber_input").val();
		var bbrPhone = $("#recognizee_phone_input").val();
		var bbrEmail = "";

		var b1 = bbrId.substr(6, 4);
		var i1 = bbrId.substr(10, 2);
		var r1 = bbrId.substr(12, 2);
		var bbrBir = b1 + '-' + i1 + '-' + r1;
		var bbrSex = bbrId.substr(16, 1);
	}
	var fn = new Date;
	var nowday = fn.getTime();
	var nextday = $.getDateStr(0, '', 1);

	var insureList = new Array();
	for(var i = 0; i < code.length; i++) {
		var pro = {
			"productId": code[i]
		}
		insureList.push(pro)
	}

	var url = base.url + "/ghxOrder/addOrder.do";
	var reqData = {
		"head": {
			"userCode": "",
			"transTime": $.getTimeStr(),
			"channel": "1"
		},
		"body": {
			"ejxInfo": {
				"agrtCode": parm.dicChannel, //dicchannel1
				"data": {
					"customerList": [{
						"birthDate": tbrBir,
						"customerAddress": "",
						"customerFlag": "1",
						"customerName": tbrName,
						"customerSameInd": tbrCsi,
						"customerType": "1",
						"docNo": tbrId,
						"docType": "01",
						"email": tbrEmail,
						"phoneNo": tbrPhone,
						"sex": tbrSex
					}, {
						"birthDate": bbrBir,
						"customerAddress": "",
						"customerFlag": "2",
						"customerName": bbrName,
						"customerSameInd": bbrCsi,
						"customerType": "1",
						"docNo": bbrId,
						"docType": "01",
						"email": bbrEmail,
						"phoneNo": bbrPhone,
						"sex": bbrSex
					}],
					"insuredObject": {
						"fieldAA": "01",
						"fieldAC": "01",
						"fieldAE": parm.banbenFlag, //11
						"fieldAF": nextday //当前日期的下一任
						
					},
					"orderDynamicDto": { //扩展被保险人
						"fieldAA": parm.peiouFlag + "",
						"fieldAB": parm.zinvFlag + "",
						"fieldAC": parm.fumuFlag + "",
						"fieldAD": parm.qitaFlag + ""

					},
					"projectCode": parm.dicCode, //2 diccode
					"riskCode": "1014"
				},
				"dataSource": "O-BY",
				"interfaceCode": "createOrder",
				"requestTime": nowday //gettime
			},
			"other": {
				"customerId": parm.customerId, //代理人ID
				"prem": parm.baofeiSum + "", //总保费
				"productId": code[0], //	险种代码
				//"orderResources": "1", //渠道来源  
				"ghProductIds": parm.remark, //主险代码+附加险代码
				"ghOptionalFlag": s, // '可选保障项代码1：附加，0不附加',
				//"inviterCode":"",
				"inviterPhone":parm.userCode,
			    "channelResource":"3",//渠道来源  
				"insureList": insureList
			}

		}
	}
	$.toAjaxs(url, reqData, function(respdata) {
		if(respdata.statusCode == "000000") {
			var jsonKey = {};
			jsonKey.commodityId = parm.commodityId;
			jsonKey.customerId = parm.customerId;
			jsonKey.userCode = parm.userCode;
			jsonKey.productId = parm.productId;
			jsonKey.orderNo = respdata.returns.orderNo;
			jsonKey = UrlEncode(JSON.stringify(jsonKey));
			window.location.href = "daizhifu.html?jsonKey=" + jsonKey;
		} else {
			mui.alert(respdata.statusMessage, '温馨提示');
		}

	});
}