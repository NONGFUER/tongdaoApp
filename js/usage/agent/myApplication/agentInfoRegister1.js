$(function(){
	$("#agentName").val(name);
	$("#agentMobile").val(mobile);
	$("#agentIdNo").val(idNo);
	queryInfoRequest();
	
	//点击出来可选下拉框
	openDicMuiList("agentEdu", "bx_education", "", true);//学历	
	openDicMuiList("agentNation", "bx_nation", "", true);//民族		
	openDicMuiList("agentPolity", "bx_politics", "", true);//政治面貌
	
	bankListRequest();
	getBankAreaListRequest( "BOC" )
	getBankSubsList( "ABC", "1400", "1404" )
	isWhiteRequest();
});

//查询代理人信息
function queryInfoRequest(){
	var url = requestUrl.queryInfoUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId" : customerId,
				"type"		 : "1"
			}
	}
	$.reqAjaxs( url, sendJson, queryInfoCallBack );
}

function queryInfoCallBack( data ){
	console.log(data);
	if( data.statusCode == "000000" ){
		
	}else{
		
	}
}

//查询推荐人信息查询
function isWhiteRequest(){
	var url = requestUrl.isWhiteUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId" : customerId,
				"recommendId": "016330B0051"
			}
	}
	$.reqAjaxs( url, sendJson, isWhiteCallBack );
}

function isWhiteCallBack( data ){
	console.log(data);
	if( data.statusCode == "000000" ){
		var body         = data.returns;
		var coreWhiteDto = body.coreWhiteDto;
		
		var whiteName         = coreWhiteDto.name;				//推荐人姓名
		var recommendCode     = coreWhiteDto.recommendCode;		//推荐人代码
		var recommendMobile   = coreWhiteDto.mobile;			//推荐人手机号
		var recommendIdno     = coreWhiteDto.idNo;
		var reComProvinceCode = coreWhiteDto.reComProvinceCode;	
		var reComProvinceName = coreWhiteDto.reComProvinceName;
		var reComCityCode     = coreWhiteDto.cityCode;
		var reComCityName     = coreWhiteDto.cityName;
		var comcode           = coreWhiteDto.comcode;
		$("#agentWhite").attr( "data-name", whiteName );
		$("#agentWhite").attr( "data-code", recommendCode);
		$("#agentWhite").attr( "data-mobile", recommendMobile );
		$("#agentWhite").attr( "data-idno", recommendIdno );
		
		$("#agentArea").attr( "data-agentid", comcode );		
		$("#agentArea").val( reComProvinceName + " "+ reComCityName );
		$("#agentArea").attr( "data-provicename", reComProvinceName );
		$("#agentArea").attr( "data-cityname", reComCityName );
		$("#agentArea").attr( "data-provicecode", reComProvinceCode );
		$("#agentArea").attr( "data-citycode", reComCityCode );
				
	}else{
		modelAlert( data.statusMessage );
	}
}

//银行
function bankListRequest(){
	var url = requestUrl.bankListUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				
			}
	}
	$.reqAjaxs( url, sendJson, bankListCallBack );
}

//
function bankListCallBack( data ){
	$("#agentBank").unbind("tap").bind("tap",function(){
		var paramlist = data.returns.bankList;
		var selectPicker = new mui.PopPicker();	
		selectPicker.setData(paramlist);
		selectPicker.show(function(items) {
			var bankCode = items[0].value;
			var bankName = items[0].text;
			$("#agentBank").val(bankName);
			$("#agentBank").attr("data-name",bankName);
			$("#agentBank").attr("data-code",bankCode);
			getBankAreaListRequest( bankCode );
		})
	})
}

//获取区域
function getBankAreaListRequest( bankCode ){
	var url = requestUrl.provinceUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"bankCode" : bankCode
			}
	}
	$.reqAjaxs( url, sendJson, getBankAreaListCallBack );
}

function getBankAreaListCallBack(data){
	$("#agentBankArea").unbind("tap").bind("tap",function(){
		var bankCode=$("#agentBank").attr("data-code");
		if(bankCode == "" || bankCode == null){
			modelAlert("请先选择开户银行");
			return false;
		}		
		var bankquyuPicker = new mui.PopPicker({layer:2});
		bankquyuPicker.setData(data.returns.provinceCitys);
		bankquyuPicker.show(function(items) {
			var pcode = items[0].value;
			var pname = items[0].text;
			var ccode = items[1].value;
			var cname = items[1].text;
			$("#agentBankArea").attr("data-pcode",pcode);			
			$("#agentBankArea").attr("data-ccode",ccode);
			$("#agentBankArea").attr("data-pname",pname);			
			$("#agentBankArea").attr("data-cname",cname);
			$("#agentBankArea").val(pname+" "+cname);
			getzhihangList( bankCode, pcode, ccode );
		});
	})
}

//获取支行名
function getBankSubsList( bankCode, pcode, ccode ){
	var url = requestUrl.bankSubsUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"bankCode" : bankCode,
				"bankProvinceCode" : pcode,
				"bankCityCode" : ccode
			}
	}
	$.reqAjaxs( url, sendJson, getBankSubsListCallBack );
}

