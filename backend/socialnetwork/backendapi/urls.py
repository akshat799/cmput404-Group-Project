from rest_framework.routers import SimpleRouter
from django.urls import path
from . import views

app_name = 'backendapi'
routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'backendapi/auth/login', views.LoginViewSet, basename='auth-login')
routes.register(r'backendapi/auth/register', views.RegistrationViewSet, basename='auth-register')
#routes.register(r'api/auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'backendapi/user', views.UserViewSet, basename='user')
# routes.register(r'backendapi/authors', views.UserViewSet, basename='author')
# routes.register(r'backendapi/authors/', views.AuthorsListView, basename='author')


urlpatterns = [
    path('backendapi/authors/<author_id>', views.AuthorsView),
    path('backendapi/authors/<author_id>/posts/<post_id>', views.PostViewSet),
    path('backendapi/authors/<author_id>/posts/', views.PostViewSet),
    path('backendapi/authors/<author_id>/inbox', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/likes', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/comments/<comment_id>/likes',views.LikeViewSet),
    path('backendapi/authors/<author_id>/liked', views.LikedViewSet),
    *routes.urls
]
