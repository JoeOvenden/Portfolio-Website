from django import forms
from .models import *
from datetime import date

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


class EventFilterForm(forms.Form):
    today = date.today()
    initial_end_date = today.replace(month=(today.month % 12) + 1)
    start_date = forms.DateField(widget=forms.SelectDateWidget, initial=today)
    end_date = forms.DateField(widget=forms.SelectDateWidget, initial=initial_end_date)
    min_distance = forms.DecimalField(required=False)
    max_distance = forms.DecimalField(required=False)

    def clean_min_distance(self):
        data = self.cleaned_data['min_distance']
        if data is not None and data < 0:
            raise forms.ValidationError("Please enter a non-negative number.")
        return data
    
    def clean_max_distance(self):
        data = self.cleaned_data['max_distance']
        # check max distance is non negative
        if data is not None and data < 0:
            raise forms.ValidationError("Please enter a non-negative number.")
        return data
    
    def clean_start_date(self):
        data = self.cleaned_data['start_date']
        # Check start date is not before today
        if data is not None and data < date.today():
            raise forms.ValidationError("Start date must be from today onwards.")
        return data 
    
    def clean_end_date(self):
        data = self.cleaned_data['end_date']
        # Check start date is not before today
        if data is not None and data < date.today():
            raise forms.ValidationError("End date must be from today onwards.")
        return data 