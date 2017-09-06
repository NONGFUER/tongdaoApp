var urlParm     = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var mobile      = urlParm.head.mobile,
	productCode = urlParm.body.productCode,
	commodityNo = urlParm.body.commodityNo,
	customerId  = urlParm.body.customerId ,
	duty        = urlParm.body.duty,
	productName = urlParm.body.productName,
	premCal     = urlParm.body.prem,
	peices      = urlParm.body.pieces;

var param={
		"head":{
			"mobile":mobile,
			"switchCommission":""
		},"body":{
			"customerId":customerId,
			"productCode":productCode,
			"productName":productName,
			"commodityNo":commodityNo
		}
	}
var jsonStr = UrlEncode(JSON.stringify(param));	
var indexParm = {
		"customerId":customerId,
		"productCode":commodityNo,
		"mobile":mobile
	}
var jsonStrIndex = UrlEncode(JSON.stringify(indexParm));	
$("#btnHaif").attr("href","insureForm.html"+window.location.search);//”全部为否“按钮
$("#module_new_header .iconfont").attr("href","productDetail.html?jsonKey="+jsonStr);//返回	
$("#otherProduct").attr("href","index.html?jsonKey="+jsonStrIndex);//返回	

$(".healthy-error .a1").click(function(){
	callService("4006895505",".kefuPhone")
})
var _paq = _paq || [];
var healthy = {
		init: function() {
			healthy.submitBtn()
		},
		submitBtn: function() {
			$(".errorBtn").click(function() {
				healthy.submitFlase(this)
			}), 
			$("#gaozhiBtn").click(function() {
				$("#baoxiantiaokuan")[0] && $.newBox({
					id: $("#baoxiantiaokuan")
				})
			})
		},
		submitFlase: function(t) {
			_paq.push(["trackEvent", "身体不健康", util.ids.pid]);
			var t = $(t),
				i = $("#jwx_notice_tips");
			t.data("error") ? i.find(".text_error").html(t.data("error")) : i.find(".text_error").html("被保人的健康状况不满足该保险投保规定。"), 
			$.newBox({id: i})
		}
		
	}
var util = {
		ids: {
			pid: $("#productId").val(),
			zyid: "#zhiyeBox",
			ease: ".easeAmount",
			bmi: ".health-BMI"
		}
	};
healthy.init();

