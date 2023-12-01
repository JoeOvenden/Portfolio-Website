from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "profile_picture", "bio")

class FollowAdmin(admin.ModelAdmin):
    list_display = ("user_following", "user_followed")

class EventAdmin(admin.ModelAdmin):
    list_display = ("organiser", "date", "time", "description")

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Event, EventAdmin)