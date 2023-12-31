# Generated by Django 4.2.5 on 2023-10-10 12:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import network.models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_alter_likes_post_alter_likes_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Unfollow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('follow_status', models.BooleanField(default=True, verbose_name=network.models.User)),
                ('unfollow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='unfollow', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_want_nf', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
