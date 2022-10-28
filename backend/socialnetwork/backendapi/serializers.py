from dataclasses import fields
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.core.exceptions import ObjectDoesNotExist
from . import models

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Users
        fields = ['type', 'id', 'url', 'host', 'displayName','profileImage','created','is_active', 'email','githubName']
        read_only_field = ['is_active', 'created']

class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

class RegisterSerializer(UserSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    githubName = serializers.CharField(write_only=True, max_length=128,default="")

    class Meta:
        model = models.Users
        fields = ['id', 'username', 'displayName','url','profileImage','password', 'is_active', 'created','githubName', 'email']

    def create(self, validated_data):
        try:
            user = models.Users.objects.get(username=validated_data['username'])
        except ObjectDoesNotExist:
            user = models.Users.objects.create_user(**validated_data)
        return user

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.CommentModel
        fields = '__all__'

class FollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.FollowerModel
        fields = '__all__'
