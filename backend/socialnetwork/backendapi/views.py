from pyexpat.errors import messages
from pyexpat import model
from django.shortcuts import render, get_object_or_404
from django import http
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.pagination import PageNumberPagination
from . import serializers
from . import models
from .paginaion import CustomPagiantor
import json
import uuid
from .auth import *
import requests
from requests.auth import HTTPBasicAuth
import json
from uuid import UUID
from django.forms.models import model_to_dict

url = "https://cmput404team18-backend.herokuapp.com/backendapi"
grp17_url = "https://cmput404f22t17.herokuapp.com"
grp15_url = "https://fallsocialuahank.herokuapp.com/service"
grp05_url = "https://fallprojback.herokuapp.com"

grp17_username = 't18user1'
grp17_password = 'Password123!'
grp15_username = "18fifteen"
grp15_password = "18fifteen"
grp05_username = "admin"
grp05_password = "admin"

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
            req2 = requests.get(grp15_url + '/authors', auth=HTTPBasicAuth(grp15_username,grp15_password))
            req3 = requests.get(grp05_url + '/authors', auth=HTTPBasicAuth(grp05_username,grp05_password))
            
            if(req.status_code == 200):
                node_dataGrp17 = json.loads(req.content.decode('utf-8'))["items"]
            else:
                node_dataGrp17 = []
                #print(items_data)
            if(req2.status_code == 200):
                node_dataGrp15 = json.loads(req2.content.decode('utf-8'))["items"]
            else:
                node_dataGrp15 = []
            if(req3.status_code == 200):
                node_dataGrp05 = json.loads(req3.content.decode('utf-8'))["items"]
            else:
                node_dataGrp05 = []
            items_data = serializer.data + node_dataGrp17 + node_dataGrp15 + node_dataGrp05
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

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def AuthorsView(request,author_id):
    if(request.method == 'GET'):
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
    if(request.method == 'POST'):
        response = check_auth(request)
        if(response != 'local' and response != 'remote'):
            return response
        if(response == 'remote'):
            message = {'message','You do not have authorization to edit this profile.'}
            return Response(message,status=status.HTTP_401_UNAUTHORIZED)
        else:
            data = request.data
            try:
                authors = models.Users.objects.get(id=author_id)
               # serializer = serializers.UserSerializer(authors,data,partial=True)
                if data.get("displayName"):
                    authors.displayName = data["displayName"]
                    authors.save(update_fields=["displayName"])
                if data.get("githubName"):
                    authors.githubName = data["githubName"]
                    authors.save(update_fields=["githubName"])
                if data.get("email"):
                    authors.email = data["email"]
                    authors.save(update_fields=["email"])
                if data.get("profileImage"):
                    authors.profileImage = data["profileImage"]
                    authors.save(update_fields=["profileImange"])
                
                
                
                # message = {'message','successfully update profile'}
                return Response(model_to_dict(authors),status=status.HTTP_200_OK)
            except Exception as e:
                message = {'error',e}
                messages.error(request,'Fail to update profile')
                return Response(message,status=status.HTTP_400_BAD_REQUEST)


    

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
                            author = models.Users.objects.get(id = author_id)
                            post = models.PostModel.objects.get(id=post_id,visibility='PUBLIC', author = author)
                            serializer = serializers.PostSerializer(post)
                            serial_data = serializer.data
                            serial_data["id"] = url + f'/authors/{post.author.id}/posts/{post.id}'
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
                                req = requests.get(grp17_url + f'/authors/{author_id}/posts/{post_id}/', auth=HTTPBasicAuth(grp17_username,grp17_password))
                                posts = json.loads(req.content)
                                
                                return Response(posts , status=status.HTTP_200_OK )
                            except:
                                try:
                                    req = requests.get(grp15_url + f'/authors/{author_id}/posts/{post_id}', auth=HTTPBasicAuth(grp15_username,grp15_password))
                                    posts = json.loads(req.content)
                                    return Response(posts , status=status.HTTP_200_OK )
                                except:
                                    try:
                                        req = requests.get(grp05_url+ f'/authors/{author_id}/posts/{post_id}', auth=HTTPBasicAuth(grp05_username,grp05_password))
                                        posts = json.loads(req.content)
                                        return Response(posts , status=status.HTTP_200_OK)
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
                                entry["id"] = url + f'/authors/{author_id}/posts/{entry["id"]}'
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
                                req = requests.get(grp15_url + f'/authors/{author_id}/posts/', auth=HTTPBasicAuth(grp15_username,grp15_password))
                                node_data = json.loads(req.content)
                                return Response(node_data, status=status.HTTP_200_OK )
                            except:
                                try:
                                    req = requests.get(grp17_url + f'/authors/{author_id}/posts/', auth=HTTPBasicAuth(grp17_username,grp17_password))
                                    node_data = json.loads(req.content)
                                    return Response(node_data, status=status.HTTP_200_OK )
                                except:
                                    try:
                                        req = requests.get(grp05_url + f'/authors/{author_id}/posts/', auth=HTTPBasicAuth(grp05_username,grp05_password))
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

                    data = serializer.data

                    for entry in data:
                        entry["id"] = url + f'/authors/{entry["author"]}/posts/{entry["id"]}'
                        author = get_object_or_404(models.Users , id = entry["author"])

                        entry["author"] = {
                            "type": author.type,
                            "id": f'{url}/authors/{str(author.id)}',
                            "host": author.host,
                            "displayName": author.displayName,
                            "url": author.url,
                            "github": f'http://github.com/{author.githubName}',
                            "profileImage": author.profileImage
                        }

                    if(response == 'local'):
                        try:
                            r = requests.get(grp17_url+"/posts",auth=HTTPBasicAuth(grp17_username,grp17_password))
                            r2 = requests.get(grp15_url+"/posts",auth=HTTPBasicAuth(grp15_username,grp15_password))
                            r3 = requests.get(grp05_url+"/authors/posts_all",auth=HTTPBasicAuth(grp05_username,grp05_password))
                            if(r.status_code == 200 ):
                                posts_all = (json.loads(r.content)['items'])
                            if(r2.status_code == 200):
                                posts_all += (json.loads(r2.content)['items'])
                            if(r3.status_code == 200):
                                posts_all += (json.loads(r3.content)['items'])
                        except Exception as e:
                            return posts_all
                        #posts_all = get_foreign_posts_t17()
                        #print(posts_all)
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
               

                post.title = postData["title"]
                post.description = postData["description"]
                post.contentType = postData["contentType"]
                post.content = postData["content"]
                post.categories = postData["categories"]
                post.visibility = postData["visibility"]

                post.save(update_fields=["title" , "description", "contentType", "content", "categories", "visibility"])
                
                data = model_to_dict(post)
                data["published"] = str(data["published"])
                data["id"] = url + f'/authors/{author_id}/posts/{post_id}'
                data["author"] = {
                    "type": author.type,
                    "id": str(author.id),
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }

                if data["visibility"] == "FRIENDS":
                    try:
                        followerList = models.FollowerModel.objects.filter(followedAuthor = author_id)

                        for followers in followerList:
                            try:
                                inboxreceiver = models.InboxObject.objects.get(author = followers.follower.id)
                                data_listreceiver = []
                                data_listreceiver.append(json.dumps(data))
                                inboxreceiver.object = inboxreceiver.object + data_listreceiver
                                inboxreceiver.save(update_fields=["object"])
                            
                            except Exception as e:
                                inboxAuthorreceiver = get_object_or_404(models.Users , id =followers.follower.id)
                                inboxReciever = {
                                    "type" : "inbox",
                                    "author" : inboxAuthorreceiver.id,
                                    "object" : [json.dumps(data , indent=10)]
                                }

                                inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                                inboxrecieverSerializer.is_valid(raise_exception = True)
                                inboxrecieverSerializer.save()

                        try:
                            inboxsender = models.InboxObject.objects.get(author = author_id)
                            data_listsender = []
                            data_listsender.append(json.dumps(data))
                            inboxsender.object = inboxsender.object + data_listsender
                            inboxsender.save(update_fields=["object"])
                        
                        except Exception as e:
                            inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                            inboxSender = {
                                "type" : "inbox",
                                "author" : inboxAuthorsender.id,
                                "object" : [json.dumps(data , indent=10)]
                            }

                            inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                            inboxsenderSerializer.is_valid(raise_exception = True)
                            inboxsenderSerializer.save()
                    except Exception as e:
                        data = {'error': str(e)}
                        return Response(data,status=status.HTTP_404_NOT_FOUND)

                return Response(data , status=status.HTTP_201_CREATED)

            elif post_id == None:
                author = get_object_or_404(models.Users,id=author_id)
                postData = request.data
                postData.update({"author": author.id})
                serializer = serializers.PostSerializer(data=postData)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                data = serializer.data
                data["published"] = str(data["published"])
                data["id"] = url + f'/authors/{author_id}/posts/{data["id"]}'
                data["author"] = {
                    "type": author.type,
                    "id": str(author.id),
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }

                if data["visibility"] == "FRIENDS":
                    try:
                        followerList = models.FollowerModel.objects.filter(followedAuthor = author_id)

                        for followers in followerList:
                            try:
                                inboxreceiver = models.InboxObject.objects.get(author = followers.follower.id)
                                data_listreceiver = []
                                data_listreceiver.append(json.dumps(data))
                                inboxreceiver.object = inboxreceiver.object + data_listreceiver
                                inboxreceiver.save(update_fields=["object"])
                            
                            except Exception as e:
                                inboxAuthorreceiver = get_object_or_404(models.Users , id =followers.follower.id)
                                inboxReciever = {
                                    "type" : "inbox",
                                    "author" : inboxAuthorreceiver.id,
                                    "object" : [json.dumps(data , indent=10)]
                                }

                                inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                                inboxrecieverSerializer.is_valid(raise_exception = True)
                                inboxrecieverSerializer.save()

                        try:
                            inboxsender = models.InboxObject.objects.get(author = author_id)
                            data_listsender = []
                            data_listsender.append(json.dumps(data))
                            inboxsender.object = inboxsender.object + data_listsender
                            inboxsender.save(update_fields=["object"])
                        
                        except Exception as e:
                            inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                            inboxSender = {
                                "type" : "inbox",
                                "author" : inboxAuthorsender.id,
                                "object" : [json.dumps(data , indent=10)]
                            }

                            inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                            inboxsenderSerializer.is_valid(raise_exception = True)
                            inboxsenderSerializer.save()
                    except Exception as e:
                        data = {'error': str(e)}
                        return Response(data,status=status.HTTP_404_NOT_FOUND)

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
            serializer.is_valid(raise_exception=True)
            serializer.save(id=post_id)
            
            data = serializer.data
            
            data["published"] = str(data["published"])
            data["id"] = url + f'/authors/{author_id}/posts/{data["id"]}'
            data["author"] = {
                "type": author.type,
                "id": str(author.id),
                "host": author.host,
                "displayName": author.displayName,
                "url": author.url,
                "github": f'http://github.com/{author.githubName}',
                "profileImage": author.profileImage
            }

            if data["visibility"] == "FRIENDS":
                    try:
                        followerList = models.FollowerModel.objects.filter(followedAuthor = author_id)

                        for followers in followerList:
                            try:
                                inboxreceiver = models.InboxObject.objects.get(author = followers.follower.id)
                                data_listreceiver = []
                                data_listreceiver.append(json.dumps(data))
                                inboxreceiver.object = inboxreceiver.object + data_listreceiver
                                inboxreceiver.save(update_fields=["object"])
                            
                            except Exception as e:
                                inboxAuthorreceiver = get_object_or_404(models.Users , id =followers.follower.id)
                                inboxReciever = {
                                    "type" : "inbox",
                                    "author" : inboxAuthorreceiver.id,
                                    "object" : [json.dumps(data , indent=10)]
                                }

                                inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                                inboxrecieverSerializer.is_valid(raise_exception = True)
                                inboxrecieverSerializer.save()

                        try:
                            inboxsender = models.InboxObject.objects.get(author = author_id)
                            data_listsender = []
                            data_listsender.append(json.dumps(data))
                            inboxsender.object = inboxsender.object + data_listsender
                            inboxsender.save(update_fields=["object"])
                        
                        except Exception as e:
                            inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                            inboxSender = {
                                "type" : "inbox",
                                "author" : inboxAuthorsender.id,
                                "object" : [json.dumps(data , indent=10)]
                            }

                            inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                            inboxsenderSerializer.is_valid(raise_exception = True)
                            inboxsenderSerializer.save()
                    except Exception as e:
                        data = {'error': str(e)}
                        return Response(data,status=status.HTTP_404_NOT_FOUND)

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
    
                if("comment" not in postData):                  
                    postData["object"] =  url + f"/authors/{author.id}/posts/{postData['post']}"
                elif("comment" in postData):
                    postData["object"] =  url + f"/authors/{author.id}/posts/{postData['post']}/comments/{postData['comment']}"
                
                postData["author"] = author_id


                serializer = serializers.LikesSerializer(data=postData)
                serializer.is_valid(raise_exception=True)
                serializer.save()

                data = serializer.data

                data["author"] = {
                    "type": author.type,
                    "id": str(author.id),
                    "host": author.host,
                    "displayName": author.displayName,
                    "url": author.url,
                    "github": f'http://github.com/{author.githubName}',
                    "profileImage": author.profileImage
                }

                data.pop("post")
                data.pop("comment")
                data.pop("id")

                try:
                    inbox = models.InboxObject.objects.get(author = author_id)
                    data_list = []
                    data_list.append(json.dumps(data))
                    inbox.object = inbox.object + data_list
                    inbox.save(update_fields=["object"])

                except Exception as e:
                    inboxAuthor = get_object_or_404(models.Users , id = author_id)
                    inbox = {
                        "type" : "inbox",
                        "author" : inboxAuthor.id,
                        "object" : [json.dumps(data , indent=10)]
                    }

                    inboxSerializer = serializers.InboxObjectSerializer(data = inbox)
                    inboxSerializer.is_valid(raise_exception = True)
                    inboxSerializer.save()

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
                            
                    return Response(data, status=status.HTTP_200_OK)

                elif comment_id == None:
                    likes = models.LikeModel.objects.filter(post = post_id)
                    serializer = serializers.LikesSerializer(likes,many=True)
                    data = serializer.data
                    all_nonComment = []

                    for entry in data:
                        if(entry["comment"] is None):
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
                            all_nonComment.append(entry)   

                    return Response(all_nonComment, status=status.HTTP_200_OK)
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
        likes = models.LikeModel.objects.all()

        serializer = serializers.LikesSerializer(likes,many=True)
        data = serializer.data
        all_post = []
        for entry in data:
            authorCheck = entry["object"].split("/")[5]
            if(authorCheck == author_id):
                post = models.PostModel.objects.get(id = entry["post"])
                if(post.visibility == 'PUBLIC'):
                    if(entry["comment"] is None):
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
                        all_post.append(entry)
        return Response({
            "type": "liked",
            "items": all_post
        }, status=status.HTTP_200_OK)  
    except Exception as e:
        data = {'error': str(e)}
        return Response(data,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def CommentViewSet(request, author_id, post_id):

    paginator = CustomPagiantor()

    if(request.method == 'GET'):
        try:
            comments = models.CommentModel.objects.filter(post = post_id)
            post = get_object_or_404(models.PostModel , id = post_id)

            result_page = paginator.paginate_queryset(comments, request)
            serializer = serializers.CommentSerializer(result_page, many = True)
            paginator_result = paginator.get_paginated_response(serializer.data).data
            page = paginator_result.get("page")
            if page == None:
                page = 1
            size = paginator_result.get("count")
            
            comments = serializer.data

            for entry in comments:
                commentAuthor = get_object_or_404(models.Users , id = entry["author"])
                entry["id"] = url + f'/authors/{post.author.id}/posts/{post_id}/comments/{entry["id"]}'

                entry["author"] = {
                    "type": commentAuthor.type,
                    "id": commentAuthor.id,
                    "host": commentAuthor.host,
                    "displayName": commentAuthor.displayName,
                    "url": commentAuthor.url,
                    "github": f'http://github.com/{commentAuthor.githubName}',
                    "profileImage": commentAuthor.profileImage
                }

                entry.pop("post")
                

            result = {
                    "type": "comments",
                    "page": page,
                    "size": size,
                    "post": url + f'/authors/{post.author.id}/posts/{post_id}',
                    "id": post_id + "/comments",
                    'comments': comments
            }
            
            return Response(result, status = status.HTTP_200_OK)
        except Exception as e:
            try:
                req = requests.get(grp05_url+ f'/authors/{author_id}/posts/{post_id}/comments', auth=HTTPBasicAuth(grp05_username,grp05_password))
                commentGrp05 = json.loads(req.content)

                return Response(commentGrp05 , status.HTTP_200_OK)

            except Exception as e:
                try:
                   req = requests.get(grp15_url + f'/authors/{author_id}/posts/{post_id}/comments', auth=HTTPBasicAuth(grp15_username,grp15_password))
                   commentGrp15 = json.loads(req.content)
                   commentGrp15["comments"] = commentGrp15["items"]
                   commentGrp15.pop("items")
                   return Response(commentGrp15 , status.HTTP_200_OK) 
                except Exception as e:
                    try:
                        req = requests.get(grp17_url + f'/authors/{author_id}/posts/{post_id}/comments', auth=HTTPBasicAuth(grp17_username,grp17_password))
                        commentGrp17 = json.loads(req.content)
                        return Response(commentGrp17 , status.HTTP_200_OK)
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

            commentData = serializer.data
            #this is the author who made the comment
            commentData["author"] = {
                "type": author.type,
                "id": str(author.id),
                "host": author.host,
                "displayName": author.displayName,
                "url": author.url,
                "github": f'http://github.com/{author.githubName}',
                "profileImage": author.profileImage
            }


            #get post origin author for post id
            post = models.PostModel.objects.get(id=post_id)

            # try to add comment in post table
            if(post.comments is None):
                post.comments = f"{url}/authors/{post.author.id}/posts/{post.id}/comments"
                updateField = ["comments", "count"]
            else:
                updateField = ["count"]
            
            commentData["post"] = url + f'/authors/{post.author.id}/posts/{post_id}'
            post.count += 1
            post.save(update_fields= updateField)
            
            # add this comment to the post's owner's inbox
            if(post.visibility == "FRIENDS"):
                try:
                    inboxreceiver = models.InboxObject.objects.get(author = post.author.id)
                    data_listreceiver = []
                    data_listreceiver.append(json.dumps(commentData))
                    inboxreceiver.object = inboxreceiver.object + data_listreceiver
                    inboxreceiver.save(update_fields=["object"])
                
                except Exception as e:
                    inboxAuthorreceiver = get_object_or_404(models.Users , id =post.author.id)
                    inboxReciever = {
                        "type" : "inbox",
                        "author" : inboxAuthorreceiver.id,
                        "object" : [json.dumps(commentData , indent=10)]
                    }

                    inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                    inboxrecieverSerializer.is_valid(raise_exception = True)
                    inboxrecieverSerializer.save()

                try:
                    inboxsender = models.InboxObject.objects.get(author = author_id)
                    data_listsender = []
                    data_listsender.append(json.dumps(commentData))
                    inboxsender.object = inboxsender.object + data_listsender
                    inboxsender.save(update_fields=["object"])
                
                except Exception as e:
                    inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                    inboxSender = {
                        "type" : "inbox",
                        "author" : inboxAuthorsender.id,
                        "object" : [json.dumps(commentData , indent=10)]
                    }

                    inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                    inboxsenderSerializer.is_valid(raise_exception = True)
                    inboxsenderSerializer.save()

            return Response(commentData, status = status.HTTP_200_OK)
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
                #print('PRINTING SERIALZER DATA : ',serializer.data)
                authorList = []
                for follower in serializer.data:
                    #print(follower['follower'])
                    author = get_object_or_404(models.Users, id = follower['follower'])
                    #print(author)
                    authorData = {
                        "type": author.type,
                        "id": author.id,
                        "host": author.host,
                        "displayName": author.displayName,
                        "url": author.url,
                        "github": f'http://github.com/{author.githubName}',
                        "profileImage": author.profileImage,
                        "isTrueFriend":follower['true_friends']
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
                #check if it's follow himself
                if author_id == foreign_author_id:
                    return Response("You cannot follow yourself", status=400)
                #check if already follow this author
                if models.FollowerModel.objects.filter(follower = foreign_author_id, followedAuthor = author_id).exists():
                    result = {
                        "detail": "You already followed this user!"
                    }
                    return Response(result,status=status.HTTP_400_BAD_REQUEST)
                
                TrueFirend_check = False
                #check if the author is also following the actor
                if models.FollowerModel.objects.filter(follower = author_id, followedAuthor = foreign_author_id).exists():
                    TrueFirend_check = True
                    models.FollowerModel.objects.filter(follower = author_id, followedAuthor = foreign_author_id).update(true_friends=TrueFirend_check)

                inbox = get_object_or_404(models.InboxObject , author = author_id)
                
                inboxCount = 0
                for length in inbox.object:
                    data = json.loads(length)
                    # print(data["actor"]["id"])
                    inboxCount += 1
                    if "actor" in data:
                        if data["actor"]["id"] == foreign_author_id:
                            #print("hi")
                            inbox.object.pop(inboxCount-1)
                            inbox.save(update_fields=["object"])

                follower = get_object_or_404(models.Users, id = foreign_author_id)
                followedAuthor = models.Users.objects.get(id = author_id)
                models.FollowerModel.objects.create(follower = follower,followedAuthor=followedAuthor,true_friends=TrueFirend_check)
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
                result={
                    "detail": "Following request has been accpected! "+str(follower.displayName) +" is now following you! "
                    }
                
                
                return Response(result, status = status.HTTP_201_CREATED)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)

        elif(request.method == 'DELETE'):
            #unfollow the author
            try:
                follow = get_object_or_404(models.FollowerModel, follower = foreign_author_id, followedAuthor = author_id)
                serializer = serializers.FollowerSerializer(follow)
                follow.delete()
                data = {"message":"Deletion successful"}
                return Response(data, status = status.HTTP_204_NO_CONTENT)
            except Exception as e:
                data = {'error' : str(e)}
                return Response(data, status = status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def InboxViewSet(request,author_id):
    if(request.method == "GET"):
        try:
            author = get_object_or_404(models.Users,id = author_id)
            queryset = models.InboxObject.objects.filter(author=author)
            pagination = CustomPagiantor()
            qs = pagination.paginate_queryset(queryset, request)
            serializer = serializers.InboxObjectSerializer(qs, many=True)

            items = []
            for io in serializer.data:
                for i in io["object"]:
                    items.append(json.loads(i))
            #print(json.loads(serializer.data["object"]))
            res = {
                "type": "inbox",
                "author": author.url,
                "items": items#[io["object"] for io in serializer.data]
            }
            return Response(res, status=status.HTTP_200_OK)
        except Exception as e:
            data = {'error' : str(e)}
            return Response(data, status = status.HTTP_400_BAD_REQUEST)

    
    if(request.method == "POST"):
        author = get_object_or_404(models.Users,id = author_id)

        if request.data["type"] == "post":
            postID = request.data["post"]
            post = models.PostModel.objects.get(id=postID)
            postData = model_to_dict(post)
            
            postData["id"] = url + f'/authors/{post.author.id}/posts/{post.id}'
            postData["author"] = {
                "type": post.author.type,
                "id": str(post.author.id),
                "host": post.author.host,
                "displayName": post.author.displayName,
                "url": post.author.url,
                "github": f'http://github.com/{post.author.githubName}',
                "profileImage": post.author.profileImage,
            }

            postData["published"] = str(postData["published"])

            receiverAuthor = get_object_or_404(models.Users , id = request.data["author"])
            try:
                inboxreceiver = models.InboxObject.objects.get(author = receiverAuthor.id)
                data_listreceiver = []
                data_listreceiver.append(json.dumps(postData))
                inboxreceiver.object = inboxreceiver.object + data_listreceiver
                inboxreceiver.save(update_fields=["object"])
            
            except Exception as e:
                inboxAuthorreceiver = get_object_or_404(models.Users , id =receiverAuthor.id)
                inboxReciever = {
                    "type" : "inbox",
                    "author" : inboxAuthorreceiver.id,
                    "object" : [json.dumps(postData , indent=10)]
                }

                inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                inboxrecieverSerializer.is_valid(raise_exception = True)
                inboxrecieverSerializer.save()

            try:
                inboxsender = models.InboxObject.objects.get(author = author_id)
                data_listsender = []
                data_listsender.append(json.dumps(postData))
                inboxsender.object = inboxsender.object + data_listsender
                inboxsender.save(update_fields=["object"])
                return Response(model_to_dict(inboxsender), status.HTTP_200_OK)
            
            except Exception as e:
                inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                inboxSender = {
                    "type" : "inbox",
                    "author" : inboxAuthorsender.id,
                    "object" : [json.dumps(postData , indent=10)]
                }

                inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                inboxsenderSerializer.is_valid(raise_exception = True)
                inboxsenderSerializer.save()
                return Response(inboxsenderSerializer.data , status.HTTP_200_OK)
            

        elif request.data["type"] =="comment":

            comment = get_object_or_404(models.CommentModel , id = request.data["comment"])
            commentData = model_to_dict(comment)
            commentData["published"] = str(commentData["published"])
            commentData["id"] = url + f'/authors/{comment.post.author.id}/posts/{comment.post.id}/comments/{comment.id}'
            commentData["author"] = {
                "type": comment.post.author.type,
                "id": str(comment.post.author.id),
                "host": comment.post.author.host,
                "displayName": comment.post.author.displayName,
                "url": comment.post.author.url,
                "github": f'http://github.com/{comment.post.author.githubName}',
                "profileImage": comment.post.author.profileImage
            }
            commentData["post"] = url + f'/authors/{comment.post.author.id}/posts/{comment.post.id}'
            receiverAuthor = get_object_or_404(models.Users , id = request.data["author"])

            try:
                inboxreceiver = models.InboxObject.objects.get(author = receiverAuthor.id)
                data_listreceiver = []
                data_listreceiver.append(json.dumps(commentData))
                inboxreceiver.object = inboxreceiver.object + data_listreceiver
                inboxreceiver.save(update_fields=["object"])
            
            except Exception as e:
                inboxAuthorreceiver = get_object_or_404(models.Users , id =receiverAuthor.id)
                inboxReciever = {
                    "type" : "inbox",
                    "author" : inboxAuthorreceiver.id,
                    "object" : [json.dumps(commentData , indent=10)]
                }

                inboxrecieverSerializer = serializers.InboxObjectSerializer(data = inboxReciever)
                inboxrecieverSerializer.is_valid(raise_exception = True)
                inboxrecieverSerializer.save()

            try:
                inboxsender = models.InboxObject.objects.get(author = author_id)
                data_listsender = []
                data_listsender.append(json.dumps(commentData))
                inboxsender.object = inboxsender.object + data_listsender
                inboxsender.save(update_fields=["object"])
                return Response(model_to_dict(inboxsender), status.HTTP_200_OK)
            
            except Exception as e:
                inboxAuthorsender = get_object_or_404(models.Users , id = author_id)
                inboxSender = {
                    "type" : "inbox",
                    "author" : inboxAuthorsender.id,
                    "object" : [json.dumps(commentData , indent=10)]
                }

                inboxsenderSerializer = serializers.InboxObjectSerializer(data = inboxSender)
                inboxsenderSerializer.is_valid(raise_exception = True)
                inboxsenderSerializer.save()
                return Response(inboxsenderSerializer.data , status.HTTP_200_OK)


        elif request.data["type"].lower() == "follow":
            """ required: {"type", "follower"} """
            InboxAuthor_name = str(author.displayName)
            follower_url = request.data['object']
            follower_uuid = follower_url.split('authors/')[1]
            follower_obj = get_object_or_404(models.Users,id = follower_uuid)
            
            #check if its already a follower
            if models.FollowerModel.objects.filter(follower = follower_uuid, followedAuthor = author_id).exists():
                result = {
                    "detail": str(follower_obj.displayName) +" is already following "+ InboxAuthor_name
                }
                return Response(result,status=status.HTTP_400_BAD_REQUEST)
            
            # add follow request to the author' inbox
            data= {
                "type" : "follow",
                "summary" : str(follower_obj.displayName) + " wants to follow " + InboxAuthor_name,
                "actor": serializers.UserSerializer(follower_obj).data,
                "object":serializers.UserSerializer(author).data
            }
            try:
                inbox = models.InboxObject.objects.get(author = author_id)
                data_list = []
                data_list.append(json.dumps(data))
                inbox.object = inbox.object + data_list
                inbox.save(update_fields=["object"])

            except Exception as e:
                inboxAuthor = get_object_or_404(models.Users , id = author_id)
                inbox = {
                    "type" : "inbox",
                    "author" : inboxAuthor.id,
                    "object" : [json.dumps(data , indent=10)]
                }

                inboxSerializer = serializers.InboxObjectSerializer(data = inbox)
                inboxSerializer.is_valid(raise_exception = True)
                inboxSerializer.save()
            
            result={
                "detail": str(follower_obj.displayName) +" sent a follow request to "+ InboxAuthor_name
            }

            return Response(result, status=status.HTTP_200_OK)
    

    if(request.method == "DELETE"):
        author = get_object_or_404(models.Users,id = author_id)

        #author = models.Users.objects.get(id=author_id)
        models.InboxObject.objects.filter(author=author.url).delete()

        return Response(status=status.HTTP_200_OK)
