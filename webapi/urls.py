from django.urls import path
from .views import *

urlpatterns = [
    path('test', get_test_page),
    path('get_scholar', get_scholar),
    path('get_project_detail', get_project_detail),
    path('get_school_data', get_school_data),
    path('get_scholar_detail', get_scholar_detail)

]
