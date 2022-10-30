from urllib import response
from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase, APIClient

class AuthTest(APITestCase):
    def setUp(self):
        self.username = "test"
        self.email = "test@gmail.com"
        self.displayName = "testDisplay"
        self.password = "password123"
        self.githubName = "githubtest"
        #self.profileImage = 'https://imag.png'
        self.user_info = {'username' :self.username,'email' : self.email,'displayName':self.displayName, 'password':self.password,
        'githubName' : self.githubName}
        self.login_info = {'username':self.username,'password':self.password}
        self.client = APIClient()
    
    def test_register(self):
        reponse = self.client.post('http://127.0.0.1:8000/backendapi/auth/register/',self.user_info,format="json")
        self.assertEquals(reponse.status_code,201)
    def test_login(self):
        self.test_register()
        reponse = self.client.post('http://127.0.0.1:8000/backendapi/auth/login/',self.login_info,format="json")
        self.assertEquals(reponse.status_code,200)

    def test_get_author(self):
        self.test_register()
        test = Users.objects.get(username="test")
        test_id = str(test.id)
        url = 'http://127.0.0.1:8000/backendapi/authors/'+test_id
        
        res = self.client.get(url,format="json")
        self.assertEquals(res.status_code,200)
        
    #test for post method
    def test_makePost(self):
        # self.client.post('http://127.0.0.1:8000/backendapi/auth/register/',self.user_info,format="json")
        # self.client.post('http://127.0.0.1:8000/backendapi/auth/login/',self.login_info,format="json")
        self.client.login(username=self.username,password=self.password)
        test = Users.objects.get(username="test")
        test_id = str(test.id)
        url = 'http://127.0.0.1:8000/backendapi/authors/'+test_id+'/posts/'
        
        test_post_conetent = {
            "title" : "A test post",
            "source": "",
            "origin": "",
            "description":"This is a test description.",
            "contentType":"",
            "content":"This is a test content.",
            "categories":"",
            "count":0,
            "comments":"",
            "visibility":"Pubilc",
        }
        response=self.client.post(url,test_post_conetent,format="json")
        self.assertEquals(response.status_code,201)
        
    
    