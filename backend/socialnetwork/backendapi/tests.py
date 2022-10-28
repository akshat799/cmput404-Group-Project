from urllib import response
from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase, APIClient

class AuthTest(APITestCase):
    def setUp(self):
        self.username = 'test'
        self.email = 'test@gmail.com'
        self.displayName = 'testDisplay'
        self.password = "password123"
        self.githubName = 'githubtest'
        self.profileImage = 'https://imag.png'
        self.user_info = {'self.username' :'test','email' : 'test@gmail.com','displayName':self.displayName, 'password':self.password,
        'githubName' : 'githubtest','profileImage': 'https://imag.png','is_active':'True'}
        self.client = APIClient()
    
    def test_register(self):
        reponse = self.client.post(f'backendapi/auth/register/',self.user_info,format="json")
        self.assertEquals(reponse.status_code,201)
