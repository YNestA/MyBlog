/**
 * Created by yang on 16-7-23.
 */
;(function ($) {
    var closeIcon_s='/static/DialogBox/MyDialogBox/image/close_s.png',
        closeIcon_h='/static/DialogBox/MyDialogBox/image/close_h.png';
    function createShade() {
        if(!document.getElementById("my-dialog-cover")) {
            var cover = document.createElement("div");
            cover.setAttribute("id", "my-dialog-cover");
            document.body.appendChild(cover);
            $("#header,#warp,#footer,header,footer").css("filter","blur(1px)");
        }
    }
    function removeShade() {
        if(!(document.getElementsByClassName("alert-box").length+document.getElementsByClassName("confirm-box").length)) {
            var cover = document.getElementById("my-dialog-cover");
            document.body.removeChild(cover);
            $("#header,#warp,#footer,header,footer").css("filter","");
        }
    }
    function removeBox(event){
        event.stopPropagation();
        var $box=$(this).closest("div.alert-box,div.confirm-box");
        $box.addClass("box-close-anim");
        setTimeout(function () {
            $box.remove();
            removeShade();
        },200);
    }
    $.extend({
        myAlert:function (message) {
            var box="";
            box+="<div class='alert-box'><span class='alert-close'><img src='"
            box+=closeIcon_s;
            box+="'></span><div class='alert-message'>";
            box+=message;
            box+="</div></div>";
            createShade();
            $("body").append(box);
            $("div.alert-box").show().addClass("box-open-anim");//show()类似初始化的作用,否则后面一行添加的class将同时结算，无法触发动画.暂时没想到更好的解决办法
            $("span.alert-close img").hover(function (event) {
                $(this).attr("src",closeIcon_h);
            },function(event){
                $(this).attr("src",closeIcon_s);
            });
            $(".alert-box span.alert-close").click(removeBox);
        },
        myConfirm:function (options) {
            var defaults={
                message:"",
                trueCallback:function () {},
                falseCallback:function () {}
            };
            var opts=$.extend(defaults,options);
            var box="";
            box+="<div class='confirm-box'><span class='alert-close'><img src='"
            box+=closeIcon_s;
            box+="'></span><div class='confirm-message'>";
            box+=opts.message;
            box+="</div><div class='confirm-btns'>";
            box+="<button class='confirm-true'>确认</button><button class='confirm-false'>取消</button></div></div>"
            createShade();
            $("body").append(box);
            $("div.confirm-box").show().addClass("box-open-anim");//show()类似初始化的作用,否则后面一行添加的class将同时结算，无法触发动画.暂时没想到更好的解决办法
            $("span.alert-close img").hover(function (event) {
                $(this).attr("src",closeIcon_h);
            },function(event){
                $(this).attr("src",closeIcon_s);
            });
            $("button.confirm-true").click(removeBox).click(opts.trueCallback);
            $("button.confirm-false,.confirm-box span.alert-close").click(removeBox).click(opts.falseCallback);
        },
    });
    $.fn.extend({
        myTip:function (options) {
            if($(this).length) {
                var $theEle = $(this);
                var defaults = {
                    message: "",
                    width: 250,
                    direction:"bottom"
                };
                var opts = $.extend(defaults, options);
                var $tipBox = $("<div class='tip-box'><div style='position: relative;'><span class='tip-message'>" + opts.message + "</span><div class='tip-arrow-border'></div><div class='tip-arrow'></div></div></div>");
                $theEle.parent().append($tipBox);
                $tipBox.find(".tip-arrow").addClass("tip-arrow-"+opts.direction);
                $tipBox.find(".tip-arrow-border").addClass("tip-arrow-border-"+opts.direction);

                var tipLeft,tipTop;
                if(opts.direction=="bottom"){
                    tipLeft=$theEle.position().left;
                    tipTop=$theEle.position().top+$theEle.outerHeight()+10;
                }else if(opts.direction=="right"){
                    tipLeft=$theEle.position().left+$theEle.outerWidth()+10;
                    tipTop=$theEle.position().top;
                }
                $tipBox.css({
                    'left': tipLeft,
                    'top':  tipTop,
                    'width': opts.width,
                });
                $theEle.click(function () {
                    $tipBox.remove();
                });
                $theEle.focus(function () {
                    $tipBox.remove();
                })
            }
        },
    });
})(jQuery);