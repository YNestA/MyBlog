# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_passage_view_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='passage_id',
        ),
        migrations.AddField(
            model_name='comment',
            name='head_img',
            field=models.CharField(default=b'/static/image/common/user.jpg', max_length=500),
        ),
        migrations.AlterField(
            model_name='passage',
            name='comments',
            field=models.ManyToManyField(related_name='as_comment_for_passage', to='blog.Comment', blank=True),
        ),
    ]
