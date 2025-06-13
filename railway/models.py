from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User')
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')


class Train(models.Model):
    name = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    seat_capacity = models.IntegerField()
    arrival_source = models.TimeField()
    arrival_destination = models.TimeField()

class Booking(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    no_of_seats = models.IntegerField()
    seat_numbers = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
