from django.urls import path 
from home import views

# app_name = "home",

urlpatterns = [
    path("", views.index, name="home.index"),
    path("dashboard/", views.dashboard, name="home.dashboard"),
]
