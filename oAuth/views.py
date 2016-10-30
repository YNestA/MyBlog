from django.shortcuts import render,render_to_response,HttpResponseRedirect
from django.template import RequestContext
from django.http import HttpResponse
import urllib,httplib
from oAuth_settings import *
import json
from oAuth_session import *
# Create your views here.


def oAuth_redirect(request):
    try:
        page_path=request.session.get("page_path","/home/")
        code=request.GET.get("code")
        if code:
            http_params=urllib.urlencode({
                "client_id":WEIBO_APP["app_key"],
                "client_secret":WEIBO_APP["app_secret"],
                "grant_type":"authorization_code",
                "code":code,
                "redirect_uri":WEIBO_APP["redirect_uri"],
            })
            f=urllib.urlopen(WEIBO_API["get_access_token_url"],http_params)
            info_dict=json.loads(f.read())
            access_token,uid=info_dict["access_token"],info_dict["uid"]
            http_params, get_user_show_url = urllib.urlencode({
                "access_token": access_token,
                "uid": uid,
            }), WEIBO_API["get_user_show_url"] + "?%s"
            f = urllib.urlopen(get_user_show_url % http_params)
            user_show = json.loads(f.read())
            set_base_auth_session(request, {
                "access_token": access_token,
                "uid": uid,
                "name": user_show["name"],
                "head_img":user_show["profile_image_url"],
                "profile_url":"https://weibo.com/"+user_show["profile_url"],
            },int(info_dict["expires_in"]))
            print user_show["profile_url"]
        return HttpResponseRedirect(page_path)
    except Exception as e:
        print e
        return HttpResponseRedirect(page_path)

def oAuth_sign_out(request):
    try:
        access_token,page_path=request.session.get("access_token",None),request.session.get("page_path","/home/")
        if access_token:
            http_params=urllib.urlencode({
                "access_token":access_token,
            })
            f=urllib.urlopen(WEIBO_API["sign_out_auth2"],http_params)
            res=json.loads(f.read())
            if res["result"]=="true":
                del_base_auth_session(request)
                return HttpResponseRedirect(page_path)
            else:
                return HttpResponseRedirect(request.path)
    except Exception as e:
        print e
        return HttpResponseRedirect(request.path)


