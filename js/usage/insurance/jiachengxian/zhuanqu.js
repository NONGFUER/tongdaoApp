var mobile="";//电话号码
var productCode="";//产品编码
var type = "";
var idAuth = "";
$(function(){
	var str = getUrlQueryString("jsonKey");
	str = UrlDecode(str);
	parm = JSON.parse(str);
    mobile=parm.mobile;
    productCode=parm.productCode;
   
	/*mobile="13276690882";
	productCode="1213";*/
	/* 设置滑动区域 */
	$.setscroll();
	//返回
	$(".h_back").unbind("tap").bind("tap",function(){
		if(systemsource == "ios"){
			objcObject.OpenUrl("back");
		}else if(systemsource == "android"){
			android.goBack();
		}
	})
	//获取剩余份数
	$.getShengyu();
	//领取
	 getAppInfo();
	if(mobile == ""||mobile == undefined){	
		$(".lingqu").unbind("tap").bind("tap",function(){
			//alert("1"+" "+mobile);
			//loginControl();
		})
	}else{	
		//alert(idAuth +" "+type);
		if(idAuth == "1"){
			if(type == "2" || type == "3" || type == "4" ){
				$(".lingqu").css("color","#ff6a00");
				$(".lingqu").css("border","1px solid #ff6a00");
				$(".lingqu").unbind("tap").bind("tap",function(){					
					var parm={};
			    	parm.mobile=mobile;
			    	parm.productCode=productCode;
			    	var jsonStr=UrlEncode(JSON.stringify(parm));
			    	window.location.href="jcxshouye.html?jsonKey="+jsonStr;
				})
			}else if(type == "5"){
				$(".lingqu").unbind("tap").bind("tap",function(){					
					
				})
			}else{
				$(".lingqu").unbind("tap").bind("tap",function(){
					//registerControl();
				});
				
			}			
		}else{
			$(".lingqu").unbind("tap").bind("tap",function(){
			//registerControl();
			});
		}
		
	}
	
	//赠送客户
	if(mobile == ""||mobile == undefined){
		$(".zengsong").unbind("tap").bind("tap",function(){
		//alert("1"+" "+mobile);
			//loginControl();
		})
	}else{
		//alert(idAuth +" "+type);
		if(idAuth == "1"){
			if(type == "2" || type == "3" || type == "4"){
			$(".zengsong").css("color","#1b6bb8");
			$(".zengsong").css("border","1px solid #1b6bb8");
			$(".zengsong").on("tap",function(){
				//alert("2"+" "+mobile);
				var parm={};
				parm.mobile=mobile;
				parm.productCode=productCode;
				var jsonStr=UrlEncode(JSON.stringify(parm));
		    	if(systemsource == "ios"){
		    		var shareParam={
		    				url:base.url+"App/html/jiachengxian/jcxshouyeShare.html?jsonKey="+jsonStr,
		    				flag:"2",
		    				title:"免费领取20万驾乘意外险",
		    				desc:"驾车乘车都能保，20万保额免费送！",
		    				descQuan:"免费领取20万驾乘意外险，驾车乘车都能保！",
		    				picUrl:"http://td-sit.ta-by.com/tongdaoPlatform/App/images/jiachenxianfenx.png"
		    		}
					objcObject.share(shareParam);
				}else if(systemsource == "android"){
					android.JsShareBy("4","免费领取20万驾乘意外险","驾车乘车都能保，20万保额免费送！","免费领取20万驾乘意外险，驾车乘车都能保！",base.url+"App/html/jiachengxian/jcxshouyeShare.html?jsonKey="+jsonStr);
				}
		    });
			}else{
				$(".zengsong").unbind("tap").bind("tap",function(){
					//registerControl();
				});
			}
		}else{
			$(".zengsong").unbind("tap").bind("tap",function(){
				//registerControl();
			});
		}
	}
	
	//
})
//获取剩余份数,领取记录
$.getShengyu=function(){
	var url=base.share_sxyurl+"giveInsuranceAll/giveInsurance.do";
	var reqData={
			"head":{
				"channel": "01",
			    "userCode": "2835",
			    "transTime": ""
			},"body":{
				"phone": mobile,  //手机号
			    "productCode": productCode   //产品编码
			}
	}
	$.reqAjaxs(url,reqData,function(data){
		//console.log(data);
		if(data.statusCode=="000000"){
			var param=data.returns.pager.entities;
			$(".shengyuNum").html(data.returns.surplusNum);
			var str="";
			var str1="";
			var str2="";
			var str3="";
			var str4="";
			var i=0;
			var length=param.length;//领取记录条数
			if(length==0){
				$(".zhankai").hide();
				$(".quanbu").html("暂无人领取");
				$(".quanbu").show();
				str4="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				$(".jiluTable").html(str4);
			}else if(length<=10 && length!=0){//小于10条，全部展示
				$(".zhankai").hide();
				$(".quanbu").html("已加载全部");
				$(".quanbu").show();
				str="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				for(i=0;i<param.length;i++){
					str+="<tr>";
					str+="<td>"+param[i].insuName+"</td>";
					str+="<td>"+param[i].insuPhone+"</td>";
					str+="<td>"+param[i].underDate+"</td>";
					str+="</tr>";
				}
				$(".jiluTable").html(str);
			}else{//大于10条，先展示前10条，点击展开按钮时再展示全部
				$(".kai").html("点击展开");
				$(".kaiImg").html("<img src='../../images/jiantou2.png'/>");
				/*$(".kaiImg img").attr("src","../../images/jiantou2.png");*/
				$(".zhankai").show();
				$(".quanbu").hide();
				str1="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
				for(i=0;i<10;i++){
					str1+="<tr>";
					str1+="<td>"+param[i].insuName+"</td>";
					str1+="<td>"+param[i].insuPhone+"</td>";
					str1+="<td>"+param[i].underDate+"</td>";
					str1+="</tr>";
				}
				$(".jiluTable").html(str1);
				
				$(".zhankai").unbind("tap").bind("tap",function(){
					if($(".kai").html()=="点击展开"){//点击展开
						$(".kai").html("点击收起");
						$(".kaiImg").html("<img src='../../images/jiantou1.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou1.png");*/
						$(".zhankai").show();
						$(".quanbu").html("已加载全部");
						$(".quanbu").show();
						str2="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<length;i++){
							str2+="<tr>";
							str2+="<td>"+param[i].insuName+"</td>";
							str2+="<td>"+param[i].insuPhone+"</td>";
							str2+="<td>"+param[i].underDate+"</td>";
							str2+="</tr>";
						}
						$(".jiluTable").html(str2);
					}else{//点击收起
						$(".kai").html("点击展开");
						$(".kaiImg").html("<img src='../../images/jiantou2.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou2.png");*/
						$(".zhankai").show();
						$(".quanbu").hide();
						str3="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<10;i++){
							str3+="<tr>";
							str3+="<td>"+param[i].insuName+"</td>";
							str3+="<td>"+param[i].insuPhone+"</td>";
							str3+="<td>"+param[i].underDate+"</td>";
							str3+="</tr>";
						}
						$(".jiluTable").html(str3);
					}
				})
			}
		}else{
			modelAlert(data.statusMessage);
		}
		
		
	})
}
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#contentHead").height(Scrollheight);
	mui("#contentHead").scroll();
};
function getAppInfo(){
	var url=base.url+"appUser/getCurrentUserInfo.do";
	var reqData={
			"head":{
				
			},
			"body":{
				"userName": mobile  //手机号
			}		
	}
	$.reqAjaxsFalse(url,reqData,getStatus)
}
function getStatus(data){
	if(data.statusCode == "000000"){
	type = data.returns.cutomerBasic.type;		//
	idAuth = data.returns.cutomerBasic.idAuth; //
	}
}