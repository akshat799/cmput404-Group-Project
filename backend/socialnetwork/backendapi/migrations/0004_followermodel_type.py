# Generated by Django 3.1.6 on 2022-10-27 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0003_auto_20221027_1441'),
    ]

    operations = [
        migrations.AddField(
            model_name='followermodel',
            name='type',
            field=models.CharField(default='follow', max_length=20),
        ),
    ]