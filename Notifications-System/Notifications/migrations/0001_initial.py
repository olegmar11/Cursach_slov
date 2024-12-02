# Generated by Django 5.0.2 on 2024-02-29 11:09

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Authentication', '0001_initial'),
        ('Comments', '0001_initial'),
        ('Stories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdministrativeOverallNotifications',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_title', models.CharField(max_length=255)),
                ('message', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='UserCommentRepliedNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('parent_source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Stories.post')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Authentication.baseuserprofile')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Comments.comment')),
            ],
        ),
        migrations.CreateModel(
            name='UserStoryCommentedNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Comments.comment')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Authentication.userprofilewriter')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Stories.post')),
            ],
        ),
        migrations.CreateModel(
            name='UserStoryCreatedNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Authentication.userprofilewriter')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Stories.post')),
            ],
        ),
        migrations.CreateModel(
            name='MarkedAsRead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notifications_ao', models.ManyToManyField(to='Notifications.administrativeoverallnotifications')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Authentication.baseuserprofile')),
                ('notifications_cr', models.ManyToManyField(to='Notifications.usercommentrepliednotification')),
                ('notifications_scom', models.ManyToManyField(to='Notifications.userstorycommentednotification')),
                ('notifications_sc', models.ManyToManyField(to='Notifications.userstorycreatednotification')),
            ],
        ),
    ]