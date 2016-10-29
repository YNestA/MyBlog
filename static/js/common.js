/**
 * Created by yang on 16-3-21.
 */
var MyEventUtil={
    
    addHandler: function(element,type,handler){
        if(element.addEventListener && type!="submit"){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on"+type,handler);
        }else{
            element["on"+type]=handler;
        }
    },

    removeHandler: function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }else{
            element["on"+type]=null;
        }
    },

    getEvent: function(event){
        return event?event:windows.event;
    },

    getTarget:function(event){
        return event.target || event.srcElement;
    },

    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation;
        }else{
            event.cancelBubble=true;
        }
    },
    getButton: function(event){
        if(doucment.implementation.hasFeature("MouseEvents","2.0")){
            return event.button;//0 is left,1 is center,2 is right;
        }else{
            switch(event.button){
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 4:
                    return 1;
                case 2:
                case 6:
                    return 2;
            }
        }
    },

    getCharCode: function(){
        if(typeof event.charCode=="number"){
            return event.charCode;
        }else{
            return event.keyCode;
        }
    },


};

function createXHR(){
    if (typeof XMLHttpRequest!="undefined"){
        return new XMLHttpRequest();
    }else if(typeof  ActiveXObject!="undefined"){
        if(typeof arguments.callee.activeXString!="string"){
            var versions=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],
                i,
                len;
            for(i=0,len=versions.length;i<len;i++){
                try{
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString=versions;
                    break;
                }catch (ex){
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString)
    }else{
        throw new Error("No XHR object available");
    }
}

function addURLParam(url,name,value){
    if(url.indexOf("?")==-1){
        url+="?";
    }else{
        url+="&"
    }
    url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
    return url;
}

//The funs homepage needed

function search(){
    var searchInfo=$("#search-input").val(),
        searchType=$("#search-input").attr("name").slice(7);
    if (searchInfo){
        var searchShade=$("#search-shade");
        searchShade.show(); //显示透明遮罩防止用户重复点击
        $("#search-input").unbind("keypress",keySearch);
        $.ajax({
            url:"/home/search/",
            data:{search_type:searchType,search_info:searchInfo},
            success:function(data){
                if(data){
                    var center=document.getElementById("center");
                    center.innerHTML=data;
                }
            },
            complete:function () {
                searchShade.hide(); //隐藏透明遮罩
                $("#search-input").bind("keypress",keySearch);
            }

        });
        if($("footer").css("display")=="none"){
            $("footer").css({"display":"inline"});
        }
    }

};

function keySearch(event) {
    if(event.keyCode==13){
        search();
    }
}

function headerDrop(event) {
    event.stopPropagation();
    var $headerDropList=$("#header_drop_list");
    $headerDropList.slideToggle(200).click(function (event) {
        event.stopPropagation();
    });
    $("body,html").click(function (event) {
        $headerDropList.slideUp(200);
        $("body,html").unbind(arguments.callee);
    })
}

$(document).ready(function(){
    //MyEventUtil.addHandler(searchBtn,"click",search);
    $('#search-button').click(search);
    if($("#go-top").length) {
        $("#go-top").click(function () {
            $('body,html').animate({scrollTop: $("header").offset().top}, 500, "linear")
        });
    }
    $("#search-input").keypress(keySearch);
    $("img").error(function () {
        $(this).attr("src","/static/image/common/default.jpg");
    });
    $("button,a").focus(function () {
       $(this).blur();
    });
    $("#header_drop_btn").click(headerDrop)
});










