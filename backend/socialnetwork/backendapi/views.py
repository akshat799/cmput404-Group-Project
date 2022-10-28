from email import message
from logging import raiseExceptions
import profile
from pyexpat.errors import messages
from django.shortcuts import render
from requests import request
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status,filters
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from . import serializers
from . import models
from rest_framework.decorators import api_view,permission_classes


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AuthorsListView(request):
    #get and return all the authors
    if request.user.is_superuser:
        authors = models.Users.objects.filter(type="author")
        serializer = serializers.UserSerializer(authors,many=True)
        data = {"type":"authors",
                "items":serializer.data
                }
        return Response(data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AuthorsView(request,author_id):
    #return specific author
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

