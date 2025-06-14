from django.urls import path
from .views import (
    RegisterView, CreateTrainView, AvailabilityView,
    BookSeatView, BookingDetailView,MyBookingsView,CustomTokenObtainPairView,UpdateTrainSeatsView,DeleteTrainView,
    run_migrations
)
from rest_framework_simplejwt.views import TokenObtainPairView 
urlpatterns = [
    path('signup', RegisterView.as_view()),
    path('login', CustomTokenObtainPairView.as_view()), 
    path('trains/create', CreateTrainView.as_view()),
    path('trains/availability', AvailabilityView.as_view()),
    path('trains/<int:train_id>/book', BookSeatView.as_view()),
    path('bookings/<int:booking_id>', BookingDetailView.as_view()),
    path('bookings/mine', MyBookingsView.as_view()),
    path('trains/<int:train_id>/update-seats', UpdateTrainSeatsView.as_view()),
    path('trains/<int:train_id>', DeleteTrainView.as_view()), 
]
