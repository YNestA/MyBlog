# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_delete_commentip'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommentIP',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('IP', models.CharField(max_length=100)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('if_forbidden', models.BooleanField(default=False)),
            ],
        ),
    ]
