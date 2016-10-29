# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_auto_20161026_1855'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='profile_url',
            field=models.CharField(default=b'#', max_length=500),
        ),
    ]
