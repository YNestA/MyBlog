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
        $.myAlert("评论成功");
        getCommentsByPage(1,$("#comments_next_btn"),$("#comments_pager"));
    }
    document.getElementById("submit-button").disabled = true; //禁用按钮
    $.ajax({
        type:"POST",
        url:$("#comment-form").attr("action"),
        data:JSON.stringify(jsonObj),
        success:successCallback,
        error:function (XMLHttpRequest,textStatus,errorThrown) {
            $.myAlert("评论失败");
        },
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
function getCommentsByPage(futurePage,$btn,$commentsPager) {
    $.ajax({
        type:"POST",
        url:"/home/passage_more_comments/",
        data:{
            passage_id:$("article.post").attr("data-id"),
            page:futurePage,
        },
        success:function (data,textStatus) {
            var jsonDict=JSON.parse(data);
            console.log(data);
            if(jsonDict["res"]==="success"){
                var page=jsonDict["page"],
                    whole_page=jsonDict["whole_page"],
                    $prevBtn=$("#comments_prev_btn"),
                    $nextBtn=$("#comments_next_btn");
                $commentsPager.attr("data-page",page);
                $prevBtn.css("visibility","visible");
                $nextBtn.css("visibility","visible");
                if(page==="1"){
                    $prevBtn.css("visibility","hidden");
                }
                if(page===whole_page){
                    $nextBtn.css("visibility","hidden");
                }
                var comments=jsonDict["comments"],
                    commentsHtml="";
                for(var i=0;i<comments.length;i++){
                    var comment=comments[i];
                    commentsHtml+="<li ><div class='comment-head'><img src='";
                    commentsHtml+=comment["head"];
                    commentsHtml+="'></div><div class='comment-body'><span class='comment-name'>";
                    commentsHtml+=comment["name"];
                    commentsHtml+="</span>";
                    for(var j=0;j<comment["content"].length;j++){
                        commentsHtml+="<p class='comment-content'>"+comment["content"][j]+"</p>";
                    };
                    commentsHtml+="<div class='comment-info'><time>";
                    commentsHtml+=comment["time"];
                    commentsHtml+="</time></div></div><div style='clear: both'></div></li>";
                }
                $("#comments_ul").empty().append($(commentsHtml));
                $("html,body").animate({scrollTop:parseInt($("#comments").offset().top)-100});
            }
        },
        beforeSend:function (XMLHttpRequest) {
            if($btn.data("in-request")==="True") {
                return false;
            }else {
                $btn.data("in-request", "True");
            }
        },
        complete:function (XMLHttpRequest,textStatus) {
            $btn.data("in-request","False");
        },
    });
}
function next_prev_comments(event) {
    var $target=$(event.target),
        $commentsPager=$("#comments_pager"),
        currentPage=parseInt($commentsPager.attr("data-page")),
        futurePage=$target.attr("id")==="comments_next_btn"?currentPage+1:currentPage-1;
    getCommentsByPage(futurePage,$target,$commentsPager);

}
$(document).ready(function () {
    var theForm=document.getElementById("comment-form");
    MyEventUtil.addHandler(theForm,"submit",doCommentForm);
    initCodeText();
    $("#comments_next_btn,#comments_prev_btn").click(next_prev_comments);
});
