var reqDataq = {
    "head":{
        "channel"  :"01",
        "userCode" :"18500000000",
        "transTime":"",
		"transToken":"6e1ac86ab83a8e36f7d654870cd7711b"
    },
    "body":{
        "shortRiskorder":{
            "productId" :"12",
            "insureName":"吴赛杰",
            "customerId":"15",
            "insurePhone":"13852291705",
            "insureIdentitycard": "32068119940124621X",				
            "coverage":"500000",
            "inviterPhone":"13852291705",
            "insureAddress":"深圳",
            "totalPieces":1,
			"commodityId":'15',
			"commodityCombinationId":"12",
			"type":"01",
			"insureAdress":"上海浦东",
            "channelResource":'3'// '渠道来源,1-微信公众号，2-分享进入，3-App',	
        },
        "shortRiskInsured":{
            "apRelation" : "01",//01本人
            "insuredname": "吴赛杰",
            "insuredidno": "32068119940124621X",
            "insuredmobile":"13852291705"
        },
		"productId":"",
		"customerId":"6",
        "belongORGCode":"BY0120301831",
        "agentCode":"012030Y00120",
        "teamCode":"012030T022",
        "certiNo":"012030B00022",
        "businessSource":"012030T022"
    }
}
var reqData = {"request":{
    "head":{
        "channel"  :"01",
        "userCode" :"13852291705",
        "transTime":""
    },
    "body":{
        "shortRiskOrder":{
            "commodityCombinationId" :"1",
			"commodityId" :"1",
            "insureName":"吴赛杰",
            "customerId":"15",
            "insurePhone":"13852291705",
            "insureIdentitycard": "340881198908307499",				
            "coverage":"500000",
            "inviterPhone":"13852291705",
            "insureAddress":"深圳",
            "totalPieces":1,
            "channelResource":'3'// '渠道来源,1-微信公众号，2-分享进入，3-App',	
        },
        "shortRiskInsured":{
            "apRelation" : "01",//01本人
            "insuredname": "吴赛杰",
            "insuredidno": "340881198908307499",
            "insuredmobile":"13852291705"
        },
        "versions":"01"
    }
	}
}
var reqData1 = {
        "head":{
            "channel"  :"01",
            "userCode" :"13852291705",
            "transTime":""
        },
        "body":{
            "customerId":"14",//customerId,//773  198980 250
            "commodityCombinationId" : '6' //
        }
}
var ff = {"head":{"channel":"01","userCode":"18900001111","transTime":"2017-09-01 16:3:55"},"body":{"orgProvinceCode":"110000","commodityCombinationId":"6","cityCode":""}}

	var url = 'http://localhost:8080/tongdaoPlatform/ecard/toubao.do?jsonKey='
	console.log(url+""+requestJson);
document.write(url+requestJson);
var sendData = {
		"mobile":"13888888888",
		"customerId":"816",
		"name":"王晓伟",
		"idNo":"150404198210221124",
		"idAuth":"1",
		"roleType":"04",
		"transToken":"701f3e80f2f0d22f9109c68770366dfe",
		"ccId":"9",
		"ccCode":"00400007",
		"cId":"",
		"cCode":"",
		"cityCode":"",
		"provinceCode":"130000"
	}
	var jsonKey = UrlEncode(JSON.stringify(sendData));
	console.log("产品：jsonKey="+jsonKey);
	
	
	////////////////////////////////////////////////////////
	var urlA = 'http://localhost:8080/tongdaoPlatform/agent/question.do?jsonKey=';
	var sendJson = {
			"head":{
	            "channel"  :"01",
	            "userCode" :"13852291705",
	            "transTime":"",
	            "transToken":""
	        },
	        "body":{
	            
	        }	
	}
		
		
	var requestJson = aesEncrypt(JSON.stringify(sendJson), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	console.log("获取代理人考试题目");
	console.log(urlA+""+requestJson);
	
	
	
	/////////////////////////////////////////////////////////////
	var urlB = 'http://localhost:8080/tongdaoPlatform/bank/bankList.do?jsonKey=';
	var sendJsonB = {
			"head":{
	            "channel"  :"01",
	            "userCode" :"13852291705",
	            "transTime":"",
	            "transToken":""
	        },
	        "body":{
	            
	        }	
	}
		
		
	var requestJsonB = aesEncrypt(JSON.stringify(sendJsonB), secretKey, secretKey);
	requestJsonB=URLencodeForBase64(requestJsonB);
	console.log("获取银行：");
	console.log(urlB+""+requestJsonB);
	////////////////////////////////////////////////////////////////////////////////////agent/isWhite.do
	var urlC = 'http://localhost:8080/tongdaoPlatform/agent/isWhite.do?jsonKey=';
	var sendJsonC = {
			"head":{
	            "channel"  :"01",
	            "userCode" :"13852291705",
	            "transTime":"",
	            "transToken":"b16e2692964b9887e1133604a11cc1cc"
	        },
	        "body":{
	        	"recommendId": "016330B0051",
	        	"customerId":"812"
	        }	
	}
		
		
	var requestJsonC = aesEncrypt(JSON.stringify(sendJsonC), secretKey, secretKey);
	requestJsonC=URLencodeForBase64(requestJsonC);
	console.log("获取银行：");
	console.log(urlC+""+requestJsonC);
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	var urlD = 'http://localhost:8080/tongdaoPlatform/agent/agentQuery.do?jsonKey=';
	var sendJsonD = {
			"head":{
				"channel": "01",
		        "userCode": "13852291705",
		        "transTime": $.getTimeStr(),
		        "transToken":"b16e2692964b9887e1133604a11cc1cc"
			},
			"body":{
				"customerId" : "812",
				"type"		 : "1"
			}
	}
		
		
	var requestJsonD = aesEncrypt(JSON.stringify(sendJsonD), secretKey, secretKey);
	requestJsonD=URLencodeForBase64(requestJsonD);
	console.log("查询：");
	console.log(urlD+""+requestJsonD);