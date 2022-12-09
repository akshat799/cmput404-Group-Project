from rest_framework.response import Response
from rest_framework import status
from . import models
import base64


def check_auth(req):
    if(req.META.get('HTTP_AUTHORIZATION') == None):
        message = {"Error": "Authorization Required"}
        return Response(message , status.HTTP_401_UNAUTHORIZED)

    auth_method = req.META['HTTP_AUTHORIZATION'].split(" ")[0].lower()
    auth_param = req.META['HTTP_AUTHORIZATION'].split(" ")[1].lower()
    if(auth_method == None):
        message = {"Error": "Authorization Required"}
        return Response(message , status.HTTP_401_UNAUTHORIZED)
    elif(auth_method == 'bearer'):
        return 'local'
    elif(auth_method == 'basic'):
        auth_header = req.META['HTTP_AUTHORIZATION']
        encodeC = auth_header.split(' ')[1] #remove basic 'Basic' from string
        decodeC = base64.b64decode(encodeC).decode('utf-8').split(':')

        username = decodeC[0]
        password = decodeC[1]

        try:
            user = models.Node.objects.get(username=username)
            if (user.verified):
                if(user.password == password):
                    return 'remote'
                else:
                    message = {"Error": "Password incorrect, Try Again!"}
                    return Response(message, status.HTTP_401_UNAUTHORIZED)
            else:
                message = {"Error": "Access Denied. Unverified node connection"}
                return Response(message , status.HTTP_403_FORBIDDEN)
        except:
            message = {"Error": "username is incorrect or user with the username does not exist"}
            return Response(message , status.HTTP_404_NOT_FOUND)
