# Generated by Django 5.0.6 on 2024-11-05 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0004_remove_userprofilewriter_subscribers_counter'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofilewriter',
            name='total_dislikes_counter',
            field=models.PositiveBigIntegerField(default=0),
        ),
    ]