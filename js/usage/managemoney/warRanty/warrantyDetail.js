mui.init();
/*data传值*/
var data = {
	"userCode": "",
	"channel": "",
	"transTime": "",
	"transToken": "",
	"statusCode": "000000",
	"statusMessage": "查询成功",
	"returns": {
		"commodityCombination": {
			"id": 4,
			"commodityCombinationCode": "00600001",
			"commodityCombinationName": "弘康安溢保两全保险",
			"commodityCombinationType": "01",
			"companyId": 6,
			"startPiece": "1000元起投，1000元递增",
			"insuredAge": "18周岁-70周岁(含)",
			"insuredDuration": "10年",
			"insuredInfo": "直付100万",
			"paymentDeadline": 0,
			"commodityCombinationImage": 0,
			"banner": "https://td-pro.ta-by.com/tongdaoPlatform/tongdaoApp/page/image/cancerRisk/baby1.png",
			"isCommission": "0",
			"commissionShowType": "01",
			"commodityId": 0,
			"commodityCombinationStatus": "1",
			"commodityCombinationRate": "",
			"commodityCombinationOrder": 4,
			"dateCreated": 0,
			"createdBy": "",
			"dateUpdated": 0,
			"updatedBy": "",
			"remark": "5.40"
		},
		"bxPolicyFinance": {
			"id": 7,
			"orderNo": "1503383113382",
			"insureNo": "11030010001181",
			"policyNo": "86000020171310001181",
			"insureName": "吴大旺啊啊",
			"insurePhone": "13651746591",
			"insureCertifitype": "1",
			"insureIdentitycard": "130230199009306268",
			"insureGender": "2",
			"insureEmail": "523277302@qq.com",
			"insureAddress": "河流路",
			"insureZipcode": 0,
			"provinceCode": "110000",
			"provinceName": "安徽",
			"cityCode": "110101",
			"cityName": "宿州",
			"areaCode": "110101",
			"areaName": "泗县",
			"prem": 4000.0000,
			"customerId": 3,
			"policyForm": "http://www.hongkang-life.com/PolicyDownload?sign\u003dF32CD75B822C143FA4264D1D4224B7D23A5E9183C6608ADC",
			"totalPieces": "4",
			"policyDate": "2017-08-22 14:25:17",
			"startTime": "2017-08-23 00:00:00",
			"endTime": "9999-12-30 23:59:59",
			"underWrite": "2017-08-22 14:19:43",
			"effectiveDate": "2017-08-23 00:00:00",
			"commodityCombinationId": 4,
			"commodityId": 7,
			"productCode": 0,
			"inviterCode": "",
			"inviterPhone": "13651746591",
			"orderStatus": "03",
			"orderResource": "2",
			"refuseReason": 0,
			"initialFee": 12.0000,
			"bankCode": "BCS",
			"bankName": "招商",
			"bankCertificate": "323232324546456546",
			"accountValue": 0,
			"yesterdayProfit": 0,
			"totalProfit": 0,
			"returnVisit": "0",
			"freeDateStart": 0,
			"freeDateEnd": 0,
			"dateCreated": "2017-08-22 14:27:29",
			"createdBy": 0,
			"dateUpdated": "2017-08-22 14:27:29",
			"updatedBy": 0,
			"remark": 0
		}
	}
};

var vm = new Vue({
	el: '#list',
	data: {
		Objectitle: {
			commodityCombination: {},
			bxPolicyFinance: {}
		},
		Objecbody: null,
		baozhang: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				if($('.baozhang').html() == '01') {
					$('.baozhang').html('待生效')
				} else if($('.baozhang').html() == '02') {
					$('.baozhang').html('保障中')
				} else if($('.baozhang').html() == '03') {
					$('.baozhang').html('已领取')
				} else if($('.baozhang').html() == '99') {
					$('.baozhang').html('已失效')
				}
				bankweihao();
				$('.phoneyin').html(phoneyin($('.phoneyin').html()));
			})
		})
	}
})
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
		userCode = urlParm.userCode,
		policyNo = urlParm.policyNo;
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": ""
		},
		"body": {
			"policyNo": policyNo
		}
	}
	var url = '../moneyManage/policyQueryListInfo.do';
	console.log("页面初始化，发送请求报文--");
	/*$.reqAjaxsFalse(url, reqData, policyQueryListInfo);*/
	vm.Objectitle = data.returns;
	console.log(vm.Objectitle);
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		alert(1);
		/*接口请求位子*/
	})
	mui('.man-div-body-ul_li_div_btn').on('tap', '#lingqu', function() {
		alert(2);
		/*接口请求位子*/
	})
	$(".baodan").unbind("tap").bind("tap", function() {
		/*正式版使用接口↓*/
		/*window.location.href = base.url+vm.Objectitle.bxPolicyFinance.policyForm;*/
		window.location.href = vm.Objectitle.bxPolicyFinance.policyForm;
	})
	$(".chanping").unbind("tap").bind("tap", function() {
		var commodityCombinationId= vm.Objectitle.bxPolicyFinance.commodityCombinationId
		var reqData = {
			"commodityCombinationId":commodityCombinationId,
			"userCode":userCode,
		}
		var jsonStr = UrlEncode(JSON.stringify(reqData));
		window.location.href = base.url+"tongdaoApp/html/managemoney/productDetails/productDetails.html?jsonKey=" + jsonStr;
	})
})

function policyQueryListInfo(data) {
	console.log(data)
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}
/*隐藏手机号中间几位*/
function phoneyin(phone) {
	var mphone = phone.substr(0, 3) + '****' + phone.substr(7);
	return mphone;
}