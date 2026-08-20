from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from .forms import CustomUserCreationForm, CustomErrorList
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .forms import SignUpForm

# Create your views here.


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        # print("POST data keys:", request.POST.keys())
        # print("POST data:", request.POST)
        # print("Breathing ...")
        #  Debug: print whether the form is valid and its errors
        # print("Form is valid:", form.is_valid())
        if not form.is_valid():
            print("Form errors:", form.errors)

        if form.is_valid():
            user = form.save()
            auth_login(request,user)
            messages.success(request, f'Account created for {user.email}!')
            return redirect('accounts:login')   
    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})



def login(request):
    if request.method == "GET":
        return render(request, "accounts/login.html")

    elif request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is None:
            messages.error(request,"The Username OR Password is Inncorrect!")
            return render( request, "accounts/login.html")
        
        if user is not None:

            if user.is_staff:
                auth_login(request, user)
                messages.success(request, "Welcome Your Redirected to Dashboard")
                return redirect('home.dashboard')
            else:
                messages.error(request, "Invalid Staff Credientals!")
                return render( request, "accounts/login.html")
                #return redirect('login')  # 

        else:
               messages.error(request,"You Are Not Manager OR Staff Member!")
               return render( request, "accounts/login.html")   
        


@login_required
def logout(request):
    auth_logout(request)
    return redirect("home.index")


