from django.db import models
from Authentication.models import UserProfileReader, UserProfileWriter, BaseUserProfile
import Notifications.models as notificationMod
import Comments.models as commentMod
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
# Create your models here.

class PostGenre(models.Model):
    genre = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return self.genre

class PostTags(models.Model):
    tag = models.CharField(max_length=30, unique=True)
        
    def __str__(self):
        return self.tag
    
class Post(models.Model):
    creator_id = models.ForeignKey(UserProfileWriter, on_delete=models.CASCADE)
    
    post_image = models.ImageField(upload_to ='story_fis/', default='story_fis/default_story.jpeg')
    post_title = models.CharField(max_length = 50, unique=True, default="No Name")
    post_text = models.TextField(null = False)
    post_description = models.CharField(max_length=100, default="No Description")
    
    created = models.DateTimeField(default=timezone.now)            
    likes = models.ManyToManyField(BaseUserProfile, related_name="story_likes")
    dislikes = models.ManyToManyField(BaseUserProfile, related_name="story_dislikes")
    views = models.ManyToManyField(BaseUserProfile, related_name="story_views")
    
    genre = models.ForeignKey(PostGenre, on_delete=models.DO_NOTHING, null=False)
    tags = models.ManyToManyField(PostTags)
    

    def serializer_all_search_engine(self):
        return {
            "id": self.id,
            "creator": self.creator_id.serialize_load(),
            "title": self.post_title,
            "image": self.post_image.url,
            "description": self.post_description,
            'created_at': self.whenAdded(),
            'genre': self.genre.serializer(),
            'views_counter': self.views_counter,
            'relevancy': self.num_matches,
        }
        
    def serializer_single(self):
        return {
            "id": self.id,
            "creator": self.creator_id.serialize_load(),
            "title": self.post_title,
            "body": self.post_text,
            'likes_count': self.likes_count,
            'dislikes_count': self.dislikes_count,
            'comments_count': commentMod.Comment.objects.filter(post=self, parent_comment=None).count(),
            'created_at': self.whenAdded(),
            'views_counter': self.views_counter,
        }
        
# class UserLikedPosts(models.Model):
#     reader = models.ForeignKey(UserProfileReader, on_delete=models.CASCADE)
#     posts = models.ManyToManyField(Post)
    
#     def serializer_all(self):
#         return {
#             "id": self.id,
#             "posts": [elem.serializer_all() for elem in self.posts],
#         }
        
# class UserViewedPosts(models.Model):
#     reader = models.ForeignKey(UserProfileReader, on_delete=models.CASCADE)
#     posts = models.ManyToManyField(Post)
    
#     def serializer_all(self):
#         return {
#             "id": self.id,
#             "posts": [elem.serializer_all() for elem in self.posts],
#         }
        
@receiver(post_save, sender=Post)
def story_created(sender, instance, created, **kwargs):
    if created:
        if UserProfileReader.objects.filter(subscribed_to = instance.creator_id).count() > 0:
            notification = notificationMod.UserStoryCreatedNotification(creator=instance.creator_id, source=instance)
            notification.save()
            print("Server: Writer has >0 Subscribers. Notification Created.")
        else:
            print("Server: Writer has 0 Subscribers. Notification Was Not Created")