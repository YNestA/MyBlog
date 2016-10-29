# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0008_auto_20161029_1640'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CommentIP',
        ),
    ]
