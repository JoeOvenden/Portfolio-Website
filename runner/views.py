import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import *
from .forms import *

def index(request):
    return render(request, "runner/index.html")

@csrf_exempt
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
            return render(request, "runner/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "runner/login.html")


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
            return render(request, "runner/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "runner/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "runner/register.html")


def profile(request, username):
    try:
        user = User.objects.get(username=username)
    
    except User.DoesNotExist:
        return render(request, "runner/404-profile.html")

    if request.user.is_anonymous or not user.followers.filter(user_following=request.user).exists():
        is_following = False
    else:
        is_following = True

    return render(request, "runner/profile.html", {
        "profile": user,
        "follower_count": user.follower_count,
        "following_count": user.following_count,
        "is_following": is_following
    })


@login_required
def edit_profile(request):
    user = User.objects.get(username=request.user)
    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect(f'profile/{request.user}')
    else:
        form = ProfileForm(instance=user)
    return render(request, "runner/edit_profile.html", {"form": form})


@csrf_exempt
@login_required
def follow(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        profile = data.get("profile_username")

        # Make sure the user to be followed exists
        if User.objects.filter(username=profile).exists() is False:
            return HttpResponse(400)    # Bad request
        
        # Make sure user is not trying to follow themselves
        profile_user = User.objects.get(username=profile)
        user = User.objects.get(username=request.user)
        if profile_user == request.user:
            return HttpResponse(400)    # Bad request
        
        # If following already exists then delete it
        try:
            following = profile_user.followers.get(user_following=request.user)
            following.delete()
            change = -1

        # Otherwise create the following
        except Follow.DoesNotExist:
            following = Follow(user_following=request.user, user_followed=profile_user)
            following.save()
            change = 1

        # Change the number of followers for the profile user and followings for the current user
        profile_user.follower_count += change
        user.following_count += change
        profile_user.save()
        user.save()
        return JsonResponse({'change': change})

        

@login_required(login_url='/login')
def following_page(request):
    followings = request.user.followings.all()                                  # Get all the following objects of the user
    users_followed = [following.user_followed for following in followings]      # Get all the user objects of the users followed
    posts = Post.objects.filter(user__in=users_followed)                        # Get all the posts from the users followed
    return render(request, "network/following.html", get_posts_data(request, posts))


def get_rating_value(post, user):
    # If user is not logged in then just return 0
    if user.is_anonymous:
        return 0

    # Returns how the user rated the post as -1/0/1. 0 indicates the user has not rated the post
    try:
        rating = post.ratings.get(user=user)
        return rating.rating

    except Rating.DoesNotExist:
        return 0