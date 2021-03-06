var pageflag = 0; // 0 车辆基本信息 1 车辆详细信息 2 品牌型号选择
var brand_model = "";// 品牌型号
var citynum = "";// 城市代码
var shengList = new Array();// 省级数据
var shiList = new Array();// 市级数据
var province = "0";// province值为上级的代码，province=0时取全部省
var rankFlag = 0;// 省市县级别标志 0-省 1-市 2-县
var comparyCode = "00004";// 101 天安保险公司编码
var cheakOwnerFlag = true;// 检验车主信息标志
var cheakCarinfoFlag = true;// 检验车辆详细信息标志
var carinfoCheakFlag = true; //校验品牌型号的标志
var seats = "";// 座位数
var chooseicon = 0;// 是否新车标志 1：新车，0：非新车
var specialCarFlag = 0;// 是否过户车 是：1；否：0
var shengName = "";
var vehicleModelData;
var cxCarMessage = {};// 车辆信息
var cxOrder = {};// 订单信息
var cxOffer = {};// 报价信息
var inforCar ={};  //向下一个页面传参数的实体
var parm;
var cxSessionId;
var carPlate="";//车牌
var mobile;
var registDate="";//注册日期全局变量
var roleType;
var channelcar;
$(function() {
	var str = window.location.search.split("&")[0];
	str = str.substr(9, str.length);
	str = UrlDecode(str);
	parm = JSON.parse(str);
	console.log(parm)
	mobile = parm.mobile;
	roleType=parm.roleType;
	channelcar=parm.channelcar;
	if(channelcar=="channelcar"){//渠道出单标志
		$("#carselectChannel").show();
		sessionStorage.setItem("channelcar","channelcar");
	}else{
		$("#carselectChannel").hide();
	}
	if(parm.shareFlag=="Y"){//App头部显示分享按钮
	    parm.source="2";//分享进入
	}else{
		if(parm.entry="mall"){
			parm.source="1";//微信保险商城
		}else{
			parm.source="3";//App渠道
		}
		
	}
	parm.leftIco="1";
	parm.rightIco="0";''
	parm.downIco="0"
	parm.title="车险指南";
	/**首页banner跳转***/
	$(".banner").attr("href","carInfo.html?jsonKey="+UrlEncode(JSON.stringify(parm)));
	if(!$.isNull(parm.body) && parm.body!= undefined){
		cxSessionId=parm.body.cxSessionId
		// 获取车辆信息
		$.loadCarInfoed();
	}else{
		parm.body={};
		if(mobile != ""&&mobile!=undefined){
			var url = base.url + "vi/selectHistoryInfo.do";
			var resData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":parm.source,
				},"body":{
			        "userName" : mobile
				}
			};
			$.reqAjaxs(url, resData, function(data){
				if (data.statusCode == "000000") {
					if(channelcar=="channelcar"){
						if(data.returns.cxChannel!= null){//出单渠道
							$("#issueChannel").attr("channelCode",data.returns.cxChannel.channelCode).val(data.returns.cxChannel.channelName);
						}
					}
					if(data.returns.cxOrder != null){
						//出单人员是否匹配到省
						parm.body.cdPrivinceFlag=data.returns.cxProvince.flag;
						var cityName = data.returns.cxOrder.cityName;
						if(!$.isNull(cityName)){ //省份、城市
							var arr = cityName.split(/[-]/);
							$("#car_sheng").val(arr[0]);
							$("#car_shi").val(arr[1]);
							$("#tip").html(getContentByProvince($("#car_sheng").val()));
						}
						if(!$.isNull(data.returns.cxOrder.provinceCode)){
							$("#car_sheng").attr("name",data.returns.cxOrder.provinceCode);
						}
						if(!$.isNull(data.returns.cxOrder.cityCode)){
							citynum=data.returns.cxOrder.cityCode;
							$("#car_shi").attr("name",data.returns.cxOrder.cityCode);
						}
						if (data.returns.cxOrder.newcarFlag == "1") {
							document.getElementById("chooseicon").src = base.imagePath+"insurance/car/gouxuankuang1.png";
							$("#plateNum").css("color","#1b6bb8");
							$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
							chooseicon = 1;// 是否新车标志 1：新车，0：非新车
						} else {
							document.getElementById("chooseicon").src = base.imagePath + "insurance/car/gouxuankuang.png";
							$("#plateNum");
							$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
							$("#plate_number_input").val(data.returns.cxOrder.plateno);
						}
						if(!$.isNull(data.returns.cxOrder.ownerName)){ //车主姓名
						    $("#owner_name").val(data.returns.cxOrder.ownerName);
						}
						if(!$.isNull(data.returns.cxOrder.ownerIdno)){ //身份证
						    $("#owner_idNo").val(data.returns.cxOrder.ownerIdno);
						}
						if(!$.isNull(data.returns.cxOrder.ownerMobile)){ //手机号码
						    $("#owner_mobile").val(data.returns.cxOrder.ownerMobile);
						}
						if(data.returns.cxOrder.cityCode=="3110000"){//新车北京地区
							if(data.returns.cxCarMessage != null){
								if(!$.isNull(data.returns.cxCarMessage.fuelType)){//能源种类
									$("#fuelType").attr("name",data.returns.cxCarMessage.fuelType).val(data.returns.cxCarMessage.fuelTypeName)
								}
							}
							if(!$.isNull(data.returns.cxOrder.certiStartdate)){//身份证起期
								$("#certiStartDate").val(data.returns.cxOrder.certiStartdate.split(" ")[0]);
							}
	                        if(!$.isNull(data.returns.cxOrder.certiEnddate)){//身份证止期
	                         	$("#certiEndDate").val(data.returns.cxOrder.certiEnddate.split(" ")[0]);
							}
	                        if(!$.isNull(data.returns.cxOrder.nation)){//民族
	                        	 $("#nation").val(data.returns.cxOrder.nation)
							}
	                        if(!$.isNull(data.returns.cxOrder.issuerAuthority)){//签发机构
								$("#issuer").val(data.returns.cxOrder.issuerAuthority);
							}
							if (data.returns.cxOrder.newcarFlag == "1") {
								if(data.returns.cxCarMessage != null){
									if(!$.isNull(data.returns.cxCarMessage.certificateType)){//凭证种类
										$("#certificateType").attr("name",data.returns.cxCarMessage.certificateType).val(data.returns.cxCarMessage.certificateTypeName)
									}
									if(!$.isNull(data.returns.cxCarMessage.certificateNo)){//凭证编号
										$("#certificateNo").val(data.returns.cxCarMessage.certificateNo);
									}
									if(!$.isNull(data.returns.cxCarMessage.certificateDate)){//凭证日期
										$("#certificateDate").val(data.returns.cxCarMessage.certificateDate.split(" ")[0]);
									}
								}
							}
						}
						if(citynum=="3440300"||citynum=="3110000"){//深圳地区  北京地区
							if(!$.isNull(data.returns.cxOrder.owneremail)){ //邮箱
							   $("#owner_email").val(data.returns.cxOrder.owneremail);
							}
						}
					}
					if(data.returns.cxCarMessage != null){
						if(!$.isNull(data.returns.cxCarMessage.rackNo)){//车辆识别代码/VIN
						    $("#vehicle_identification_input").val(data.returns.cxCarMessage.rackNo);
						}
						if(!$.isNull(data.returns.cxCarMessage.engineNo)){ //发动机号
						    $("#engine_number_input").val(data.returns.cxCarMessage.engineNo);
						}
						var registerDate = "";
						if(!$.isNull(data.returns.cxCarMessage.registerDate)){ //车辆注册日期
							registerDate = subTime(data.returns.cxCarMessage.registerDate);
						    $("#vehicle_registration_date").val(registerDate);
						}
						//是否过户
						if(data.returns.cxCarMessage.transferFlag == 1){
							document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/dakai.png";
							$("#specialCarDate_select").show();
							var transferDate = subTime(data.returns.cxCarMessage.transferDate); //过户日期
						    $("#specialCarDate").val(transferDate);
						}else{
							document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/guanbi.png";
							$("#specialCarDate_select").hide();
							$("#specialCarDate").val("");
						}
						//是否外地车
						if(data.returns.cxCarMessage.ecdemicVehicleFlag == 1){
							$("#info_car_choose div").css("color","#1b6bb8");
							document.getElementById("choosecar").src = base.imagePath + "insurance/car/dakai.png";
						}else{
							$("#info_car_choose div");
							document.getElementById("choosecar").src = base.imagePath + "insurance/car/guanbi.png";
						}
					}
				}else{
					modelAlert(data.statusMessage);
				}
				$(".backload").hide();//背景图隐藏
			});
		}else{
			$(".backload").hide();//背景图隐藏
		}
	}
	$.setscrollarea("indexpart");
	$.setscrollarea("lastPart");
	//分享遮罩
	$(".cxshare").bind("tap",function() {
      	$("#zhezhaoImg").show();
    });
	$("#zhezhaoImg").bind("tap",function() {
      	$("#zhezhaoImg").hide();
    });
	//车辆提示遮罩显示
    $(".howInput").bind("tap",function() {//行驶证提示
      	$("#cjh,.shadow").show();
    });
    $(".sfzHowInput").bind("tap",function() {//身份证提示
      	$("#sfz,.shadow").show();
    });
    //车辆提示遮罩隐藏
    $("#cjh").bind("tap",function() {
    	setTimeout(function(){
    	   $("#cjh,.shadow").hide();
    	},500);
    });
    $("#sfz").bind("tap",function() {//身份证提示遮罩
    	setTimeout(function(){
     	   $("#sfz,.shadow").hide();
     	},200);
    });
    //返回
	$(".h_back").unbind("tap").bind("tap",function() {
		backlast();
	});

	/** ************************车主信息********************************* */
	$("#carselectChannel").unbind("tap").bind("tap",function() {
		selectChannel();
		$("#brand_model_input").val("");
	});
	$("#carselectSheng").unbind("tap").bind("tap",function() {
		selectSheng();
		$("#brand_model_input").val("");
	});
	$("#carselectshi").unbind("tap").bind("tap",function() {
		selectShi();
		$("#brand_model_input").val("");
	});
	// 勾选新车未上牌
	$("#plateNum").unbind("tap").bind("tap",function(){
		var picName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
		if (picName == "gouxuankuang.png") {
			document.getElementById("chooseicon").src = base.imagePath + "insurance/car/gouxuankuang1.png";
			$("#plateNum").css("color","#1b6bb8");
			$("#plate_number_input").val(""); // 车牌号码
			$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
			chooseicon = 1;// 是否新车标志 1：新车，0：非新车
			$("#brand_model_input").val("");
		} else {
			document.getElementById("chooseicon").src = base.imagePath + "insurance/car/gouxuankuang.png";
			$("#plateNum").css("color","#888");
			$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
			$("#plate_number_input").val(carPlate);//牌照
			chooseicon = 0;// 是否新车标志 1：新车，0：非新车
		}
	})
	// 车辆注册日期调用日期控件
	$("#vehicle_registration_date_select").unbind("tap").bind("tap",function() {
		 $("input").blur();
		  var vehicle_registration_date = $("#vehicle_registration_date").val();
		  if (vehicle_registration_date == "请选择注册日期") {
			  vehicle_registration_date = "";
		  }
		  openDataNowDate("vehicle_registration_date","zcrqi");
		});
	
	// 过户日期调用日期控件
	$("#specialCarDate_select").unbind("tap").bind("tap",function() {
	    //注册日期
		if ($.isNull($("#vehicle_registration_date").val())|| $("#vehicle_registration_date").val() == "请选择注册日期") {
			modelAlert("请选择车辆注册日期！");
			return false;
		}
		var specialCarDate = $("#specialCarDate").val();
		if (specialCarDate == "请选择过户日期") {
			specialCarDate = "";
		}
		openDataNowDate("specialCarDate");
	});
	$("#specialCarDate_select").hide();
	
	//能源种类
	openDicMuiList("fuelType", "bx_fuel_type", " ", true);
	//车辆来历凭证种类
	openDicMuiList("certificateType", "bx_certificate_type", " ", true);
	//开具车辆来历凭证所载日期
	var date=new Date();
	var year2 = date.getFullYear();
	var month2 = date.getMonth() + 1;
	var day2 = date.getDate();
	$("#certificateDate").attr("data-options",'{"type":"date","beginYear":1980,"endYear":'+year2+',"endMonth":'+month2+',"endDay":'+day2+'}');
	openDataCustomized("certificateDate");
	/*身份证有效起期*/
	var now=new Date();
	now.setDate(now.getDate()-1);
	var year1 = now.getFullYear();
	var month1 = now.getMonth() + 1;
	var day1 = now.getDate();
	$("#certiStartDate").attr("data-options",'{"type":"date","beginYear":2003,"endYear":'+year1+',"endMonth":'+month1+',"endDay":'+day1+'}');
	/*身份证有效止期*/
	var current = new Date();
	current.setDate(current.getDate() + 1);
    var year = current.getFullYear();
    var month = current.getMonth() + 1;
    var day = current.getDate();
    var defaultTime=$.getTimeStr2();
	$("#certiEndDate").attr("data-options",'{"type":"date","beginYear":'+year+',"beginMonth":'+month+',"beginDay":'+day+',"endYear":2070}');
	
	//身份证有效起期
	openDataCustomized("certiStartDate");
	//身份证有效止期
	openDataCustomized("certiEndDate");
	//民族
	openDicMuiList("nation", "bx_nation", " ", true);
	
	// 点击是否选择
	selectCarFlag();

	$(".confirmsection").unbind("tap").bind("tap",function() {
		$(".unfindarea").hide();
		$(".shadow").hide();
	});

	// 实时检查车主信息
	blurCheackOwner();

	// 车辆基本信息确认按钮
	$("#confirm1").unbind("tap").bind("tap",function() {
		$("#brand_model_input").val("");
		if(parm.roleType == "00" || parm.roleType == ""){
			if(ua=="isApp"){
				loginControl();
				return false;
			}else{
				delete parm["body"]; 
				var jsonKey = UrlEncode(JSON.stringify(parm));
				window.location.href=base.url+"weixin/wxusers/html/users/phoneValidate.html?jsonKey="+jsonKey+"&openid="+parm.openid+"&inviterPhone="+parm.shareMobile+"&fromtype=11";
				return false;
			}
		}
       $("#plate_number_input").val($("#plate_number_input").val().toUpperCase());//车牌小写转大写
		// 解绑实时检查车主信息
		unBindblurCheackOwner();
		// 校验车主信息
		cheackOwner();
	
		// 若校验车主信息通过则显示下一页内容
		if (cheakOwnerFlag == true) {
			    cxOrder.companyCode = comparyCode;
			    if(parm.shareCusId!=""){
			    	cxOrder.agentId=parm.shareCusId;
			    }
			    cxOrder.issueChannel=$("#issueChannel").attr("channelCode");
				cxOrder.cityCode = citynum;// 车辆行驶城市
				
				var pName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
				if (pName == "gouxuankuang.png") {
					chooseicon = 0;
					cxOrder.plateno = $("#plate_number_input").val();// 车牌号
				} else {
					chooseicon = 1;
					cxOrder.plateno = "";// 车牌号
				}
				cxOrder.newcarFlag = chooseicon;// 是否新车
				cxOrder.cityName = $("#car_sheng").val()+"-"+$("#car_shi").val();
				cxOrder.provinceName=$("#car_sheng").val();
				cxOrder.provinceCode=$("#car_sheng").attr("name");
				var cxInfoDTO = {
					"productId" : "", // 产品编号
					"sessionId" : "", // 唯一流水号
					"agentCode" : mobile,
					"comparyCode" : comparyCode,
					"cxOrder" : cxOrder,
					"orderChannel":parm.source,//渠道
					"transToken":parm.transToken,
					"customerId":parm.customerId
				};
				var url = base.url + "vi/saveCxInfoOne.do";
				var data = {
					"cxInfoDTO" : cxInfoDTO
				};
				$.toAjaxs(url, data, function(respData){
					var paramList = eval("(" + respData + ")");
					if (paramList.status.statusCode == "000000") {
						$("#indexpart_scroll").css("transform","translate3d(0px, 0px, 0px)");
						// 唯一流水号
						parm.body.cxSessionId = paramList.sessionId;
						if(citynum=="3110000"){//北京地区
							$("#fuelTypeTable,#cardTable").show();
							if(chooseicon==1){
								$("#lailiTable").show();
							}else{
								$("#lailiTable").hide();
							}
						}else{
							$("#fuelTypeTable,#cardTable,#lailiTable").hide();
						}
						if(citynum=="3440300"||citynum=="3110000"){//深圳地区  北京地区
							$("#plateEmail").show();
						}else{
							$("#plateEmail").hide();
						}
						var cxOrder=paramList.cxOrder;
						if(cxOrder!=null){
							var cxCarMessage=paramList.cxCarMessage;
							 $("#vehicle_identification_input").val(cxCarMessage.rackNo);
							 $("#engine_number_input").val(cxCarMessage.engineNo);
							 var registerDate = timeFormatDate(cxCarMessage.registerDate.time,'yyyy-MM-dd');
							 $("#vehicle_registration_date").val(registerDate);
							//是否过户
							if(cxCarMessage.transferFlag == 1){
								document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/dakai.png";
								$("#specialCarDate_select").show();
								var transferDate = timeFormatDate(cxCarMessage.transferDate.time,'yyyy-MM-dd'); //过户日期
							    $("#specialCarDate").val(transferDate);
							}else{
								document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/guanbi.png";
								$("#specialCarDate_select").hide();
								$("#specialCarDate").val("");
							}
							//是否外地车
							if(cxCarMessage.ecdemicVehicleFlag == 1){
								document.getElementById("choosecar").src = base.imagePath + "insurance/car/dakai.png";
							}else{
								document.getElementById("choosecar").src = base.imagePath + "insurance/car/guanbi.png";
							}
							$("#fuelType").attr("name",cxCarMessage.fuelType).val(cxCarMessage.fuelTypeName);
							
							$("#owner_name").val(cxOrder.ownerName);
							sessionStorage.setItem("brandKey",cxCarMessage.vehicleBrand);
						    $("#owner_idNo").val("");
						    $("#owner_mobile").val("");
						    $("#owner_email").val("");
						    
						    $("#certiStartDate").val("");
                         	$("#certiEndDate").val("");
                        	$("#nation").val("");
							$("#issuer").val("");
						}
						setTimeout(function() {
							$(".rightIcon").hide();//隐藏分享图标
							$(".firstPart").hide();//车辆投保地区隐藏
							$(".lastPart").show();//车辆详细信息显示
						}, 500);
					}else if(paramList.status.statusCode == "123456"){
						modelAlert(paramList.status.statusMessage,"",function(){
							 loginControl();
						});
					}else{
						modelAlert(paramList.status.statusMessage);
					}
				});
				  
				
		  
		}

		pageflag = 1;
		$.replacePlaceholder($("#vehicle_identification_input"),"请输入车辆识别代码");
		$.replacePlaceholder($("#engine_number_input"), "请输入发动机号");
		$.replacePlaceholder($("#vehicleInvoiceNo"), "请输入新车购置发票号");
		$.replacePlaceholder($("#seat"), "请输入车辆座位数");

		// 实时检查车辆详细信息
		blurCheackCarinfo();
	});

	// 点击跳转到品牌型号选择页面
	$("#carTypeSelect").unbind("tap").bind("tap", function() {
		//校验品牌型号查询的所有字段
		carinfoCheack();
		if (carinfoCheakFlag == true){
			$(".carMes").hide();
			$("#maindiv").hide();
			$(".vehicleInfo").show();
	        $("#searchcustomer").empty();
	        var brandKey=sessionStorage.getItem("brandKey");
	        if(brandKey!=null&&brandKey!=""||brandKey!=undefined){
	        	$("#searchtext").val(brandKey).css("color", "#585858");
	        }else{
	        	$("#searchtext").val("请输入关键字点击查询").css("color", "#cccccc");
	        }
	        pageflag = 2;
			setTimeout(function() {
				mui('#wrapper').scroll().scrollTo(0,0,0);//100毫秒滚动到顶
			}, 100);
	        changeTitle("品牌型号选择");
	    }
	});

	// 车辆详细信息确认按钮
	$("#confirm2").unbind("tap").bind("tap",function() {
		 $("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());//车辆识别代码小写转大
		 $("#owner_idNo").val($("#owner_idNo").val().toUpperCase());//身份证小写转大写
			// 解绑实时检查车辆详细信息
			unBindblurCheackCarinfo();
			// 校验车辆详细信息
			cheackCarinfo();
			// 若校验车辆详细信息通过则往下执行
			if (cheakCarinfoFlag == false) {
				return;
			}

          if (vehicleModelData == null) {
                    modelAlert("请先选择品牌型号！");
                    return false;
			}
           if(sessionStorage.getItem("checkFlag")=="0"){
        	   if($("#checkNo").val()=="请输入验证码"||$.isNull($("#checkNo").val())){
        		   if($("#yanzhengmaImg").css("display")!="none"){
					    modelAlert("请输入验证码！");
					    return false;
	               }
        	   }else{
        		   sessionStorage.setItem("checkCode", $("#checkNo").val());
        	   }
           }
           cxCarMessage.sessionid=parm.body.cxSessionId;
           cxCarMessage.citycode = citynum;// 车辆行驶城市
			// 车辆基本信息
			var infochoose = $("#chooseIcons").attr("src").substring(
					$("#chooseIcons").attr("src").lastIndexOf("/") + 1);
			if (infochoose == "guanbi.png") {
				specialCarFlag = 0;
				cxCarMessage.transferDate ='2000-01-01'
			} else {
				specialCarFlag = 1;
				cxCarMessage.transferDate = $("#specialCarDate").val();// 过户日期
			}
			cxCarMessage.vehicleid = vehicleModelData.rbcode;// 车辆Id
			cxCarMessage.transferFlag = specialCarFlag;// 是否过户车
			cxCarMessage.engineNo = $("#engine_number_input").val();// 发动机号
			cxCarMessage.rackNo = $("#vehicle_identification_input").val();// 车辆识别代码
			cxCarMessage.vehicleBrand = vehicleModelData.brandName;// 品牌型号
			cxCarMessage.registerDate = $("#vehicle_registration_date").val();// 车辆注册日期
			cxCarMessage.seats = $("#seat").val()+".0";//车辆
			cxCarMessage.vehicleValue = vehicleModelData.purchasePrice;//购车价
			cxOrder.ownerName = $("#owner_name").val();// 车主姓名
			cxOrder.ownerMobile = $("#owner_mobile").val();// 手机号码;
			cxOrder.ownerIdno = $("#owner_idNo").val();// 车主身份证号
			cxOrder.ownerEmail = "";// 车主邮箱
			var ecdemicFlag = "";// 外地车标识
			var infocarchoose = $("#choosecar").attr("src").substring(
					$("#choosecar").attr("src").lastIndexOf("/") + 1);
			if (infocarchoose == "guanbi.png") {
			    ecdemicFlag = 0;
			} else {
				ecdemicFlag = 1;
			}
			cxCarMessage.ecdemicVehicleFlag = ecdemicFlag;
			var drivearea = "0";// 出单地省内【0】 中国境内【3】 这里约定的是出单地点 默认为0
			cxCarMessage.drivearea = drivearea;
			cxCarMessage.vehicleinvoicedate = $("#vehicle_registration_date").val();// 车辆购车日期
			cxCarMessage.runMileRate = "3000";
			cxCarMessage.isHaveGps = 0;
			cxCarMessage.familyCarCount = "0";
			cxCarMessage.currentvalue = vehicleModelData.actualValue;// 实际价值
			cxCarMessage.enginecapacity = vehicleModelData.exhaustCapacity;// 排量
			cxCarMessage.producingarea = vehicleModelData.importFlag;// 车型产地
			cxCarMessage.carName = vehicleModelData.carName;
			cxCarMessage.jingyouVehicleCode = vehicleModelData.vehicleJingyouDto.vehicleCode;
			cxCarMessage.jingyouVehicleName = vehicleModelData.vehicleJingyouDto.vehicleName;
			cxCarMessage.jingyouPrice = vehicleModelData.vehicleJingyouDto.price;
			cxCarMessage.jingyouFamilyname = vehicleModelData.vehicleJingyouDto.familyName;
			cxCarMessage.noticeType = vehicleModelData.noticeType;
			cxCarMessage.vehiclehycode = vehicleModelData.hyModelCode;
			cxCarMessage.wholeWeight = vehicleModelData.vehicleWeight;
			
			cxOffer.sessionid=parm.body.cxSessionId;
			cxOffer.businessBegindate=$.getDateStr("0","",1);//起保日期 T+1天
			if(citynum=="3110000"){//北京地区
				cxCarMessage.fuelType=$("#fuelType").attr("name");
				cxCarMessage.fuelTypeName=$.trim($("#fuelType").val());
				cxOrder.certiStartdate=$("#certiStartDate").val();
				cxOrder.certiEnddate=$("#certiEndDate").val();
				cxOrder.nation=$("#nation").val();
				cxOrder.issuerAuthority=$("#issuer").val();
				if(chooseicon==1){
					cxCarMessage.certificateType=$("#certificateType").attr("name");
					cxCarMessage.certificateTypeName=$.trim($("#certificateType").val());
					cxCarMessage.certificateNo=$.trim($("#certificateNo").val())
					cxCarMessage.certificateDate=$.trim($("#certificateDate").val())
				}
			}
			if(citynum=="3440300"||citynum=="3110000"){//深圳地区  北京地区
			    cxOrder.ownerEmail = $("#owner_email").val();// 车主邮箱
			}
			var carinfoMes={
				"vehicleModelData":vehicleModelData,
			}
			carinfoMes=UrlEncode(JSON.stringify(carinfoMes));
			var cxInfoDTO = {
				"productId" : "", // 产品编号
				"sessionId" : parm.body.cxSessionId, // 唯一流水号
				"agentCode" : mobile,
				"comparyCode" : comparyCode,
				"cxCarMessage" : cxCarMessage,
				"cxOffer":cxOffer,
				"cxOrder" : cxOrder,
				"tradeNO":sessionStorage.getItem("tradeNo"),
				"checkNo":sessionStorage.getItem("checkNo"),
				"checkCode":sessionStorage.getItem("checkCode"),
				"vehicleModelData":carinfoMes
			};
			var url = base.url + "vi/saveCxInfoTwo.do";
			var data = {
				"cxInfoDTO" : cxInfoDTO
			};
			sessionStorage.setItem("cxInfoDTO",JSON.stringify(cxInfoDTO))
		    $.toAjaxs(url, data, $.submitCallBack);
		});

	// 提交保存回调
	$.submitCallBack = function(param) {
		if (param != "") {
			var paramList = eval("(" + param + ")");
			if (paramList.status.statusCode == "000000") {
				// 唯一流水号

				parm.body.cxSessionId = paramList.sessionId;
				parm.body.businessBegindate = $("#startDate").val();
				parm.body.forceBeginDate = $("#startDate").val();
			
				inforCar.shengCode = $("#car_sheng").attr("name");
				inforCar.shengName = $("#car_sheng").val();
				inforCar.cityName = $("#car_shi").val();
				inforCar.vehicleModelData = vehicleModelData;
				parm.title="选择投保方案";
				parm.rightIco="0";
				parm.body.inforCar = inforCar;
				parm.body.cityCode = citynum;
				parm.body.pagesflag = "carinfo"; //标记是回到车辆详情
				parm.body.comparyCode=comparyCode;
				parm.body.producingarea=cxCarMessage.producingarea;//车型产地  进口车、合资车、国产车
				var jsonStr = JSON.stringify(parm);
				jsonStr = UrlEncode(jsonStr);
				var nextPageUrl = "insuranceCoverage.html?jsonKey="+ jsonStr;
				window.location.href = nextPageUrl;
			}else if(paramList.status.statusCode == "123456"){
				modelAlert(paramList.status.statusMessage,"",function(){
					 loginControl();
				});
			} else {
				modelAlert("提交失败！" + paramList.status.statusMessage);
			}
		} else {
			modelAlert("提交异常！");
		}
	};

	// 具体车型选择弹框两个按钮的点击事件
	$(".confirmarea span").eq(0).unbind("tap").bind("tap",function() {
		$(".carselectarea").hide();
		$(".unfindarea").show();
	});
	$(".confirmarea").find("span:last-child").unbind("tap").bind("tap",function() {
		var chooseflag = 0; // 判断是否选择了车型
		$.each($("#carselect_div .cartype"), function() {
			if ($(this).find(".car").attr("class").indexOf("choosed") > -1) {
				chooseflag = 1;
			};
		});
		if (chooseflag == 1) {
			window.location.href = "accuratePrice.html";
		} else {
			modelAlert("请选择具体车型！");
		};
	});
	
	/*分享按钮显示*/
	if(roleType != "00" && roleType != ""){
		if(ua=="isApp"){//App头部显示分享按钮
			showRightIcon(); 
		}
		if(ua=="isWechat"){
			$(".cxshare").show();
			getConfig(method); 
		}
	}
});
// 勾选是否
function selectCarFlag() {
	// 是否过户车
	$("#info_choose").unbind("tap").bind("tap",function(){
		var picName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
		if (picName == "guanbi.png") {
			document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/dakai.png";
			$("#info_choose div").css("color","red");
			$("#specialCarDate_select").show("fast");
		} else {
			document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/guanbi.png";
			$("#info_choose div");
			$("#specialCarDate_select").hide();
		}
	});
	// 是否外地车
	$("#info_car_choose").unbind("tap").bind("tap",function(){
		var picName = $("#choosecar").attr("src").substring($("#choosecar").attr("src").lastIndexOf("/") + 1);
		if (picName == "guanbi.png") {
			document.getElementById("choosecar").src = base.imagePath + "insurance/car/dakai.png";
			$("#info_car_choose div").css("color","#1b6bb8");
		} else {
			document.getElementById("choosecar").src = base.imagePath + "insurance/car/guanbi.png";
			$("#info_car_choose div");
		}
	});
}

