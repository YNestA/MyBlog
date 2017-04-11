/**
 * Created by yang on 16-8-6.
 */
;(function ($) {
    $.fn.extend({
        imgScrollLoad:function (options) {
            var defaults={      //设置默认参数
                realSrc:"data-url",
                callback:function () {},
            };
            var opts=$.extend(defaults,options),
                imgs=[];
            for(var i=0;i<$(this).length;i++){
                var img=$(this).get(i);
                if(img.tagName.toLowerCase()=="img") {
                    imgs.push(img);
                }
            };
            var imgLoad=function (event) {
                for(var i=0;i<imgs.length;i++){
                    var $img=$(imgs[i]);
                    if($img.is(':visible')&&$(window).scrollTop()+$(window).height()>$img.offset().top){
                        $img.attr("src",$img.attr(opts.realSrc));
                        if($.isFunction(opts.callback)){
                            opts.callback.apply($img);
                        }
                    }
                }
            };
            imgLoad();
            $(window).scroll(imgLoad);
        }
    });
})(jQuery);