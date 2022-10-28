import email
from django.test import TestCase
from backendapi.models import *

class AuthorTest(TestCase):
    def setUp(self):
        user = UserManager.create_user(username='testuser',password='password123',displayName='user_test')
        self.author = Users.objects.create(username='testuser',displayName='user_test',email='test@gmail.com',githubName='testgithub')
        self.author.save()
        
    def test_email(self):
        self.assertEquals(self.author.email,'test@gmail.com')
    def test_user(self):
        user = UserManager.get(username='testuser')
        self.assertEquals(user,self.user.username)