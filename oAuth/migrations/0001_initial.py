# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WeiboLoginRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uid', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=200)),
                ('profile_url', models.CharField(max_length=500)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('head_img', models.CharField(max_length=500)),
            ],
        ),
    ]
