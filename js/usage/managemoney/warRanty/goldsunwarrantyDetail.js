mui.init();
/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	policyNo = urlParm.policyNo,
	insureNo = urlParm.insureNo,
	transToken = urlParm.transToken,
	customerId = urlParm.customerId,
	cxflag = urlParm.cxflag,
	title = urlParm.title,
	ccName = urlParm.ccName,
	commodityId = urlParm.commodityId,
	orderNo = urlParm.orderNo;
var channel = urlParm.channel;
var commodityComId = urlParm.commodityCombinationId;
var epolicyUrl = '';
if(typeof(commodityComId) == 'undefined') {
	commodityComId = urlParm.commodityComId;
}
if(typeof(commodityComId) == 'undefined') {
	commodityComId = "";
}
if(channel == '' || channel == null) {
	channel = '01';
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			bxPolicyFinance: {},
		},
		Objecbody: null,
		baozhang: null,
		returnVisit: {},
		commodityComId: "",
		channel: "",
		ccName: '',
		bdjiazhi: '',
		dianzibaodan: '',
		insureNo: '',
	},
})
$(function() {
	vm.ccName = ccName;
	vm.insureNo = insureNo;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"customerId": customerId + '',
		}
	}
	var url = base.url + 'ygJmyBasic/ygPolicyQueryInfo.do';
	$.reqAjaxsFalse(url, reqData, policyQueryListInfo);
	/*保单价值*/
	var reqDatas = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"orderNo": orderNo,
			"customerId": customerId + '',
		}
	}
	var urls = base.url + 'ygJmyRedemption/getYgPolicyValue.do';
	$.reqAjaxsFalse(urls, reqDatas, getYgPolicyValue);
	/*电子保单*/
	var reqDatadian = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"policyNo": policyNo,
			"orderNo": orderNo,
			"customerId": customerId + '',
		}
	}
	var urldian = base.url + 'ygJmyBasic/getYgDownloadUrl.do';
	$.reqAjaxsFalse(urldian, reqDatadian, getYgDownloadUrl);
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		window.location.href = vm.dianzibaodan;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var reqData = {
			"commodityCombinationId": commodityComId + "",
			"ccId": commodityComId + '',
			"userCode": userCode,
			"customerId": customerId,
			"transToken": transToken,
			"channel": channel,
			"insurePhone": userCode,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
			"title": '产品详情',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/productDetails/goldsunshineDetails.html?jsonKey=" + jsonStr;
	})
	vm.commodityComId = commodityComId;
	vm.channel = channel;
	$("#guanbi").unbind('tap').bind("tap", function() {
		$('#weixin').hide()
	})
})

