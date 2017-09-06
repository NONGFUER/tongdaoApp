/*获取数据*/
var paramlist = null;//常用保险人列表
var editnum = null;//编辑对象编号

var transToken = '059876d99ec46c490953d04d4993da56';
var userCode = '13601460140';
var customerId = '8';
var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
customerId = urlParm.customerId;
userCode = urlParm.userCode,
//transToken = urlParm.transToken,

//初始化
$(function() {
	if(customerId != null && customerId != ""){
		getList();//获取常用保险人列表
	}
	
//	openAdd();//打开新增弹框
	
	//关闭添加/修改弹出框
	$(".note-div_title_right").unbind("tap").bind("tap",function(){
		$(".note").hide();
	});
	
	/***新增*******/
	$("#addBtn").on("tap",function(){
		if(addCheck()){
			add();
		}
	});
	
	/*****修改*****/
	$("#updateBtn").on("tap",function(){
		if(updateCheck()){
			update();
		}
	});
})

//获取常用保险人列表
function getList() {
	var reqData = {
			"body": {
				"customerId": customerId
			},
			"head": {
				"userCode": userCode,
				"channel": "01",
//				"transToken": transToken,
				"transTime":$.getTimeStr()
			}
		}
		var url = base.url + 'underwriterCommonlyUsed/getUnderwriterCommonlyUsed.do';
		console.log("页面初始化，发送请求报文--");
		$.reqAjaxsFalse(url, reqData, ListCallBack);
}

//渲染常用保险人结果列表
function ListCallBack(data) {
	if(data.statusCode == "000000"){
		var str = "";
		paramlist = data.returns.underwriterCommonlyUsedList;
		if(!$.isNull(paramlist) && paramlist.length > 0){
			for(var i = 0; i < paramlist.length; i++){
				var name = paramlist[i].name ? paramlist[i].name:"";
				var email = paramlist[i].email ? paramlist[i].email:"";
				var phone = paramlist[i].phone ? paramlist[i].phone:"";
				var idNo = paramlist[i].idNo ? paramlist[i].idNo:"";
				var addressDetial = paramlist[i].addressDetial ? paramlist[i].addressDetial:"";
				var retail = paramlist[i].retail;//关系
				
				str += '<div class="notice_info">';
				str += '<div class="helpcenter_enter"><input type="hidden" value="'+paramlist[i].questionCode+'"/>';
				str += '<ul><li class="border-1px-bottom" id="loginpwd">';
				
				str += '<li class="man-div-body-ul_li mui-table-view-cell">';
				str += '<div class="mui-slider-right mui-disabled shanchu">';
				//判断关系
				if(retail =="01"){
					str += '<a class="mui-btn blue bianjiBtn"style="visibility: hidden;"><input type="hidden" value="'+i+'"/>';
				}else{
					str += '<a class="mui-btn blue bianjiBtn"><input type="hidden" value="'+i+'"/>';
				}
				str += '<i class="bianji">';
				str += '<img src="../../image/useApplicant/bianji.png"/>';
				str += '</i>';
				str += '<span>编辑</span>';
				str += '</a>';
				str += '<a class="mui-btn red delBtn"><input type="hidden" value="'+i+'"/>';
				str += '<i class="shanchu">';
				str += '<img src="../../image/useApplicant/shanchu.png"/>';
				str += '</i>';
				str += '<span>删除</span>';
				str += '</a>';
				str += '</div>';
				str += '<div class="man-div-body-ul_li_div mui-slider-handle">';
				str += '<ul class="ul_title">';
				str += '<li>';
				str += '<div class="title_name_left">';
				str += '<span>'+name+'</span>';
				//判断关系
				if(retail =="01"){
					str += '<span>本人</span>';
				}else{
					str += '<span style="visibility: hidden;"></span>';
				}
				str += '</div>';
				str += '<div class="title_name_right">';
				str += '<span><img src="../../image/useApplicant/email.png"/></span>';
				str += '<span>'+email+'</span>';
				str += '</div>';
				str += '</li>';
				str += '<li>';
				str += '<div class="title_body_left">';
				str += '<span>'+phone+'</span>';
				str += '</div>';
				str += '<div class="title_body_right">';
				str += '<span><img src="../../image/useApplicant/shenfenzheng.png"/></span>';
				str += '<span>'+idNo+'</span>';
				str += '</div>';
				str += '</li>';
				str += '<li class="dizi">';
				str += addressDetial;
				str += '</li>';
				str += '</ul>';
				str += '</div>';
				str += '</li>';
			}
		}
		//html插入页面渲染数据
		$(".man-div-body-ul").html(str);
		
		/***修改***/
		$(".bianjiBtn").unbind("tap").bind("tap",function(){
			var num = $(this).find("input").val();
			editnum = num;//编辑对象编号
			$("#editholder").show();
			$("#updateId").val(paramlist[num].id);
			$("#editName").val(paramlist[num].name);
			$("#editPhone").val(paramlist[num].phone);
			$("#editIdNo").val(paramlist[num].idNo);
			$("#editEmail").val(paramlist[num].email);
			$("#editAddress").val(paramlist[num].addressDetial);		
		})	
		
		/***删除***/
		$(".delBtn").unbind("tap").bind("tap",function(){
			var num = $(this).find("input").val();
			var unId=paramlist[num].id;
			shanchu(unId);
		});
		
	}else{
		modelAlert("查询常用保险人列表失败！");
	}
}

