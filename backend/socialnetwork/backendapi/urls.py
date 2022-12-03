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
# routes.register(r'backendapi/user', views.UserViewSet, basename='user')
# routes.register(r'backendapi/authors', views.UserViewSet, basename='author')
# routes.register(r'backendapi/authors/', views.AuthorsListView, basename='author')


urlpatterns = [
    path('backendapi/authors/<author_id>', views.AuthorsView),
    path('backendapi/authors/<author_id>/posts/<post_id>', views.PostViewSet),
    path('backendapi/authors/<author_id>/posts/', views.PostViewSet),
    path('backendapi/authors/posts/', views.PostViewSet),
    #add slash on the end as sample for post like
    path('backendapi/authors/<author_id>/inbox/', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/likes', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/comments/<comment_id>/likes',views.LikeViewSet),
    path('backendapi/authors/<author_id>/liked', views.LikedViewSet),
    #path('backendapi/editprofile/<author_id>',views.editProfielView),
    path('backendapi/authors/', views.AuthorsListView),
    path('backendapi/authors/<author_id>/posts/<post_id>/comments', views.CommentViewSet),
    path('backendapi/authors/<author_id>/followers/<foreign_author_id>', views.FollowerViewSet),
    path('backendapi/authors/<author_id>/followers', views.FollowerViewSet),
    path('backendapi/authors/<author_id>/inbox',views.InboxViewSet),
    *routes.urls
]
