import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.core.paginator import Paginator

from .models import User, Posts, Follow ,Likes, Unfollow, Unlike, Comments
from .forms import new_post_form, reply_post_form


def index(request):
    # To render the form in the html
    form = new_post_form()
    reply = reply_post_form
    return render(request, "network/index.html",{
        "form":form,
         "reply":reply
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
@csrf_exempt
@login_required
def new_post(request):
    # New post only available via post method
    if request.method != "POST":
        return JsonResponse({'error':"POST method required"}, status=400)
    
    # Check the post
    data = json.loads(request.body)
    print(data)
    post = data.get("form","")
    print(data)
    user = request.user
    
    #check the form
    """if (post.is_valid()):
        print(data)
        post_clean = post.cleaned_data["post"]
        print(data)"""

    #add post
    new_post = Posts.objects.create(user=user, content_post=post, user_name=user)
    new_post.save()

    return JsonResponse({"message":"post added succesfully"}, status=201)
    
    # To get the info out of the form
    """if request.method == "POST":
        user = request.user
        get_form = new_post_form(request.POST)
        if (get_form.is_valid()):
            new_post = get_form.cleaned_data["post"]
            
            # Make new post object
            post = Posts.objects.create(user=user, content_post=new_post)
            post.save()"""

# Function to send the post to the front-end
@csrf_exempt
def show_posts(requset):
    # Load all posts
    posts = Posts.objects.all().order_by('-time_post')

    # Make paginator
    paginator = Paginator(posts, 10)
    page_obj = paginator.get_page(1)
    # Prepare the json files
    serialized_data = serialize('json', posts)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False, status=201)

# Function to show replys
def show_reply(request, post_id):
    # Load all replys
    post = Posts.objects.filter(id=post_id)[0]
    replys = Comments.objects.filter(post=post)

    # Prepare the json files
    serialized_data = serialize('json', replys)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False, status=201)

# Function to sned the user-info to the front-end    
def show_user(requser, id):
    # Get the user
    user = User.objects.filter(id=id)
    print(user)

    # Prepare the json files
    serialized_data = serialize('json', user)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False)

# Function to add likes
@csrf_exempt
def add_like(request, id):
    user = request.user
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("likes") == 'like':
            # Get the user and the post to like
            post = Posts.objects.filter(id=id)[0]
    
            # Calculate the likes and add 1
            num_likes = post.likes

            # Update post
            post.likes = (num_likes + 1)
            post.save()

            #Keep track of likse
            like_track = Likes.objects.create(user=user, post=post)
            like_track.save()
            return HttpResponse(status=204)


        # Add the like
        elif data.get("likes") == 'like_r':
                # Get the reply
                reply = Comments.objects.filter(id=id)[0]

                # Calculate num of likes
                num_likes_r = reply.likes

                # Update post
                reply.likes = (num_likes_r + 1)
                reply.save()

                return HttpResponse(status=204)

# Function to update like count in inteface
def update_like(request, id):
    # Get the post
    post = Posts.objects.filter(id=id)

    # Prepare the json files
    serialized_data = serialize('json', post)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False)

# Function to update like count in inteface
def update_like_r(request, id):
    # Get the post
    reply = Comments.objects.filter(id=id)

    # Prepare the json files
    serialized_data = serialize('json', reply)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False)

