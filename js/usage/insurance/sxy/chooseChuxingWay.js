if(getUrlQueryString("jsonKey")){
	var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
	var mobile = urlParm.mobile ? urlParm.mobile : '';//手机号，从URL中获取
}else{
	var mobile = getUrlQueryString("mobile");
}

var policyType="";//订单状态（01：待支付，03：未生效，04：已生效，99：已过期）
var orderNo="";//订单号
var baodanhao="";//保单号
var userId="";//用户ID
var beginDate="";//订单生效日期（yyyy-mm-dd）
var endDate="";//订单失效日期（yyyy-mm-dd）
var beginDate1="";//订单生效日期（yyyy年mm月dd日）
var endDate1="";//订单失效日期（yyyy年mm月dd日）
var chuxingWay="";//出行方式(9996:飞机，9997:汽车，9998：火车，9999：轮船)
var clickTime="";//上一次点击时间
var pwd="";
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i) == "micromessenger") {
	var devFlag = '1';	//微信公众号
}else{
	var devFlag = '3';	//app
}
$(function(){
	//mobile=getUrlQueryString("mobile");
	/* 设置滑动区域 */
	$.setscroll();
	
	//根据登录手机号获取订单状态，订单生效时间、失效时间、出行方式、订单号、保单号
	var url = base.url + "common/getTrafficTime.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"phone":mobile
			}
	}
	$.reqAjaxs(url,reqData,function(data){
		console.log(data);
		if(data.statusCode == "000000"){
			var parm=data.returns.bxOrder;
			policyType=parm.policyStatus;//订单状态
			beginDate=data.returns.starttime;//起保时间
			endDate=data.returns.endtime;//终保时间
			chuxingWay=data.returns.bxSxyTraffic.trafficWay;//出行方式
			orderNo=parm.orderNo;//订单号
			baodanhao=parm.policyNo;//保单号
			userId=data.returns.bxTdCustomerBasic.id;//用户IDs
			
			var dateTemp = beginDate.split("-"); 
			var dateTemp1 = endDate.split("-"); 
			beginDate1=dateTemp[0]+"年"+dateTemp[1]+"月"+dateTemp[2]+"日";
			endDate1=dateTemp1[0]+"年"+dateTemp1[1]+"月"+dateTemp1[2]+"日";
			
			//未生效状态
			if(policyType=="09"){
				/*$(".zhuangtai").hide();*/
				$(".zhuangtai").html(" ");
				$(".down").hide();
				$(".anniu").hide();
				var str="<p style='text-align:center;'>"+beginDate1+"0点正式生效时间</p>";
				$("#kuang").html(str);
				var str1="<p>正式生效后可随时切换其它保障类型<img class='white' src='../../../image/insurance/sxy/wenhao.png'></p>";
				$("#kuangwai").html(str1);
				if(chuxingWay=="9996"){
					$("#center").attr("src","../../../image/insurance/sxy/feiji100wan.png");
					/*$(".feijiType").html("待生效").show();*/
					$(".feijiType").html("待生效");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane1.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
					$("#lunchuan,#huoche,#qiche").unbind("tap").bind("tap",function(){
						modelAlert("您的随心易灵活个人交通意外保险将于"+beginDate1+"正式生效，生效后即可自由切换其它出行保障。");
					})
				}else if(chuxingWay=="9999"){
					$("#center").attr("src","../../../image/insurance/sxy/lunchuan100wan.png");
					/*$(".lunchuanType").html("待生效").show();*/
					$(".lunchuanType").html("待生效");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
					$("#feiji,#huoche,#qiche").unbind("tap").bind("tap",function(){
						modelAlert("您的随心易灵活个人交通意外保险将于"+beginDate1+"正式生效，生效后即可自由切换其它出行保障。");
					})
				}else if(chuxingWay=="9998"){
					$("#center").attr("src","../../../image/insurance/sxy/huoche100wan.png");
					/*$(".huocheType").html("待生效").show();*/
					$(".huocheType").html("待生效");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
					$("#lunchuan,#feiji,#qiche").unbind("tap").bind("tap",function(){
						modelAlert("您的随心易灵活个人交通意外保险将于"+beginDate1+"正式生效，生效后即可自由切换其它出行保障。");
					})
				}else if(chuxingWay=="9997"){
					$("#center").attr("src","../../../image/insurance/sxy/qiche100wan.png");
					$(".qicheType").html("待生效");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche2.png");
					$("#lunchuan,#feiji,#huoche").unbind("tap").bind("tap",function(){
						modelAlert("您的随心易灵活个人交通意外保险将于"+beginDate1+"正式生效，生效后即可自由切换其它出行保障。");
					})
				}
			}else if(policyType=="10"){//已生效状态
				var str1="<p>保险期间："+beginDate1+"至"+endDate1+"</p>";
				$("#kuangwai").html(str1);
				if(chuxingWay=="9996"){
					var str="<p class='baozhangfanwei' style='text-align:center;'>保障范围：乘坐合法客运的民航班机</p><p style='text-align:center;font-size:10px'>（保障责任：意外伤害身故、残疾）</p>";
					$("#kuang").html(str);
					$(".zhuangtai").html();
					$(".down").show();
					$(".anniu").hide();
					$("#center").attr("src","../../../image/insurance/sxy/feiji100wan.png");
					$(".feijiType").html("已生效");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane1.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9999"){
					var str="<p class='baozhangfanwei' style='text-align:center;'>保障范围：乘坐合法客运轮船</p><p style='text-align:center;font-size:10px'>（保障责任：意外伤害身故、残疾）</p>";
					$("#kuang").html(str);
					$(".zhuangtai").html(" ");
					$(".down").show();
					$(".anniu").hide();
					$("#center").attr("src","../../../image/insurance/sxy/lunchuan100wan.png");
					$(".lunchuanType").html("已生效");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9998"){
					var str="<p class='baozhangfanwei' style='text-align:center;'>保障范围：乘坐合法客运火车、轻轨、地铁</p><p style='text-align:center;font-size:10px'>（保障责任：意外伤害身故、残疾）</p>";
					$("#kuang").html(str);
					$(".zhuangtai").html(" ");
					$(".down").show();
					$(".anniu").hide();
					$("#center").attr("src","../../../image/insurance/sxy/huoche100wan.png");
					$(".huocheType").html("已生效");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9997"){
					var str="<p class='baozhangfanwei' style='text-align:center;'>保障范围：乘坐合法客运公共汽车、电车、出租车</p><p style='text-align:center;font-size:10px'>（保障责任：意外伤害身故、残疾）</p>";
					$("#kuang").html(str);
					$(".zhuangtai").html(" ");
					$(".down").show();
					$(".anniu").hide();
					$("#center").attr("src","../../../image/insurance/sxy/qiche100wan.png");
					$(".qicheType").html("已生效");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche2.png");
				}
				$("#lunchuan").unbind("tap").bind("tap",function(){
					chooseLunchuan();
				})
				$("#feiji").unbind("tap").bind("tap",function(){
					chooseFeiji();
				})
				$("#huoche").unbind("tap").bind("tap",function(){
					chooseHuoche();
				})
				$("#qiche").unbind("tap").bind("tap",function(){
					chooseQiche();
				})
			}else if(policyType=="99"){//已过期

				pwd = data.returns.bxOrder.insureIdentitycard;
				//已过期状态
				$(".zhuangtai").html();
				$(".down").hide();
				var str="<p style='text-align:center;'>您的保单已经失效</p>";
				$("#kuang").html(str);
				var str1="";
				$("#kuangwai").html(str1);
				if(chuxingWay=="9996"){
					$("#center").attr("src","../../../image/insurance/sxy/feiji100wan.png");
					$(".feijiType").html("已过期");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane1.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9999"){
					$("#center").attr("src","../../../image/insurance/sxy/lunchuan100wan.png");
					$(".lunchuanType").html("已过期");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9998"){
					$("#center").attr("src","../../../image/insurance/sxy/huoche100wan.png");
					$(".huocheType").html("已过期");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche2.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
				}else if(chuxingWay=="9997"){
					$("#center").attr("src","../../../image/insurance/sxy/qiche100wan.png");
					$(".qicheType").html("已过期");
					$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
					$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
					$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
					$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche2.png");
				}			
			} 
		}else{
			modelAlert(data.statusMessage);
		}
	});			
})

