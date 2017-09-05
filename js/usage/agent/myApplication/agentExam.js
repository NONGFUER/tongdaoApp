var answerList = new Array();

$(function(){
	$.init();
	//弹出框
	$(".cancle").unbind("tap").bind("tap",function(){		
		window.location.href = 'agentapply.html';
	})
	$(".retest").unbind("tap").bind("tap",function(){
		$(".shadow").hide();
		location.replace(location);//刷新当前页面
	})
	$(".sure").unbind("tap").bind("tap",function(){
		$(".shadowpass").hide();
		$.saveAnswer(answerList);
	})		
	$.setscroll();	
})

$.init = function(){
	var url = base.url + "agent/question.do";
	var reqData = {
			"head": {
		        "channel": "01",
		        "userCode": "13852291705",
		        "transTime": " ",
		        "transToken":""
		    },"body": {}
		}
	$.reqAjaxs(url,reqData,$.infoCallBack);
}

$.infoCallBack=function(data){
	var str = '<div class="tishi">答对3道考题即通过考试</div><div class="content">';
	var str1 = "";
	var status = "";//是否正确  1：正确    0：错误
	if(data.statusCode == "000000"){
		parm = data.returns;
		var questionNum = parm.questionList.length;
		var i=0;
		for(i=0;i<questionNum;i++){
			var num = i+1;
			var j=0;
			var optionNum = parm.questionList[i].entities.length;
			str += '<div class="kaoti clear"><span>'+num+'、</span>';
			str += '<span>'+parm.questionList[i].questionInfo+'</span>';
			str += '<div class="xuanxiang">';
			for(j=0;j<optionNum;j++){
				str += '<div class="option">';
				str += '<img src="../../image/chooseno.png" class="chooseImg"/>';
				str += '<span class="optionShow">'+parm.questionList[i].entities[j].optionShow+'</span><span>、'+parm.questionList[i].entities[j].optionInfo+'</span></div>';
			}
				str += '</div>';
			str += '<div class="questionCode" style="display:none;">'+parm.questionList[i].questionCode+'</div>';
			str += '<div class="trueanswer" style="display:none;">'+parm.questionList[i].questionAnswer+'</div>';
			str += '</div>';
			
			
		}
						
			str += '</div><div id="confirm" class="confirmbtn">提交试卷</div>'
		$("#insure_iscroll").html(str);
			//点击提交试卷按钮，获取用户答题信息，判断是否通过考试，送后台
			$(".confirmbtn").unbind("tap").bind("tap",function(){
				var m=0;
				var trueNum=0;
				//获取用户选择的答案
				$.getAnswer();
				if(answerList.length != 5){
					modelAlert("请完成所有考题后再提交!");
					return false;
				}else{
					for(var m=0;m<answerList.length;m++){
						if(answerList[m].status == "1"){
							trueNum++;
						}
					}
					if(trueNum < 3){
						$(".tipTrueNum").html(trueNum);
						$(".shadow").show();
						
					}else{
						$(".tipTrueNum").html(trueNum);
						$(".score").html(parseInt(trueNum)*20);
						$(".shadowpass").show();
					}
				}			
			})	
		//点击选择框，选择框图片变色
		$(".option").unbind("tap").bind("tap",function(){
			var picName = $(this).find("img").attr("src").substring($(this).find("img").attr("src").lastIndexOf("/")+1);
			if(picName == "chooseno.png"){
				$(this).parent().find(".option img").attr("src","../../image/chooseno.png");
				$(this).parent().find(".option").css("color","#d2d2d2");
				$(this).find("img").attr("src","../../image/chooseyes.png");
				$(this).css("color","#1b6bb8");
			}else{
				$(this).find("img").attr("src","../../image/chooseno.png");
				$(this).css("color","#d2d2d2");
			}
		})
		
	}
}

//获取用户选择的答案
$.getAnswer = function(){
	answerList = [];
	var optionArr = new Array();//所有选项放到optionArr中
	$(".option").each(function(){
		optionArr.push($(this));
	})
	var k=0;
	
	var optionArrLength = optionArr.length;
	for(k=0;k<optionArrLength;k++){
		var picname = optionArr[k].find("img").attr("src").substring(optionArr[k].find("img").attr("src").lastIndexOf("/")+1);
		if(picname == "chooseyes.png"){
			var chooseanswer = optionArr[k].find(".optionShow").html();
			var trueanswer = optionArr[k].parent().parent().find(".trueanswer").html();
			var questionCode = optionArr[k].parent().parent().find(".questionCode").html();
			
			if(chooseanswer == trueanswer){
				status = "1";     
			}else{
				status = "0"; 
			}
			var answerDate = {
					"code":questionCode,
					"answer": chooseanswer,
	                "status": status
			}
			answerList.push(answerDate);
		}
	}
	console.log(answerList);
}

//通过考试时，保存用户答案到后台
$.saveAnswer = function(data){
	url = base.url + "agent/saveQuestion.do";
	var reqData = {
			"head": {
			     "channel": "01",
			     "userCode": mobile,
			     "transTime": "",
			     "transToken":transToken
			 },
			 "body": {
			     "questionList": data,
			     "customerId"  :customerId,
			     "mobile":mobile
			 }
	}
	$.reqAjaxs(url,reqData,$.saveAnswerCallBack);
}

$.saveAnswerCallBack = function(data){
	console.log(data);
	if(data.statusCode == "000000"){
		urlParm.title = "代理人信息登记";
		urlParm.leftIco = "1";
		urlParm.rightIco = "0";
		urlParm.downIco = "0"
		var jsonStr = UrlEncode(JSON.stringify(urlParm));
		window.location.href="agentInfoRegister.html?jsonKey="+jsonStr;
	}else{
		modelAlert(data.statusMessage);
		return false;
	}
	
}

/* 设置滑动区域 */
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height();
	$("#indexpart").height(Scrollheight + "px");
	var shadowheight = window.innerHeight;
	$("#shadow").height(shadowheight + "px");
	$("#shadowpass").height(shadowheight + "px");
	mui("#indexpart").scroll();
};

function backlast(){
	sysback();
}
