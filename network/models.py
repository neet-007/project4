from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Keep track of every users followers and following
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)

# Making a model to handle the functionalty of posting
class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    user_name = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username', default=None, related_name='user_name')
    content_post = models.TextField(default=None)
    time_post = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"user:{self.user} content:{self.content_post} time:{self.time_post} likes:{self.likes}"

# Making a model to handle the funcionality of following
class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_want_f")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    follow_status = models.BooleanField(User, default=False)

    def __str__(self):
        return f"user:{self.user} following:{self.following.username} follow status:{self.follow_status}"
    
# Making a model to handle the funcionality of unfollowing
class Unfollow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_want_nf")
    unfollow = models.ForeignKey(User, on_delete=models.CASCADE, related_name="unfollow")

    def __str__(self):
        return f"user:{self.user} unfollowed:{self.unfollow.username}"
 
 # Making a model to track likes
class Likes(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="likes", default=None)
    post = models.ForeignKey(Posts,on_delete=models.CASCADE, related_name="like", default=None)

# Making a model to track unlikes
class Unlike(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE, related_name="unlike", default=None)
    post = models.ForeignKey(Posts,on_delete=models.CASCADE, related_name="unlike", default=None)

    def __str__(self):
        return f"user:{self.user.username} unliked post:{self.post.pk}"

# Making a model to add comments to posts
class Comments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comment")
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="comment_post",)
    user_name = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username', default=None, related_name='user_name_commnet')
    content_post = models.TextField(default=None)
    time_post = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    
    def __str__(self):
        return f"user:{self.user_name} comment of:{self.content_post} at post:{self.post}"