//已生效状态下选择飞机
function chooseFeiji(){
	//保存选择交通方式
	var url = base.url + "duty/dutySwith.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"policyNo":baodanhao,
				"currentLiability":"9996",
				"orderNo":orderNo,
				"userPhone":mobile,
				"flag":devFlag
			}
	}
	console.log(reqData);
	$.reqAjaxs(url,reqData,function(data){
		console.log(data);
		if(data.statusCode == "000000"){
			$(".zhuangtai").html("");
			$(".baozhangfanwei").html("保障范围：乘坐合法客运的民航班机");
			$(".down").show();
			$(".anniu").hide();
			$("#center").attr("src","../../../image/insurance/sxy/feiji100wan.png");
			$(".feijiType").html("已生效");
			$(".feijiImg").attr("src","../../../image/insurance/sxy/plane1.png");
			$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
			$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
			$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
		}else{
			modelAlert(data.statusMessage);
		}
	});
}
//已生效状态下选择轮船
function chooseLunchuan(){
	//保存选择交通方式
	var url = base.url + "duty/dutySwith.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"policyNo":baodanhao,
				"currentLiability":"9999",
				"orderNo":orderNo,
				"userPhone":mobile,
				"flag":devFlag
			}
	}
	console.log(reqData);
	$.reqAjaxs(url,reqData,function(data){
		console.log(data);
		if(data.statusCode == "000000"){
			$(".zhuangtai").html("");
			$(".baozhangfanwei").html("保障范围：乘坐合法客运轮船");
			$(".down").show();
			$(".anniu").hide();
			$("#center").attr("src","../../../image/insurance/sxy/lunchuan100wan.png");
			$(".lunchuanType").html("已生效");
			$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan2.png");
			$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
			$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
			$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
		}else{
			modelAlert(data.statusMessage);
		}
	});
}
//已生效状态下选择火车
function chooseHuoche(){
	//保存选择交通方式
	var url = base.url + "duty/dutySwith.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"policyNo":baodanhao,
				"currentLiability":"9998",
				"orderNo":orderNo,
				"userPhone":mobile,
				"flag":devFlag
			}
	}
	$.reqAjaxs(url,reqData,function(data){
		if(data.statusCode == "000000"){
			$(".zhuangtai").html("");
			$(".baozhangfanwei").html("保障范围：乘坐合法客运火车、轻轨、地铁");
			$(".down").show();
			$(".anniu").hide();
			$("#center").attr("src","../../../image/insurance/sxy/huoche100wan.png");
			$(".huocheType").html("已生效");
			$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche2.png");
			$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
			$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
			$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche.png");
		}else{
			modelAlert(data.statusMessage);
		}
	});
}
//已生效状态下选择汽车
function chooseQiche(){
	//保存选择交通方式
	var url = base.url + "duty/dutySwith.do";
	var reqData = {
			"head":{
				"channel":"01",
				"userCode":"2835",
				"transTime":""
			},"body":{
				"policyNo":baodanhao,
				"currentLiability":"9997",
				"orderNo":orderNo,
				"userPhone":mobile,
				"flag":devFlag
			}
	}
	$.reqAjaxs(url,reqData,function(data){
		if(data.statusCode == "000000"){
			$(".zhuangtai").html("");
			$(".baozhangfanwei").html("保障范围：乘坐合法客运公共汽车、电车、出租车");
			$(".down").show();
			$(".anniu").hide();
			$("#center").attr("src","../../../image/insurance/sxy/qiche100wan.png");
			$(".qicheType").html("已生效");
			$(".huocheImg").attr("src","../../../image/insurance/sxy/huoche.png");
			$(".feijiImg").attr("src","../../../image/insurance/sxy/plane.png");
			$(".lunchuanImg").attr("src","../../../image/insurance/sxy/lunchuan.png");
			$(".qicheImg").attr("src","../../../image/insurance/sxy/qiche2.png");
		}else{
			modelAlert(data.statusMessage);
		}
	});
}

$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentIndex").height(Scrollheight);
	mui("#contentIndex").scroll();
};

function backlast(){
	urlParm.title = "保单详情";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	var jsonStr = UrlEncode(JSON.stringify(urlParm));
	window.location.href = base.url + "tongdaoApp/html/account/myOrder/policyInfo.html?jsonKey="+jsonStr;
}
