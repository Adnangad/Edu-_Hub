# Generated by Django 5.0.6 on 2024-09-12 07:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('edu', '0007_tasks_temporary_field'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tasks',
            name='temporary_field',
        ),
    ]
