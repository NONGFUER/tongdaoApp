var data = '{"body": [{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"未核保"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"处理中"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "-3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"未核保"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"投保成功"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"核保失败"},{"title_goumai": "领取","titel_name": "弘康人寿","title_money": "-3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"领取成功"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"未核保"},{"title_goumai": "领取","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"处理中"},{"title_goumai": "购买","titel_name": "弘康人寿","title_money": "+3007.61元","boyd_dingdan":"订单号","body_hao":"282372632162721821","body_date":"2016/10/23 12:00","body_zhuangtai":"投保失败"}]}';

function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null,
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
				$(function() {
						$('.goumaizhuangtai').each(function() {
								if($(this).html() == '购买') {
									$('.money').each(function() {
											if($(this).html() == '未核保') {
												$(this).addClass('lanse');
												$(this).parent().parent('li').prev().children('.money').addClass('lanse');
											} else if($(this).html() == '核保失败') {
												$(this).addClass('huise');
												$(this).parent().parent('li').prev().children('.money').addClass('huise');
											}else if($(this).html()=='处理中'&&$(this).parent().parent('li').prev().children('.goumaizhuangtai').html()=='购买'){
												$(this).addClass('lanse');
												$(this).parent().parent('li').prev().children('.money').addClass('lanse');
										}else if($(this).html()=='投保成功'){
												$(this).addClass('lanse');
												$(this).parent().parent('li').prev().children('.money').addClass('lanse');
										}else if($(this).html()=='投保失败'){
												$(this).addClass('huise');
												$(this).parent().parent('li').prev().children('.money').addClass('huise');
										}
									})
							} else if($(this).html() == '领取') {
								$('.money').each(function() {
									if($(this).html() == '领取成功') {
										$(this).addClass('huangse');
										$(this).parent().parent('li').prev().children('.money').addClass('huangse');
									} else if($(this).html() == '领取失败') {
										$(this).addClass('huise');
										$(this).parent().parent('li').prev().children('.money').addClass('huise');
									}else if($(this).html() == '处理中'&&$(this).parent().parent('li').prev().children('.goumaizhuangtai').html()=='领取') {
										$(this).addClass('huangse');
										$(this).parent().parent('li').prev().children('.money').addClass('huangse');
									}else if($(this).html()=='投保成功'){
												$(this).addClass('huangse');
												$(this).parent().parent('li').prev().children('.money').addClass('huangse');
										}else if($(this).html()=='投保失败'){
												$(this).addClass('huise');
												$(this).parent().parent('li').prev().children('.money').addClass('huise');
										}
								})
							}
						})

				})
		})
}
})
$(function() {
	vm.Objectlist = strToJson(data).body;
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		/*接口请求位子*/
		console.log($(this).html());
	})
})