function add(){
	var url = base.url + "underwriterCommonlyUsed/saveUnderwriterCommonlyUsed.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			"customerId":customerId,
			"name":$.trim($("#addName").val()),
			"idNo":$("#addIdNo").val(),
			"phone":$.trim($("#addPhone").val()),
			"email":$.trim($("#addEmail").val()),
			"addressDetial":$.trim($("#addAddress").val()),
			"createdBy":customerId,
			"updatedBy":customerId,
		}
	}	
	$.reqAjaxs(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	modelAlert("添加成功！", null , function(data){window.location.reload();});
//	    	window.location.reload();
		}else {
		   modelAlert(data.statusMessage);
		}
	});
}

function update(){
	var url = base.url + "underwriterCommonlyUsed/UpdateUnderwriterCommonlyUsed.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			"id":$("#updateId").val(),
			"customerId":customerId,
			"name":$.trim($("#editName").val()),
			"idNo":$("#editIdNo").val(),
			"phone":$.trim($("#editPhone").val()),
			"email":$.trim($("#editEmail").val()),
			"addressDetial":$.trim($("#editAddress").val()),
			"createdBy":customerId,
			"updatedBy":customerId,
		}
	}	
	$.reqAjaxs(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	modelAlert("编辑成功！", null , function(data){window.location.reload();});
//	    	window.location.reload();
		}else {
		   modelAlert(data.statusMessage);
		}
	});
}

//删除常用保险人
function shanchu(unId){
	var url = base.url + "underwriterCommonlyUsed/delUnderwriterCommonlyUsed.do";
	var reqData = {
		"head":{
			"channel":"01",
			"userCode":"",
			"transTime":$.getTimeStr()
		},"body":{
			"unId":unId,
		}
	}	
	/*$.reqAjaxsFalse(url, reqData, ListCallBack);*/
	$.reqAjaxs(url,reqData,function(data){
	    if(data.statusCode == "000000") {
	    	modelAlert("删除成功！", null , function(data){window.location.reload();});
//	    	window.location.reload();
		}else {
		   modelAlert(data.statusMessage);
		}
	});
}

//打开新增弹框
function openAdd(){
	$("#addholder inpt").val("");//输入框置空
	$("#addholder").show();
}



function addCheck(){
	if ($.isNull($("#addName").val())) {
		modelAlert("姓名不能为空！");
		return false;
	} else if (tit.regExp.isChinese($.trim($("#addName").val())) == false) {
		modelAlert("姓名必须为汉字！");
		return false;
	}
	
	// 投保人手机号码校验
	if ($.isNull($("#addPhone").val())) {
		modelAlert("手机号不能为空！");
		return false;
	} else if (tit.regExp.isMobile($("#addPhone").val()) == false) {
		modelAlert("请输入正确的手机号码！");
		return false;
	}
	
	//投保人身份证号
	if ($.isNull($("#addIdNo").val())) {
		modelAlert("身份证号不能为空！");
		return false;
	} else if ($.checkIdCard($("#addIdNo").val().toLocaleUpperCase()) != 0) {
		modelAlert("请输入合法的身份证号！");
		return false;
	}

	// 投保人邮箱校验
	if ($.isNull($("#addEmail").val())) {
		modelAlert("邮箱不能为空！");
		return false;
	} else if (tit.regExp.isEmail($.trim($("#addEmail").val())) == false) {
		modelAlert("请输入正确的邮箱！");
		return false;
	}

	// 地址校验
	if ($.isNull($("#addAddress").val())) {
		modelAlert("地址不能为空！");
		return false;
	}
	return true;
}


function updateCheck(){
	if ($.isNull($("#editName").val())) {
		modelAlert("姓名不能为空！");
		return false;
	} else if (tit.regExp.isChinese($.trim($("#editName").val())) == false) {
		modelAlert("姓名必须为汉字！");
		return false;
	}
	
	// 投保人手机号码校验
	if ($.isNull($("#editPhone").val())) {
		modelAlert("手机号不能为空！");
		return false;
	} else if (tit.regExp.isMobile($("#editPhone").val()) == false) {
		modelAlert("请输入正确的手机号码！");
		return false;
	}
	
	//投保人身份证号
	if ($.isNull($("#editIdNo").val())) {
		modelAlert("身份证号不能为空！");
		return false;
	} else if ($.checkIdCard($("#editIdNo").val().toLocaleUpperCase()) != 0) {
		modelAlert("请输入合法的身份证号！");
		return false;
	}

	// 投保人邮箱校验
	if ($.isNull($("#editEmail").val())) {
		modelAlert("邮箱不能为空！");
		return false;
	} else if (tit.regExp.isEmail($.trim($("#editEmail").val())) == false) {
		modelAlert("请输入正确的邮箱！");
		return false;
	}

	// 地址校验
	if ($.isNull($("#editAddress").val())) {
		modelAlert("地址不能为空！");
		return false;
	}
	return true;
}