// 品牌类型子页面消失时执行的回调
function loadCarContent(param) {
	if (param != "goBack") {
		// 显示摘要
		var itemValue = param.brandName;
		vehicleModelData = param; // 车型数据 保存车主 车辆信息的时候 需要用到
		$("#brand_model_input").val(itemValue).css("width", "85%"); // 品牌型号
		$("#seat").val(parseInt(param.seatCount).toFixed(0)); // 座位数
		/*验证码图片*/
		if(sessionStorage.getItem("checkFlag")=="0"){
			$("#yanzhengmaImg").show();
			var str="/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcU FhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgo KCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAYAFQDASIA AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3 ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3 uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD16ZdN 0nwxpV5daNpjW4sYbmSYpCHl2oTKrGQKi8bCHL4JLZ2hcnodSsdDi083enaPol3CkrxSuI0+QruQ gAKdzCUBWUlcfNzldpytCtUtY/CwDSiJrSJw8rNLlmyxUFicDLYA6KCAAAABz/x68Uah4Z8P32r2 cNs1xpuz7OkkzyRSrJJCpMsQ2gMDuA5bA5yN7LQB0+n6fo4hsjHpej3Ni1rHdi6VY5TKG3FgCE2l QuHVlZiwUjAABMvijS9Etns4V0rTl3SB5CsKqdo4wcDODk8+1cd8N/Fmq6p4p8TaNq8Fst3ps1qR dQyOVLTRb44zuyx2lXQuNu4P91cYrqfHFrE1xHafOkJtRF+7kZGC5YcMCGBx3ByPWgCxrfh7w5eW aWy6TpyxtAz+cbKF2jVkKbl8xGBbaztgg5CEEEE1S8Q6ToSeILUDTrWJYF2sYogqjeyklkxtfCqM ZBIycHkg+d/s8v8AYpPGFnEzbT4lu0iaV2dg67NhZjljnlSSckMcmu08ZaVcG8ktrbUb2w2sHSaB Y2YpjAT96jjA6Zxn5evUUAb1zpmiXV3plta6Xp4d3Erv9jEYZAM8AryDz+VVvEWn6PBdwfZNDsLm VJB+5tRHvk29YyrbUBJOAWYDjkgVwXwI1zXde0PQ9c17WNTllu4ZLXY0NosRVZmVXjCR7gBtCnec 5DnGNpqf9qe3mn+H+trAkszfZ4JNqrkqqzqWPA6AKWJPQZ7UAdvDZaU2uSxWui6RMJnVAjqm1VUj c6kIQPk3EL3YAEqDkaGt6XptmYPsfh3TZyGEkoaGJF8kHEhB2k7lBDAY5IAyMkjxTwF4hv8AxF8Q Licw2/8AxKzfW8MsIO1YGls3t5WJJH7wBirHCsASBxmvXdTne5vpGe1h3uEQq0ThlOAwU+5+7nuF 7CgDzf4haaNK1Kyg+y2VrI1sZZEtLZYELNNKclVJBbGMtn5jk4XO0FafxiaN/EVg0GPKNhGUwMDb vfHFFAHY6bd6XLpXhyRdR09Zra3gE4M+XQKq8EDIUA5yTjHHNZfjCz0HxZHqGl6pe2t5plxJGZ2F x5aDDBlyytjC7cdVJJxzRRQBNaaL4Vtdd1rV7PWNNtdQ1GaJ5JlulO5Y1IQBd+FxuxwB93PerniS 80nVbi1aTULd4ZIdl0ltdfNEmfmO+Ntw4Y/MMEYyDRRQBjeEdC8H6RPe6loWtR2i6lumYXWozu0h kKSea6SzZWXIUEsA3y89TWtf31vqV/JNZSwRtDglkuUcE7A+V2Mf4t65O0lgeMEMxRQBgfCTRtO8 MeB7TSb3xRYeZbxzw20oWCKaENKziTBklQtuZmUkD5SoZQQwrR1h9I8QXl5BqF9FdWV48kNzbM8a iK34jOHiblWXL7i24b+duAqlFAEekeHPB/hm9a78OT2Eks7QxTwx3PnM8ESBI1Cs7Z2oCMgZOcnp mtS8u7Se6lnF7paNulMZh1DfwHyrAkDDHO5gPlXJ54DkooA86+MFppmqeIbCS1u5ZY4rFIv9D1GX YpDyHGUcAkZ784x7UUUUAf/Z"
			$("#checkImg").attr("src","data:image/png;base64,"+sessionStorage.getItem("checkCode"));
			$("#checkNo").val("请输入验证码").css("#888");
		}else{
			$("#yanzhengmaImg").hide();
			$("#checkNo").val("请输入验证码").css("#888");
		}
	}

};


