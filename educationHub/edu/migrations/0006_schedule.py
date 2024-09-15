# Generated by Django 5.0.6 on 2024-09-11 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edu', '0005_tasks'),
    ]

    operations = [
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_on', models.DateField(auto_now_add=True)),
                ('course_name', models.CharField(default=None, max_length=70)),
                ('link', models.CharField(max_length=300)),
                ('description', models.CharField(max_length=300)),
            ],
        ),
    ]
