/**
 * Created by yang on 16-7-25.
 */
$(document).ready(function () {
    var $body=$("body");
    for(var i=0;i<50;i++){
        $body.append("<br>")
    };
    $("#myAlert-btn").click(function (event) {
        $.myAlert("哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈");
    });
    $("#myConfirm-btn").click(function (event) {
        $.myConfirm({
            message: "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
            trueCallback: function () {
                //确认时的回调函数
                console.log("True");
            },
            falseCallback: function () {
                //取消时的回调函数
                console.log("False");
            },
        });
    });
    $("#jsAlert-btn").myTip({
        message:"提示框",
        width:300,
        direction:"right"
    })
});