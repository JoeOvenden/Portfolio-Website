from django import forms
from .models import *

class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["profile_picture", "bio", "phone_number"]
        widgets = {
            "bio": forms.Textarea(attrs={"cols": 60, "rows": 10}),
        }


class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ["title", "description", "date", "time", "distance", "duration", 
                  "pace", "route"]
        widgets = {
            "description": forms.Textarea(attrs={"cols": 60, "rows": 6}),
            "date": forms.SelectDateWidget(),
            "time": forms.TimeInput(attrs={'type': 'time'}, format='%H:%M'),
            "duration": forms.TimeInput(attrs={'type': 'time'}, format='%H:%M'),
            "pace": forms.TimeInput(attrs={'type': 'time'}, format='%M:%S')
        }
        labels = {
            "distance": "Distance (km)",
            "duration": "Duration (hh:mm)",
            "pace": "Pace per km"
        }
