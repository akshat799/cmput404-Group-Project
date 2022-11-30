from pyexpat.errors import messages
from pyexpat import model
from django.shortcuts import render, get_object_or_404
from django import http
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.pagination import PageNumberPagination
from . import serializers
from . import models
import json
import uuid
from .auth import *
import requests
from requests.auth import HTTPBasicAuth

url = "https://cmput404-backend.herokuapp.com/backendapi"
grp17_url = "https://cmput404f22t17.herokuapp.com"

grp17_username = 't18user1'
grp17_password = 'Password123!'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AuthorsListView(request):
    response = check_auth(request)
    authors = models.Users.objects.filter(type="author")
    serializer = serializers.UserSerializer(authors,many=True)

    for entry in serializer.data:
        entry["github"] = entry["githubName"]
        del entry["githubName"]
        entry["github"] = f'http://github.com/{entry["github"]}'
        entry["id"] = f'{url}/authors/{entry["id"]}'

    if(response == 'local'):
        #get and return all the authors
        try:
            req = requests.get(grp17_url + '/authors', auth=HTTPBasicAuth(grp17_username,grp17_password))
            if(req.status_code == 200):
                node_data = json.loads(req.content.decode('utf-8'))
                items_data = serializer.data + node_data['items']
        except http.Http404 as e:
            message = {'error':str(e)}
            return Response(message , status.HTTP_404_NOT_FOUND)
        except Exception as e:
            if(req.status_code == 403):
                items_data = serializer.data
            else:
                message = {'error':str(e)}
                return Response(message , status.HTTP_400_BAD_REQUEST)

        data = {"type":"authors",
                "items":items_data
                }
        return Response(data, status.HTTP_200_OK)
    
    elif(response == 'remote'):
        data = {"type":"authors",
                "items":serializer.data
                }
        return Response(data, status.HTTP_200_OK)

    else:
        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AuthorsView(request,author_id):
    #return specific author
    response = check_auth(request)
    if response == None:
        message = {"Error": "Authorization Required"}
        return Response(message , status.HTTP_401_UNAUTHORIZED)
    try:
        authors = models.Users.objects.get(id=author_id)
        serializer = serializers.UserSerializer(authors)
        return Response(serializer.data)
    except Exception as e:
        message = {'error':str(e)}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editProfielView(request,author_id):
    data = request.data
    try:        
        authors = models.Users.objects.get(id=author_id)
        authors.displayName = data['displayName']
        authors.githubName = data['githubName']
        authors.profileImage = data['profileImage']
        authors.save()
        
        message = {'message','successfully update profile'}
        messages.success(request,'Profile is update successfully!')
        return Response(message,status=status.HTTP_200_OK)
    except Exception as e:
        message = {'error',e}
        messages.error(request,'Fail to update profile')
        return Response(message,status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def ProfileView(request,id):
#     try:
#         author_object = models.Users.objects.get(id=id)
#         # print(author_object.profileImage)
#         profile = {
#             'user': author_object.user,
#             'id': id,
#             'host': author_object.host,
#             'displayName': author_object.displayName,
#             'githubName':author_object.githubName,
#             'profileImage': author_object.profileImage,
#         }
#         return Response(profile,status=status.HTTP_200_OK)
#     except Exception as e:
#         message = {'error',e}
#         return Response(message,status.HTTP_400_BAD_REQUEST)

        
# class UserViewSet(ModelViewSet):
#     http_method_names = ['get']
#     serializer_class = serializers.UserSerializer
#     permission_classes = (IsAuthenticated,)
#     filter_backends = [filters.OrderingFilter]
#     ordering_fields = ['updated']
#     ordering = ['-updated']

#     def get_queryset(self):
#         if self.request.user.is_superuser:
#             return models.Users.objects.all()

#     def get_object(self):
#         lookup_field_value = self.kwargs[self.lookup_field]

#         obj = models.Users.objects.get(lookup_field_value)
#         self.check_object_permissions(self.request, obj)

#         return obj

    

    

    

    

    

class LoginViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = serializers.LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = serializers.RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def PostViewSet(request,author_id = None,post_id = None):
    
    if(request.method == 'GET'):
        response = check_auth(request)

        if(response != 'local' and response != 'remote'):
            return response

        try:
            if author_id != None:
                    if post_id != None:
                        try:
                            post = models.PostModel.objects.get(id=post_id,visibility='PUBLIC')
                            serializer = serializers.PostSerializer(post)
                            serial_data = serializer.data
                            serial_data["author"] = {
                                "type": post.author.type,
                                "id": f'{url}/authors/{post.author.id}',
                                "host": post.author.host,
                                "displayName": post.author.displayName,
                                "url": post.author.url,
                                "github": f'http://github.com/{post.author.githubName}',
                                "profileImage": post.author.profileImage
                            }
                            return Response(serial_data, status.HTTP_200_OK)
                        except Exception as e:
                            try:    
                                posts = []
                                posts.extend(get_foreign_posts_t17())
                                if(posts == []):
                                    message = {"Error": "The Post does not Exist"}
                                    return Response(message  , status.HTTP_404_NOT_FOUND)
                                for entry in posts:
                                     
                                    localPostId = entry['id'].split("/")[-2]
                                    if(localPostId == post_id):
                                        return Response(entry , status=status.HTTP_200_OK )

                                message = {"Error" : "The Post does not exist"}
                                return Response(message  , status.HTTP_404_NOT_FOUND)
                            except http.Http404 as e:
                                message = {'error':str(e)}
                                return Response(message , status.HTTP_404_NOT_FOUND)
                            except Exception as e:
                                message = {'error':str(e)}
                                return Response(message , status.HTTP_400_BAD_REQUEST)

                    elif post_id == None:
                        
                        try:
                            
                            author = models.Users.objects.get(id=author_id)
                            post = models.PostModel.objects.filter(author=author)
                            serializer = serializers.PostSerializer(post,many=True)
  
                            data = serializer.data

                            for entry in data:
                                entry["author"] = {
                                    "type": author.type,
                                    "id": f'{url}/authors/{author.id}',
                                    "host": author.host,
                                    "displayName": author.displayName,
                                    "url": author.url,
                                    "github": f'http://github.com/{author.githubName}',
                                    "profileImage": author.profileImage
                                }
                                
                            return Response(data, status=status.HTTP_200_OK)
                        except Exception as e:
                            
                            try:
                                req = requests.get(grp17_url + f'/authors/{author_id}/posts/', auth=HTTPBasicAuth(grp17_username,grp17_password))
                                node_data = json.loads(req.content)
                                return Response(node_data, status=status.HTTP_200_OK )
                            except http.Http404 as e:
                                message = {'error':str(e)}
                                return Response(message , status.HTTP_404_NOT_FOUND)
                            except Exception as e:
                                message = {'error':str(e)}
                                return Response(message , status.HTTP_400_BAD_REQUEST)
                    
            elif author_id == None:
                try:
                    post_obj = models.PostModel.objects.filter(visibility='PUBLIC')
                    serializer =  serializers.PostSerializer(post_obj,many=True)

                    if(response == 'local'):
                        posts_all = get_foreign_posts_t17()
                        all_data = serializer.data + posts_all

                    else:
                        all_data = serializer.data

                    data = {"type":"posts",
                            "items":all_data 
                            }

                    return Response(data,status=status.HTTP_200_OK)
                except Exception as e:
                    return Response(f"Error:{e}",status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            data = {'error': str(e)}
            return Response(data,status=status.HTTP_400_BAD_REQUEST)

    elif(request.method == 'POST'):
        try:
            if post_id != None:
                author = get_object_or_404(models.Users,id=author_id)
                post = get_object_or_404(models.PostModel, id=post_id)
                postData = request.data
                postData.update({"id": post_id, "author": author.id})
                serializer = serializers.PostSerializer(data=postData,partial=True)
                serializer.is_valid(raise_exception=True)
                postData.update({"author": author})
                serializer.update(post,postData)
                data = serializer.data
                data["id"] = post_id
                data["author"] = {
                    "type": author.type,
                    "id": author.id,
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }
                return Response(data , status=status.HTTP_201_CREATED)
            elif post_id == None:
                author = get_object_or_404(models.Users,id=author_id)
                postData = request.data
                postData.update({"author": author.id})
                serializer = serializers.PostSerializer(data=postData)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                data = serializer.data
                data["author"] = {
                    "type": author.type,
                    "id": author.id,
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }
                return Response(data , status=status.HTTP_201_CREATED)
                
        except Exception as e:
            data = {'error': str(e)}
            return Response(data,status=status.HTTP_400_BAD_REQUEST)
    
    elif(request.method == 'PUT'):
        if post_id != None:
            author = get_object_or_404(models.Users,id=author_id)
            postData = request.data
            postData.update({"id": post_id, "author": author.id})
            serializer = serializers.PostSerializer(data=postData)
            instance = models.PostModel()
            serializer.is_valid(raise_exception=True)
            postData.update({"author": author})
            serializer.update(instance , postData)
            data = serializer.data
            data["author"] = {
                "type": author.type,
                "id": author.id,
                "host": author.host,
                "displayName": author.displayName,
                "url": author.url,
                "github": f'http://github.com/{author.githubName}',
                "profileImage": author.profileImage
            }
            return Response(data , status=status.HTTP_201_CREATED)
        elif post_id == None:
            data = {'error': 'This method is not allowed'}
            return Response(data , status = status.HTTP_405_METHOD_NOT_ALLOWED)
            

    elif(request.method == 'DELETE'):
        try:
            if post_id != None:
                author = get_object_or_404(models.Users,id = author_id)
                post = get_object_or_404(models.PostModel,id=post_id,author=author)
                serializer = serializers.PostSerializer(post)
                post.delete()
                data = {"message":"Deletion successful"}
                return Response(data, status = status.HTTP_202_ACCEPTED)

            elif post_id == None:
                data = {'error': 'This method is not allowed'}
                return Response(data , status = status.HTTP_405_METHOD_NOT_ALLOWED)

        except Exception as e:
            data = {'error': str(e)}
            return Response(data,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def LikeViewSet(request,author_id,post_id = None,comment_id = None):
    try:
        if(request.method == 'POST'):
            if post_id != None:
                data = {'error': 'This method is not allowed'}
                return Response(data , status = status.HTTP_405_METHOD_NOT_ALLOWED)
            elif post_id == None:
                postData = request.data
                author = get_object_or_404(models.Users,id=postData["author"])
                postData.update({"object": url + f"authors/{author_id}/inbox"})
                print("HI ",postData)
                serializer = serializers.LikesSerializer(data=postData)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                data = serializer.data
                data["author"] = {
                    "type": author.type,
                    "id": author.id,
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }
                idPost = data["post"]
                data["object"] = f"{url}/authors/{author_id}/posts/{idPost}"
                return Response(data , status=status.HTTP_201_CREATED)
        elif(request.method == 'GET'):
            if post_id != None:
                if comment_id != None:
                    likes = models.LikeModel.objects.filter(post = post_id , comment = comment_id)
                    serializer = serializers.LikesSerializer(likes,many=True)
                    data = serializer.data
                    for entry in data:
                        newAuthor = get_object_or_404(models.Users,id = entry["author"])
                        entry["author"] = {
                            "type": newAuthor.type,
                            "id": newAuthor.id,
                            "host": newAuthor.host,
                            "displayName": newAuthor.displayName,
                            "url": newAuthor.url,
                            "github": f'http://github.com/{newAuthor.githubName}',
                            "profileImage": newAuthor.profileImage
                        }
                        
                        entry["object"] = f"{url}/authors/{author_id}/posts/{post_id}/comments/{comment_id}"
                    return Response(data, status=status.HTTP_200_OK)
                elif comment_id == None:
                    likes = models.LikeModel.objects.filter(post = post_id)
                    serializer = serializers.LikesSerializer(likes,many=True)
                    data = serializer.data
                    for entry in data:
                        newAuthor = get_object_or_404(models.Users,id = entry["author"])
                        entry["author"] = {
                            "type": newAuthor.type,
                            "id": newAuthor.id,
                            "host": newAuthor.host,
                            "displayName": newAuthor.displayName,
                            "url": newAuthor.url,
                            "github": f'http://github.com/{newAuthor.githubName}',
                            "profileImage": newAuthor.profileImage
                        }          
                        entry["object"] = f"{url}/authors/{author_id}/posts/{post_id}"
                    return Response(data, status=status.HTTP_200_OK)
            elif post_id == None:
                data = {'error': 'This method is not allowed'}
                return Response(data , status = status.HTTP_405_METHOD_NOT_ALLOWED)

    except Exception as e:
        data = {'error': str(e)}
        return Response(data,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def LikedViewSet(requests,author_id):
    try:
        likes = models.LikeModel.objects.filter(author = author_id)
        serializer = serializers.LikesSerializer(likes,many=True)
        data = serializer.data
        for entry in data:
            newAuthor = get_object_or_404(models.Users,id = entry["author"])
            entry["author"] = {
                "type": newAuthor.type,
                "id": newAuthor.id,
                "host": newAuthor.host,
                "displayName": newAuthor.displayName,
                "url": newAuthor.url,
                "github": f'http://github.com/{newAuthor.githubName}',
                "profileImage": newAuthor.profileImage
            }
        return Response({
            "type": "liked",
            "items": data
        }, status=status.HTTP_200_OK)  
    except Exception as e:
        data = {'error': str(e)}
        return Response(data,status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def CommentViewSet(request, author_id, post_id):

    paginator = PageNumberPagination()
    paginator.page_size = 10
    page_query_param = 'page'
    page_size_query_param = 'size'

    if(request.method == 'GET'):
        try:
            comments = models.CommentModel.objects.filter(post = post_id)
            result_page = paginator.paginate_queryset(comments, request)
            serializer = serializers.CommentSerializer(result_page, many = True)
            # return Response(serializer.data, status = status.HTTP_200_OK)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            data = {'error' : str(e)}
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    if(request.method == 'POST'):
        try:
            data = request.data
            author = get_object_or_404(models.Users,id = author_id)
            data.update({"post" : post_id, "author" : author_id})
            serializer = serializers.CommentSerializer(data = data)
            serializer.is_valid(raise_exception = True)
            serializer.save()
            authorData = {
                "type": author.type,
                "id": author.id,
                "host": author.host,
                "displayName": author.displayName,
                "url": author.url,
                "github": f'http://github.com/{author.githubName}',
                "profileImage": author.profileImage
            }
            responseData = {
                "type" : "comment",
                "author" : authorData,
                "comment" : serializer.data["comment"],
                "contentType" : serializer.data["contentType"],
                "published" : serializer.data["published"],
                "id" : serializer.data["id"],
            }
            return Response(responseData, status = status.HTTP_200_OK)
        except Exception as e:
            data = {'error' : str(e)}
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def FollowerViewSet(request, author_id, foreign_author_id = None):
    
    if(foreign_author_id == None):
        if(request.method == 'GET'):
            try:
                followers = models.FollowerModel.objects.filter(followedAuthor = author_id)
                serializer = serializers.FollowerSerializer(followers, many = True)
                print('PRINTING SERIALZER DATA : ',serializer.data)
                authorList = []
                for follower in serializer.data:
                    print(follower)
                    author = get_object_or_404(models.Users, id = follower.follower_id)
                    print(author)
                    authorData = {
                        "type": author.type,
                        "id": author.id,
                        "host": author.host,
                        "displayName": author.displayName,
                        "url": author.url,
                        "github": f'http://github.com/{author.githubName}',
                        "profileImage": author.profileImage
                    }
                    authorList.append(authorData)

                returnVal = {
                    "type" : "followers",
                    "items" : authorList
                }

                return Response(returnVal, status = status.HTTP_200_OK)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)

    else:
        if(request.method == 'GET'):
            try:
                if models.FollowerModel.objects.filter(follower = foreign_author_id, followedAuthor = author_id).exists():
                    data = "IS A FOLLOWER"
                else:
                    data = "IS NOT A FOLLOWER"
                return Response(data, status = status.HTTP_200_OK)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)

        elif(request.method == 'PUT'):
            try:
                data = request.body
                jsonResponse = json.loads(data.decode('utf-8'))
                author = models.Users.objects.get(id = foreign_author_id)
                jsonResponse.update({"followedAuthor" : author_id, "follower" : foreign_author_id})
                serializer = serializers.FollowerSerializer(data = jsonResponse)
                serializer.is_valid(raise_exception = True)
                serializer.save()
                follower = get_object_or_404(models.Users, id = foreign_author_id)
                followedAuthor = models.Users.objects.get(id = author_id)

                followerData = {
                    "type": follower.type,
                    "id": follower.id,
                    "host": follower.host,
                    "displayName": follower.displayName,
                    "url": follower.url,
                    "github": f'http://github.com/{follower.githubName}',
                    "profileImage": follower.profileImage
                }

                followedAuthorData = {
                    "type": followedAuthor.type,
                    "id": followedAuthor.id,
                    "host": followedAuthor.host,
                    "displayName": followedAuthor.displayName,
                    "url": followedAuthor.url,
                    "github": f'http://github.com/{followedAuthor.githubName}',
                    "profileImage": followedAuthor.profileImage
                }

                returnVal = {
                    "type" : "follow",
                    "follower" : followerData,
                    "followed author" : followedAuthorData
                }
                return Response(returnVal, status = status.HTTP_201_CREATED)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)

        elif(request.method == 'DELETE'):
            
            try:
                follow = get_object_or_404(models.FollowerModel, follower = foreign_author_id, followedAuthor = author_id)
                print('FOLLOW OBJECT:', follow)
                serializer = serializers.FollowerSerializer(follow)
                follow.delete()
                data = {"message":"Deletion successful"}
                return Response(data, status = status.HTTP_204_NO_CONTENT)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)

def get_foreign_posts_t17():
    r = requests.get(grp17_url + "/authors/",auth=HTTPBasicAuth('t18user1','Password123!'))
    
    authors = json.loads(r.content)['items']
    posts_list = []
    for author in authors:
        author_url = author['url'] + 'posts/'
        
        try:
            r = requests.get(author_url,auth=HTTPBasicAuth('t18user1','Password123!'))
            # print(json.loads(r.content)['items'])
            for post in json.loads(r.content)['items']:
                if post != []:
                    posts_list.append(post)
        except Exception as e:
            return posts_list  
    return posts_list
#get foregin posts
# def get_foreign_posts():
#     posts_list = []
#     try:
#         posts_list.extend(get_foreign_posts_t17())
#     except:
#         pass
#     posts_list.sort(key=lambda x:x['published'],reverse=True)
#     data = {'posts_list':posts_list}
#     return posts_list