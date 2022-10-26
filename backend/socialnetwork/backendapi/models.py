from django.contrib.postgres.fields import ArrayField
import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager, PermissionsMixin
#make this as defual url for now
url="http://CMPUT404-GROUP-PROJECT.herokuapp.com/"
#create user.
class UserManager(BaseUserManager):
    
    def create_user(self, username,password=None, profileImage='https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png', **kwargs):
        """Create and return a `User` with an email, phone number, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')
        

        user = self.model(username=username,displayName=username,profileImage=profileImage)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')
        # if github is None:
        #     raise TypeError('Superusers must have an github.')
        if username is None:
            raise TypeError('Superusers must have an username.')

        user = self.create_user(username, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user

class AutoDateTimeField(models.DateTimeField):
    def pre_save(self, model_instance, add):
        return timezone.now()


class User(AbstractBaseUser, PermissionsMixin):
    type = models.CharField(default="author",editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    url = models.CharField(max_length=225, default="http://127.0.0.1:8000/authors/"+str(id))
    host = models.CharField(max_length=200, default='http://127.0.0.1:8000/', blank=True)
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True,  null=True, blank=True)
    displayName = models.CharField(max_length=200, default="")
    githubName = models.CharField(max_length = 100,verbose_name='githubName',default="",blank=True)
    profileImage = models.URLField(max_length=500,default="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_1280.png")
    
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)
    #update = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    #REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f"{self.username}"
    
    def save(self,*args,**kwargs):
        self.url = "http://127.0.0.1:8000/authors/"+str(self.id)
        return super(User,self).save(*args,**kwargs)

# Create your models here.
class LoginInformationModle(models.Model):
    username = models.CharField(max_length=100,verbose_name='username')
    password = models.CharField(max_length = 100,verbose_name='password')
    githubName = models.CharField(max_length = 100,verbose_name='githubName',default="",blank=True)
    id = models.CharField(max_length=255,verbose_name='id',primary_key=True)
    email = models.EmailField(db_index=True, unique=True,  null=True, blank=True)
    
    class Meta:
        db_table = 'LoginInformation'

class PostModel(models.Model):
    type = models.CharField(default="post",editable=False) 
    title = models.CharField(max_length=200)
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    source = models.URLField(max_length=255, default=url) # where did you get this post from?
    origin = models.URLField(max_length=255, default=url) # where is it actually from
    description = models.TextField()
    
    CT_MARKDOWN = 'text/markdown' #commonMark
    CT_PLAIN = 'text/plain'       # utf-8
    CT_HTML = 'text/html'
    CT_BASE64 = 'application/base64'
    CT_PNG = 'image/png;base64'   # embedded png
    CT_JPG = 'image/jpeg;base64'  # embedded jpeg

    CONTENT_TYPE_CHOICES = [
        ('Text', (
            (CT_MARKDOWN, 'markdown'),
            (CT_PLAIN, 'plain'),
            (CT_HTML, 'html'),
        )),
        ('Encoded Text', (
            (CT_BASE64, 'base64'),
        )),
        ('Image', (
            (CT_PNG, '.png'),
            (CT_JPG, '.jpg'),
        )),
    ]
 
    contentType = models.CharField(
        max_length=18,
        choices=CONTENT_TYPE_CHOICES,
        default=CT_MARKDOWN
    )
    
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    
    categories = ArrayField(models.TextField(), blank=True, default=list, null=True) # e.g. ["web","tutorial"]
    count =  models.PositiveIntegerField(default=0)       # for comments
    size =  models.PositiveIntegerField(default=0)        # page size for comments
    published = models.DateTimeField(default=timezone.now)
    PUBLIC = 'PUBLIC'
    FRIENDS = 'FRIENDS'
    VISIBILITY_CHOICES = [ (PUBLIC, 'Public'), (FRIENDS, 'Friends')]
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default=PUBLIC)
    # unlisted is used for images so they won't show up in timelines
    unlisted = models.BooleanField(default=False)
    
    def get_comments(self):
        return CommentModel.objects.filter(post=self.id)
    class Meta:
        ordering = ['-published']
        
class CommentModel(models.Model):
    # ID of the Comment (UUID)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(PostModel, on_delete=models.PROTECT)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    
    comment = models.TextField()
    #only choose default type for now
    contentType = models.CharField(max_length=18, default="text/plain")
    # these two are not in the spec
    published = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    #local = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['published']

class FriendModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.CharField(max_length=40)
    user2 = models.CharField(max_length=40)
    #local = models.BooleanField(default=True)
    
#may need like modle
