from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase, APIClient
from uuid import UUID
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


    def testUpdateAuthor(self):
        # update author 
        author1 = Users.objects.get(username="testuser")
        url = f'/backendapi/authors/{str(author1.id)}'

        # update author with new display name
        update_res = self.client.post(url, {"displayName": "test1"}, format="json", **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(update_res.status_code, 200)


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
        author_id = str(author.id)
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        response = self.client.get(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22169',**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})

        self.assertEqual(response.status_code, 200)
    
    def test_UpdatePost(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        self.UpdateConetent = {
            "title" : "new title",
            "description":"new description",
            "contentType":"text/markdown",
            "content": "new content",
            "categories": ["web", "tutorial"],
            "visibility":"PUBLIC"
        }
        response = self.client.post(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22169',self.UpdateConetent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "new title")

    def test_PutPost(self):
        """Test Put request to create a new post"""
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        self.PutConetent = {
            "title" : "Put title",
            "description":"Put description",
            "contentType":"text/markdown",
            "content": "Put content",
            "categories": ["web", "tutorial"],
            "visibility":"PUBLIC"
        }

        response = self.client.put(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22189',self.PutConetent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
    
    def test_update_post_unauthorized(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        self.UpdateConetent = {
            "title" : "new title",
            "description":"new description",
            "contentType":"text/markdown",
            "content": "new content",
            "categories": ["web", "tutorial"],
            "visibility":"PUBLIC"
        }
        response = self.client.post(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22169',self.UpdateConetent,format="json")
        self.assertEqual(response.status_code, 401)
    
    def test_deletePost_unauthorized(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        response = self.client.delete(f'/backendapi/authors/'+ author_id + '/posts/631f3ebe-d976-4248-a808-db2442a22169')
        self.assertEqual(response.status_code, 401)
    
    def test_deletePost(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        response = self.client.delete(f'/backendapi/authors/'+ author_id + '/posts/631f3ebe-d976-4248-a808-db2442a22169',**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 202)
    
class FollowersTestCase(APITestCase):
    """
    TEST DO NOT CONSIDER AUTHTICATION, SINCE IT IS DONE IN AUTH TEST
    URL: ://service/authors/{AUTHOR_ID}/followers
    GET [local, remote]: get a list of authors who are AUTHOR_ID’s followers
    """
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

    def test_follow_himself(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        response = self.client.put(f'/backendapi/authors/'+author_id+'/followers/'+author_id,**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 400)

    def test_accpet_followerRequest(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        Users.objects.create(
            id = "60d9c89d-b59e-4969-841b-df0bc2c674fa",
            username = "followerUser1",
            displayName = "followerUser1",
            email = "follower1@gmail.com",
            password = "follower123"
        )
        follower_request = {
            "type":"follow",
            "object":"/backendapi/authors/60d9c89d-b59e-4969-841b-df0bc2c674fa"
        }
        #send request to inbox
        response = self.client.post(f'/backendapi/authors/'+author_id+'/inbox',follower_request,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        response = self.client.put(f'/backendapi/authors/'+author_id+'/followers/60d9c89d-b59e-4969-841b-df0bc2c674fa',**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
    
    def test_get_Author_followers(self):
        self.test_accpet_followerRequest()
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        response = self.client.get(f'/backendapi/authors/'+author_id+'/followers',**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        current_follower_list=response.data['items']
        self.assertEqual(len(current_follower_list), 1)

class commentsTestCase(APITestCase):
    """
    TEST DO NOT CONSIDER AUTHTICATION, SINCE IT IS DONE IN AUTH TEST
    backendapi/authors/<author_id>/posts/<post_id>/comments
    """
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
    
    def test_makeComment(self):
        author = Users.objects.get(username="testuser")
        Users.objects.create(
            id = "60d9c89d-b59e-4969-841b-df0bc2c674fa",
            username = "commenttest",
            displayName = "commentest",
            email = "comments@gmail.com",
            password = "comment123"
        )
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        self.commentContent={
            "comment":"This is a test comment"
        }
        response = self.client.post(f'/backendapi/authors/60d9c89d-b59e-4969-841b-df0bc2c674fa/posts/631f3ebe-d976-4248-a808-db2442a22169/comments',self.commentContent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
    
    def test_getComments(self):
        self.test_makeComment()
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        response = self.client.get(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22169/comments',self.commentContent,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)
        current_comment_list=response.data['comments']
        self.assertEqual(len(current_comment_list), 1)

class likesTestCase(APITestCase):
    """
    TEST DO NOT CONSIDER AUTHTICATION, SINCE IT IS DONE IN AUTH TEST
    backendapi/authors/<author_id>/posts/<post_id>/likes
    """
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
    
    def test_send_like(self):
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        Users.objects.create(
            id = "60d9c89d-b59e-4969-841b-df0bc2c674fa",
            username = "liketest",
            displayName = "liketest",
            email = "like@gmail.com",
            password = "like123"
        )
        PostModel.objects.create(
            id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = author,
            title="Test title for get Post",
            description="This is a get description",
            contentType="text/plain",
            content="This is a test content",
            categories=["Category3","Category4"],
            visibility="PUBLIC",
            unlisted="False",
        )
        self.like_obj = {
            "at_context":"https://www.w3.org/ns/activitystreams",
            "summary" : "liketest Likes your post",
            "author":"60d9c89d-b59e-4969-841b-df0bc2c674fa",
            "post":"631f3ebe-d976-4248-a808-db2442a22169",
            "object":"/authors/60d9c89d-b59e-4969-841b-df0bc2c674fa/posts/631f3ebe-d976-4248-a808-db2442a22169"
        }
        response = self.client.post(f'/backendapi/authors/'+author_id+'/inbox/like',self.like_obj,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 201)
    
    def test_getPost_like(self):
        self.test_send_like()
        author = Users.objects.get(username="testuser")
        author_id = str(author.id)
        response = self.client.get(f'/backendapi/authors/'+author_id+'/posts/631f3ebe-d976-4248-a808-db2442a22169/likes',self.like_obj,format="json",**{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, 200)    

    
