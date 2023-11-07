from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
import datetime


class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True)
    bio = models.CharField(max_length=800, blank=True)
    phone_number = PhoneNumberField(blank=True)
    account_creation_date = models.DateField(auto_now_add=True)
    follower_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    total_km_run = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    """
    Total Km run
    Longest distance

    """


class Follow(models.Model):
    user_following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followings")
    user_followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")


class Event(models.Model):
    organiser = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="events_organised", null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date = models.DateField(default=datetime.date.today)
    time = models.TimeField(default=datetime.datetime.now().time())
    description = models.CharField(max_length=400)
    # start_point = gis_models.PointField()
    # end_point = gis_models.PointField()
    route = models.FileField(upload_to='gpx_files', blank=True)
"""
FROM NETWORK

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.CharField(max_length=400)
    timestamp = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.timestamp} {self.user}: {self.text}"


class Rating(models.Model):
    RATING_CHOICES = (
        (-1, '-1'),
        (1, '1')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="ratings")
    rating = models.IntegerField(choices=RATING_CHOICES)


class Follow(models.Model):
    user_following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followings")
    user_followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
"""