import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager, PermissionsMixin
# Create your models here.
class UserManager(BaseUserManager):
    
    def create_user(self, username, github, profileImage='https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png',password=None, **kwargs):
        """Create and return a `User` with an email, phone number, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')
        if github is None:
            raise TypeError('Users must have an github.')

        user = self.model(username=username,displayName=username,github=github,profileImage=profileImage)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username,github, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')
        if github is None:
            raise TypeError('Superusers must have an github.')
        if username is None:
            raise TypeError('Superusers must have an username.')

        user = self.create_user(username, github, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user

class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()


class User(AbstractBaseUser, PermissionsMixin):
    type = models.CharField(max_length=50, default="author")
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    url = models.CharField(max_length=225, default="http://127.0.0.1:8000/authors/"+str(id))
    host = models.CharField(max_length=200, default='http://127.0.0.1:8000/', blank=True)
    displayName = models.CharField(max_length=200, default="")
    github = models.URLField(db_index=True,unique=True,null=True,blank=True)
    profileImage = models.URLField(max_length=500,default="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png")
    
    username = models.CharField(db_index=True, max_length=255, unique=True)
    # email = models.EmailField(db_index=True, unique=True,  null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now=True)
    #update = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'github'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.github}"
    
    def save(self,*args,**kwargs):
        self.url = "http://127.0.0.1:8000/authors/"+str(self.id)
        return super(User,self).save(*args,**kwargs)

