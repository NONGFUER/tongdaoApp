/*data传值*/
var data = '';

var vm = new Vue({
	el: '#list',
	data: {
		Objectlist: null,
		bao: null,
	},
	mounted() {
		this.$nextTick(function() {
			$(function() {
				

			})
		})
	}
})
$(function() {
	vm.Objectlist = data;
	mui('.man-div-body-ul_li_div_btn').on('tap','#huifang', function() {
		mui.alert(2);
		/*接口请求位子*/
	})
})