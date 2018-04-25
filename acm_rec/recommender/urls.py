from django.conf.urls import url
from . import views

app_name = 'recommender'

urlpatterns = [
    url(r'^', views.index, name="angular-index"),
    ]