@csrf_exempt
# Function to handle the following 
def follow(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        if data.get("add") == 'follow':
            # Get the user and the user to follow
            user = request.user
            user_follow = User.objects.filter(id=id)[0]

            #check if is already followed
            if Follow.objects.filter(user=user, following=user_follow).exists():
                check = Follow.objects.filter(user=user, following=user_follow)[0]
                if check.follow_status == True:
                    return HttpResponse(status=204)
            
            # Update the follow model
            if Follow.objects.filter(user=user, following=user_follow).exists():
                check = Follow.objects.filter(user=user, following=user_follow)[0]
                check.follow_status = True
                check.save()
            else:
                follow = Follow.objects.create(user=user, following=user_follow, follow_status=True)
                follow.save()

            # Update followers and following counts for each user
            user.following_count = (user.following_count + 1)
            user_follow.followers_count = (user_follow.followers_count + 1)
            user_follow.save()
            user.save()
            
            return HttpResponse(status=204)
        elif data.get('add') == 'unfollow':
            # Get the user and the user to unfollow
            user = request.user
            user_follow = User.objects.filter(id=id)[0]

            #check if is already unfollowed
            if Unfollow.objects.filter(user=user, unfollow=user_follow).exists():
                check = Follow.objects.filter(user=user, following=user_follow)[0]
                if check.follow_status == False:

                    return HttpResponse(status=204)
            
            # Update the unfollow model
            unfollow = Unfollow.objects.create(user=user, unfollow=user_follow)
            unfollow.save()
            follow_b = Follow.objects.filter(user=user, following=user_follow)[0]
            follow_b.follow_status = False
            follow_b.save()

            # Update followers and following counts for each user
            user.following_count = (user.following_count - 1)
            user.save()
            user_follow.followers_count = (user_follow.followers_count - 1)
            user_follow.save()
            return HttpResponse(status=204)
    else:
        return JsonResponse({"error": "PUT request required."}, status=400)

# Function to show the following only posts
def show_following(request):
    # Get the user following
    user = request.user
    following_get_query = Follow.objects.filter(user=user)
    posts = []
    # Load the last 20 posts
    for i in range(len(following_get_query)):
        count = Posts.objects.filter(user=following_get_query[i].following).count()
        for j in range(count):
            post = Posts.objects.filter(user=following_get_query[i].following).order_by('-time_post')[(j)]
            if len(posts) == 10:
                break
            posts.append(post)
    # Prepare the json files
    print(posts)
    serialized_data = serialize('json', posts)
    serialized_data = json.loads(serialized_data)
    posts.clear()
    return JsonResponse(serialized_data, safe=False, status=201)

@csrf_exempt
# Function to remove likes
def remove_like(request, id):
    user = request.user
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("likes") == 'unlike':
            # Get the user and the post to like
            post = Posts.objects.filter(id=id)[0]
            
            # Calculate the likes and sub 1
            num_likes = post.likes

            # Update post
            post.likes = (num_likes - 1)
            post.save()

            #Keep track of likse
            like_track = Unlike.objects.create(user=user, post=post)
            like_track.save()
            return HttpResponse(status=204)

        # Add the like
        elif data.get("likes") == 'unlike_r':
            # Get the reply
            reply = Comments.objects.filter(id=id)[0]

            #calculate num of likes
            num_likes_r = reply.likes

            #update reply
            reply.likes = (num_likes_r - 1)
            reply.save()

            return HttpResponse(status=204)

            

# Function to load profile posts
def profile_posts_load(request ,id):
    # Get the user from id 
    user = User.objects.filter(id=id)[0]
    # Load the last 20 posts
    posts = Posts.objects.filter(user=user).order_by('-time_post')[:10]

    # Prepare the json files
    serialized_data = serialize('json', posts)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False, status=201)

# Check user
def user_auth(request):
    user_id= (request.user).id
    user = User.objects.filter(id=user_id)

    # Prepare the json files
    serialized_data = serialize('json', user)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False, status=201)

#Check follow status
def check_follow(reqeust, id):
    user_follow = User.objects.filter(id=id)[0]
    follow = Follow.objects.filter(user=(reqeust.user), following=user_follow)

    # Prepare the json files
    serialized_data = serialize('json', follow)
    serialized_data = json.loads(serialized_data)
    return JsonResponse(serialized_data, safe=False, status=201)
"""# Check if post is already liked
    if Likes.objects.filter(user=user, post=post).exists():
        return HttpResponse(status=204)"""

@csrf_exempt
@login_required
# Function to handle replys
def reply(request):
    # New post only available via post method
    if request.method != "POST":
        return JsonResponse({'error':"POST method required"}, status=400)
    
    user = request.user
    # Check the post
    data = json.loads(request.body)
    reply = data.get("reply","")
    post_id = data.get("post_id","")
    user = request.user
    post = Posts.objects.filter(id=post_id)[0]
    #add reply
    reply = Comments.objects.create(user=user, user_name=user, post=post, content_post=reply)
    reply.save()

    return JsonResponse({"message":"reply added succesfully"}, status=201) 