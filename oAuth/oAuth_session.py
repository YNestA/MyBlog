# -*- coding:utf-8 -*-

keys=("access_token","uid","name","head_img","profile_url")

def set_base_auth_session(request,auth_dict,age):
    for key in keys:
        if auth_dict.get(key,None):
            request.session[key]=auth_dict[key]
    request.session.set_expiry(age)

def del_base_auth_session(request):
    for key in keys:
        del request.session[key]

def get_base_auth_session(request):
    return {
        "access_token":request.session.get("access_token",None),
        "uid" :request.session.get("uid", None),
        "weibo_user_name": request.session.get("name", None),
        "head_img" : request.session.get("head_img", None),
        "profile_url":request.session.get("profile_url",None),
    }