# Generated by Django 3.1.6 on 2022-10-27 14:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0002_auto_20221026_0824'),
    ]

    operations = [
        migrations.CreateModel(
            name='FollowerModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('true_friends', models.BooleanField(default=False)),
                ('followedAuthor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followedAuthor', to=settings.AUTH_USER_MODEL)),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'followerList',
            },
        ),
        migrations.DeleteModel(
            name='FriendModel',
        ),
    ]
