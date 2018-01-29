var comparyCode = "";// 车险保险公司编号
var cxSessionId = "";// 车险投保唯一流水号"15061915143671823305";
var fromFlag = "";// 来自跳转页面标志
var isShowBtn = "";// N  从车险列表进入
var orderPrams = "";// 页面传递订单信息
var proNo = "";// 投保单号 有商业用商业 没有商业用交强
var phName = "";// 投保人姓名
var interveneFlag = "00";// 人工干预标志 00-直接提交 01-人工干预
var cxorderStatus = "";// 订单状态
var myScroll;
var orderNos = "";
var sessionId = "";
var payUrl = "";
var parm;
var tradeNo;
$(function() {
	/* 设置滑动区域 */
	$.setscroll();
	var str = getUrlQueryString("jsonStr");
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	cxSessionId = parm.body.cxSessionId;
	$("#order_index").css("height",($("body").height() - $("header").height() + "px"));
	$("#indexpart").css("padding-bottom", "10rem");
	$("#indexpart_scroll").css("padding-bottom", "10rem");


	

	

	//返回按钮
	$(".h_back,#btn_backHome").unbind("tap").bind("tap",function() {
		WeixinJSBridge.call('closeWindow');
	});

	


	// 获取订单信息
	$.loadOrderInf();
	
	$(".ul_left img").attr("src",base.imagePath + "carinsure/moneybtn.png");
	// 查看详细投保信息
	$("#see_details").unbind("tap").bind("tap",function() {
		parm.body.orderNos = orderNos;
		var jsonStr = JSON.stringify(parm);
		jsonStr = UrlEncode(jsonStr); // 加密过后的操作
		window.location.href = "insureMes.html?jsonKey=" + jsonStr;
	});


	// 去支付按钮
	$("#topay_btn_area").unbind("tap").bind("tap",function() {
		window.open(payUrl);
	});
});


// 获取订单信息模块初始化
$.loadOrderInf = function() {
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId" : cxSessionId,// 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.loadData);
};
/**
 * 获取订单信息回调
 */
$.loadData = function(param) {
	param = eval("(" + param + ")");
      console.log(param)
      if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				tradeNo=param.cxInfo.cxOrder.tradeno;
				cxorderStatus = param.cxInfo.cxOrder.orderStatus;// 订单状态
				// 订单号
				orderNos = param.cxInfo.cxOrder.orderNo;
				$("#orderno").html(orderNos);// A123456789012345657
				$("#comtype").html("天安财险");
				$("#version").html(param.cxInfo.cxOrder.commodityName);
				$("#comtype1").html("天安财险保险股份有限公司");
				if (!$.isNull(param.cxInfo.cxOrder.businessAppno)) {
					$("#businessAppnoArea").show("fast");
					// 商业险投保单号
					$("#businessAppno").html(param.cxInfo.cxOrder.businessAppno);// 商业险投保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.businessPolno)) {
					$("#busPolnoArea").show("fast");
					// 商业险保单号
					$("#busPolno").html(param.cxInfo.cxOrder.businessPolno);// 商业险保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.forceAppno)) {
					$("#forceAppnoArea").show("fast");
					// 交强险保单号
					$("#forceAppno").html(param.cxInfo.cxOrder.forceAppno);// 交强险投保单号
				}
				if (!$.isNull(param.cxInfo.cxOrder.forcePolno)) {
					$("#jqxPolnoArea").show("fast");
					// 交强险保单号
					$("#jqxPolno").html(param.cxInfo.cxOrder.forcePolno);// 交强险保单号
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredname)) {
					$("#insuredNameArea").show("fast");
					$("#insuredname").html(param.cxInfo.cxParty.insuredname);
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredidno)) {
					$("#insuredNober").show("fast");
					$("#insuredNo").html(param.cxInfo.cxParty.insuredidno);
				}
				if (!$.isNull(param.cxInfo.cxParty.insuredmobile)) {
					$("#insuredMobileArea").show("fast");
					$("#insuredMobile").html(param.cxInfo.cxParty.insuredmobile);
				}
				if (!$.isNull(param.cxInfo.cxOrder.plateno)) {
					$("#plateNoArea").show("fast");
					$("#plateNo").html(param.cxInfo.cxOrder.plateno);
				}

				


				// 总保费
				$("#summoney").html("￥"+ $.formatNumOfTwo(param.cxInfo.cxOffer.totalPre));// ￥7200.00

				// 商业险保费
				$("#busmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.businessPre)+"元");// 6000.00

				// 交强险保费
				$("#jqxmoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.jqxPre)+"元");// 900.00

				// 车船税
				$("#vehiclemoney").html($.formatNumOfTwo(param.cxInfo.cxOffer.vehicletaxPre)+"元");// 300.00

				//商业险推广费
				$("#bustgmoney").html(param.cxInfo.hqCommision);
				//交强险推广费
				$("#jqxtgmoney").html(param.cxInfo.orgCommision);
				// 投保人姓名
				phName = param.cxInfo.cxParty.phname;
				if (!$.isNull(param.cxInfo.cxOrder.businessAppno)) {
					proNo = param.cxInfo.cxOrder.businessAppno;// 投保单号
				} else {
					proNo = param.cxInfo.cxOrder.forceAppno;// 投保单号
				}
				payUrl = param.cxInfo.cxOrder.payUrl;//支付路径
				
				//人身险
				if(param.cxInfo.cxOrder.rcldIndicate=="1"){
					$("#rcldProductName").html(param.cxInfo.cxOrder.rcldProductName);
					$("#rcldAppno").html(param.cxInfo.cxOrder.rcldAppno);
					$("#rcldmoney").html(param.cxInfo.cxOrder.rcldProductAmount+"元");
					$(".rcld").show();
					if (!$.isNull(param.cxInfo.cxOrder.rcldPolno)&&param.cxInfo.cxOrder.rcldPolno!="") {
						$("#rcldPolnoArea").show("fast");
						// 商业险投保单号
						$("#rcldPolno").html(param.cxInfo.cxOrder.rcldPolno);// 人身险投保单号
					}
				}
                
			}
		} else {
			modelAlert(param.status.statusMessage);
		}
	} else {
		modelAlert("查询订单信息异常！");
	}
};

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#order_index").height(Scrollheight);
	mui("#order_index").scroll();
};
