from rest_framework.response import Response
from rest_framework import status
from . import models
import base64


def check_auth(req):

    if(req.META['HTTP_AUTHORIZATION'] == None):
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
        auth_param = base64.b64decode(auth_param.strip()).decode('utf-8')

            # username = auth_param.split(':')[0]
            # password = auth_param.split(':')[1]
            username = decodeC[0]
            password = decodeC[1]

        print(username , password)

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