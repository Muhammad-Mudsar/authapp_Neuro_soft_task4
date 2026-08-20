
from django.forms.utils import ErrorList
from django.utils.safestring import mark_safe

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    username = forms.CharField(
        max_length=150,
        required=True,
        label='Username',
        widget=forms.TextInput(attrs={
            'class': 'input-premium',
            'placeholder': 'Ahmed',
            'id': 'signupUsername',
            'autocomplete': 'username',
        })
    )
    email = forms.EmailField(
        max_length=254,
        required=True,
        label='Email address',
        widget=forms.EmailInput(attrs={
            'class': 'input-premium',
            'placeholder': 'ahmed@company.com',
            'id': 'signupEmail',
            'autocomplete': 'email',
        })
    )
    # terms = forms.BooleanField(
    #     required=True,
    #     label='I agree to the Terms of Service and Privacy Policy',
    #     widget=forms.CheckboxInput(attrs={
    #         'id': 'signupTerms',
    #         'style': 'accent-color:var(--accent-blue);width:16px;height:16px;cursor:pointer;',
    #     })
    # )

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Style password fields
        self.fields['password1'].widget.attrs.update({
            'class': 'input-premium',
            'placeholder': '••••••••',
            'id': 'signupPassword',
            'autocomplete': 'new-password',
            'minlength': '8',
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'input-premium',
            'placeholder': '••••••••',
            'id': 'signupConfirm',
            'autocomplete': 'new-password',
        })
        # Remove help texts
        self.fields['password1'].help_text = None
        self.fields['password2'].help_text = None

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        # Split full name
        # full_name = self.cleaned_data['full_name'].strip()
        # if full_name:
        #     parts = full_name.split(' ', 1)
        #     user.first_name = parts[0]
        #     user.last_name = parts[1] if len(parts) > 1 else ''
        if commit:
            user.save()
        return user
    
# class SignUpForm(UserCreationForm):
#     email = forms.EmailField(
#         max_length=254,
#         required=True,
#         help_text='Required. Enter a valid email address.',
#         widget=forms.EmailInput(attrs={
#             'class': 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
#             'placeholder': 'you@example.com'
#         })
#     )

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password1', 'password2')

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         # Add Tailwind classes to all fields for consistent styling
#         for field_name, field in self.fields.items():
#             field.widget.attrs['class'] = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
#             field.widget.attrs['placeholder'] = field.label

#     def clean_email(self):
#         email = self.cleaned_data.get('email')
#         if User.objects.filter(email=email).exists():
#             raise forms.ValidationError("This email is already registered.")
#         return email

#     def save(self, commit=True):
#         user = super().save(commit=False)
#         user.email = self.cleaned_data['email']
#         if commit:
#             user.save()
#         return user





# custom-user-creation
class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)
        for fieldname in ["username", "password1", "password2"]:
            self.fields[fieldname].help_text = None
            self.fields[fieldname].widget.attrs.update({"class": "form-control"})


class CustomErrorList(ErrorList):
    def __str__(self):
        if not self:
            return ""
        return mark_safe(
            "".join(
                [
                    f'<div class="alert alert-danger" role="alert">{e}</div>'
                    for e in self
                ]
            )
        )