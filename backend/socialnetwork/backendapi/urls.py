from rest_framework.routers import SimpleRouter
from . import views

app_name = 'backendapi'
routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'backendapi/auth/login/', views.LoginViewSet, basename='auth-login')
routes.register(r'backendapi/auth/register/', views.RegistrationViewSet, basename='auth-register')
#routes.register(r'api/auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'backendapi/user/', views.UserViewSet, basename='user')
routes.register(r'backendapi/authors/', views.UserViewSet, basename='author')


urlpatterns = [
    *routes.urls
]
