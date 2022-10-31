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
        res = self.client.post('http://127.0.0.1:8000/backendapi/auth/register/',self.user_info,format="json")
        self.assertEquals(res.status_code,201)
        res_data = res.data
        self.assertTrue('token' in res_data.keys())
       
    def test_login(self):
        self.test_register()
        res = self.client.post('http://127.0.0.1:8000/backendapi/auth/login/',self.login_info,format="json")
        self.assertEquals(res.status_code,200)

    
    #test get specific author
    def test_get_author(self):
        self.test_register()
        test = Users.objects.get(username="test")
        test_id = str(test.id)
        url = 'http://127.0.0.1:8000/backendapi/authors/'+test_id
        
        res = self.client.get(url,format="json")
        self.assertEquals(res.status_code,200)
        
    #test for post method
    def test_makePost(self):
        self.client.post('http://127.0.0.1:8000/backendapi/auth/register/',self.user_info,format="json")
        res = self.client.post('http://127.0.0.1:8000/backendapi/auth/login/',self.login_info,format="json")
        token = res.data['access']
        #self.client.login(username=self.username,password=self.password)
        test = Users.objects.get(username="test")
        test_id = str(test.id)
        url = 'http://127.0.0.1:8000/backendapi/authors/'+test_id+'/posts/'
        
        test_post_conetent = {
            "title" : "A test post",
            "description":"This is a test description.",
            "contentType":"",
            "contentType":"text/markdown",
            "categories": ["web", "tutorial"],
            "visibility":"PUBLIC",
            "unlisted": "false"
        }
        response=self.client.post(url,test_post_conetent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {token}'})
        self.assertEquals(response.status_code,201)
        
    
    