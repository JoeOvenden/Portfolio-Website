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
        fields = ["date", "time", "description", "route"]
        widgets = {
            "description": forms.Textarea(attrs={"cols": 60, "rows": 6}),
            "date": forms.SelectDateWidget(),
            "time": forms.TimeInput(attrs={'type': 'time'}, format='%H:%M'),
        }