var data = '{"body": [{"baodan": "安溢保两全保险(一年期)","baozhang": "待生效","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "已领取","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "已过期","shaoer": "弘康人寿","chengbao":"投资连结险"},{"baodan": "安溢保两全保险(一年期)","baozhang": "保障中","shaoer": "弘康人寿","chengbao":"投资连结险"},]}';
var datajiazhi = '{"body": [{"name":"保单价值","name_value":"190000.00元"},{"name":"投资本金","name_value":"2.33元"},{"name":"昨日收益","name_value":"190000.00元"},{"name":"累计收益","name_value":"190000.00元"},{"name":"保单价值","name_value":"190000.00元"},{"name":"初始费","name_value":"190000.00元"},{"name":"承保时间","name_value":"2017/05/29 15:30"}]}';

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