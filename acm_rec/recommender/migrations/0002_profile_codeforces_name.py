# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-04-22 16:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recommender', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='codeforces_name',
            field=models.TextField(default=None),
        ),
    ]
