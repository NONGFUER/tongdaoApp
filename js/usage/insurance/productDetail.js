$(function(){
    $.setscroll("bodyMuiScroll");
    jieshaoToshuomingBind();
    productInfoRender(data1);
    calOptionsRender(data4);
});
//试算条件
function calOptionsRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var calOptionDtos = body.calOptionDtos;
        for(var i = 0; i < calOptionDtos.length; i++){
           var calName    = calOptionDtos[i].calName;
           var calOptions = calOptionDtos[i].calOptions;
           var calDetails = calOptionDetails(calOptions);
           var str = "";
           str += '<div class="d1">';
           str += '<div class="label">' + calName+ '：</div>';
           str += '<div class="conter">';
           str += calDetails;
           str += '</div>';
           $(".insurance-choice").append(str);         
        }
       
    }else{
        modelAlert( message.requestFail );
    }
}
//试算枚举
function calOptionDetails(calOptions){
    var optionsLength = calOptions.length;
    var str = "";
    if( optionsLength == 1 ){
        str += calOptions[0].enuContent;
    }else{
        str += '<ul class="radio">'
        for(var i = 0; i < optionsLength; i++){
            str += '<li>' + calOptions[i].enuContent + '</li>'
        }
        str += '</ul>'
    }
    return str;

}
/**
 * @function 请求响应的线上产品详情数据
 * @param {*} data 
 */
function productInfoRender(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){
        var body = data.returns;
        var commodityCombinationModuleMapper = body.commodityCombinationModuleMapper;
        var commodityCombination             = body.commodityCombination;

        for(var i = 0; i < commodityCombinationModuleMapper.length; i++){
            moduleStr(commodityCombinationModuleMapper[i])
        }
    }else{
        modelAlert( message.requestFail );
    }
}

function moduleStr(mapperList){
    var str = "";
    str += '<dl class="mb10 whitebackground">';
    str += '<dt class="dt">' + mapperList.moduleName + '</dt>';
    str += '<dd class="dd">';
    if( mapperList.moduleType == "02" ){
        str +=  mapperList.modueInfo;
    }          								
    str += '</dd></dl>';
    if( mapperList.bigModuleName == "产品介绍" ){
        $(".jieshao").append(str);
    }else if( mapperList.bigModuleName == "详细说明" ){
        $(".shuoming").append(str);
    }
}
//产品介绍 详情说明切换
function jieshaoToshuomingBind(){
    $(".insurance-tab").find("li").bind("click", function() {
        tab($(this),'on1');					
        $(".insurance-tab_content").hide().eq($(this).index()).show();					
    })
}
function tab(a, flag) {
	$(a).siblings().removeClass(flag); 
	$(a).addClass(flag);
};