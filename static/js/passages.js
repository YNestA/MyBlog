function titlesMove($titles) {
    var windowScroll=$(window).scrollTop(),
        windowHeight=$(window).height();
    $titles.each(function (index,item) {
            var itemTop=$(item).offset().top;
            if((windowScroll+windowHeight>itemTop)&&itemTop>windowScroll){
                $(item).children("a").css({
                    "-webkit-animation":"title-show 1s forwards",
                    "-moz-animation":"title-show 1s forwards",
                    "-ms-animation":"title-show 1s forwards",
                    "animation":"title-show 1s forwards",
                });
            }else if(windowScroll+windowHeight<itemTop){
                $(item).children("a").css({
                    "-webkit-animation":"",
                    "-moz-animation":"",
                    "-ms-animation":"",
                    "animation":"",
                });
            }
        });
}
$(document).ready(function () {
    var $titles = $("h2.title");
    titlesMove($titles);
    $(window).scroll(function (event) {
        titlesMove($titles);
    });
    $("#center img.lazy").imgScrollLoad();
});
