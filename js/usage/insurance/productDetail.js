$(function(){
    $.setscroll("bodyMuiScroll");
    jieshaoToshuomingBind();
    productInfoRender(data1);
});
//试算条件
function calOptions(data){
    console.log(data);
    if( data.statusCode == ajaxStatus.success ){

    }else{

    }
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