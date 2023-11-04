from django import forms
from .models import *

class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["profile_picture", "bio", "phone_number"]
        widgets = {
            "bio": forms.Textarea(attrs={"cols": 60, "rows": 10}),
        }