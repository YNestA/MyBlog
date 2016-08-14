/**
 * Created by yang on 16-3-21.
 */
/*
function caluHeight() {
    $(".bigger-container").css("height",$(window).height());
}
*/
function getAimImage(checked,drection){
    var $aim;
    if(drection==">") {
        if (checked.attr("alt") == "last") {
            $aim = $("#image-list img[alt='first']");
        }else{
            $aim=checked.next();
        }
    }else{
        if (checked.attr("alt") == "first") {
            $aim = $("#image-list img[alt='last']");
        }else{
            $aim=checked.prev();
        }
    }
    return $aim;
}

function imageRoll(event) {
    var $checked=$(".checked"),
        $aim=getAimImage($checked,event.target.getAttribute("alt"));
    $("span.current").removeClass("current");
    $("span[alt='"+$aim.attr('alt')+"']").addClass("current");
    $checked.removeClass("checked").stop().fadeOut(700);
    $aim.addClass("checked").stop().fadeIn(700);
}
function pointRoll(event){
    var aimAlt=event.target.getAttribute("alt");
    $("span.current").removeClass("current");
    event.target.setAttribute("class","current");
    $(".checked").removeClass("checked").stop().fadeOut(700);
    $("img[alt='"+aimAlt+"']").addClass("checked").stop().fadeIn(700);
}

$(document).ready(function () {
    function hoverIn(event) {
        clearInterval(intervalID);
    }
    function hoverOut(event) {
        intervalID=setInterval(function () {
            $("#container >a[alt='>']").click();
        },2800);
    }
    $("footer").css({"display":"none"})
    $("#image-list img[class!='checked']").hide();
    $("#container > a").click(function(event){
        imageRoll(event);
    });
    $("#container > a").focus(function (event) {
        this.blur();
    });
    $("#point-list span").click(pointRoll);
    setTimeout(function () {},1500);//第一次载入页面时延迟1.5s开始自动滚动
    var intervalID=setInterval(function () {
        $("#container >a[alt='>']").click();
    },2800);
    $("#container > a").hover(hoverIn,hoverOut);
    $("#point-list span").hover(hoverIn,hoverOut);
});