// 实时检查车主信息
function blurCheackOwner() {
	// 车牌号码
	$("#plate_number_input").change(function() {
		if ($("#plate_number_input").val().length == 7||$("#plate_number_input").val().length == 8) {
			$("#plate_number_input").val($("#plate_number_input").val().toUpperCase());
		}
		if ($.isNull($("#plate_number_input").val())
				|| $("#plate_number_input").val() == "请输入车牌号码") {
			return false;
		}else if(!checkCarNo($.trim( $("#plate_number_input").val()))){
			modelAlert("车牌号码格式不正确！");
			return false;
		}else if ($("#plate_number_input").val().length != 7&&$("#plate_number_input").val().length != 8) {
			modelAlert("车牌号码长度不正确！");
			return false;
		}
		$("#brand_model_input").val("");
	});
	
}
// 解绑实时检查车主信息
function unBindblurCheackOwner() {
	$('#plate_number_input').unbind('change');// 车牌号码取消事件
}

// 提交时检查车主信息
function cheackOwner() {
	// 车辆基本信息
	var car_shengshi = $("#car_sheng").val(); // 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var plate_number_input = "";// 车牌号码
	// var chooseicon = 0;//是否新车标志 1：新车，0：非新车
	var pName = $("#chooseicon").attr("src").substring($("#chooseicon").attr("src").lastIndexOf("/") + 1);
	if (pName == "gouxuankuang.png") {
		chooseicon = 0;
		plate_number_input = $("#plate_number_input").val();
	} else {
		chooseicon = 1;
	}

	// 判断非空
	if ($.isStringNull(car_shengshi) || car_shengshi == "请选择省份") {
		cheakOwnerFlag = false;
		modelAlert("请选择省份！");
		return false;
	}
	if ($.isStringNull(car_city) || car_city == "请选择城市") {
		cheakOwnerFlag = false;
		modelAlert("请选择城市！");
		return false;
	}
	if ($.isNull(plate_number_input) && chooseicon == 0) {
		cheakOwnerFlag = false;
		modelAlert("请输入车牌号码，或者选择新车未上牌！");
		return false;
	}
	if (plate_number_input == "请输入车牌号码" && chooseicon == 0) {
		cheakOwnerFlag = false;
		modelAlert("请输入车牌号码，或者选择新车未上牌！");
		return false;
	}
	if (!($.isNull(plate_number_input)) && plate_number_input != "请输入车牌号码"&& chooseicon == 0) {
		if(!checkCarNo($.trim( $("#plate_number_input").val()))){
			cheakOwnerFlag = false;
			modelAlert("车牌号码格式不正确！");
			return false;
		}else if (plate_number_input.length != 7&&plate_number_input.length != 8) {
			cheakOwnerFlag = false;
			modelAlert("车牌号码长度不正确！");
			return false;
		}
	}
	cheakOwnerFlag = true;
}

