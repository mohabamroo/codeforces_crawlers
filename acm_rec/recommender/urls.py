from django.conf.urls import url
from . import views

app_name = 'recommender'

urlpatterns = [
    url(r'^crawl/$', views.crawl, name="spider"),
    url(r'^', views.index, name="angular-index"),

]