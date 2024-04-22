from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Building, Floor, Room, Booking, TimeSlot
from .serializers import BuildingSerializer, FloorSerializer, RoomSerializer, BookingSerializer
from datetime import timedelta
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives
import datetime  # Make sure this is imported


class BuildingList(APIView):
    def get(self, request):
        buildings = Building.objects.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BuildingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BuildingDetail(APIView):
    def get_object(self, pk):
        try:
            return Building.objects.get(pk=pk)
        except Building.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        building = self.get_object(pk)
        serializer = BuildingSerializer(building)
        return Response(serializer.data)

    def put(self, request, pk):
        building = self.get_object(pk)
        serializer = BuildingSerializer(building, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        building = self.get_object(pk)
        building.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FloorList(APIView):
    def get(self, request):
        floors = Floor.objects.all()
        serializer = FloorSerializer(floors, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = FloorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FloorDetail(APIView):
    def get_object(self, pk):
        try:
            return Floor.objects.get(pk=pk)
        except Floor.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        floor = self.get_object(pk)
        serializer = FloorSerializer(floor)
        return Response(serializer.data)

    def put(self, request, pk):
        floor = self.get_object(pk)
        serializer = FloorSerializer(floor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        floor = self.get_object(pk)
        floor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RoomList(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomDetail(APIView):
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    def put(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        room = self.get_object(pk)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookingList(APIView):

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)  # Filter by logged-in user
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():

            if not self.check_booking_availability(serializer.validated_data):
                return Response({"error": "Room not available for the selected time."},
                                status=status.HTTP_400_BAD_REQUEST)

            room = get_object_or_404(Room, pk=serializer.validated_data['room'].id)
            room.is_booked = True

            room.save()
            serializer.save()
            email = serializer.data['Email']
            name = serializer.data['name']
            room_name = room.room_name
            room_number = room.room_number
            floor = room.floor.floor_name
            building = room.floor.building.name
            start_time = serializer.data['start_time']
            end_time = serializer.data['end_time']
            htmly = get_template('booking.html')

            start_time_dt = datetime.datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S%z') # Adjust format if needed
            end_time_dt = datetime.datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S%z') # Adjust format if needed
            timeslot = TimeSlot.objects.create(start_time=start_time, end_time=end_time, date=start_time_dt)
            room.booked_slots.add(timeslot)
            room.save()
            # Format the datetime objects
            formatted_start_time = start_time_dt.strftime("%B %d, %Y %I:%M %p")
            formatted_end_time = end_time_dt.strftime("%B %d, %Y %I:%M %p")

            data = {'name': name, "room_name": room_name, "room_number": room_number, "floor": floor,
                    "building": building, "start_time": formatted_start_time, "end_time": formatted_end_time}
            subject, from_email, to = f"Hi {name}, you have booked a room", 'test@gmail.com', email
            html_content = htmly.render(data)
            #msg = EmailMultiAlternatives(
                #subject, html_content, from_email, [to])
            #msg.attach_alternative(html_content, "text/html")
            #msg.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def check_booking_availability(self, booking_data):
        conflicting_bookings = Booking.objects.filter(
            room=booking_data['room'],
            start_time__lt=booking_data['end_time'],  # Start time before new booking ends
            end_time__gt=booking_data['start_time']  # End time after new booking starts
        )
        return not conflicting_bookings.exists()


class BookingDetail(APIView):

    def get_object(self, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            self.check_object_permissions(self.request, booking)  # Ensure user owns booking
            return booking
        except Booking.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        booking = self.get_object(pk)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            room = Room.objects.get(pk=serializer.validated_data['room'].id)
            new_start_time = serializer.validated_data['start_time']
            new_end_time = serializer.validated_data['end_time']

            # Check 1: Room availability
            if room.is_available(new_start_time, new_end_time):
                # Check 2: Booking duration (max 3 hours)
                if (new_end_time - new_start_time) <= timedelta(hours=3):
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'Booking cannot exceed 3 hours'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Room already booked for this time period'},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        booking = self.get_object(pk)
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
