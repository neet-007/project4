
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new post", views.new_post, name="new post"),
    path("show posts", views.show_posts, name="show posts"),
    path("show user/<int:id>", views.show_user, name="show user"),
    path("add like/<int:id>", views.add_like, name="add like"),
    path("update like/<int:id>", views.update_like, name="update like"),
    path("follow/<int:id>", views.follow, name="follow"),
    path('show following', views.show_following, name='show following'),
    path('remove like/<int:id>', views.remove_like, name ="remove like"),
    path('load profile posts/<int:id>', views.profile_posts_load, name='load profile posts'),
    path('user auth', views.user_auth, name="user auth"),
    path('check follow/<int:id>', views.check_follow, name="check follow"),
    path('reply', views.reply, name='reply'),
    path('show reply/<int:post_id>', views.show_reply, name="show_reply"),
    path('update like_r/<int:id>', views.update_like_r, name="update like_r")
]
