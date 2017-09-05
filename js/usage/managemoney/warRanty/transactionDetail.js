var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null,
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				chuli();
			})
		})
	},
	watch: {
		Objectlist: function(val) {
			this.$nextTick(function() {
				$(function() {
					chuli();
				})
			})
		}
	}
})
var userCode = "",
	transToken = "",
	customerId = "",
	commodityCommId = "",
	policyNo="";
$(function() {
	/*获取数据*/
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
		userCode = urlParm.userCode;
		transToken = urlParm.transToken;
		customerId = urlParm.customerId;
		commodityCommId = urlParm.commodityComId;
		policyNo = urlParm.policyNo;
	console.log("页面初始化，获取上个页面传值报文--");
	list(userCode, transToken, customerId, commodityCommId, '1');
})

function policyDetail(data) {
	console.log(data);
	vm.Objectlist = data.returns.list1;
}

function chuli() {
	$('.goumaizhuangtai').each(function() {
		if($(this).html() == '购买') {
			$('.money').each(function() {
				if($(this).html() == '01') {
					$(this).html('未核保');
					$(this).addClass('lanse');
					$(this).parent().parent('li').prev().children('.money').addClass('lanse');
				} else if($(this).html() == '03') {
					$(this).html('核保失败');
					$(this).addClass('huise');
					$(this).parent().parent('li').prev().children('.money').addClass('huise');
				} else if($(this).html() == '06' || $(this).html() == '09' && $(this).parent().parent('li').prev().children('.goumaizhuangtai').html() == '购买') {
					$(this).html('处理中');
					$(this).addClass('lanse');
					$(this).parent().parent('li').prev().children('.money').addClass('lanse');
				} else if($(this).html() == '02') {
					$(this).html('核保成功');
					$(this).addClass('lanse');
					$(this).parent().parent('li').prev().children('.money').addClass('lanse');
				} else if($(this).html() == '04') {
					$(this).html('待生效');
					$(this).addClass('lanse');
					$(this).parent().parent('li').prev().children('.money').addClass('lanse');
				} else if($(this).html() == '05') {
					$(this).html('投保成功');
					$(this).addClass('lanse');
					$(this).parent().parent('li').prev().children('.money').addClass('lanse');
				} else if($(this).html() == '08') {
					$(this).html('已退保');
					$(this).addClass('huise');
					$(this).parent().parent('li').prev().children('.money').addClass('huise');
				} else if($(this).html() == '07') {
					$(this).html('投保失败');
					$(this).addClass('huise');
					$(this).parent().parent('li').prev().children('.money').addClass('huise');
				}
			})
		} else if($(this).html() == '领取') {
			$('.money').each(function() {
				if($(this).html() == '01') {
					$(this).html('领取成功')
					$(this).addClass('huangse');
					$(this).parent().parent('li').prev().children('.money').addClass('huangse');
				} else if($(this).html() == '02') {
					$(this).html('领取失败')
					$(this).addClass('huise');
					$(this).parent().parent('li').prev().children('.money').addClass('huise');
				} else if($(this).html() == '03' && $(this).parent().parent('li').prev().children('.goumaizhuangtai').html() == '领取') {
					$(this).html('处理中');
					$(this).addClass('huangse');
					$(this).parent().parent('li').prev().children('.money').addClass('huangse');
				} else if($(this).html() == '04') {
					$(this).html('投保成功');
					$(this).addClass('huangse');
					$(this).parent().parent('li').prev().children('.money').addClass('huangse');
				} else if($(this).html() == '05') {
					$(this).html('投保失败');
					$(this).addClass('huise');
					$(this).parent().parent('li').prev().children('.money').addClass('huise');
				}
			})
		}
	})
}

function mylist(userCode, transToken, customerId, commodityCommId, flag) {
	list(userCode, transToken, customerId, commodityCommId, flag);
}

function list(userCode, transToken, customerId, commodityCommId, flag) {
	userCode = userCode;
	transToken = transToken;
	customerId = customerId;
	commodityCommId = commodityCommId;
	flag = flag;
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"customerId": customerId,
			"commodityCommId": commodityCommId,
			"flag": flag
		}
	}
	$.reqAjaxsFalse(url, reqData, policyDetail);
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		var flag = $(this).attr('flag');
		list(userCode, transToken, customerId, commodityCommId, flag);
	})
}