# -*- coding:utf-8 -*-
from django.shortcuts import render_to_response,HttpResponseRedirect
from django.template import RequestContext
from form import *
from django.http import HttpResponse
import json
from tools import *
import models

def homepage(request,page):
    #return passages(request,page,None)
    return render_to_response("homepage.html")

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

@recorder
def passages(request,page,tag):
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
    return render_to_response('passages.html',{ 'title':tags.get(tag,'YNestA'),
                                                'passages':passages,
                                               'next':res['next'],
                                                'pre':res['pre']},
                                                context_instance=RequestContext(request))
@recorder
def passage(request,passage_id,tag):
    if request.method=='POST':
        req=json.loads(request.body)
        comment_info={
            'nickname':req['nickname'],
            'content':req['content'],
        }
        comment_model=models.Comment()
        theComment=comment_model.save_comment(comment_info,passage_id)
        theJson=json.dumps({'head':'/static/image/common/user.jpg',
                    'name':theComment.name,
                   'content':theComment.content.split('\r\n'),
                   'time':theComment.time,
                },cls=DatetimeEncoder)
        return HttpResponse(theJson)


    tags={'note':'笔记','thought':'杂谈'}
    passage_model=models.Passage()
    passage_need,comments_need=passage_model.get_passage_id(passage_id)
    passage_need.view_count += 1
    passage_need.save()
    passage_res={'title':passage_need.title,
                 'content':passage_need.content.split('\r\n'),
                 'time':passage_need.time,
                 'tag':tags[passage_need.tag],
                 'tag_url':'/home/%s/page1'%passage_need.tag,
                 'view_count':passage_need.view_count,
                }
    comments_res=[{'head':'/static/image/common/user.jpg',
                   'name':x.name,
                   'content':x.content.split('\r\n'),
                   'time':x.time,
                  }
                  for x in comments_need]
    form=CommentForm()
    return render_to_response("passage.html",{'passage':passage_res,
                                              'comments':comments_res,
                                              'form':form,
                                              },context_instance=RequestContext(request))
@recorder
def books(request):
    book_model=models.Book()
    book_need=book_model.get_books()
    book_res=build_book_res(book_need)
    return render_to_response('books.html',{'books':book_res},context_instance=RequestContext(request))

def about_me(request):
    return  passage(request,'000000',None)
