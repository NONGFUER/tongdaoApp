/*data传值*/
var data = {
	"userCode": "2835",
	"channel": "01",
	"transTime": "2017-08-25 10:10:38",
	"transToken": "",
	"statusCode": "000000",
	"statusMessage": "",
	"returns": {
		"hKCalculate": {
			"commodityCombinationID": "4",
			"commodityCombinationCode": "00600001",
			"commodityCombinationName": "弘康安溢保两全保险",
			"yearRate": "5.40",
			"policyValue": 3988.0000,
			"initialFee": 12.0000,
			"fee": 0.0000,
			"availableMoney": 4000.0000,
			"orderNo": "1503383193733",
			"policyNo": "86000020171310001183",
			"insureNo": "11030010001183",
			"investmentPrem":"2321321.00",
			"bankCode": "BCS",
			"bankName": "招商",
			"bankCertificate": "323232324546456546",
			"freeDateStart": '2017/01/01',
			"freeDateEnd": '2018/01/01'
		}
	}
};

var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: {
			hKCalculate:{},
		},
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				bankweihao()
			})
		})
	}
})
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
		commodityCommId = urlParm.commodityCommId,
		orderNo = urlParm.orderNo;
	console.log("页面初始化，获取上个页面传值报文--");
	console.log(urlParm);
	vm.Objectlist = data.returns;
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": "2835",
			"transTime": ""
		},
		"body": {
			"commodityCommId": "4",
			"orderNo": "1503383193733"
		}
	}
	var url = '../moneyManage/redemptionTrial.do';
	/*$.reqAjaxsFalse(url, reqData, redemptionTrial);*/
	mui('.man-div-body-ul_li_div_btn').on('tap', '#huifang', function() {
		mui.alert('赎回成功');
		/*接口请求位子*/
	})
})
function redemptionTrial(data){
	console.log(data);
	vm.Objectlist = data.returns;
}
/*截取银行卡号*/
function bankweihao() {
	var banke = $('.bank_weihao').html();
	banke = banke.substr(banke.length - 4);
	$('.bank_weihao').html('尾号 ' + banke);
}