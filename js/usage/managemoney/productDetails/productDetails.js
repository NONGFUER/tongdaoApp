/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	commodityCombinationId = urlParm.commodityCombinationId,
	userCode = urlParm.userCode,
	roleType = urlParm.roleType,
	ccId = urlParm.ccId,
	transToken = urlParm.transToken,
	idAuth = urlParm.idAuth,
	isComing=urlParm.isComing,
	channel = '01',
	customerId = urlParm.customerId;
var productFlag='01';
if(userCode==null){
	userCode='';
}
if(commodityCombinationId==null||commodityCombinationId==''){
	commodityCombinationId=ccId;
}
if(typeof(isComing) == 'undefined') {
	isComing = '';
}
if(isComing=='1'){
	$('#huifang').hide();
}else{
	$('#huifang').show();
}
if(commodityCombinationId == '4') {
	productFlag = '01';
} else if(commodityCombinationId == '5') {
	productFlag = '02';
}
var phone ='';
if(userCode!=''&&userCode!=null){
	phone = phoneyin(userCode);
}
var invMobie=userCode;
$('.phone').html(phone);
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
			commodityCombination: {
				remark: "",
			},
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
		cid: {},
		name: "",
		title: "",
		chiyou:"",
		chiyoudate:"",
	}
})
$(function() {
	var reqData = {
		"body": {
			"commodityCombinationId": commodityCombinationId,
			"customerId": customerId,
		},
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	};
	var url = base.url + 'firstPage/goldProductInfo.do';
	$.reqAjaxs(url, reqData, goldProductInfo);
	if(roleType == "" || roleType == "00") {
		$('#huifang').addClass('btnhuise');
	} else if(idAuth == '0') {
		$('#huifang').addClass('btnhuise');
	}
	mui('.man-div-body-ul_li_div_three').on('tap', '.neirong', function() {
		var urls = $(this).attr('modueinfo');
		var name = $(this).attr('subModuleName');
		urlParm.cId = vm.cid;
		urlParm.frompage = "hongkanghtml";
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		if(name=='保险条款'){
			window.location.href = urls + "?jsonKey=" + jsonStr;
		}else{
			window.location.href = urls;
		}
	})
	/*伸缩按钮*/
	$(".body_title").unbind("tap").bind("tap", function() {
		$(this).children('.jiantou').toggleClass('shangjiantou');
		$(this).siblings('ul').toggle();
	})
	/*点击购买*/
	$("#huifang").unbind("tap").bind("tap", function() {
		if(roleType == "" || roleType == "00") {
			modelAlert('请先登录', '', lognCont);
		} else if(idAuth == '0') {
			modelAlert('请先实名', '', register);
		} else {
			var reqData = {
				"body": {
					"userPhone": userCode,
					"customerId": customerId,
				},
				"head": {
					"userCode": userCode,
					"channel": "01",
					"transTime": $.getTimeStr(),
					"transToken": transToken
				}
			}
			var url = base.url + 'investmentLinkedInsurance/getRiskAble.do';
			$.reqAjaxs(url, reqData, getRiskAble);
		}
	})
	$("#dianhua").unbind("tap").bind("tap", function() {
		var dianhua=$('#dianhua').html()
		callService(dianhua, "#dianhua");
	})
	$(".cancle").unbind("tap").bind("tap", function() {
		$('#shadow').hide();
	})
	$(".youyuqi img").unbind("tap").bind("tap",function(){
		modelAlert("犹豫期是指在购买后处于犹豫期内进行赎回，免手续费");
	});
	$(".suoding_left img").unbind("tap").bind("tap",function(){
		modelAlert("锁定期是指在购买后处于锁定期内进行赎回，需收取一定费率的手续费（在锁定期外或犹豫期内赎回免手续费）");
	});

})

/*购买*/
function buy() {
	var sendData = {
		"riskSupportAbility": $('.retest').attr('testType'),
		"insurePhone": userCode,
		"userCode": userCode,
		"customerId": customerId,
		"transToken": transToken,
		"commodityCombinationId": commodityCombinationId,
		"commodityId": vm.Objectitle.commodityInfo.id + "",
		"testType": $('.retest').attr('testType'),
		"title": vm.Objectitle.commodityCombination.commodityCombinationName,
		"productFlag": productFlag,
		"channel": channel,
		"roleType": roleType,
		"invMobie":invMobie,
		"idAuth": idAuth,
		"leftIco": '1',
		"rightIco": '0',
		"downIco": '0',
	}
	var jsonStr = JSON.stringify(sendData);
	jsonStr = UrlEncode(jsonStr);
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/messageFillout.html?jsonKey=" + jsonStr;
}

