//var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var customerId = "812";//urlParm.customerId;
var mobile     = "13852291705";//urlParm.mobile;
var transToken = "b16e2692964b9887e1133604a11cc1cc";//urlParm.transToken;
var idNo	   = "32068119940124621X";//urlParm.idNo;
var name	   = "吴赛杰";//urlParm.name;
var base = {
		url : "http://td-sit.ta-by.com/tongdaoPlatform/"
}
var requestUrl = {
		saveInfoUrl  : base.url + 'agent/saveAgent.do',   //@zkl 保存代理人信息
		queryInfoUrl : base.url + 'agent/agentQuery.do',   //@zkl 代理人信息查询
		isWhiteUrl   : base.url + 'agent/isWhite.do',	  //@zkl 引荐人信息查询
		bankListUrl  : base.url + 'bank/bankList.do',		//@zkl 银行列表
		provinceUrl  : base.url + 'bank/provinceCitys.do',	//@zkl	银行所在地区列表
		bankSubsUrl  : base.url + 'bank/bankSubs.do'		//@zkl   支行列表
}