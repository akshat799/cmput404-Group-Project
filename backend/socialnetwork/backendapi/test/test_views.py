from urllib import response
from django.test import TestCase, Client
from requests import request
from backendapi.models import *
from django.urls import reverse

class AuthTest(TestCase):
    def setUp(self):
        self.client = Client()
        user = UserManager.create_user(username='testuser',password='password123',displayName='user_test')
        user.save()
        author = Users.objects.create(username='testuser',displayName='user_test',email='test@gmail.com',githubName='testgithub')
        author.save()
        self.login_url = 'backendapi/auth/login/'
        self.register_url = 'backendapi/auth/register/'
    
    def test_register(self):
        request = {
            'username':'testuser',
            'password': 'password123',
            'displayName':'user_test',
        }
        response = self.client.post(
            reverse(self.register_url),
            request,
        )
        self.assertEquals(response.status_code,'201')
    
    def test_login(self):
        request = {
            'username':'testuser',
            'password': 'password123',
        }
        response = self.client.post(
            reverse(self.login_url),
            request,
        )
        self.assertEquals(response.status_code,'200')
        