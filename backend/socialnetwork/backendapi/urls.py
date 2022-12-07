from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import SimpleRouter

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
schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,

   permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    path('backendapi/authors/<author_id>', views.AuthorsView),
    path('backendapi/authors/<author_id>/posts/<post_id>', views.PostViewSet),
    path('backendapi/authors/<author_id>/posts/', views.PostViewSet),
    path('backendapi/authors/posts/', views.PostViewSet),
    path('backendapi/authors/<author_id>/inbox', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/likes', views.LikeViewSet),
    path('backendapi/authors/<author_id>/posts/<post_id>/comments/<comment_id>/likes',views.LikeViewSet),
    path('backendapi/authors/<author_id>/liked', views.LikedViewSet),
    path('backendapi/editprofile/<author_id>',views.editProfielView),
    path('backendapi/authors/', views.AuthorsListView),
    path('backendapi/authors/<author_id>/posts/<post_id>/comments', views.CommentViewSet),
    path('backendapi/authors/<author_id>/followers/<foreign_author_id>', views.FollowerViewSet),
    path('backendapi/authors/<author_id>/followers', views.FollowerViewSet)
]
urlpatterns+=routes.urls
urlpatterns+=[
      re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]