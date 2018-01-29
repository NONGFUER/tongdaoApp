/*获取数据*/
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey"))),
	userCode = urlParm.userCode,
	transToken = urlParm.transToken,
	channel = urlParm.channel,
	title = urlParm.title;
var vm = new Vue({
	el: '#list',
	data: {
		threelist: {},
		level: '0',
		ccod:'',
	}
})

$(function() {
	getProvinceReq();
})

function getProvinceReq() {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {}
	};
	var url = base.url + 'ygJmyBasic/getBylevel.do';
	$.reqAjaxs(url, reqData, getBylevel);
}

function getBylevel(data) {
	console.log(data);
	if(data.statusCode == "000000") {
		$("#hangyename").unbind('tap').bind('tap', function() {
			var cityPicker1 = new mui.PopPicker();
			cityPicker1.setData(data.returns.list);
			cityPicker1.show(function(item) {
				var cityText = item[0].text;
				var cityValue = item[0].value;
				$("#hangyename").html(cityText);
				$("#hangyename").attr("data-where", cityValue);
				$('#hangyefenlei').html('请选择');
				$('#hangyefenlei').attr('data-where', '');
				$('#zhiyename').html('请选择');
				$('#zhiyename').attr('data-where', '');
				$('#gangweiname').html('请选择');
				$('#gangweiname').attr('data-where', '');
				$('#dengji').html('');
				$('#shifou').html('');
				vm.level='0';
				objeji(cityValue, '2');
			});
		});
	} else {
		modelAlert(data.statusMessage);
	}
}

function objeji(code, cisu) {
	var reqData = {
		"head": {
			"userCode": userCode,
			"channel": channel,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {
			"super_code": code,
		}
	};
	var url = base.url + 'ygJmyBasic/getBySuperCode.do';
	if(cisu == '2') {
		$.reqAjaxs(url, reqData, getBySuperCodetwo);
	} else if(cisu == '3') {
		$.reqAjaxs(url, reqData, getBySuperCodethree);
	} else if(cisu == '4') {
		$.reqAjaxs(url, reqData, getBySuperCodefour);
	}
}

function getBySuperCodetwo(data) {
	console.log(data);
	if(data.statusCode == "000000") {
		$("#hangyefenlei").unbind('tap').bind('tap', function() {
			if(!$("#hangyename").attr('data-where')) {
				modelAlert('请先选择行业名称！');
				return false;
			}
			var cityPicker2 = new mui.PopPicker();
			cityPicker2.setData(data.returns.list);
			cityPicker2.show(function(item) {
				var cityText = item[0].text;
				var cityValue = item[0].value;
				$("#hangyefenlei").html(cityText);
				$("#hangyefenlei").attr("data-where", cityValue);
				$('#zhiyename').html('请选择');
				$('#zhiyename').attr('data-where', '');
				$('#gangweiname').html('请选择');
				$('#gangweiname').attr('data-where', '');
				$('#dengji').html('');
				$('#shifou').html('');
				vm.level='0';
				objeji(cityValue, '3');
			});
		});
	} else {
		modelAlert(data.statusMessage);
	}
}

function getBySuperCodethree(data) {
	console.log(data);
	if(data.statusCode == "000000") {

		$("#zhiyename").unbind('tap').bind('tap', function() {
			if(!$("#hangyename").attr('data-where')) {
				modelAlert('请先选择行业名称！');
				return false;
			}
			if(!$("#hangyefenlei").attr('data-where')) {
				modelAlert('请先选择行业分类！');
				return false;
			}
			var cityPicker3 = new mui.PopPicker();
			cityPicker3.setData(data.returns.list);
			cityPicker3.show(function(item) {
				var cityText = item[0].text;
				var cityValue = item[0].value;
				var level = item[0].level;
				$("#zhiyename").html(cityText);
				$("#zhiyename").attr("data-where", cityValue);
				$('#gangweiname').html('请选择');
				$('#gangweiname').attr('data-where', '');
				$('#dengji').html('');
				$('#shifou').html('');
				vm.level='0';
				objeji(cityValue, '4');
				vm.threelist = cityText;
				vm.level = level;
				vm.ccod=cityValue;
			});
		});

	} else {
		modelAlert(data.statusMessage);
	}
}

function getBySuperCodefour(data) {
	console.log(data);
	if(data.statusCode == "000000") {
		if(data.returns.list.length > 0) {
			$("#gangweiname").unbind('tap').bind('tap', function() {
				if(!$("#hangyename").attr('data-where')) {
					modelAlert('请先选择行业名称！');
					return false;
				}
				if(!$("#hangyefenlei").attr('data-where')) {
					modelAlert('请先选择行业分类！');
					return false;
				}
				if(!$("#zhiyename").attr('data-where')) {
					modelAlert('请先选择职业名称！');
					return false;
				}
				var cityPicker4 = new mui.PopPicker();
				cityPicker4.setData(data.returns.list);
				cityPicker4.show(function(item) {
					var cityText = item[0].text;
					var cityValue = item[0].value;
					var dengji = item[0].level;
					$("#gangweiname").html(cityText);
					$("#gangweiname").attr("data-where", cityValue);
					$('#dengji').html(dengji + '级');
					vm.level = dengji;
					vm.ccod=cityValue;
					if(vm.level>4){
						$('#shifou').html('此职业不可投保')
					}else{
						$('#shifou').html('此职业可投保')
					}
					panding();
				});
			});
		} else {
			$("#gangweiname").html(vm.threelist);
			$('#dengji').html(vm.level + '级');
			if(vm.level>4){
				$('#shifou').html('此职业不可投保')
			}else{
				$('#shifou').html('此职业可投保')
			}
			panding();
		}
	} else {
		modelAlert(data.statusMessage);
	}
}

function panding(){
	if(vm.level<5){
		$("#huifang").removeClass('jinzhi');
		$("#huifang").unbind('tap').bind('tap', function() {
			urlParm.title=urlParm.titles;
			urlParm.zhiyename=$('#gangweiname').html();
			urlParm.level=vm.level;
			urlParm.ccod=vm.ccod;
			var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/goldsunshineFillout.html?jsonKey=" + jsonStr;
		})
	}else{
		$("#huifang").addClass('jinzhi');
		$("#huifang").unbind('tap').bind('tap', function() {
			
		})
	}
}

function backlast() {
	urlParm.title=urlParm.titles;
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/managemoney/messageFillout/goldsunshineFillout.html?jsonKey=" + jsonStr;
}