// 实时检查车辆详细信息
function blurCheackCarinfo() {
	// 车辆识别代码验证
	$("#vehicle_identification_input").change(function() {
        $("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());
		if ($("#vehicle_identification_input").val().length == 17) {
			$("#vehicle_identification_input").val($("#vehicle_identification_input").val().toUpperCase());
		}
		if ($.isNull($("#vehicle_identification_input").val())|| $("#vehicle_identification_input").val() == "请输入车辆识别代码") {
			return false;
		} else if ($("#vehicle_identification_input").val().length != 17) {
			modelAlert("车辆识别代码长度不正确，须是17位！");
			return false;
		} else if (tit.regExp.isVehicleIdentification($("#vehicle_identification_input").val()) == false) {
			modelAlert("车辆识别代码必须由17位的数字或大写字母组成！");
			return false;
		}
		$("#brand_model_input").val("");
	});

	// 发动机号验证
	$("#engine_number_input").change(function() {
		if ($("#engine_number_input").val().length == 19) {
			$("#engine_number_input").val($("#engine_number_input").val().toUpperCase());
		}
		if ($.isNull($("#engine_number_input").val())|| $("#engine_number_input").val() == "请输入发动机号") {
			return false;
		} else if ($("#engine_number_input").val().length > 19) {
			modelAlert("发动机号长度不正确！");
			return false;
		} else if(!checkChinese($.trim( $("#engine_number_input").val()))){
			modelAlert("发动机号是由数字和字母组成！");
			return false;
		}
		$("#brand_model_input").val("");
	});
	//车主姓名
	$("#owner_name").change(function() {
		if ($.isNull($("#owner_name").val())|| $("#owner_name").val() == "请输入车主姓名") {
			return false;
		} else if (tit.regExp.isChinese($("#owner_name").val()) == false) {
			modelAlert("车主姓名必须为汉字！");
			return false;
		}
	});
	//车主身份证号
	$("#owner_idNo").change(function() {
		if ($("#owner_idNo").val().length == 18) {
			$("#owner_idNo").val($("#owner_idNo").val().toUpperCase());
		}
		if ($.isNull($("#owner_idNo").val())|| $("#owner_idNo").val() == "请输入车主身份证号") {
			return false;
		} else if ($.checkIdCard($("#owner_idNo").val().toLocaleUpperCase()) != 0) {
			modelAlert("请输入合法的身份证号！");
			return false;
		}
	});

	// 车主手机号码校验
	$("#owner_mobile").change(function() {
		if ($.isNull($("#owner_mobile").val())|| $("#owner_mobile").val() == "请输入车主手机号码") {
			return false;
		} else if (tit.regExp.isMobile($("#owner_mobile").val()) == false) {
			modelAlert("请输入正确的手机号码！");
			return false;
		}
	});

}
// 解绑实时检查车辆详细信息
function unBindblurCheackCarinfo() {
	$('#vehicle_identification_input').unbind('change');// 车辆识别代码取消事件
	$('#engine_number_input').unbind('change');// 发动机号取消事件
	$('#owner_name').unbind('change');// 车主姓名取消事件
	$('#owner_idNo').unbind('change');// 车主身份证号取消事件
	$('#owner_mobile').unbind('change');// 车主手机号取消事件
}

// 提交时检查车辆详细信息
function cheackCarinfo() {
	var currentTime = new Date().getTime();// 当前时间
	// 获得上一年在这一天的日期
	var lastYearDate = getLastYeardate();
	var car_shengshi = $("#car_sheng").val();// 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var owner_name = $("#owner_name").val();// 车主姓名
	// 车辆详细信息
	var brand_model_input = $("#brand_model_input").val();// 品牌型号
	var vehicle_identification_input = $("#vehicle_identification_input").val();// 车辆识别代码
	var engine_number_input = $("#engine_number_input").val();// 发动机号
	var vehicle_registration_date = $("#vehicle_registration_date").val();// 车辆注册日期
	var startDate = $("#startDate").val();// 起保日期
	var purchaseDate = $("#vehicle_registration_date").val();//购车日期
	
	var fuelType=$("#fuelType").val();//能源种类
	var certificateTypeName=$.trim($("#certificateType").val());//凭证种类
	var certificateNo=$.trim($("#certificateNo").val())//凭证编号
	var certificateDate=$.trim($("#certificateDate").val())//凭证日期
	var certiStartDate=$("#certiStartDate").val();//身份证起期
	var certiEndDate=$("#certiEndDate").val();//身份证止期
	var nation=$("#nation").val();//名族
	var issuer=$("#issuer").val();//签发机构
	var owner_email=$("#owner_email").val();//邮箱

	// var specialCarFlag = 0;//是否过户车 是：1；否：0
	var pName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
	if (pName == "guanbi.png") {
		specialCarFlag = 0;
	} else {
		specialCarFlag = 1;
	};
	var specialCarDate = $("#specialCarDate").val();// 过户日期
	var vehicleInvoiceNo = $("#vehicleInvoiceNo").val();// 新车购置发票号
	var vehicleInvoiceDate = $("#vehicleInvoiceDate").val();// 发票开具日期
	
	var owner_name = $("#owner_name").val();// 车主姓名
	var owner_idNo = $("#owner_idNo").val();// 车主身份证号
	var owner_mobile = $("#owner_mobile").val();// 手机号码
	

	// 判断非空
	if ($.isNull(car_shengshi) ||  car_shengshi == "请选择省份") {
		cheakCarinfoFlag = false;
		modelAlert("请选择省份！");
		return false;
	};
	if ($.isNull(car_city) ||  car_city == "请选择城市") {
		cheakCarinfoFlag = false;
		modelAlert("请选择城市！");
		return false;
	};
	if ($.isNull(vehicle_identification_input)|| vehicle_identification_input == "请输入车辆识别代码") {
		cheakCarinfoFlag = false;
		modelAlert("请输入车辆识别代码/VIN！");
		return false;
	} else if (vehicle_identification_input.length != 17) {
		cheakCarinfoFlag = false;
		modelAlert("车辆识别代码长度不正确，须是17位！");
		return false;
	};
	if ($.isNull(engine_number_input) || engine_number_input == "请输入发动机号") {
		cheakCarinfoFlag = false;
		modelAlert("请输入发动机号！");
		return false;
	} else if (engine_number_input.length > 19) {
		cheakCarinfoFlag = false;
		modelAlert("发动机号长度不正确！");
		return false;
	}else if(!checkChinese($.trim(engine_number_input))){
		modelAlert("发动机号不能输入汉字！");
		return false;
	}
	;
	if ($.isNull(vehicle_registration_date)|| vehicle_registration_date == "请选择注册日期") {
		cheakCarinfoFlag = false;
		modelAlert("请选择注册日期！");
		return false;
	} else {
		if (new Date(vehicle_registration_date).getTime() > currentTime) {
			cheakCarinfoFlag = false;
			modelAlert("车辆注册日期不能大于当前日期！");
			return false;
		}
		// 如果是新车 车辆注册日期不能小于当前日期一年
		else if (chooseicon == 1&& (new Date(vehicle_registration_date).getTime() < new Date(lastYearDate).getTime())) {
			cheakCarinfoFlag = false;
			modelAlert("新车，车辆注册日期不能小于当前日期一年！");
			return false; 
		}
	}
	if (specialCarFlag == 1) {
		if ($.isNull(specialCarDate) || specialCarDate == "请选择过户日期") {
			cheakCarinfoFlag = false;
			modelAlert("请选择过户日期！");
			return false;
		} else {
			if (new Date(specialCarDate).getTime() > currentTime) {
				cheakCarinfoFlag = false;
				modelAlert("过户日期不能大于当前日期！");
				return false;
			} else if (new Date(specialCarDate).getTime() < new Date(
					vehicle_registration_date).getTime()) {
				cheakCarinfoFlag = false;
				modelAlert("过户日期不能小于车辆注册日期！");
				return false;
			}
		}
	}
	
	if ($.isNull(brand_model_input) || brand_model_input == "请选择品牌型号") {
		cheakCarinfoFlag = false;
		modelAlert("请选择品牌型号！");
		return false;
	}
	if ($.trim($("#seat").val())=="") {
		cheakCarinfoFlag = false;
		modelAlert("请输入车辆座位数！");
		return false;
	}else{
		if(!/^[1-9]{1}$/.test($.trim($("#seat").val()))){
			cheakCarinfoFlag = false;
			modelAlert("车辆座位数为数字1~9！");
			return false;
		}
	}
	
	if ($.isNull(owner_name) || owner_name == "请输入车主姓名") {
		modelAlert("请输入车主姓名！");
		cheakCarinfoFlag = false;
		return false;
	}
	if (tit.regExp.isChinese(owner_name) == false) {
		modelAlert("车主姓名必须为汉字！");
		cheakCarinfoFlag = false;
		return false;
	}
	if ($.isNull(owner_idNo) || owner_idNo == "请输入车主身份证号") {
		modelAlert("请输入车主身份证号！");
		cheakCarinfoFlag = false;
		return false;
	} else if ($.checkIdCard(owner_idNo.toLocaleUpperCase()) != 0) {
		modelAlert("请输入合法的身份证号！");
		cheakCarinfoFlag = false;
		return false;
	}
	if ($.isNull(owner_mobile) || owner_mobile == "请输入车主手机号码") {
		modelAlert("请输入车主手机号码！");
		cheakCarinfoFlag = false;
		return false;
	}
	// 车主手机号码验证
	if (tit.regExp.isMobile(owner_mobile) == false) {
		modelAlert("请输入合法的手机号码！");
		cheakCarinfoFlag = false;
		return false;
	}

	
	
	
	if(citynum=="3110000"){//北京地区
		if ($.isNull(fuelType) || fuelType == "请选择能源种类") {
			modelAlert("请选择能源种类！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(certiStartDate) || certiStartDate == "请选择身份证有效起期") {
			modelAlert("请选择身份证有效起期！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(certiEndDate) || certiEndDate == "请选择身份证有效止期") {
			modelAlert("请选择身份证有效止期！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(nation) || nation == "请选择民族") {
			modelAlert("请选择民族！");
			cheakCarinfoFlag = false;
			return false;
		}
		if ($.isNull(issuer) || issuer == "请输入签发机构") {
			modelAlert("请输入签发机构！");
			cheakCarinfoFlag = false;
			return false;
		}
		if(chooseicon==1){
			if ($.isNull(certificateTypeName) || certificateTypeName == "请选择凭证种类") {
				modelAlert("请选择凭证种类！");
				cheakCarinfoFlag = false;
				return false;
			}
			if ($.isNull(certificateNo) || certificateNo == "请输入凭证编号") {
				modelAlert("请输入凭证编号！");
				cheakCarinfoFlag = false;
				return false;
			}
			if ($.isNull(certiEndDate) || certiEndDate == "请选择凭证所载日期") {
				modelAlert("请选择凭证所载日期！");
				cheakCarinfoFlag = false;
				return false;
			}
		}
	}
	if(citynum=="3440300"||citynum=="3110000"){//深圳地区  北京地区
		if ($.isNull(owner_email) || owner_email == "请输入车主邮箱") {
			modelAlert("请输入车主邮箱！");
			cheakCarinfoFlag = false;
			return false;
		}
		// 电子邮箱验证
		if (tit.regExp.isEmail(owner_email) == false) {
			modelAlert("请输入合法的电子邮箱！");
			cheakCarinfoFlag = false;
			return false;
		}
	}
	
	cheakCarinfoFlag = true;
}

//品牌型号查询前校验
function carinfoCheack() {
	var currentTime = new Date().getTime();// 当前时间
	// 获得上一年在这一天的日期
	var lastYearDate = getLastYeardate();
	var car_shengshi = $("#car_sheng").val();// 车辆行驶省份
	var car_city = $("#car_shi").val();// 车辆行驶城市
	var owner_name = $("#owner_name").val();// 车主姓名
	// 车辆详细信息
	var vehicle_identification_input = $("#vehicle_identification_input").val();// 车辆识别代码
	var engine_number_input = $("#engine_number_input").val();// 发动机号
	var vehicle_registration_date = $("#vehicle_registration_date").val();// 车辆注册日期
	//var startDate = $("#startDate").val();// 起保日期
	var purchaseDate = $("#purchaseDate").val();  //购车日期

	// var specialCarFlag = 0;//是否过户车 是：1；否：0
	var pName = $("#chooseIcons").attr("src").substring($("#chooseIcons").attr("src").lastIndexOf("/") + 1);
	if (pName == "guanbi.png") {
		specialCarFlag = 0;
	} else {
		specialCarFlag = 1;
	};
	var specialCarDate = $("#specialCarDate").val();// 过户日期

	// 判断非空
	if ($.isNull(car_shengshi) ||  car_shengshi == "请选择省份") {
		carinfoCheakFlag = false;
		modelAlert("请选择省份！");
		return false;
	}
	if ($.isNull(car_city) ||  car_city == "请选择城市") {
		carinfoCheakFlag = false;
		modelAlert("请选择城市！");
		return false;
	}
	if ($.isNull(vehicle_identification_input)|| vehicle_identification_input == "请输入车辆识别代码") {
		carinfoCheakFlag = false;
		modelAlert("请输入车辆识别代码！");
		return false;
	} else if (vehicle_identification_input.length != 17) {
		carinfoCheakFlag = false;
		modelAlert("车辆识别代码长度不正确，须是17位！");
		return false;
	}
	if ($.isNull(engine_number_input) || engine_number_input == "请输入发动机号") {
		carinfoCheakFlag = false;
		modelAlert("请输入发动机号！");
		return false;
	} else if (engine_number_input.length > 19) {
		carinfoCheakFlag = false;
		modelAlert("发动机号长度不正确！");
		return false;
	}else if(!checkChinese($.trim(engine_number_input))){
		modelAlert("发动机号不能输入汉字！");
		return false;
	}
	if ($.isNull(vehicle_registration_date)
			|| vehicle_registration_date == "请选择注册日期") {
		carinfoCheakFlag = false;
		modelAlert("请选择车辆注册日期！");
		return false;
	} else {
		if (new Date(vehicle_registration_date).getTime() > currentTime) {
			carinfoCheakFlag = false;
			modelAlert("车辆注册日期不能大于当前日期！");
			return false;
		}
		// 如果是新车 车辆注册日期不能小于当前日期一年
		else if (chooseicon == 1&& (new Date(vehicle_registration_date).getTime() < new Date(lastYearDate).getTime())) {
			carinfoCheakFlag = false;
			modelAlert("新车，车辆注册日期不能小于当前日期一年！");
			return false; 
		}
	}
	if (specialCarFlag == 1) {
		if ($.isNull(specialCarDate) || specialCarDate == "请选择过户日期") {
			carinfoCheakFlag = false;
			modelAlert("请选择过户日期！");
			return false;
		} else {
			if (new Date(specialCarDate).getTime() > currentTime) {
				carinfoCheakFlag = false;
				modelAlert("过户日期不能大于当前日期！");
				return false;
			} else if (new Date(specialCarDate).getTime() < new Date(
					vehicle_registration_date).getTime()) {
				carinfoCheakFlag = false;
				modelAlert("过户日期不能小于车辆注册日期！");
				return false;
			}
		}
	}
	carinfoCheakFlag = true;
}


//省份选择模块初始化  通过映射表查询
$.loadDisAddress = function(t, y) {
	if(t==2){//查询省
		var url = base.url + "gzhcx/queryProvinceInfo.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":parm.source,
					"issueChannel":$("#issueChannel").attr("channelCode")
				},"body":{}
			
		};
		$.reqAjaxs(url, reqData, $.loadData);
	}else if(t==3){//查询市
		var url = base.url + "gzhcx/queryCityInfo.do";
		var reqData = {
				"head":{
					"userCode":"",
					"transTime":$.getTimeStr(),
					"channel":parm.source,
				    "cxProvinceId":y,
				    "issueChannel":$("#issueChannel").attr("channelCode")
				},"body":{}
			
		};
		$.reqAjaxs(url, reqData, $.loadData);
	}
}

/**
 * 数据库加载数据
 */
$.loadData = function(param) {
	param = eval("(" + param + ")");

	if (param.status.statusCode == "000000") {
		if (param != null || param != "") {
			var customerlist = new Array();
			function ProcessSheng(text, value) {
				this.text = text;
				this.value = value;
			}
			if (param.cityinfo.rows != null) {
				for ( var j = 0; j < param.cityinfo.rows.length; j++) {
					var customerinfo = new ProcessSheng(param.cityinfo.rows[j].contName, j);
					customerlist.push(customerinfo);
				}
			}
			if (rankFlag == 0) {
				shengList = param.cityinfo.rows;
				// 省份选择
				(function($, doc) {
					// 一级联动
					var selectPicker = new $.PopPicker();
					selectPicker.setData(customerlist);
					var selectResult = doc.getElementById("car_sheng");
					selectPicker.show(function(items) {
						var num = items[0].value;
						selectResult.value = items[0].text;
						selectResult.style.color = "#585858";
						selectResult.name = shengList[num].id;
						doc.getElementById("car_shi").value = "";
						doc.getElementById("car_shi").style.color = "#888";
						doc.getElementById("car_shi").name = "";
						doc.getElementById("plate_number_input").value = "";
						doc.getElementById("plate_number_input").style.color = "#888";
						doc.getElementById("plate_number_input").name = "";
						citynum = "";
						if(shengList[num].id!="8"){//非江苏地区
							document.getElementById('yanzhengmaImg').style.display="none";
						}
						document.getElementById('tip').innerHTML=getContentByProvince(selectResult.value);
						selectPicker.dispose();// 释放组件资源
					});
				})(mui, document);
			} else if (rankFlag == 1) {

				shiList = param.cityinfo.rows;
				// 城市选择
				(function($, doc) {
					// 一级联动
					var selectPicker = new $.PopPicker();
					selectPicker.setData(customerlist);
					var selectResult = doc.getElementById("car_shi");
					selectPicker.show(function(items) {
						var num = items[0].value;
						selectResult.value = items[0].text;
						selectResult.style.color = "#585858";
						selectResult.name = shiList[num].id;
						if (chooseicon == 0) {
							doc.getElementById("plate_number_input").value = shiList[num].cityPlate;
							doc.getElementById("plate_number_input").style.color = "#585858";
							doc.getElementById("plate_number_input").name = "";
						}
						carPlate=shiList[num].cityPlate;
						citynum = shiList[num].id;
						//出单人员是否匹配到省
						parm.body.cdPrivinceFlag=shiList[num].flag;
						selectPicker.dispose();// 释放组件资源
					});
				})(mui, document);
			}
		}
	} else {
		modelAlert(param.status.statusMessage);
	}
};

// 查询省份
function selectSheng() {
	if ($("#issueChannel").attr("channelCode") == null|| $("#issueChannel").attr("channelCode") == "") {
		modelAlert("请先选择渠道！");
	} else {
		rankFlag = 0;
		$.loadDisAddress(2, "");// 省份选择
	}
	
}
// 查询市区
function selectShi() {
	rankFlag = 1;
	if ($("#car_sheng").attr("name") == null|| $("#car_sheng").attr("name") == "") {
		modelAlert("请先选择省份！");
	} else {
		province = $("#car_sheng").attr("name");// province值为上级的代码，province=0时取全部省
		rankFlag = 1;// 省市县级别标志 0-省 1-市 2-县
		$.loadDisAddress(3, province);
	}
}

// 获得上一年在这一天的日期
function getLastYeardate() {
	var currentdate = new Date();
	var strYear = currentdate.getFullYear() - 1;
	var strDay = currentdate.getDate();
	var strMonth = currentdate.getMonth() + 1;
	if (strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if (strDay < 10) {
		strDay = "0" + strDay;
	}
	datastr = strYear + "-" + strMonth + "-" + strDay;
	return datastr;
}

// 获取订单信息模块初始化
$.loadCarInfoed = function() {
	var url = base.url + "cx/getAllInfo.do";
	var data = {
		"sessionId" : cxSessionId,// 车险投保唯一流水号
	};
	$.toAjaxs(url, data, $.addInfo);
};

$.addInfo = function(param){
	param = eval("(" + param + ")");
	if (param != null || param != "") {
		orderPrams = JSON.stringify(param);// 传递参数到详情页面
		if (param.status.statusCode == "000000") {
			if (param.cxInfo != null) {
				if(param.cxInfo.cxOrder != null){
					vehicleModelData=JSON.parse(UrlDecode(param.cxInfo.cxOrder.vehiclemodeldata)).vehicleModelData;
					var channelCode=param.cxInfo.cxOrder.issueChannel;
					var channelName=changeChannel(channelCode);
					$("#issueChannel").attr("channelCode",channelCode).val(channelName);
					var cityName = param.cxInfo.cxOrder.cityName;
					if(!$.isNull(cityName)){ //省份、城市
						var arr = cityName.split(/[-]/);
						$("#car_sheng").val(arr[0]);
						$("#car_shi").val(arr[1]);
						$("#tip").html(getContentByProvince($("#car_sheng").val()));

					}
					if(!$.isNull(param.cxInfo.cxOrder.cityCode)){
						citynum=param.cxInfo.cxOrder.cityCode;
						$("#car_shi").attr("name",param.cxInfo.cxOrder.cityCode);
						$("#car_sheng").attr("name",param.cxInfo.cxOrder.provinceCode);
						if(citynum=="3110000"){//新车北京地区
                            if(!$.isNull(param.cxInfo.cxCarMessage.fuelType)){//能源种类
								$("#fuelType").attr("name",param.cxInfo.cxCarMessage.fuelType).val(param.cxInfo.cxCarMessage.fuelTypeName)
							}
                            if(!$.isNull(param.cxInfo.cxOrder.certiStartdate)){//身份证起期
								$("#certiStartDate").val(timeFormatDate(param.cxInfo.cxOrder.certiStartdate.time,'yyyy-MM-dd'));
							}
                            if(!$.isNull(param.cxInfo.cxOrder.certiEnddate)){//身份证止期
                            	$("#certiEndDate").val(timeFormatDate(param.cxInfo.cxOrder.certiEnddate.time,'yyyy-MM-dd'));
							}
                            if(!$.isNull(param.cxInfo.cxOrder.nation)){//民族
								$("#nation").val(param.cxInfo.cxOrder.nation)
							}
                            if(!$.isNull(param.cxInfo.cxOrder.issuerAuthority)){//签发机构
								$("#issuer").val(param.cxInfo.cxOrder.issuerAuthority);
							}
                            $("#fuelTypeTable,#cardTable").show();
						}
						if(citynum=="3440300"||citynum=="3110000"){//深圳地区  北京地区
							if(!$.isNull(param.cxInfo.cxOrder.ownerEmail)){ //邮箱
							   $("#owner_email").val(param.cxInfo.cxOrder.ownerEmail);
							   $("#plateEmail").show();
							}
						}
						if($("#car_sheng").attr("name")=="8"){//江苏地区
							var checkcode=param.cxInfo.cxOrder.checkcode;
							if(checkcode!=null){
								$("#checkNo").val(checkcode);
								
							}
							$("#checkImg").attr("src","data:image/png;base64,"+sessionStorage.getItem("checkImg"));
							$("#yanzhengmaImg").show();
						}
					}
					if (param.cxInfo.cxOrder.newcarFlag == "1") {
						document.getElementById("chooseicon").src = base.imagePath+"insurance/car/gouxuankuang1.png";
						$("#plateNum").css("color","#1b6bb8");
						$('#plate_number_input').attr("disabled", true);// 选中新车未上牌时车牌号码输入框元素设置为disabled
						chooseicon=1;
						if(citynum=="3110000"){//新车北京地区
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateType)){//凭证种类
								$("#certificateType").attr("name",param.cxInfo.cxCarMessage.certificateType).val(param.cxInfo.cxCarMessage.certificateTypeName)
							}
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateNo)){//凭证编号
								$("#certificateNo").val(param.cxInfo.cxCarMessage.certificateNo);
							}
							if(!$.isNull(param.cxInfo.cxCarMessage.certificateDate)){//凭证日期
								$("#certificateDate").val(timeFormatDate(param.cxInfo.cxCarMessage.certificateDate.time,'yyyy-MM-dd'));
							}
							$("#lailiTable").show();
						}
					} else {
						document.getElementById("chooseicon").src = base.imagePath + "insurance/car/gouxuankuang.png";
						$("#plateNum");
						$('#plate_number_input').removeAttr("disabled");// 去除input元素的readonly属性
						$("#plate_number_input").val(param.cxInfo.cxOrder.plateno);
						chooseicon=0;
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerName)){ //车主姓名
					    $("#owner_name").val(param.cxInfo.cxOrder.ownerName);
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerIdno)){ //身份证
					    $("#owner_idNo").val(param.cxInfo.cxOrder.ownerIdno);
					}
					if(!$.isNull(param.cxInfo.cxOrder.ownerMobile)){ //手机号码
					    $("#owner_mobile").val(param.cxInfo.cxOrder.ownerMobile);
					}
				}
				if(param.cxInfo.cxCarMessage != null){
					if(!$.isNull(param.cxInfo.cxCarMessage.rackNo)){//车辆识别代码/VIN
					    $("#vehicle_identification_input").val(param.cxInfo.cxCarMessage.rackNo);
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.engineNo)){ //发动机号
					    $("#engine_number_input").val(param.cxInfo.cxCarMessage.engineNo);
					}
					var registerDate = "";
					if(!$.isNull(param.cxInfo.cxCarMessage.registerDate)){ //车辆注册日期
						registerDate = timeFormatDate(param.cxInfo.cxCarMessage.registerDate.time,'yyyy-MM-dd');
					    $("#vehicle_registration_date").val(registerDate);
					}
					//是否过户
					if(param.cxInfo.cxCarMessage.transferFlag == 1){
						document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/dakai.png";
						$("#specialCarDate_select").show();
						var transferDate = timeFormatDate(param.cxInfo.cxCarMessage.transferDate.time,'yyyy-MM-dd'); //过户日期
					    $("#specialCarDate").val(transferDate);
					}else{
						document.getElementById("chooseIcons").src = base.imagePath + "insurance/car/guanbi.png";
						$("#specialCarDate_select").hide();
						$("#specialCarDate").val("");
					}
					var vehicleinvoicedate = "";
					if(!$.isNull(parm.body.businessBegindate)){ //起保日期
					    $("#startDate").val(parm.body.businessBegindate);
					}
					//是否外地车
					if(param.cxInfo.cxCarMessage.ecdemicVehicleFlag == 1){
						$("#info_car_choose div").css("color","#1b6bb8");
						document.getElementById("choosecar").src = base.imagePath + "insurance/car/dakai.png";
					}else{
						$("#info_car_choose div");
						document.getElementById("choosecar").src = base.imagePath + "insurance/car/guanbi.png";
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.vehicleBrand)){ //品牌型号jingyouVehicleName
					    $("#brand_model_input").val(param.cxInfo.cxCarMessage.vehicleBrand);
					}
					if(!$.isNull(param.cxInfo.cxCarMessage.seats)){ //座位数
					    $("#seat").val(parseInt(param.cxInfo.cxCarMessage.seats).toFixed(0));
					}
					if(parm.body.pagesflag == "carinfo" ){
						$(".firstPart").hide();
						$(".lastPart").show("fast");//车辆详细信息显示
						$(".backload").hide();//背景图隐藏
						pageflag = 1;
					}else{
						$(".backload").hide();//背景图隐藏
						pageflag = 0;
					}
				}
			}
		}
	}
}

