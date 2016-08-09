# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequestRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('path', models.CharField(max_length=150)),
                ('time', models.DateTimeField(default=datetime.datetime.now)),
                ('addr', models.CharField(max_length=50)),
                ('userAgent', models.CharField(max_length=200)),
                ('refere', models.CharField(max_length=200)),
            ],
        ),
    ]
