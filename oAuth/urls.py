# -*- coding:utf-8 -*-
from django.conf.urls import patterns,url
from oAuth import views

urlpatterns=patterns('',
    url(r'^oAuth_redirect/$',views.oAuth_redirect),
    url(r'^sign_out/$',views.oAuth_sign_out),
)