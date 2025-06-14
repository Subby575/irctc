from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum
from django.conf import settings
from .models import User, Train, Booking
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes





class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "status": "Account successfully created",
                "status_code": 200,
                "user_id": user.id
            }, status=200)
        return Response(serializer.errors, status=400)




def check_admin_api_key(request):
    if request.headers.get("X-ADMIN-KEY") != settings.ADMIN_API_KEY:
        return Response({"message": "Unauthorized. Invalid Admin Key"}, status=403)
    return None




class CreateTrainView(APIView):
    def post(self, request):
        check = check_admin_api_key(request)
        if check:
            return check  

        data = request.data
        train = Train.objects.create(
            name=data['train_name'],
            source=data['source'],
            destination=data['destination'],
            seat_capacity=data['seat_capacity'],
            arrival_source=data['arrival_time_at_source'],
            arrival_destination=data['arrival_time_at_destination']
        )
        return Response({
            "message": "Train added successfully",
            "train_id": train.id
        }, status=201)


class UpdateTrainSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, train_id):
        # Check if user is admin
        if request.user.role != "admin":
            return Response({"message": "Only admins can update train seats"}, status=403)

        # Check API key
        if request.headers.get("X-ADMIN-KEY") != settings.ADMIN_API_KEY:
            return Response({"message": "Invalid Admin Key"}, status=403)

        try:
            new_capacity = int(request.data.get("seat_capacity"))
        except:
            return Response({"message": "Invalid seat capacity"}, status=400)

        try:
            train = Train.objects.get(id=train_id)
            train.seat_capacity = new_capacity
            train.save()

            return Response({
                "message": "Seat capacity updated successfully",
                "train_id": train.id,
                "new_capacity": new_capacity
            }, status=200)
        except Train.DoesNotExist:
            return Response({"message": "Train not found"}, status=404)


class AvailabilityView(APIView):
    def get(self, request):
        source = request.query_params.get("source")
        destination = request.query_params.get("destination")

        if not source or not destination:
            # Only allow admin to get all trains without filters
            if not request.user.is_authenticated or request.user.role != "admin":
                return Response({"message": "Please provide source and destination"}, status=400)

        # If filters are present, apply them; else get all trains (admin only)
        trains = Train.objects.all()
        if source and destination:
            trains = trains.filter(source=source, destination=destination)

        response = []
        for train in trains:
            booked = Booking.objects.filter(train=train).aggregate(Sum('no_of_seats'))['no_of_seats__sum'] or 0
            available = train.seat_capacity - booked
            response.append({
                "train_id": train.id,
                "train_name": train.name,
                "source": train.source,
                "destination": train.destination,
                "seat_capacity": train.seat_capacity,
                "available_seats": available,
                "arrival_time_at_source": train.arrival_source,
                "arrival_time_at_destination": train.arrival_destination
            })

        return Response(response)



class BookSeatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, train_id):
        user = request.user
        try:
            no_of_seats = int(request.data['no_of_seats'])
        except:
            return Response({"message": "Invalid number of seats"}, status=400)

        try:
            with transaction.atomic():
                train = Train.objects.select_for_update().get(id=train_id)
                booked = Booking.objects.filter(train=train).aggregate(Sum('no_of_seats'))['no_of_seats__sum'] or 0
                available = train.seat_capacity - booked

                if available < no_of_seats:
                    return Response({"message": "Not enough seats"}, status=400)

                # Generate seat numbers (dummy logic)
                already_booked_seats = Booking.objects.filter(train=train).values_list('seat_numbers', flat=True)
                flat_seats = set()
                for sublist in already_booked_seats:
                    flat_seats.update(sublist)

                seat_numbers = []
                next_seat = 1
                while len(seat_numbers) < no_of_seats:
                    if next_seat not in flat_seats:
                        seat_numbers.append(next_seat)
                    next_seat += 1

                booking = Booking.objects.create(
                    train=train,
                    user=user,
                    no_of_seats=no_of_seats,
                    seat_numbers=seat_numbers
                )

                return Response({
                    "message": "Seat booked successfully",
                    "booking_id": booking.id,
                    "seat_numbers": seat_numbers
                }, status=201)
        except Train.DoesNotExist:
            return Response({"message": "Train not found"}, status=404)




class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            train = booking.train

            return Response({
                "booking_id": booking.id,
                "train_id": train.id,
                "train_name": train.name,
                "user_id": request.user.id,
                "no_of_seats": booking.no_of_seats,
                "seat_numbers": booking.seat_numbers,
                "arrival_time_at_source": train.arrival_source,
                "arrival_time_at_destination": train.arrival_destination
            }, status=200)

        except Booking.DoesNotExist:
            return Response({"message": "Booking not found"}, status=404)


class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = Booking.objects.filter(user=user).select_related("train")

        data = []
        for b in bookings:
            data.append({
                "booking_id": b.id,
                "train_name": b.train.name,
                "seat_numbers": b.seat_numbers,
                "no_of_seats": b.no_of_seats,
                "arrival_time_at_source": b.train.arrival_source,
                "arrival_time_at_destination": b.train.arrival_destination,
            })
        return Response(data, status=200)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role  # Add role to token
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role  # Include role in response too
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class DeleteTrainView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, train_id):
        if request.user.role != "admin":
            return Response({"message": "Only admins can delete trains"}, status=403)
        if request.headers.get("X-ADMIN-KEY") != settings.ADMIN_API_KEY:
            return Response({"message": "Invalid Admin Key"}, status=403)

        try:
            train = Train.objects.get(id=train_id)
            train.delete()
            return Response({"message": "Train deleted successfully"}, status=200)
        except Train.DoesNotExist:
            return Response({"message": "Train not found"}, status=404)
