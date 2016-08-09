/**
 * Created by yang on 16-3-24.
 */
function dealComment() {
    var jsonObj={
        "nickname":$("#id_nickname").val(),
        "content":$("#id_content").val(),
    };
    var successCallback=function (json) {
        var newComment="<li ><div class=\"comment-head\"><img src="+json['head']+
            "></div><div class=\"comment-body\"><span class=\"comment-name\">"+json['name']+ "</span>";

        for(var i=0;i<json['content'].length;i++){
            newComment+="<p class=\"comment-content\">"+json['content'][i]+"</p>";
        }
        newComment+="<div class=\"comment-info\"><time>"+json['time']+"</time></div> </div> <div style=\"clear: both\"></div> </li>";
        $("#comments ul").prepend(newComment);
    }
    document.getElementById("submit-button").disabled = true; //禁用按钮
    $.ajax({
        type:"POST",
        url:$("#comment-form").attr("action"),
        data:JSON.stringify(jsonObj),
        success:successCallback,
        complete:function () {
            document.getElementById("submit-button").disabled = false; //启用按钮
        },
        dataType:"json",
    });

}

function doCommentForm(){
    var theForm=document.getElementById('comment-form'),
        formError=document.getElementById('form-error');
    var nickname=theForm.elements['nickname'],
        content=theForm.elements['content'];
    if(nickname.value.length==0 || content.value.length==0){
        formError.innerHTML="昵称或评论不能为空";
    }else if(nickname.value.length>20){
        formError.innerHTML="昵称不能超过20字";
    }else if(content.value.length>200){
        formError.innerHTML="评论不能超过200字";
    }else{
        formError.innerHTML="";
    }
    if(formError.innerHTML){
        return false;
    }else {
        dealComment(); //发送请求
        nickname.value="";
        content.value="";
    }
    return false;
};

//处理文章中代码框的代码
function initCodeText() {
    var $codetext=$("textarea.my-code");
    $codetext.each(function () {
        var code=$(this).text().trim().split("</p><p class='my-p'>");
        $(this).text(code.slice(1,code.length-1).join("\r\n")).css("height",this.scrollHeight);
    });
}

$(document).ready(function () {
    var theForm=document.getElementById("comment-form");
    MyEventUtil.addHandler(theForm,"submit",doCommentForm);
    initCodeText()
});
