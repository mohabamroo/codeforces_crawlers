# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json, os

from django.contrib.auth.models import User, Group
from django.shortcuts import render
from rest_framework import permissions, generics
from recommender.models import Profile
from recommender.serializers import  ProfileSerializer
from django.views.generic import TemplateView
from rest_framework import views, serializers
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from pymongo import MongoClient
from json import JSONEncoder
from bson.objectid import ObjectId


class MongoEncoder(JSONEncoder):
    def default(self, obj, **kwargs):
        if isinstance(obj, ObjectId):
            return str(obj)
        return JSONEncoder.default(obj, **kwargs)


def connect_to_mongo():
    uri = 'mongodb://mohabamroo:ghostrider1@ds241699.mlab.com:41699/bachelor'
    client = MongoClient(uri,
                         connectTimeoutMS=30000,
                         socketTimeoutMS=None,
                         socketKeepAlive=True)
    db = client.get_database()
    return db


@api_view(['GET'])
def recommendations(request):
    instance = Profile.objects.get(user=request.user)
    profile = ProfileSerializer(instance, context={'request': request}).data
    db = connect_to_mongo()
    recommendations = db['predictions'].find_one({'user': 'chaitan94'})
    recommendations = MongoEncoder().encode(recommendations)
    recommendations = json.loads(recommendations)
    return Response({"message": "Got some data!", "data": request.data, 'profile': profile, 'rec': recommendations})


def index(request):
    return render(request, 'index.html', context=None)


@api_view(['GET'])
def crawl(request):
    output = os.system("echo 'helloss world'")
    return Response({"message": "Got some data!", "output": output})


