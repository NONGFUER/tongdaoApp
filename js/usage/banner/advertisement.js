$(function() {
	mui.init();
	$(".h_back").unbind("tap").bind("tap", function() {
		sysback();
	});
	var vm = new Vue({
		el: '#bodylist',
		data: {
			objelist: null
		}
	})
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonkey")));
	var phone = urlParm.mobile;
	var addid = urlParm.adId;
	var customerId = urlParm.customerId;
	var provinceCode = urlParm.provinceCode;
	var cityCode = urlParm.cityCode;
	var productId = urlParm.productId;
	var minuteurl = base.url + "lunBo/getLunBoDetail.do";
	console.log(addid);
	var minutedata = {
		"head": {
			"channel": "01",
			"userCode": phone,
			"transTime": ""
		},
		"body": {
			"lunboId": addid
		}
	}
	$.reqAjaxs(minuteurl, minutedata, function(data) {
		console.log(data);
		if(data.statusCode == '000000') {
			vm.objelist = data.returns.lunBoDetail.detailInfo;
		}else{
			mui.alert('网络繁忙');
		}
	})
})

function backlast(){
	sysback();
}