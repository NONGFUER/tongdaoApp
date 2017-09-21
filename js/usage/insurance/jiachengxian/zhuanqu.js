$(function(){
	/* 设置滑动区域 */
	$.setscroll();		
	//获取剩余份数
	$.getShengyu("21");
	//领取
	// getAppInfo();	
	if( isComing == "1" ){
		$(".zengsong").css({border: "1px solid #eee",color: "#eee"});
		$(".lingqu").css({border: "1px solid #eee",color: "#eee"});		
	}
		$(".lingqu").unbind("tap").bind("tap",function(){
			if( isComing == "1" ){				
				return false;
			}
			if(roleType == "00" || roleType == "") {
				loginControl();
			}else if( roleType == "05" ){
				modelAlert("当前用户为团队人员，无法领取！");
			}else{
				tuLingqu();
			}
		})	
		$(".zengsong").unbind().bind("tap",function(){
			if( isComing == "1" ){				
				return false;
			}
			if(roleType == "00" || roleType == "") {
				loginControl();
			}else if( roleType == "05" ){
				modelAlert("当前用户为团队人员，无法赠送！");
			}else{
				shareHandle();
			}
		});
})
//获取剩余份数,领取记录
$.getShengyu=function(cId){
	var url=base.url+"giveInsuranceAll/giveInsurance.do";
	var reqData={
			"head":{
				"channel": "01",
			    "userCode": mobile,
			    "transTime": "",
			    "transToken":transToken
			},"body":{
				"phone": mobile,  //手机号
			    "commmodityId": cId,   //产品编码
			    "customerId":customerId
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
					if( roleType == "01" ){
						str+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
						str+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
					}else{
						str+="<td>"+param[i].insuName+"</td>";
						str+="<td>"+param[i].insuPhone+"</td>";
					}	
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
					if( roleType == "01" ){
						str1+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
						str1+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
					}else{
						str1+="<td>"+param[i].insuName+"</td>";
						str1+="<td>"+param[i].insuPhone+"</td>";
					}	
					str1+="<td>"+param[i].underDate+"</td>";
					str1+="</tr>";
				}
				$(".jiluTable").html(str1);
				
				$(".zhankai").unbind("tap").bind("tap",function(){
					if($(".kai").html()=="点击展开"){//点击展开
						$(".kai").html("点击收起");
						$(".kaiImg").html("<img src='../../../images/insurance/jcx/jiantou1.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou1.png");*/
						$(".zhankai").show();
						$(".quanbu").html("已加载全部");
						$(".quanbu").show();
						str2="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<length;i++){
							str2+="<tr>";
							if( roleType == "01" ){
								str2+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
								str2+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
							}else{
								str2+="<td>"+param[i].insuName+"</td>";
								str2+="<td>"+param[i].insuPhone+"</td>";
							}							
							str2+="<td>"+param[i].underDate+"</td>";
							str2+="</tr>";
						}
						$(".jiluTable").html(str2);
					}else{//点击收起
						$(".kai").html("点击展开");
						$(".kaiImg").html("<img src='../../../images/insurance/jcx/jiantou1.png'/>");
						/*$(".kaiImg img").attr("src","../../images/jiantou2.png");*/
						$(".zhankai").show();
						$(".quanbu").hide();
						str3="<tr><th class='topLeft'>投保人名称</td><th class='middle'>投保人手机号</td><th class='topRight'>承保时间</td></tr>";
						for(i=0;i<10;i++){
							str3+="<tr>";
							if( roleType == "01" ){
								str3+="<td>"+$.namePrivate(param[i].insuName)+"</td>";
								str3+="<td>"+$.phonePrivate(param[i].insuPhone)+"</td>";
							}else{
								str3+="<td>"+param[i].insuName+"</td>";
								str3+="<td>"+param[i].insuPhone+"</td>";
							}							
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

function tuLingqu(){
	urlParm.title = "驾乘人员意外伤害保险";
	urlParm.leftIco = "1";
	urlParm.rightIco = "0";
	urlParm.downIco = "0";
	var jsonStr=UrlEncode(JSON.stringify(urlParm));			
	window.location.href="jcxshouye.html?jsonKey="+jsonStr;
}

function shareHandle(){
	var title = "易安驾乘无忧意外保险" ;
	var desc  = "驾车乘车都能保，20万保额免费领" ;	
	var shareurl = base.url+"tongdaoApp/html/share/kongbai.html?mobile="+mobile+'&ccId='+ccId+'&type=4';
	var picUrl = base.url + "tongdaoApp/image/share/jiachenxianfenx.png";
	shareMethod(shareurl,title,desc,"baodan",picUrl);		
};

function backlast(){
	sysback();
}