function goldProductInfo(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		vm.Objectitle = data.returns;
		vm.CommodityCombinationModuleList = data.returns.CommodityCombinationModuleList;
		vm.cid = data.returns.commodityInfo.id;
		vm.name = data.returns.commodityCombination.commodityCombinationAbbreviation;
		vm.title = data.returns.commodityCombination.insuredInfo;
		vm.chiyou=data.returns.CommodityCombinationModuleList[0].subModuleName;
		vm.chiyoudate=data.returns.CommodityCombinationModuleList[0].modueInfo;
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
					xiangguan.forEach(function(value, key) {
						if(xiangguan[key].subModuleName == '保险条款') {
							xiangguan[key].modueInfo = base.url + 'tongdaoApp/html/agreement/article.html';
						}
					})
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
			modelAlert(data.statusMessage);
		}
	} else {
		modelAlert(data.statusMessage);
	}
	if(roleType != '00'&&isComing!='1') {
		showRightIcon();
	}
}
var PRODUCT_PICURL = {
	"HONGKANG": base.url + "tongdaoApp/image/share/tongdaoicyi.png",
	"HONGKANGWU": base.url + "tongdaoApp/image/share/tongdaoicwu.png",
}
/*风险评估*/
function getRiskAble(data) {
	console.log(data);
	if(data.statusCode == '000000') {
		if(data.returns.isRisk == "0" && data.returns.riskble != '5') {
			$('#shadow').show();
			$('.retest').attr('testType', data.returns.riskble);
		} else if(data.returns.isRisk == "0" && data.returns.riskble == '5') {
			$('.retest').attr('testType', data.returns.riskble);
			buy();
		} else if(data.returns.isRisk == "1") {
			var sendData = {
				"head": {
					"userCode": userCode,
					"riskSupportAbility": riskSupportAbility,
					"transToken": transToken
				},
				"body": {
					"returnflag": "",
					"testType": "",
					"mobile": userCode,
					"customerId": customerId,
					"commodityId": vm.Objectitle.commodityInfo.id + "",
					"productCode": userCode,
					"commodityCombinationId": commodityCombinationId,
				},
				"roleType": roleType,
				"invMobie":invMobie,
				"idAuth": idAuth,
				"channel": channel,
				"title": '风险评估 ',
				"productFlag": productFlag,
				"titles": vm.Objectitle.commodityCombination.commodityCombinationName,
				"leftIco": '1',
				"rightIco": '0',
				"downIco": '0',
			}
			var jsonStr = UrlEncode(JSON.stringify(sendData));
			window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/riskQuestion.html?jsonKey=" + jsonStr;
		} else if(data.returns.isRisk == "2") {
			modelAlert(data.statusMessage);
		}
	} else if(data.statusCode == '123456') {
		modelAlert(data.statusMessage, "", lognCont);
	} else {
		modelAlert(data.statusMessage, "", lognCont);
	}
}
//根据不同的产品获取分享信息
function getProductSharePic(productCode) {
	var picUrl = "";
	if(productCode == '4') {
		picUrl = PRODUCT_PICURL.HONGKANG;
	}else{
		picUrl = PRODUCT_PICURL.HONGKANGWU;
	}
	return picUrl;
}

function shareHandle() {
	urlParm.state='5';
	urlParm.fl='2';
	urlParm.ccName=vm.Objectitle.commodityCombination.commodityCombinationAbbreviation;
	urlParm.ccId=commodityCombinationId;
	urlParm.name=vm.name;
	urlParm.desc=vm.title;
	urlParm.title='同道保险二维码';
	var title = vm.name;
	var flag='3';
	var desc = vm.title;
	var shareurl = base.url + "tongdaoApp/html/share/kongbai.html?mobile=" + userCode + '&ccId=' + commodityCombinationId + '&type=5';
	var picUrl = getProductSharePic(commodityCombinationId);
	urlParm.picUrl=picUrl;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink=base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+jsonStr;
	shareMethod(shareurl, title, desc,flag,picUrl,twolink);
};
/*隐藏手机号中间几位*/
function phoneyin(userCode) {
	var mphone = userCode.substr(0, 3) + '****' + userCode.substr(7);
	return mphone;
}
/*登录失效*/
function lognCont() {
	loginControl();
}
/*未实名*/
function register() {
	registerControl();
}

function backlast() {
	sysback();
}
function toQrcodeUrl(){
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	var twolink=base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+jsonStr;
	window.location.href = twolink;
}