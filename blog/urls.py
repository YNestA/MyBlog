# -*- coding:utf-8 -*-
from django.conf.urls import patterns,url
from blog import views


urlpatterns=patterns('',
    url(r'^$',views.homepage,{'page':1}),
    url(r'^page(\d+)',views.homepage),
    url(r'^thought/page(\d+)/$',views.passages,{'tag':'thought'}),
    url(r'^note/page(\d+)/$',views.passages,{'tag':'note'}),
    url(r'^thought/(?P<passage_id>\d+)/$',views.passage,{'tag':'thought'}),
    url(r'^note/(?P<passage_id>\d+)/$',views.passage,{'tag':'note'}),
    url(r'^books/$',views.books),
    url(r'^aboutme/$',views.about_me),
    url(r'^search/',views.search),
)