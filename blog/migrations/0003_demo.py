# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_requestrecord'),
    ]

    operations = [
        migrations.CreateModel(
            name='Demo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('demo_id', models.CharField(unique=True, max_length=20)),
                ('demo_template', models.CharField(max_length=200)),
            ],
        ),
    ]
