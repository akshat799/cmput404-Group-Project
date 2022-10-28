from urllib import response
from rest_framework.permissions import IsAuthenticated
from django.test import TestCase, Client
from backendapi.models import *
from django.urls import reverse

class AuthorsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'superuser'
        self.password = 'password123'
        self.displayName = 'test_super'
        self.email  = 'super@gmail.com'
        self.githubName = 'testgithub'
        user = UserManager.create_superuser(self.username, self.password , self.email , self.displayName , githubName='testgithub')
        self.client.login(username='superuser',password='password123')
        self.get_author_url = reverse('backendapi/authors/')
        
    def test_get_authors(self):
        response = self.client.get(
            self.get_author_url,
            IsAuthenticated
        )
        self.assertEquals(response.status_code,200)
        