# Generated by Django 4.1.2 on 2022-12-04 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0030_remove_commentmodel_url_id_commentmodel_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inboxobject',
            name='object',
            field=models.JSONField(blank=True, null=True),
        ),
    ]