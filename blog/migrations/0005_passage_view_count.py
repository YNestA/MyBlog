# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_delete_demo'),
    ]

    operations = [
        migrations.AddField(
            model_name='passage',
            name='view_count',
            field=models.IntegerField(default=1),
        ),
    ]
