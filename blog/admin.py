# -*- coding:utf-8 -*-
from django.contrib import admin
from models import *

# Register your models here.
admin.site.register(Passage)
admin.site.register(Comment)
admin.site.register(Book)
admin.site.register(RequestRecord)