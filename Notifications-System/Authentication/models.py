from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

class UserProfileWriter(models.Model):
    writer_pseudo = models.CharField(max_length=100, unique=True)
        
class UserProfileReader(models.Model):
    subscribed_to = models.ManyToManyField(UserProfileWriter, through='SubscriptionTimeStampThrough')
        
    def __str__(self) -> str:
        return super().__str__()
         
class BaseUserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.jpg')
    is_premium = models.BooleanField(default=False)
    
    reader = models.ForeignKey(UserProfileReader, on_delete=models.DO_NOTHING)
    writer = models.ForeignKey(UserProfileWriter, on_delete=models.DO_NOTHING, null=True, blank=True)

class SubscriptionTimeStampThrough(models.Model):
    writer = models.ForeignKey(UserProfileWriter, on_delete = models.CASCADE)
    reader = models.ForeignKey(UserProfileReader, on_delete = models.CASCADE)
    when_subscribed = models.DateTimeField(default=timezone.now)
    receive_notifications = models.BooleanField(default=True)


@receiver(post_save, sender=User)
def user_created(sender, instance, created, **kwargs):
    if created:
        try:
            BaseUserProfile.objects.get(user = instance)
        except BaseUserProfile.DoesNotExist:
            reader = UserProfileReader()
            reader.save()
            
            profile = BaseUserProfile(user=instance, reader = reader)
            profile.save()        
            print('Server: Base and Reader profiles instances created successfully')

@receiver(pre_delete, sender=User)
def delete_profile_data(sender, instance, **kwargs):
    msg = "Server: "
    try:
        profile = BaseUserProfile.objects.get(user = instance)
        
        profile.reader.delete()
        print(msg + "Reader profile instance for given user was deleted successfully.")
        
        if profile.writer:
            profile.writer.delete()
            print(msg + "Writer profile instance for given user was deleted successfully.")
            
        print(msg + "Base User Profile instance for given user should be deleted because relation is set to cascade.")
        
    except BaseUserProfile.DoesNotExist:
        print(msg + "Base User Profile instance for given user does not exist.")