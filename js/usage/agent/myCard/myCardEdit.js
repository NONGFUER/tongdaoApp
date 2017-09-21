var urlObj = {
	"myCardSaveUrl": base.url + "agent/updateBusinessCard.do", //保存
	"upImageUrl": base.url + "agent/upPostCardWxQRCode.do", //上传接口
	"getWxQRCodeUrl": base.url + "agent/getBusinessCard.do" //
}
var cardObj = "";
var oldArray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
var hideArray = [];
var showArray = [];
var cardParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var customerId = cardParm.BxWxAgent.customerId;
var transToken = cardParm.transToken;
var userCode = cardParm.userCode;
console.log(cardParm);
$(function() {
	getWxQRCode(customerId, userCode, transToken);
	cardObj = cardParm.BxWxAgent;
	$.setscroll();
	//从前面那个页面渲染	
	$("#name").text(cardParm.BxWxAgent.name); //姓名
	$(".iden").text(cardParm.BxWxAgent.iden); //代理人身份
	$(".area").text(cardParm.BxWxAgent.area); //地区
	$("#cardphone").val(cardParm.BxWxAgent.cardmobile); //手机
	$("#agentCode").text(cardParm.BxWxAgent.agentCode); ////业务员代码
	$("#practiceCode").text(cardParm.BxWxAgent.practiceCode); //职业
	$("#introarea").val(cardParm.BxWxAgent.introinfo); //个人介绍
	$(".fieldlist").data("field", cardParm.BxWxAgent.field); //擅长
	$(".tou img").attr("src", cardObj.touxiang); //头像
	//跳转到引导步骤
	$(".wechat_right").bind("tap", function() {
		cardParm.title='如何获取二维码';
		cardParm.rightIco='0';
		var jsonStr = UrlEncode(JSON.stringify(cardParm));
		window.location.href = "./getEWM.html?jsonKey=" + jsonStr;
	});

	//跳转"关于我们"
	$(".company").unbind("tap").bind("tap", function() {
		window.location.href = base.url + "App/html/share/companyIntro1.html";
	});

	//触发壳上相机
	$('#erweima_img').bind('tap', function() {
		getImg();
	});
	//触发上传图像
	$(".erweima_commit").bind("tap", function() {
		var path = $(".erweima_img img").attr("src");
		var image = new Image();
		image.src = path;
		if(path == "../../../image/account/add.png") {
			modelAlert("请从相册中选择二维码图片上传!");
		} else {
			image.onload = function() {
				var imgData = getBase64Image(image);
				//上传接口
				uploadImg(imgData, customerId, userCode, transToken);
			}
		}

	});

	//退回
	$(".h_back").bind("tap", function() {
		var sendData = {
			"customerId": cardObj.customerId
		}
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = "./myCard.html?jsonKey=" + jsonStr;
	});

	//擅长领域	
	var lingyu = cardParm.BxWxAgent.field;
	if(lingyu) {
		lingyu = lingyu.split(',');
		showArray = lingyu; //显示中的值
		if(lingyu.length > 0) {
			var str = "";
			for(var i = 0; i < lingyu.length; i++) {
				var a = lingyu[i];
				var flag = $.inArray(a, oldArray);
				oldArray.splice(flag, 1);
				str += '<div class="tag" name="' + lingyu[i] + '">' + toField(lingyu[i]) + '<sup class="deletesup" onclick="deletex(this)"><img alt="" src="../../../image/account/delete.png"></sup></div>';
			}
			hideArray = oldArray; //选择器中的值
			str += '<div class="tag addLingyu">+</div>';
			$(".fieldlist").html(str);
			if(lingyu.length >= 6) {
				$(".addLingyu").hide();
			}
		} else {
			hideArray = oldArray;
			$(".fieldlist").html('<div class="tag addLingyu">+</div>');
		}
	} else {
		hideArray = oldArray;
		$(".fieldlist").html('<div class="tag addLingyu">+</div>');
	}
	$(".tag").each(function(i) {
		$(this).click(function() {
			$(this).find("sup").removeClass("deletesup");
			$(this).siblings().find("sup").addClass("deletesup");
			//$(this).find(".deletesup");
		})
	});

	$(".addLingyu").unbind("tap").bind("tap", function() {
		var selectPicker = new mui.PopPicker();
		var popArray = hideArray.map(function(item) {
			return toField(item);
		});

		selectPicker.setData(popArray);
		selectPicker.show(function(item) {
			//alert(item[0])			
			var tianjia = toFieldNum(item[0]);
			var flag2 = $.inArray(tianjia, hideArray);
			hideArray.splice(flag2, 1) //从hide中删除
			showArray.push(tianjia) //从show中添加
			if(showArray.length == 6) {
				$(".addLingyu").hide();
			}
			var tag = '<div class="tag" name="' + tianjia + '">' + toField(tianjia) + '<sup class="deletesup" onclick="deletex(this)" ><img alt="" src="../../../image/account/delete.png"></sup></div>';
			$(".addLingyu").before(tag);
			$(".tag").each(function(i) {
				$(this).click(function() {
					$(this).find("sup").removeClass("deletesup");
					$(this).siblings().find("sup").addClass("deletesup");
				})
			});
		});
	});

});
$.setscroll = function() {
	var Scrollheight = window.innerHeight - $("header");
	$("#card_scroll").height(Scrollheight + "px");
	mui("#card_scroll").scroll();
};
//保存接口
function saveReq() {
	var url = urlObj.myCardSaveUrl;
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"loggingCustomerId": customerId,
			"customerId": customerId,
			"postcardIntroduction": $("#introarea").val(),
			"postcardField": toArr(showArray),
			"postcardPhone": $("#cardphone").val()
		}
	}
	$.reqAjaxs(url, reqData, savecard);
}

