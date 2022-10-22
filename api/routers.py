from rest_framework.routers import SimpleRouter
from api.user.viewsets import UserViewSet
from api.auth.viewsets import LoginViewSet, RegistrationViewSet


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'api/auth/login', LoginViewSet, basename='auth-login')
routes.register(r'api/auth/register', RegistrationViewSet, basename='auth-register')
#routes.register(r'api/auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'api/user', UserViewSet, basename='user')
routes.register(r'authors', UserViewSet, basename='author')


urlpatterns = [
    *routes.urls
]
