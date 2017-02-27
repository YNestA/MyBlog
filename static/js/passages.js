function titlesMove($titles) {
    var windowScroll=$(window).scrollTop(),
        windowHeight=$(window).height();
    $titles.each(function (index,item) {
            var itemTop=$(item).offset().top;
            if((windowScroll+windowHeight>itemTop)&&itemTop>windowScroll){
                $(item).children("a").css({animation:"title-show 1s"});
            }else if(windowScroll+windowHeight<itemTop){
                $(item).children("a").css({animation:""});
            }
        });
}
$(document).ready(function () {
    var $titles=$("h2.title");
    titlesMove($titles);
    $(window).scroll(function (event) {
        titlesMove($titles);
    });
});
