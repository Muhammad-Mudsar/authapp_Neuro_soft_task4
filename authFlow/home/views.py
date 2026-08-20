from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
# Create your views here.

def index(request):
    template_data={ }
    template_data['title']= "Nexus welcome"
    return render(request,'home/index.html', { 'template_data': template_data}) 
                                            #dict key:value  ,above key=>'title'

@login_required
def dashboard(request):
    return render(request,'home/dashboard.html')


    