function savecard(data) {
	console.log(data);
	if(data.status_code == '000000') {
		var sendData = {
			"userCode":userCode,
			"transToken":transToken,
			"customerId": cardObj.customerId,
			"leftIco": '1',
			"rightIco": '3',
			"downIco": '0',
			"title": '我的名片',
		}
		var jsonStr = UrlEncode(JSON.stringify(sendData));
		window.location.href = base.url + "tongdaoApp/html/agent/myCard/myCard.html?jsonKey=" + jsonStr;
	} else if(data.status_code == '123456') {
		modelAlert(data.status_message, '', lognCont);
	} else {
		modelAlert(data.status_message);
	}
}
/*
 * 上传图片接口请求
 * 
 * 
 * */
function uploadImg(img, id, userCode, transToken) {
	var url = urlObj.upImageUrl;
	var reqData = {
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		},
		"body": {
			"img": img,
			"customerId": id,
			"loggingCustomerId": id,
		}
	}
	$.reqAjaxs(url, reqData, function(data) {
		if(data.statusCode == "000000") {
			modelAlert("上传成功");
		} else if(data.statusCode == "123456") {
			modelAlert(data.statusMessage, "", lognCont);
		} else {
			modelAlert("上传失败");
		}
	});
}

function getWxQRCode(id, userCode, transToken) {
	var url = urlObj.getWxQRCodeUrl;
	var reqData = {
		"body": {
			"loggingCustomerId": id,
			"customerId": id,
		},
		"head": {
			"channel": "01",
			"userCode": userCode,
			"transTime": "",
			"transToken": transToken
		}
	}
	$.reqAjaxs(url, reqData, function(data) {
		console.log(data)
		if(data.status_code == "000000") {
			if(!data.returns.insuranceConsultantInfo.postcardWxImage) {
				$(".erweima_img img").attr("src", "../../../image/account/add.png");
			} else {
				$(".erweima_img img").attr("src", base.url+'tongdaoApp/img/wxQRCode/'+data.returns.insuranceConsultantInfo.postcardWxImage);
			}
		}
	});
}

function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	var width = img.width;
	var height = img.height;
	canvas.width = width; /*设置新的图片的宽度*/
	canvas.height = height; /*设置新的图片的长度*/
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/
	var dataURL = canvas.toDataURL("image/png", 1);
	return dataURL.replace("data:image/png;base64,", "");
}

function getAppInfo(msg) {
	/*alert(msg);*/
	$(".erweima_img img").attr("src", "data:image/png;base64," + msg);
}

function deletex(obj) {
	$(obj).parent().remove();
	//alert($(obj).parent().attr("name"));
	var shanchu = $(obj).parent().attr("name");
	var flag1 = $.inArray(shanchu, showArray);
	showArray.splice(flag1, 1); //从show中删除
	hideArray.push(shanchu); //从hide中添加
	if(showArray.length < 6) {
		$(".addLingyu").show();
	}
}
$.fn.longPress = function(fn) {
	var timeout = undefined;
	var $this = this;
	for(var i = 0; i < $this.length; i++) {
		$this[i].addEventListener('touchstart', function(event) {
			timeout = setTimeout(fn, 800); //长按时间超过800ms，则执行传入的方法
		}, false);
		$this[i].addEventListener('touchend', function(event) {
			clearTimeout(timeout); //长按时间少于800ms，不会执行传入的方法
		}, false);
	}
}

function toField(str) {
	var field = "";
	if(str == "01") {
		field = "意外险"
	} else if(str == "02") {
		field = "少儿险"
	} else if(str == "03") {
		field = "养老险"
	} else if(str == "04") {
		field = "重疾险"
	} else if(str == "05") {
		field = "医疗险"
	} else if(str == "06") {
		field = "人寿险"
	} else if(str == "07") {
		field = "理财险"
	} else if(str == "08") {
		field = "车辆险"
	} else if(str == "09") {
		field = "家财险"
	} else if(str == "10") {
		field = "企业财产险"
	} else if(str == "11") {
		field = "农业险"
	}
	return field;
}

function toFieldNum(str) {
	var field = "";
	if(str == "意外险") {
		field = "01"
	} else if(str == "少儿险") {
		field = "02"
	} else if(str == "养老险") {
		field = "03"
	} else if(str == "重疾险") {
		field = "04"
	} else if(str == "医疗险") {
		field = "05"
	} else if(str == "人寿险") {
		field = "06"
	} else if(str == "理财险") {
		field = "07"
	} else if(str == "车辆险") {
		field = "08"
	} else if(str == "家财险") {
		field = "09"
	} else if(str == "企业财产险") {
		field = "10"
	} else if(str == "农业险") {
		field = "11"
	}
	return field;
}

function toArr(arry) {
	if(arry && arry.length != 0) {
		return arry.join(",")
	} else {
		return "";
	}
}
/*登录失效*/
function lognCont() {
	loginControl();
}
//保存
/*$(".save").bind("tap", function() {*/
function baocun() {
	var ph = $("#cardphone").val()
	if(!tit.regExp.isMobile(ph)) {
		modelAlert("请输入正确的手机号！");
		return false;
	} else {
		saveReq();
	}
}

function backlast() {
	sysback();
}
/*});*/