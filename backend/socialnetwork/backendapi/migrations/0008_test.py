# Generated by Django 3.1.6 on 2022-11-25 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backendapi', '0007_node'),
    ]

    operations = [
        migrations.CreateModel(
            name='test',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200)),
                ('password', models.CharField(max_length=200)),
                ('host', models.CharField(max_length=200)),
            ],
            options={
                'db_table': 'test',
            },
        ),
    ]