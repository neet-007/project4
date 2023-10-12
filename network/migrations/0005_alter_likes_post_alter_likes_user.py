# Generated by Django 4.2.5 on 2023-10-09 16:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='likes',
            name='post',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='like', to='network.posts'),
        ),
        migrations.AlterField(
            model_name='likes',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
    ]