/**
 * 数字Check
 * 
 * @param String
 * @returns false-不通过
 */
function checkNo(param) {
	reg = /^[0-9]*$/;
	return reg.test(param);
}

//输入一个汉字一个字母和5个数字（车牌校验）
function checkCarNo(param) {
	reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/;
	return reg.test(param);
}

//发动机号校验
function checkChinese(str){
	reg = /^[A-Za-z0-9-_]+$/;
	return reg.test(str);
}

//开始必须是一个或者多个单词字符或者是-，加上@，然后又是一个或者多个单词字符或者是-。然后是点“.”和单词字符和-的组合，可以有一个或者多个组合,邮箱不能以
//.以及其它特殊字符开头和结束,邮箱域名结尾为2~5个字母，比如cn、com、name
function checkEmail(str){
	var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*[A-Za-z0-9_]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}[a-z0-9]+$/;
    return reg.test(str);
}
//选择渠道
function selectChannel(){
	var url = base.url + "bill/selectInsideChannel.do";
	var reqData = {
			"head":{
				"userCode":"",
				"transTime":$.getTimeStr(),
				"channel":parm.source,
			},"body":{}
	};
	$.reqAjaxs(url, reqData, function(data){
		var userPicker = new mui.PopPicker();
		userPicker.setData(data.returns.bxCxChannel);
		userPicker.show(function(items) {
			document.getElementById("issueChannel").value=items[0].text;
			document.getElementById("issueChannel").setAttribute("channelCode", items[0].value)
			document.getElementById("car_sheng").value = "";
			document.getElementById("car_sheng").name = "";
			document.getElementById("car_shi").value = "";
			document.getElementById("car_shi").name = "";
			document.getElementById("plate_number_input").value = "";
			document.getElementById("plate_number_input").name = "";
			citynum = "";
		});
	});
}



