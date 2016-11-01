# -*- coding:utf-8 -*-
from django.shortcuts import render_to_response,HttpResponseRedirect
from django.template import RequestContext
from form import *
from django.http import HttpResponse
import json
from tools import *
import models
from oAuth.oAuth_session import *
from blog_settings import *

@change_session_path
@recorder
def homepage(request,page):
    template_params={
    }
    set_weibo_user(request,template_params)
    #return passages(request,page,None)
    return render_to_response("homepage.html",template_params,context_instance=RequestContext(request))


@recorder
def search(request):
    if request.method=="GET":
        search_type=request.GET["search_type"]
        if search_type=="passage":
            return search_passage(request)
        elif search_type=="book":
            return search_book(request)
    return HttpResponse("")

def search_passage(request):
    tags={'note':'笔记','thought':'杂谈'}
    if request.method=="GET":
        search_info=request.GET["search_info"]
        if search_info:
            passage_model=models.Passage()
            res=passage_model.get_passages_search(search_info)
            passages=[{ 'url':'/home/%s/%s/'%(passage.tag,passage.passage_id),
                'title':passage.title,
                'summary':passage.summary.split('\r\n'),
                'time':passage.time,
                'tag_url':'/home/%s/page1'%passage.tag,
                'tag': tags[passage.tag],
                }
              for passage in res]
            return render_to_response("search.html",{'passages':passages,
                                                     },context_instance=RequestContext(request),)
    return HttpResponse("")

def search_book(request):
    if request.method=="GET":
        search_info=request.GET["search_info"]
        if search_info:
            book_model = models.Book()
            book_res=build_book_res(book_model.get_books_search(search_info))
            return render_to_response('booksCenter.html', {'books': book_res}, context_instance=RequestContext(request))
    return ""

@change_session_path
@recorder
def passages(request,page,tag):
    template_params={}
    set_weibo_user(request,template_params)
    tags={'note':'笔记','thought':'杂谈'}
    passage_model=models.Passage()
    res=passage_model.get_passages_page(int(page),tag=tag)
    passages=[{ 'url':'/home/%s/%s/'%(passage.tag,passage.passage_id),
                'title':passage.title,
                'summary':passage.summary.split('\r\n'),
                'time':passage.time,
                'tag_url':'/home/%s/page1'%passage.tag,
                'tag': tags[passage.tag],
                'view_count':passage.view_count,
                }
              for passage in res['passages']]
    if res['pre']:res['pre']='/home/%s/page%d'%(tag,res['pre'])
    if res['next']:res['next']='/home/%s/page%d'%(tag,res['next'])
    template_params['title']=tags.get(tag,'YNestA')
    template_params['passages']=passages
    template_params['next']=res['next']
    template_params['pre']=res['pre']
    return render_to_response('passages.html',template_params,context_instance=RequestContext(request))

@change_session_path
@recorder
def passage(request,passage_id,tag):
    template_params={}
    set_weibo_user(request,template_params)

    tags={'note':'笔记','thought':'杂谈'}
    passage_model=models.Passage()
    passage_need,comments_need,if_next_comments=passage_model.get_passage_id(passage_id)
    passage_need.view_count += 1
    passage_need.save()
    passage_res={'title':passage_need.title,
                 'content':passage_need.content.split('\r\n'),
                 'time':passage_need.time,
                 'tag':tags[passage_need.tag],
                 'tag_url':'/home/%s/page1'%passage_need.tag,
                 'view_count':passage_need.view_count,
                 "id":passage_need.id,
                }
    comments_res=[{'head_img':x.head_img,
                   'name':x.name,
                   'content':x.content.split('\r\n'),
                   'time':x.time,
                   'profile_url':x.profile_url,
                  }
                  for x in comments_need]
    form=CommentForm()
    template_params['passage']=passage_res
    template_params['comments']=comments_res
    template_params['form']=form
    template_params['comments_pager']={
        "page": 1,
        "prev_comments": False,
        "next_comments": if_next_comments,
    }
    return render_to_response("passage.html",template_params,context_instance=RequestContext(request))

@change_session_path
@recorder
def books(request):
    template_params={}
    set_weibo_user(request,template_params)
    book_model=models.Book()
    book_need=book_model.get_books()
    book_res=build_book_res(book_need)
    template_params['books']=book_res
    return render_to_response('books.html',template_params,context_instance=RequestContext(request))

def about_me(request):
    return  passage(request,'000000',None)

@recorder
def more_comments(request):
    if request.method=="POST":
        try:
            page,passage_id=request.POST.get("page","1"),request.POST["passage_id"]
            the_passage=models.Passage.objects.get(id=passage_id)
            comments,page,whole_page=the_passage.get_comments(page)
            params={
                "res":"success",
                "comments":[{
                    "head_img":x.head_img,
                    "name":x.name,
                    "content":x.content.split("\r\n"),
                    "time":x.time.strftime("%Y-%m-%d %H:%M:%S"),
                    "profile_url":x.profile_url,
                } for x in comments],
                "page":str(page),
                "whole_page":str(whole_page),
            }
            return HttpResponse(json.dumps(params))
        except Exception as e:
            print e
            return HttpResponse(json.dumps({"res":"fail"}))

@recorder
def add_comment(request):
    try:
        IP,flag=request.META.get('REMOTE_ADDR'),True
        IPs=models.CommentIP.objects.filter(IP=IP)
        if IPs:
            the_ip=IPs[0]
            if the_ip.if_forbidden:
                return HttpResponse(json.dumps({'res':'fail'}))
            elif datetime_to_timestamp(datetime.now())-datetime_to_timestamp(the_ip.time)<COMMENT_PER_TIME:
                return HttpResponse(json.dumps({'res':"fail","reason":"too many"}))
            else:
                IPs[0].time = datetime.now()
                IPs[0].save()
        else:
            the_ip=models.CommentIP(IP=IP)
            the_ip.save()
        if request.method=="POST":
            comment_info={
                "name":request.POST["name"],
                "profile_url":request.POST["profile_url"],
                "content":request.POST["content"],
                "head_img":request.POST["head_img"],
            }
            weibo_user={
                "name":request.session.get("name",""),
                "profile_url": request.session.get("profile_url", ""),
                "head_img": request.session.get("head_img", ""),
            }
            for k in weibo_user:
                if comment_info[k]!=weibo_user[k]:
                    return HttpResponse(json.dumps({"res":"fail","reason":"not match"}))
            the_comment=models.Comment.save_comment(comment_info,request.POST["passage_id"])
            return HttpResponse(json.dumps({"res":"success","time":the_comment.time.strftime("%Y-%m-%d %H:%M:%S")}))
    except Exception as e:
        print e
        return HttpResponse(json.dumps({"res":"fail"}))