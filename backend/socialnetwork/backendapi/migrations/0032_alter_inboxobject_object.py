# Generated by Django 4.1.2 on 2022-12-04 18:07

import backendapi.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0031_alter_inboxobject_object'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inboxobject',
            name='object',
            field=models.JSONField(blank=True, default=backendapi.models.default_list, null=True),
        ),
    ]
