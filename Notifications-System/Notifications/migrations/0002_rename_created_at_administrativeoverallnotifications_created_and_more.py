# Generated by Django 5.0.6 on 2024-11-05 13:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Notifications', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='administrativeoverallnotifications',
            old_name='created_at',
            new_name='created',
        ),
        migrations.RenameField(
            model_name='usercommentrepliednotification',
            old_name='created_at',
            new_name='created',
        ),
        migrations.RenameField(
            model_name='userstorycommentednotification',
            old_name='created_at',
            new_name='created',
        ),
        migrations.RenameField(
            model_name='userstorycreatednotification',
            old_name='created_at',
            new_name='created',
        ),
    ]
