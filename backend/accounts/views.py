from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UserSerializer,
    FollowSerializer,
)
from .models import Profile, Follow
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response(
                {"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST
            )
        if not new_password or len(new_password) < 8:
            return Response(
                {"new_password": "New password must be at least 8 chars."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password changed."}, status=status.HTTP_200_OK)


class FollowToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        to_user = get_object_or_404(User, username=username)
        if to_user == request.user:
            return Response(
                {"detail": "Cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        obj, created = Follow.objects.get_or_create(
            follower=request.user, following=to_user
        )
        if created:
            return Response({"detail": f"Now following {username}."})
        else:
            obj.delete()
            return Response({"detail": f"Unfollowed {username}."})
