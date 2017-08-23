var data = '{"body": [{"baodan": "安溢保两全保险(一年期)","baozhang": "保障中","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "保障中","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "保障中","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "保障中","shaoer": "弘康人寿","chengbao":"投资连结险"},]}';
var datajiazhi = '{"body": [{"name":"保单价值","name_value":"190000.00元"},{"name":"领取手续费","name_value":"2.33元"},{"name":"实际领取金额","name_value":"190000.00元"},{"name":"下次免费领取时间","name_value":"2016/10/29 20:22"}]}';

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
				$('.baozhang').each(function() {
					if($(this).html() == '待生效') {
						$(this).attr('class', 'baozhang dai');
					} else if($(this).html() == '保障中') {
						$(this).attr('class', 'baozhang bao');
					} else if($(this).html() == '已领取') {
						$(this).attr('class', 'baozhang yilingqu');
					}
				})

			})
		})
	}
})
$(function() {
	vm.Objectlist = strToJson(data).body;
	vm.bao = strToJson(datajiazhi).body;
	mui('.man-div-title ul').on('tap', 'li', function() {
		$('.man-div-title ul').children('li').removeClass('li_xuan');
		$(this).addClass('li_xuan');
		/*接口请求位子*/
	})
	mui('#list').on('tap', '.mui-btn', function() {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该保单吗？', '', ['确认', '取消'], function(e) {
			if(e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		});
	})
})