from rest_framework.routers import SimpleRouter
from . import views
from django.urls import path

app_name = 'backendapi'
routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'backendapi/auth/login/', views.LoginViewSet, basename='auth-login')
routes.register(r'backendapi/auth/register/', views.RegistrationViewSet, basename='auth-register')

urlpatterns = [
    path('editprofile/{str:author_id}',views.editProfielView),
    path('backendapi/authors/', views.AuthorsListView),
    path('backendapi/authors/{str:author_id}', views.AuthorsView),
    *routes.urls
]
