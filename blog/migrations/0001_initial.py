# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('image', models.CharField(max_length=200)),
                ('my_comment', models.TextField(max_length=400)),
                ('douban_url', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
                ('content', models.TextField(max_length=200)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('passage_id', models.CharField(max_length=20, null=True)),
                ('visable', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Passage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=50)),
                ('summary', models.TextField(max_length=200)),
                ('content', models.TextField()),
                ('tag', models.CharField(max_length=50)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('visable', models.BooleanField(default=True)),
                ('passage_id', models.CharField(unique=True, max_length=20)),
                ('comments', models.ManyToManyField(to='blog.Comment', blank=True)),
            ],
        ),
    ]
