# Generated by Django 5.0.6 on 2024-11-03 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0002_alter_baseuserprofile_displayable_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='baseuserprofile',
            name='displayable_name',
        ),
        migrations.AlterField(
            model_name='userprofilewriter',
            name='writer_pseudo',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]