function backlast(){//返回上一页
	$("#indexpart_scroll").css("transform","translate3d(0px, 0px, 0px)")
	if (pageflag == 0) {
		if(channelcar=="channelcar"){//渠道出单标志
			//app:返回渠道出单首页weixin/insureChannels/index.html 参数jsonkey
			//分享：不显示或者关闭
			//微信：返回渠道出单首页weixin/insureChannels/index.html	参数&字符参openid=ohNt9vx44UP2EnqzE6_C2dOXZQ4Q&mobile=12300000000&cusId=89884&roletype=01
			if(ua=="isApp"){
				parm.title = '渠道出单';
				parm.rightIco='0';
				parm.entry="app";
				delete parm.body;
				var jsonStr = UrlEncode(JSON.stringify(parm));
				window.location.href = base.url + 'weixin/insureChannels/index.html?jsonKey='+jsonStr;
			}else{
				window.location.href = base.url + 'weixin/insureChannels/index.html?openid='+parm.openid+'&mobile='+parm.mobile+'&cusId='+parm.customerId+'&roletype='+parm.roleType;
			}
		}else{
			sysback();
		}
    } else if (pageflag == 1) {
    	$(".rightIcon").show();
    	$(".lastPart").hide();//车辆详细信息显示
    	$(".firstPart").show("fast");//车辆投保地区显示
		pageflag = 0;
	}else{
		$(".vehicleInfo").hide();
		$(".carMes").show();
		pageflag = 1;
		changeTitle("车辆信息");
	}
}