/*页面信息*/
function policyQueryListInfo(data) {
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns;
		vm.returnVisit = data.returns.bxPolicyFinance.returnVisit;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
	vm.$nextTick(function() {
		chuli();
		$("#epolicyShare").unbind("tap").bind("tap", function() {
			if(!isWeixin()) {
				shareHandle()
			} else {
				wechatEpolicyShare()
			}
		})
	})
}
/*保单价值*/
function getYgPolicyValue(data) {
	if(data.statusCode == '000000') {
		vm.bdjiazhi = data.returns.policyValue;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*电子保单*/
function getYgDownloadUrl(data) {
	if(data.statusCode == '000000') {
		vm.dianzibaodan = data.returns.DownloadUrl;
		epolicyUrl = vm.dianzibaodan;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}
/*退保试算*/
function getRedemption(data) {
	if(data.statusCode == '000000') {
		var reqData = {
			"orderNo": orderNo,
			"insureNo": insureNo,
			"policyNo": policyNo,
			"customerId": customerId,
			"commodityComId": commodityComId,
			"userCode": userCode,
			"ccName": ccName,
			"remark": vm.Objectitle.commodityCombination.remark,
			"transTime": "",
			"channel": channel,
			"transToken": transToken,
			"title": title,
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '0',
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/goldsunpolicyCancellation.html?jsonKey=" + jsonStr;
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, '', lognCont);
	} else {
		modelAlert(data.statusMessage);
	}
}

function chuli() {
	if($('.baozhang').html() == '11') {
		$('.baozhang').html('待生效')
	} else if($('.baozhang').html() == '2') {
		$('.baozhang').html('保障中')
	} else if($('.baozhang').html() == '4') {
		$('.baozhang').html('已领取')
		$('#lingqu').off('tap', '#lingqu');
		$('#lingqu').addClass('huisebtn');
		$('#huifang').addClass('huisebtn');
		vm.returnVisit == '1';
	}
	if(vm.returnVisit == '1') {
		$('#huifang').addClass('huisebtn');
	}
	if($('.baozhang').html() != '03' && $('.baozhang').html() != '已领取') {
		mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
			var url = base.url + 'ygJmyRedemption/getYgRedemption.do';
			var reqData = {
				"head": {
					"userCode": userCode,
					"channel": channel,
					"transTime": $.getTimeStr(),
					"transToken": transToken
				},
				"body": {
					"orderNo": orderNo,
					"policyNo": policyNo,
					"insureNo": insureNo,
					"customerId": customerId + '',
				}
			}
			$.reqAjaxsFalse(url, reqData, getRedemption);
		})
		mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
			/*接口请求位子*/
			if(vm.returnVisit == '0' && $('.baozhang').html() != '已领取') {
				var url = base.url + 'ygJmyAccountValue/getYgBackOnline.do';
				var reqData = {
					"head": {},
					"body": {
						"orderNo": orderNo,
					}
				}
				$.reqAjaxs(url, reqData, huifangque);

				function huifangque(data) {
					modelAlert('根据保监的规定，为保证您的权益，请您确认如下回访问卷：1.您已确认通过阳光寿险官网查阅到您的电子保单或电子保单链接（您可通过“阳光保险在线”--“我的保单”--“下载电子保单”进行下载）。2.您已确认投保人是您本人。3.您已确认已经阅读并理解产品说明书和投保提示书内容，对产品的保险责任和责任免除等相关权益都清楚。4.您已确认您购买的这份产品保险期间为5年，您选择的是一次性交费。5.您已确认电子保单生成日次日起有15天犹豫期，犹豫期内请您认真审视保险合同，如果您认为保险合同与您的需求不相符，您可以提出解除保险合同，公司将无息退还您所缴纳的保费；犹豫期后退保，您可能会承担一定的损失。6.  您已确认您购买的金满盈保险是分红产品，您购买这份保险时，公司宣传资料上的分红利益演示是基于公司精算假设，不代表公司未来利益分配情况，分红回报水平是不确定的。', '', chongzai)

					function chongzai() {
						window.location.reload();
					}
				}
			} else {
				$('#huifang').addClass('huisebtn');
			}
		})
	}
	bankweihao();
}
$(".wenhaoico").unbind("tap").bind("tap", function() {
	$('.note').show();
})
$(".note-div_title_right").unbind("tap").bind("tap", function() {
	$('.note').hide();
})

function backlast() {
	if(commodityComId != "" && channel == '01' && cxflag != '2' && cxflag != '3' && cxflag != '10') {
		var sendData = {
			"userCode": userCode,
			"commodityComId": commodityComId,
			"flag": '',
			"pageNo": '',
			"customerId": customerId,
			"transToken": transToken,
			"title": '保单列表',
			"leftIco": '1',
			"rightIco": '0',
			"downIco": '1',
		};
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/managemoney/warRanty/warrantyList.html?jsonKey=" + jsonStr;
	} else {
		if(channel == '01' && cxflag == '2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyList.html?jsonKey=" + jsonStr;
		} else if(channel == '02' && cxflag == '2') {
			urlParm.title = '我的保单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyListWeChat.html?jsonKey=" + jsonStr;
		} else if(cxflag == '3') {
			urlParm.title = '我的出单';
			urlParm.downIco = '1';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/mysingle.html?jsonKey=" + jsonStr;
		} else if(cxflag == '10') {
			urlParm.title = '我的出单';
			urlParm.downIco = '0';
			urlParm.channel = channel;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
			window.location.href = base.url + "tongdaoApp/html/agent/mysingle/teaMmysingle.html?jsonKey=" + jsonStr;
		}
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}

/*电子保单分享*/
function shareHandle() {
	var title = '同道保险电子保单';
	var desc = '点击查看详情';
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	var flag = '2';
	var shareurl = epolicyUrl;
	urlParm.picUrl = epolicyUrl;
	urlParm.shareurl = epolicyUrl;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink = base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey=" + jsonStr;
	shareMethod(shareurl, title, desc, flag, picUrl, twolink);
};

function wechatEpolicyShare() {
	$("#weixin").show()
	var title = '同道保险电子保单';
	var desc = '点击查看详情';
	var picUrl = base.url + "tongdaoApp/image/share/tongdaoic.png";
	var epolicyObj = {
		"directUrl": epolicyUrl
	}
	var jsonStr = UrlEncode(JSON.stringify(epolicyObj));
	var shareUrl = base.url + "tongdaoApp/html/share/epolicyShare.html?jsonKey=" + jsonStr;
	wechatShare(title, desc, picUrl, shareUrl)
}