# -*- coding:utf-8 -*-
__author__ = 'yang'
from django import forms

my_dafault_error_message={'required':'此项不能为空','invalid':'输入不合法'}

class CommentForm(forms.Form):
    nickname=forms.CharField(widget=forms.TextInput(attrs={'placeholder':'昵称'}),
                             max_length=20,
                             error_messages=my_dafault_error_message)
    content=forms.CharField(widget=forms.Textarea(attrs={'placeholder':'说点什么...'}),
                            max_length=200,
                            error_messages=my_dafault_error_message)