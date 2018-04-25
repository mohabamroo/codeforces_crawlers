# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework import permissions, generics
from django.contrib.auth.models import User, Group
from recommender.models import Profile
from rest_framework import viewsets
from recommender.serializers import UserSerializer, GroupSerializer, ProfileSerializer, RegistrationSerializer
from django.views.generic import TemplateView
from rest_framework import views, serializers
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from pymongo import MongoClient
from json import JSONEncoder
from bson.objectid import ObjectId
import json
class MongoEncoder(JSONEncoder):
    def default(self, obj, **kwargs):
        if isinstance(obj, ObjectId):
            return str(obj)
        else:            
            return JSONEncoder.default(obj, **kwargs)

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()

class EchoView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class UserRegister(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfile(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            profile = Profile.objects.get(user=self.request.user)
            return profile
        except ObjectDoesNotExist:
            return Profile.objects.create(user=self.request.user)

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

def connect_to_mongo():
    uri = 'mongodb://mohabamroo:ghostrider1@ds241699.mlab.com:41699/bachelor';
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
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer