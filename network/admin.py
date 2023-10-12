from django.contrib import admin
from .models import User, Posts, Follow, Likes, Unfollow, Unlike, Comments
# Register your models here.
admin.site.register(User)
admin.site.register(Posts)
admin.site.register(Follow)
admin.site.register(Likes)
admin.site.register(Unfollow)
admin.site.register(Unlike)
admin.site.register(Comments)