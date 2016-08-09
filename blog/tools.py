# -×- coding:utf-8 -*-
from datetime import datetime,date
import models
import json

class DatetimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)

def build_book_res(books):
    book_res = [{'douban_url': x.douban_url,
                 'img': x.image,
                 'name': x.name,
                 'comment': x.my_comment.split('\r\n'),
                 }
                for x in books]


    for index in range(0, len(book_res)):
        if index % 9 in (6, 7, 8):
            book_res[index]['comment_class'] = 'Isay-right'
        else:
            book_res[index]['comment_class'] = 'Isay-left'
    return book_res


def recorder(func):
    def _view(request,*k,**kw):
        info=(request.path,
              request.META.get('REMOTE_ADDR','unknow'),
              request.META.get('HTTP_USER_AGENT','unknow'),
              request.META.get('HTTP_REFERE', 'unknow'),)
        new_record=models.RequestRecord(path=info[0],addr=info[1],userAgent=info[2],refere=info[3])
        new_record.save()
        return func(request,*k,**kw)
    return _view