function getBankSubsListCallBack(data){
	$("#agentBankName").unbind("tap").bind("tap",function(){
		var shengCode=$("#agentBankArea").attr("data-pcode");
		if(shengCode == "" || shengCode == null){
			modelAlert("请先选择开户行所属区域");
			return false;
		}
		var paramlist = data.returns.bankSubs;
		var selectPicker = new mui.PopPicker();		
		selectPicker.setData(paramlist);
		selectPicker.show(function(items) {
			var bankSubName = items[0].text;
			var bankSubCode = items[0].value;
			$("#agentBankName").val(bankSubName);
			$("#agentBankName").attr("data-name",bankSubName);
			$("#agentBankName").attr("data-code",bankSubCode);
		})
	})
}
//保存代理人信息
function saveAgentInfoRequest(){
	var url = requestUrl.saveInfoUrl;
	var sendJson = {
			"head":{
				"channel": "01",
		        "userCode": mobile,
		        "transTime": $.getTimeStr(),
		        "transToken":transToken
			},
			"body":{
				"customerId"          : customerId,
				"mobile"			  : mobile,
				
				"agentId"			  : formData.agentId,			//机构编码	
				"recommendAgentCode"  : formData.recomWcode,		//推荐人工号		
				"recommendAgentName"  : formData.recomWname,		//推荐人姓名
				"recommendAgentMobile": formData.recomWphon,		//推荐人手机号
				"recommendAgentIdno"  : formData.agentWidno,		//推荐人身份证
				
				"workProvinceCode"    : formData.agentPcode,		//省代码
				"workProvinceName"    : formData.agentPname,		//省名称
				"workCityCode"        : formData.agentCcode,		//市代码
				"workCityName"		  : formData.agentCname,		//市名称
									
				"nation"			  : formData.agentNation,		//民族
				"education"           : formData.agentEdu,			//学历
				"politicalLandscape"  : formData.agentPolity,		//政治面貌
				
				"bankCode"			  : formData.agentBankCode,
				"bankName"			  : formData.agentBankName,
				"bankPrivinceCode"    : formData.agentBankPcode,	//开户银行所在省代码
				"bankPrivinceName"    : formData.agentBankPname, 	//开户银行所在省名称
				"bankCityCode"        : formData.agentBankCcode, 	//开户银行所在市代码
				"bankCityName"        : formData.agentBankCname, 	//开户银行所在市名称
				"bankSubCode"         : formData.agentBankScode, 	//开户行代码
				"bankSubName"         : formData.agentBankSname, 	//开户行名称
				"certificateCode"     : formData.agentAccount    	//银行卡号				
			} 
		}
	$.reqAjaxs( url, sendJson, saveInfoCallBack );
}

//回调
function saveInfoCallBack( data ){
	if( data.statusCode == "000000" ){
		window.location.href = "addImage.html?jsonKey="+getUrlQueryString("jsonKey");
	}
}

//绑定下一步按钮
function saveInfoBind(){
	$("#confirm").unbind('tap').bind('tap',function(){
		var formData = getFormData();
		saveAgentInfoRequest(formData);
	});
}


//获取表单信息
function getFormData(){
	var formData = {};
	
	
	$("#agentArea").val( reComProvinceName + " "+ reComCityName );
	$("#agentArea").attr( "data-provicecode", reComProvinceCode );
	$("#agentArea").attr( "data-citycode", reComCityCode );
	
	var agentId    = $("#agentArea").attr( "data-agentid");
	var recomWcode = $("#agentWhite").attr( "data-code" );
	var recomWname = $("#agentWhite").attr( "data-name");
	var recomWphon = $("#agentWhite").attr( "data-mobile");
	var agentWidno = $("#agentWhite").attr( "data-idno");
	var agentPcode = $("#agentArea").attr( "data-provicecode" );		//省代码
	var agentPname = $("#agentArea").attr( "data-provicename");		//省名称
	var agentCcode = $("#agentArea").attr( "data-citycode");		//市代码
	var agentCname = $("#agentArea").attr( "data-cityname");		//市名称
						
	var agentNation = $("#agentNation").attr("name");		//民族
	var agentEdu    = $("#agentEdu").attr("name");		//学历
	var agentPolity = $("#agentPolity").attr("name");		//政治面貌
	
	var agentBankCode  = $("#agentBank").attr("data-code");	//开户总行代码
	var agentBankName  = $("#agentBank").attr("data-name");	//开户总行名称
	var agentBankPcode = $("#agentBankArea").attr("data-pcode");	//开户银行所在省代码
	var agentBankPname = $("#agentBankArea").attr("data-pname"); 	//开户银行所在省名称
	var agentBankCcode = $("#agentBankArea").attr("data-ccode"); 	//开户银行所在市代码
	var agentBankCname = $("#agentBankArea").attr("data-cname"); 	//开户银行所在市名称
	var agentBankScode = $("#agentBankName").attr("data-code"); 	//开户行代码
	var agentBankSname = $("#agentBankName").attr("data-name"); 	//开户行名称
	var agentAccount = $("#agentAccount").val(); 	//银行卡号
	
	////////////////////////////////////////////////////
	
	formData.agentId = agentId;
	formData.recomWcode = recomWcode
	formData.recomWname = recomWname
	formData.recomWphon = recomWphon
	formData.agentWidno = agentWidno
	formData.agentPcode = agentPcode;		//省代码
	formData.agentPname = agentPname;		//省名称
	formData.agentCcode = agentCcode;		//市代码
	formData.agentCname = agentCname;		//市名称
						
	formData.agentNation = agentNation;		//民族
	formData.agentEdu    = agentEdu;		//学历
	formData.agentPolity = agentPolity;		//政治面貌
	
	formData.agentBankCode  = agentBankCode;	//开户总行代码
	formData.agentBankName  = agentBankName;	//开户总行名称
	formData.agentBankPcode = agentBankPcode;	//开户银行所在省代码
	formData.agentBankPname = agentBankPname; 	//开户银行所在省名称
	formData.agentBankCcode = agentBankCcode; 	//开户银行所在市代码
	formData.agentBankCname = agentBankCname; 	//开户银行所在市名称
	formData.agentBankScode = agentBankScode; 	//开户行代码
	formData.agentBankSname = agentBankSname; 	//开户行名称
	formData.agentAccount   = agentAccount  	//银行卡号	
}