# -*- coding:utf-8 -*-
from django.db import models
from datetime import datetime
from django.http import Http404
# Create your models here.

class Comment(models.Model):
    name=models.CharField(max_length=30)
    content=models.TextField(max_length=200)
    time=models.DateTimeField(default=datetime.now)
    passage_id=models.CharField(max_length=20,null=True)    #以防万一
    visable=models.BooleanField(default=True)

    def __unicode__(self):
        return self.content

    def save_comment(self,comment_info,passage_id):
        new_comment=self.__class__(name=comment_info['nickname'],content=comment_info['content'],passage_id=passage_id)
        new_comment.save()
        Passage.objects.get(passage_id=passage_id).comments.add(new_comment)
        return new_comment

class Passage(models.Model):
    title=models.CharField(max_length=50)
    summary=models.TextField(max_length=200)
    content=models.TextField()
    tag=models.CharField(max_length=50)
    time=models.DateTimeField(default=datetime.now)
    comments=models.ManyToManyField(Comment,blank=True)
    visable=models.BooleanField(default=True)
    passage_id=models.CharField(max_length=20,unique=True)
    view_count=models.IntegerField(default=1)

    def __unicode__(self):
        return self.title

    def get_passages_page(self,page,tag=None):
        try:
            if tag:perpage,passages=5,self.__class__.objects.filter(visable=True,tag=tag).order_by("-time")
            else:perpage,passages=5,self.__class__.objects.filter(visable=True).order_by("-time")
        except Exception:
            raise Http404
        if len(passages)%perpage==0 and len(passages)!=0:
            max_page=len(passages)/perpage
        else:
            max_page=len(passages)/perpage+1
        if page<1 or page>max_page:
            raise Http404
        if page==1:
            page,pre,next=1,False,2
        elif page==max_page:
            page,pre,next=max_page,max_page-1,False
        else:
            pre,next=page-1,page+1
        if max_page==1:
            pre,next=False,False
        return {'passages':passages[perpage*(page-1):perpage*(page)],'pre':pre,'next':next}

    def get_passage_id(self,passage_id,comments_per=10):
        try:
            passage_need=self.__class__.objects.get(passage_id=passage_id)
            #comment_need=passage_need.comments.filter(passage_id=passage_id,visable=True).order_by("-time")
            comment_need=passage_need.comments.filter(visable=True).order_by("-time")
        except Exception:
            raise Http404
        return (passage_need,comment_need[:comments_per],len(comment_need)>comments_per)

    def get_passages_search(self,search_info):
        try:
            res,passages=[],self.__class__.objects.filter(visable=True).order_by("-time")
        except Exception:
            raise  Http404
        for index in range(0,len(passages)):
            if passages[index].title.find(search_info)!=-1:
                res.append(passages[index])
        return res

    def get_comments(self,page,comments_per=10):
        page=int(page)
        the_comments=self.comments.all().order_by("-time")
        length=len(the_comments)
        whole_page=length/comments_per if length%comments_per==0 else length/comments_per+1
        if page<1:page=1
        if page>whole_page:page=whole_page
        return (the_comments[(page-1)*comments_per:page*comments_per],page,whole_page)

class Book(models.Model):
    name=models.CharField(max_length=30)
    time=models.DateTimeField(default=datetime.now)
    image=models.CharField(max_length=200)
    my_comment=models.TextField(max_length=400)
    douban_url=models.CharField(max_length=200)

    def __unicode__(self):
        return self.name

    def get_books(self):
        books=self.__class__.objects.all()
        return books

    def get_books_search(self,search_info):
        try:
            res,books=[],self.__class__.objects.all().order_by("-time")
        except Exception:
            raise  Http404
        return filter(lambda x:True if x.name.find(search_info)!=-1 else False,books)

class RequestRecord(models.Model):
    path=models.CharField(max_length=150)
    time = models.DateTimeField(default=datetime.now)
    addr=models.CharField(max_length=50)
    userAgent=models.CharField(max_length=200)
    refere=models.CharField(max_length=200)

    def __unicode__(self):
        return " | ".join([self.addr,self.time.strftime('%c'),self.userAgent])







