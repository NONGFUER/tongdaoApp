var urlParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
var customerId = urlParm.customerId;//"812";//
var mobile     = urlParm.mobile; //"13852291705";//
var transToken = urlParm.transToken;//"b16e2692964b9887e1133604a11cc1cc";//
var idNo	   = urlParm.idNo;//"32068119940124621X";//
var name	   = urlParm.name;    //"吴赛杰";//
//var base = {
//		url : "http://td-sit.ta-by.com/tongdaoPlatform/"
//}
var requestUrl = {
		saveInfoUrl  : base.url + 'agent/saveAgent.do',   //@zkl 保存代理人信息
		queryInfoUrl : base.url + 'agent/agentQuery.do',   //@zkl 代理人信息查询
		isWhiteUrl   : base.url + 'agent/isWhite.do',	  //@zkl 引荐人信息查询
		bankListUrl  : base.url + 'bank/bankList.do',		//@zkl 银行列表
		provinceUrl  : base.url + 'bank/provinceCitys.do',	//@zkl	银行所在地区列表
		bankSubsUrl  : base.url + 'bank/bankSubs.do'		//@zkl   支行列表
}