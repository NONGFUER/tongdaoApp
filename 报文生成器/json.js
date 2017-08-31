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

var requestJson = aesEncrypt(JSON.stringify(reqData), secretKey, secretKey);
	requestJson=URLencodeForBase64(requestJson);
	var url = 'http://localhost:8080/tongdaoPlatform/cancerRisk/toubao.do?jsonKey='
	console.log(url+""+requestJson);
document.write(url+requestJson);
var sendData = {
		"mobile":"18900001111",
		"customerId":"18",
		"name":"王晓伟",
		"idNo":"150404198210221124",
		"idAuth":"1",
		"roleType":"04",
		"transToken":"",
		"ccId":"101",
		"ccCode":"00900001",
		"cityCode":"",
		"provinceCode":"130000"
	}
	var jsonKey = UrlEncode(JSON.stringify(sendData));
	console.log("jsonKey="+jsonKey);