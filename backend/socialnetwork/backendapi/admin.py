from django.contrib import admin
from . import models
# class PostAdmin(admin.ModelAdmin):
#     list_display = ['title_display','published','author',]

#     @admin.display(description="Title")
#     def title_display(self,obj):
#         if obj.title == "":
#             return "empty title"
#         else:
#             return obj.title
#     @admin.display(ordering="author__host",description="Author's Host")
#     def authors_host(self,obj):
#         if obj.author.host != None:
#             return obj.author.host
#         else:
#             return ""


# Register your models here.
admin.site.register(models.Users)
admin.site.register(models.PostModel)
admin.site.register(models.CommentModel)
admin.site.register(models.Node)
admin.site.register(models.InboxObject)
admin.site.register(models.LikeModel)
admin.site.register(models.FollowerModel)
