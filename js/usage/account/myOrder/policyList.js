var data = '{"body": [{"baodan": "保单号: 8888888888888888","baozhang": "已过期","shaoer": "少儿高发恶性肿瘤险","chengbao":"天安财险承保","name_bei":"被保人","name_value":"陈某人","name_fei":"保费","value_fei":"1000.00元","name_data":"保险期间","value_data":"2017/05/24-2019/05/24"},{"baodan": "保单号: 8888888888888888","baozhang": "已过期","shaoer": "少儿高发恶性肿瘤险","chengbao":"天安财险承保","name_bei":"被保人","name_value":"陈某人","name_fei":"保费","value_fei":"1000.00元","name_data":"保险期间","value_data":"2017/05/24-2019/05/24"},{"baodan": "保单号: 8888888888888888","baozhang": "待生效","shaoer": "少儿高发恶性肿瘤险","chengbao":"天安财险承保","name_bei":"被保人","name_value":"陈某人","name_fei":"保费","value_fei":"1000.00元","name_data":"保险期间","value_data":"2017/05/24-2019/05/24"},{"baodan": "保单号: 8888888888888888","baozhang": "保障中","shaoer": "少儿高发恶性肿瘤险","chengbao":"天安财险承保","name_bei":"被保人","name_value":"陈某人","name_fei":"保费","value_fei":"1000.00元","name_data":"保险期间","value_data":"2017/05/24-2019/05/24"},{"baodan": "保单号: 8888888888888888","baozhang": "保障中","shaoer": "少儿高发恶性肿瘤险","chengbao":"天安财险承保","name_bei":"被保人","name_value":"陈某人","name_fei":"保费","value_fei":"1000.00元","name_data":"保险期间","value_data":"2017/05/24-2019/05/24"}]}';

function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
}
var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				$('.baozhang').each(function() {
					if($(this).html() == '待生效') {
						$(this).attr('class', 'baozhang dai');
					} else if($(this).html() == '保障中') {
						$(this).attr('class', 'baozhang bao');
					}
				})

			})
		})
	}
})
$(function() {
	vm.Objectlist = strToJson(data).body;
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