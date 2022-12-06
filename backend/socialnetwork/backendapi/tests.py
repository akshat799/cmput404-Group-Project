from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase, APIClient

class AuthTest(APITestCase):
    def setUp(self):
        self.username = "testuser"
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
        res = self.client.post(f'/backendapi/auth/register/',self.user_info,format="json")
        self.assertEquals(res.status_code,201)
        res_data = res.data
        self.assertTrue('token' in res_data.keys())
    
    def test_bad_register(self):
        data = { 'username': '', 'password': 'nopenope1'}
        response = self.client.post(f'/backendapi/auth/register/', data , format="json")
        self.assertEqual(response.status_code, 400)
    
    def test_login(self):
        self.test_register()
        res = self.client.post(f'/backendapi/auth/login/',self.login_info,format="json")
        self.assertEquals(res.status_code,200)
    
    def test_incorrect_login(self):    
        self.test_register()
        # attempt to login with incorrect credentials, should get 400
        response = self.client.post(f'/backendapi/auth/login/', {'username': 'testuser', 'password':'doesnotexist'} , format="json")
        self.assertEqual(response.status_code, 401)

class AuthorTestCase(APITestCase):

    def setUp(self):
        self.username = "testuser"
        self.email = "test@gmail.com"
        self.displayName = "testDisplay"
        self.password = "password123"
        self.githubName = "githubtest"
        #self.profileImage = 'https://imag.png'
        self.user_info = {'username' :self.username,'email' : self.email,'displayName':self.displayName, 'password':self.password,
        'githubName' : self.githubName}
        self.login_info = {'username':self.username,'password':self.password}
        #get token 
        self.client.post(f'/backendapi/auth/register/',self.user_info,format="json")
        self.res = self.client.post(f'/backendapi/auth/login/',self.login_info,format="json")
        self.token = self.res.data['access']
        self.client = APIClient()

           
    def testGetAuthor(self):
        #Users.objects.create(username="testuser")
        author1 = Users.objects.get(username="testuser")
        url = f'/backendapi/authors/{str(author1.id)}'

        res = self.client.get(url, format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(res.status_code, 200)
        res = res.data
        # check that all the fields needed are present
        self.assertTrue('id' in res.keys())
        self.assertTrue('url' in res.keys())
        self.assertTrue('host' in res.keys())
        self.assertTrue('githubName' in res.keys())
        self.assertTrue('profileImage' in res.keys())
        self.assertTrue('displayName' in res.keys())
        self.assertTrue('type' in res.keys())
    
    def test_getAllPublicAuthors(self):
        url = f'/backendapi/authors/'
        response=self.client.get(url,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code,200)

    def testGetAuthorNoAuthorization(self):
        author1 = Users.objects.get(username="testuser")
        url = f'/backendapi/authors/{str(author1.id)}'
        res = self.client.get(url, format="json")
        self.assertEqual(res.status_code, 401)


    # def testUpdateAuthor(self):
    #     # update author 
    #     author1 = Users.objects.get(username="testuser")
    #     url = f'/backendapi/authors/{str(author1.id)}'

    #     res = self.client.get(url, format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
    #     self.assertEqual(res.status_code, 200)
    #     # update author with new display name
    #     update_res = self.client.post(url, {"displayName": "test1"}, format="json", **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
    #     self.assertEqual(update_res.status_code, 202)

    #     # get author again and see if it really did update
    #     res = self.client.get(url, format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
    #     self.assertEqual(res.status_code, 200)
    #     self.assertEqual(res.data.get('displayName'), 'test1')

class PostTestCase(APITestCase):

    def setUp(self):
        self.username = "testuser"
        self.email = "test@gmail.com"
        self.displayName = "testDisplay"
        self.password = "password123"
        self.githubName = "githubtest"
        self.user_info = {'username' :self.username,'email' : self.email,'displayName':self.displayName, 'password':self.password,
        'githubName' : self.githubName}
        self.login_info = {'username':self.username,'password':self.password}
        #get token 
        self.client.post(f'/backendapi/auth/register/',self.user_info,format="json")
        self.res = self.client.post(f'/backendapi/auth/login/',self.login_info,format="json")
        self.token = self.res.data['access']
        self.client = APIClient()

    def test_makePost(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        url = f'/backendapi/authors/'+author_id+'/posts/'
        
        self.test_post_conetent = {
            "title" : "A test post",
            "description":"This is a test description.",
            "contentType":"",
            "contentType":"text/markdown",
            "categories": ["web", "tutorial"],
            "visibility":"PUBLIC",
            "unlisted": "false"
        }
        self.response=self.client.post(url,self.test_post_conetent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(self.response.status_code,201)

    def test_getAuthorPosts(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        url = f'/backendapi/authors/'+author_id+'/posts/'
        
        self.response=self.client.get(url,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(self.response.status_code,200)
    
    def test_getDetial(self):
        """Test GET request to get a post"""
        author = Users.objects.get(username="testuser")
        new_post = PostModel.objects.create(
            title="Test title for editing Post",
            description="This is a edit description",
            contentType="text/plain",
            content="This is a test content",
            author=author,
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted=True,
        )

        response = self.client.get(f'/backendapi/authors/' + str(author.id) +"/posts/"+str(new_post.id),**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})

        self.assertEqual(response.status_code, 200)