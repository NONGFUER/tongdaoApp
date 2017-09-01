var risktype = ""; //风险评测类型
var score1, score2, score3, score4, score5, score6, score7, score8, score9, score10 = 0;
var testScore = 0;
var chooseflag = "0"; //标记是否选中选项，选中值为true
var selectflag = "0";
var testType; //评测类型
var returnflag; // 结果页重新测评按钮的返回标记

var riskSupportAbility = "";
var mobile = "";
var productCode = "";
var customerId = "";
var titles = "";
var title = "";
var transToken="";
$(function() {

	//	url传值解密过程
	var urlstr = getUrlQueryString('jsonKey');
	urlstr = UrlDecode(urlstr);
	parm = JSON.parse(urlstr);
	mobile = parm.body.mobile;
	transToken=parm.transToken;
	customerId = parm.body.customerId;
	productCode = parm.body.productCode;
	titles = parm.titles;
	title = parm.title;
	/*初始化页面*/
	$.init();

});
/*初始化页面*/
$.init = function() {
	if($.isNull(parm.body.returnflag)) { //returnflag为空时，显示首页
		$(".risk-introduce-title").show();
		if($.isNull(parm.head.riskSupportAbility)) { //riskSupportAbility为空时，表示为初次测评
			if(!($.isNull(parm.body.testType))) { //testType不为空时，首页显示测评类型，类型值非壳所传

				$(".testType").html(parm.body.testType);
				$(".indexcontent").css("margin-top", "20px");
				$(".risk-introducey,.risk-introduce-title").show();
				var topheight = $(".risk-introducey").height() + $("header").height();
				$("#indexpart").css("margin-top", topheight + "px");
				$.setscroll2();
			} else { // testType为空，首页不显示测评类型

				$(".indexcontent,.declare-button").css("margin-top", "60px");
				$(".declare-button span").text("立即测评");
				$(".risk-introducey").show();
				var topheight = $(".resultTitle").height() + $("header").height();
				$("#indexpart").css("margin-top", topheight + "px");
				$(".resultType").hide();
				$.setscroll1();
			}
		} else { //riskSupportAbility不为空时，表示为再次测评
			if(!($.isNull(parm.body.testType))) { //testType值不为空时，代表此值是重新测评按钮所传值，非壳所传值
				$(".testType").html(parm.body.testType);
			} else { //testType值为空时，代表此值是壳所传，为非首次测评，壳所跳页面
				$(".testType").html(tps(parm.head.riskSupportAbility));
			}
			$(".indexcontent").css("margin-top", "20px");
			$(".risk-introducey,.risk-introduce-title").show();
			var topheight = $(".risk-introducey").height() + $("header").height();
			$("#indexpart").css("margin-top", topheight + "px");
			$.setscroll2();
		}

		/*加载数据*/
		$.detailinit();
	} else { //returnflag非空时，显示题目
		$(".question-item").html("");
		$.detailinit();
		$(".risk-introducey,.risk-introduce-title").hide();
		$("#indexpart").css("margin-top", "43px");
		$.setscroll();
		setTimeout(function() {
			mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
		}, 100);
		$(".indexcontent").css("margin-top", "0px");
		$(".questionDetail,.buttonLine,.question-progress").show();
	}

	//重新测评的点击事件
	$(".declare-button").unbind("tap").bind("tap", function() {
		$(".question-item").html("");
		$.detailinit();
		$(".risk-introducey,.risk-introduce-title").hide();
		$("#indexpart").css("margin-top", "43px");
		$.setscroll();
		setTimeout(function() {
			mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
		}, 100);
		$(".indexcontent").css("margin-top", "0px");
		$(".questionDetail,.buttonLine,.question-progress").show();
	});

	//头部返回按钮
	$(".h_back").on({
		touchstart: function() {
			$(".h_back div").find("img").attr("src", base.imagePath + "public/dh_backgray.png");
			return false;
		},
		touchend: function() {
			$(".h_back div").find("img").attr("src", base.imagePath + "public/dh_back.png");
			$.saveUserBehaviorAnalyzer(
				"gfb\\newExp\\App\\html\\riskGrade\\riskQuestion.html", "离开", "风险评测",
				"个人信息", null, null, null, false);
			returnPage();
		}
	});
	//返回按钮
	$(".backQuestion").unbind("tap").bind("tap", function() {
		if($.isNull(parm.head.riskSupportAbility)) {
			$(".indexcontent,.declare-button").css("margin-top", "60px");
			$(".declare-button span").text("立即测评");
			$(".risk-introducey,.risk-introduce-title").show();
			var topheight = $(".resultTitle").height() + $("header").height();
			$("#indexpart").css("margin-top", topheight + "px");
			$(".resultType,.questionDetail,.buttonLine").hide();
			$.setscroll1();
		} else {
			if(!($.isNull(parm.body.returnflag))) {
				$(".testType").html(parm.body.testType);
			}
			$(".questionDetail,.buttonLine").css("display", "none");
			$(".risk-introducey,.risk-introduce-title").show();
			var topheight = $(".risk-introducey").height() + $("header").height();
			$("#indexpart").css("margin-top", topheight + "px");
			$(".indexcontent").css("margin-top", "20px");
			$.setscroll2();
		}

	});
};
$.detailinit = function() {
	var url = base.url + "investmentLinkedInsurance/getRiskTest.do";
	var data = {
		"head": {
			"channel": "01",
			"userCode": productCode,
			"transTime": $.getTimeStr(),
			"transToken": transToken
		},
		"body": {

		}
	}
	$.reqAjaxs(url, data, $.detailinitCallBack);

}
$.detailinitCallBack = function(data) {
	console.log(data);
	if(data.statusCode == "000000") {
		var str = '';
		var paramList = [];
		var question = data.returns.question;
		var answer = data.returns.answer;
		for(var i = 0; i < question.length; i++) {
			paramList[i] = [];
			paramList[i].question = question[i];
			paramList[i].answerList = [];
			for(var j = 0, k = 0; j < answer.length; j++) {
				if(question[i].questionCode == answer[j].questionCode) {
					paramList[i].answerList[k] = answer[j];
					k++;
				}
			}
		}
		console.log(paramList);
		//var paramList = param.returns.riskTestInfo;
		for(var i = 0; i < paramList.length; i++) {
			str += '<div class="block' + i + ' blockQuestion" chooseflag="0">';
			str += '<div class="questionTitle">' + paramList[i].question.question + '</div>';
			str += '<ul>';
			for(var j = 0; j < paramList[i].answerList.length; j++) {
				str += '<li class="questionlist">';
				str += '<div class="questionimg img' + i + '" selectflag="0"><div>' + paramList[i].answerList[j].answerScore + '</div><img /></div>';
				str += '<div class="answertitle"><span class="answerCode">' + paramList[i].answerList[j].answerCode + '</span></div>';
				str += '<div class="answer">' + paramList[i].answerList[j].answer + '</div>';
				str += '</li>';
				str += '';
			}
			str += '</ul>';
			str += '</div>';
		}
		$(".question-item").append(str);
		$(".questionlist").find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseno.png");

		//下一题的点击事件
		$(".nextQuestion").unbind("tap").bind("tap", function() {
			if($(".block0").css("display") == "block") {
				if($(".block0").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score1 = $(".img0[selectflag = '1']").find("div").html();
					score1 = parseInt(score1);
					$(".backQuestion").hide();
					$(".block1").parent().parent().find(".question-progress span").html("2");
					$(".block1,.lastQuestion").show();
				}
			} else if($(".block1").css("display") == "block") {
				if($(".block1").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score2 = $(".img1[selectflag = '1']").find("div").html();
					score2 = parseInt(score2);
					$(".block2").parent().parent().find(".question-progress span").html("3");
					$(".block2").show();
				}
			} else if($(".block2").css("display") == "block") {
				if($(".block2").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score3 = $(".img2[selectflag = '1']").find("div").html();
					score3 = parseInt(score3);
					$(".block3").parent().parent().find(".question-progress span").html("4");
					$(".block3").show();
				}
			} else if($(".block3").css("display") == "block") {
				if($(".block3").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score4 = $(".img3[selectflag = '1']").find("div").html();
					score4 = parseInt(score4);
					$(".block4").parent().parent().find(".question-progress span").html("5");
					$(".block4").show();
				}
			} else if($(".block4").css("display") == "block") {
				if($(".block4").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score5 = $(".img4[selectflag = '1']").find("div").html();
					score5 = parseInt(score5);
					$(".block5").parent().parent().find(".question-progress span").html("6");
					$(".block5").show();
				}
			} else if($(".block5").css("display") == "block") {
				if($(".block5").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score6 = $(".img5[selectflag = '1']").find("div").html();
					score6 = parseInt(score6);
					$(".block6").parent().parent().find(".question-progress span").html("7");
					$(".block6").show();
				}
			} else if($(".block6").css("display") == "block") {
				if($(".block6").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score7 = $(".img6[selectflag = '1']").find("div").html();
					score7 = parseInt(score7);
					$(".block7").parent().parent().find(".question-progress span").html("8");
					$(".block7").show();
				}
			} else if($(".block7").css("display") == "block") {
				if($(".block7").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score8 = $(".img7[selectflag = '1']").find("div").html();
					score8 = parseInt(score8);
					$(".block8").parent().parent().find(".question-progress span").html("9");
					$(".block8").show();
				}
			} else if($(".block8").css("display") == "block") {
				if($(".block8").attr("chooseflag") == "0") {
					modelAlert("请选择一个选项");
				} else {
					var i = 1;
					nextItem(i);
					score9 = $(".img8[selectflag = '1']").find("div").html();
					score9 = parseInt(score9);
					$(".nextQuestion").hide();
					$(".block9").parent().parent().find(".question-progress span").html("10");
					$(".block9,.submit").show();
				}
			}
		});

		//上一题的点击事件
		$(".lastQuestion").unbind("tap").bind("tap", function() {
			$(".submit").hide();
			if($(".block0").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block0").parent().parent().find(".question-progress span").html("1");
			} else if($(".block1").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block0").parent().parent().find(".question-progress span").html("1");
				$(".blockQuestion,.lastQuestion").hide();
				$(".block0,.nextQuestion,.backQuestion").show();
			} else if($(".block2").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block1").parent().parent().find(".question-progress span").html("2");
				$(".blockQuestion").hide();
				$(".block1,.nextQuestion").show();
			} else if($(".block3").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block2").parent().parent().find(".question-progress span").html("3");
				$(".blockQuestion").hide();
				$(".block2,.nextQuestion").show();
			} else if($(".block4").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block3").parent().parent().find(".question-progress span").html("4");
				$(".blockQuestion").hide();
				$(".block3,.nextQuestion").show();
			} else if($(".block5").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block4").parent().parent().find(".question-progress span").html("5");
				$(".blockQuestion").hide();
				$(".block4,.nextQuestion").show();
			} else if($(".block6").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block5").parent().parent().find(".question-progress span").html("6");
				$(".blockQuestion").hide();
				$(".block5,.nextQuestion").show();
			} else if($(".block7").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block6").parent().parent().find(".question-progress span").html("7");
				$(".blockQuestion").hide();
				$(".block6,.nextQuestion").show();
			} else if($(".block8").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block7").parent().parent().find(".question-progress span").html("8");
				$(".blockQuestion").hide();
				$(".block7,.nextQuestion").show();
			} else if($(".block9").css("display") == "block") {
				setTimeout(function() {
					mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
				}, 10);
				$(".block8").parent().parent().find(".question-progress span").html("9");
				$(".blockQuestion").hide();
				$(".block8,.nextQuestion").show();
			}
		});
		//选中选项的绑定事件
		$(".img0").unbind("tap").bind("tap", function() {
			var i = 0;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img1").unbind("tap").bind("tap", function() {
			var i = 1;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img2").unbind("tap").bind("tap", function() {
			var i = 2;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img3").unbind("tap").bind("tap", function() {
			var i = 3;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img4").unbind("tap").bind("tap", function() {
			var i = 4;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img5").unbind("tap").bind("tap", function() {
			var i = 5;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img6").unbind("tap").bind("tap", function() {
			var i = 6;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img7").unbind("tap").bind("tap", function() {
			var i = 7;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img8").unbind("tap").bind("tap", function() {
			var i = 8;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		$(".img9").unbind("tap").bind("tap", function() {
			var i = 9;
			chooseAnswer(i);
			$(this).attr("selectflag", "1");
			$(this).find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseyes.png");
			$(this).parent().find(".answer").css("background", "#e5f2ff");
		});
		//提交按钮的触发事件
		$(".submit").unbind("tap").bind("tap", function() {
			if($(".block9").attr("chooseflag") == "0") {
				modelAlert("请选择一个选项");
			} else {
				score10 = $(".img9[selectflag = '1']").find("div").html();
				score10 = parseInt(score10);
				testScore = score1 + score2 + score3 + score4 + score5 + score6 + score7 + score8 + score9 + score10;
				$.submitData();
			}
		});

	}
};

//选中选项的方法
function chooseAnswer(i) {
	$(".img" + i).attr("selectflag", "0");
	$(".block" + i).attr("chooseflag", "1");
	$(".img" + i).parent().parent().find("img").attr("src", "../../../image/managemoney/messageFillout/risk-chooseno.png");
	$(".img" + i).parent().parent().find(".answer").css("background", "#fff");
}

//下一题
function nextItem(i) {
	$(".blockQuestion").hide();
	setTimeout(function() {
		mui('#indexpart').scroll().scrollTo(0, 0, 0); //100毫秒滚动到顶
	}, 100);
}

$.submitData = function() {
	resultRisk = toRiskType(testScore);
	var url = base.url + "investmentLinkedInsurance/saveRiskAble.do";
	var data = {
		"body": {
			"userName": mobile,
			"resultRisk": resultRisk
		},
		"head": {
			"userCode": productCode,
			"channel": "01",
			"transTime": $.getTimeStr(),
			"transToken": transToken
		}
	};
	$.reqAjaxs(url, data, $.submitDataCallBack);
}
$.submitDataCallBack = function(param) {
	console.log(param);
	if(param.statusCode == "000000") {
		var jsonObj = {
			"head": {

			},
			"body": {
				"testType": resultRisk,
				"mobile": mobile,
				"customerId": customerId,
				"productCode": productCode
			},
			"title": '评估结果',
			"titles": titles,
		};
		var jsonStr = JSON.stringify(jsonObj);
		jsonStr = UrlEncode(jsonStr);
		window.location.href = "riskResult.html?jsonKey=" + jsonStr;
	}

};

/*设置滑动区域*/
//答题时滑动区域
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header").height() - 10;
	$("#indexpart").height(Scrollheight + "px");
	mui("#indexpart").scroll();
};

//立即评测首页滑动区域
$.setscroll1 = function() {
	var Scrollheight = window.innerHeight - $("header").height() - $(".resultTitle").height();
	$("#indexpart").height(Scrollheight + "px");
	mui("#indexpart").scroll();
};

//重新评测首页滑动区域
$.setscroll2 = function() {
	var Scrollheight = window.innerHeight - $("header").height() - $(".risk-introducey").height();
	$("#indexpart").height(Scrollheight + "px");
	mui("#indexpart").scroll();
};

function toRiskType(tempScore) {
	var testType1 = "1"
	if(tempScore >= 10 && tempScore <= 16) {
		//保守型
		testType1 = "1";
	} else if(tempScore >= 17 && tempScore <= 23) {
		//稳健型
		testType1 = "2";
	} else if(tempScore >= 24 && tempScore <= 31) {
		//平衡型
		testType1 = "3";
	} else if(tempScore >= 32 && tempScore <= 38) {
		//积极型
		testType1 = "4";
	} else if(tempScore >= 39 && tempScore <= 44) {
		//进取型
		testType1 = "5";
	}
	return testType1;
}

function tps(tempScore) {
	var tp = "";
	if(tempScore == '1') {
		//保守型
		tp = "保守型";
	} else if(tempScore == '2') {
		//稳健型
		tp = "稳健型";
	} else if(tempScore == "3") {
		//平衡型
		tp = "平衡型";
	} else if(tempScore == '4') {
		//积极型
		tp = "积极型";
	} else if(tempScore == "5") {
		//进取型
		tp = "进取型";
	}
	return tp;
}