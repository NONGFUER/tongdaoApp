/*点击银行卡*/
$(".bank").unbind("tap").bind("tap", function() {
	var param = {
		"userCode": 1,
		"policyNo": 1,
		/*订单编号*/
	}
	var jsonStr = UrlEncode(JSON.stringify(param));
	window.location.href = "../cardList/cardList.html?jsonKey=" + jsonStr;
})
/*购买份数*/
$(".up").unbind("tap").bind("tap", function() {
	var fenshu = $('.fenshu_input').children('input').val();
	var money = $('#money').html();
	var mymoney = $('#mymoney').html();
	fenshu = parseInt(fenshu) + 1;
	money = parseInt(money) + 1000;
	mymoney = parseInt(mymoney) + 997;
	if(fenshu > 199) {
		fenshu = '199';
	}
	if(mymoney > 198403) {
		mymoney = '198403'
	}
	if(money > 199000) {
		money = '199000'
	}
	$('.fenshu_input').children('input').val(fenshu);
	$('#money').html(money + '.00元');
	$('#mymoney').html(mymoney + '.00');
})
$(".minus").unbind("tap").bind("tap", function() {
	var fenshu = $('.fenshu_input').children('input').val();
	var money = $('#money').html();
	var mymoney = $('#mymoney').html();
	fenshu = parseInt(fenshu) - 1;
	money = parseInt(money) - 1000;
	mymoney = parseInt(mymoney) - 997;
	if(fenshu < 1) {
		fenshu = '1';
	}
	if(mymoney < 997) {
		mymoney = '997'
	}
	if(money < 1000) {
		money = '1000'
	}
	$('.fenshu_input').children('input').val(fenshu);
	$('#money').html(money + '.00元');
	$('#mymoney').html(mymoney + '.00');
})
/*同被保人*/
$("#beibaoren").unbind("tap").bind("tap", function() {
	$('#beibaoren').toggleClass('no');
	$('#beibaorenxinxi').toggleClass('dsp');
})
/*已阅读*/
$("#word").unbind("tap").bind("tap", function() {
	$('#word').toggleClass('no');
	$('#huifang').toggleClass('xiehuise');
})