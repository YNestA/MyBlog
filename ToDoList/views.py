# -*- coding:utf-8 -*-
from django.shortcuts import render,render_to_response
from blog.tools import recorder

@recorder
def todo_list(request):
    return render_to_response("ToDoList/ToDoList.html")