function getContentByProvince(province)
{
    var content = "此地区今日能查询及投保 ${DATE} 前的车险<br/>新车未上牌无此限制";

    switch (province)
    {
        case "上海市": day = 30;break;//上海市
        case "江苏省": day = 40;break;//江苏省
        case "浙江省": day = 60;break;//浙江省
        case "山东省": day = 60;break;//山东省
        default: day = 90;
    }

    var now = new Date().getTime();
    var str =  new Date(now + day * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");

    return content.replace("${DATE}",str);
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



/**android IOS 调用h5分享方法*/
function shareHandle(){
	if(roleType != "00" && roleType != ""){
		var shareurl = base.url + 'tongdaoApp/html/share/kongbai.html?mobile=' + mobile+"&ccId=13&type=1"; // 分享链接
		if(channelcar=="channelcar"){//渠道出单标志
			shareurl = base.url + 'tongdaoApp/html/share/kongbai.html?mobile=' + mobile+"&ccId=13&type=15"; // 分享链接
		}
		var picUrl=base.url+"tongdaoApp/image/share/car.png";
		if(ua=="isApp"){
			var twolink=base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+gettwolinkurl();
			if(systemsource == "ios") {
				var shareParams = {
					"url": shareurl,
					"flag": "3",
					"title": "天安车险", // 分享标题
					"desc": "独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。", //描述
				    "descQuan":"天安车险-独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。",//朋友圈文案
				    "picUrl": picUrl,//分享图标
				    "twolink":twolink,//二维码链接
				}
				objcObject.share(shareParams)
			} else if(systemsource == "android") {
				android.JsShareBy("3",picUrl, "天安车险", "独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。", "天安车险-独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。", shareurl);
			}
		}
	}else{
		modelAlert("请先登录！");
	}
}


function toQrcodeUrl(){
	var twolink = base.url + "tongdaoApp/html/twolink/QRCodeShare.html?jsonKey="+gettwolinkurl();
	window.location.href = twolink;
}

function gettwolinkurl(){
	var twolink={
	    "userCode":mobile,
		"mobile":mobile,
		"customerId":parm.customerId,
		"title":'同道保险二维码',
		"leftIco":"1",
		"rightIco":'0',
		"state":'1',
		"ccId":'13',
		"ccName":"天安车险",
		"name":'天安车险',
		"desc":'独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。',
		"fl":"2",
		"picUrl":base.url+"tongdaoApp/image/share/car.png",
	}
	if(channelcar=="channelcar"){//渠道出单标志
		twolink.state='15';
	}
	return UrlEncode(JSON.stringify(twolink));
}

/**---分享功能----*/
var method=function(){
	wx.showMenuItems({
	    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项
	});

	var shareurl = base.url + 'tongdaoApp/html/share/kongbai.html?mobile=' + mobile+"&ccId=13&type=1"; // 分享链接
	if(channelcar=="channelcar"){//渠道出单标志
		 shareurl = base.url + 'tongdaoApp/html/share/kongbai.html?mobile=' + mobile+"&ccId=13&type=15"; // 分享链接
	}
	var shareImgUrl=base.url+"tongdaoApp/image/share/car.png";
	//分享给朋友
	wx.onMenuShareAppMessage({
	    title: '天安车险', // 分享标题
	    desc: '独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。', // 分享描述
	    link:shareurl , // 分享链接
	    imgUrl: shareImgUrl, // 分享图标
	    type: '', // 分享类型,music、video或link，不填默认为link
	    dataUrl: ''
	});
	//分享朋友圈
	wx.onMenuShareTimeline({  
	    title: "天安车险-独家专享冰点价格，7*24小时理赔服务，线上投保快捷方便。", // 分享标题  
	    link: shareurl, // 分享链接  
	    imgUrl: shareImgUrl
	});    
}