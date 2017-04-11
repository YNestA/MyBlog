/**
 * Created by yang on 16-3-24.
 */
//处理文章中代码框的代码
function initCodeText() {
    var $codetext=$("textarea.my-code");
    $codetext.each(function () {
        var code=$(this).text().trim().split("</p><p class='my-p'>");
        $(this).text(code.slice(1,code.length-1).join("\r\n")).css("height",this.scrollHeight);
    });
}
function buildCommentLi(comment) {
    var commentHtml="<li ><div class='comment-head'><a target='_blank' href='";
        commentHtml+=comment["profile_url"];
        commentHtml+="'><img src='";
        commentHtml+=comment["head_img"];
        commentHtml+="'></a></div><div class='comment-body'><span class='comment-name'><a target='_blank' href='";
        commentHtml+=comment["profile_url"]+"'>";
        commentHtml+=comment["name"];
        commentHtml+="</a></span>";
        for(var j=0;j<comment["content"].length;j++){
            commentHtml+="<p class='comment-content'>"+comment["content"][j]+"</p>";
        };
        commentHtml+="<div class='comment-info'><time>";
        commentHtml+=comment["time"];
        commentHtml+="</time></div></div><div style='clear: both'></div></li>";
    return commentHtml;
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
                    commentsHtml+=buildCommentLi(comment);
                }
                $("#comments_ul").empty().append($(commentsHtml));
                $("html,body").animate({scrollTop:parseInt($("#comments").offset().top)-100});
                $("#comment_form_left img,div.comment-head img").hover(function () {
                    $(this).removeClass("head_left_scroll").addClass("head_right_scroll");
                },function () {
                    $(this).removeClass("head_right_scroll").addClass("head_left_scroll");
                });
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

function submitComment(event) {
    var $commentTextarea=$("#comment_form textarea"),
        content=$commentTextarea.val(),
        name=$("#comment_user_name a").text(),
        profile_url=$("#comment_user_name a").attr("href"),
        head_img=$("#comment_form_left img").attr("src"),
        passage_id=$("article.post").attr("data-id"),
        $submitBtn=$(this);
    $.ajax({
        type:"POST",
        url:"/home/add_comment/",
        data:{
            "name":name,
            "profile_url":profile_url,
            "head_img":head_img,
            "content":content,
            "passage_id":passage_id,
        },
        beforeSend:function (XMLHttpRequest) {
            if(!content){
                $.myAlert("评论不能为空=_=")
                return false;
            }
            $submitBtn.attr("disabled",true);
        },
        success:function (data,textStatus) {
            var jsonDict=JSON.parse(data);
            if(jsonDict["res"]==="success"){
                $commentTextarea.val("");
                var comment={
                    "name":name,
                    "head_img":head_img,
                    "content":content.split("\r\n"),
                    "profile_url":profile_url,
                    "time":jsonDict["time"],
                }
                $("#comments_ul").prepend(buildCommentLi(comment))
                getCommentsByPage(1,$("#comments_next_btn"),$("#comments_pager"))
                $.myAlert("评论成功=_=");
            }else if(jsonDict["reason"]==="too many"){
                $.myAlert("评论太频繁=_=");
            }else {
                    $.myAlert("评论失败=_=");
            }
        },
        complete:function (XMLHttpRequest,textStatus) {
            $submitBtn.attr("disabled",false);
        },
    });
}
$(document).ready(function () {
    initCodeText();
    $("#comments_next_btn,#comments_prev_btn").click(next_prev_comments);
    $("#comment_submit_btn").click(submitComment);
    $("#clear_btn").click(function (event) {
        $("#comment_form textarea").val("");
    });
    $("#comment_form_left img,div.comment-head img").hover(function () {
        $(this).removeClass("head_left_scroll").addClass("head_right_scroll");
    },function () {
        $(this).removeClass("head_right_scroll").addClass("head_left_scroll");
    });

    $("#center img.lazy").imgScrollLoad();
});
