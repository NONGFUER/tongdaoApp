var cardParm = JSON.parse(UrlDecode(getUrlQueryString("jsonKey")));
function backlast() {
	cardParm.title='我的名片';
	cardParm.rightIco='5';
	var jsonStr = UrlEncode(JSON.stringify(cardParm));
	window.location.href = "./myCardEdit.html?jsonKey=" + jsonStr;
}