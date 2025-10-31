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
from posts.models import Post
from posts.serializers import PostSerializer


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
        to_user = get_object_or_404(User, username=username.lower())
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


class UserProfileView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username__iexact=username)
        profile = user.profile

        followers_count = Follow.objects.filter(following=user).count()
        following_count = Follow.objects.filter(follower=user).count()
        is_following = False

        if request.user.is_authenticated:
            is_following = Follow.objects.filter(
                follower=request.user, following=user
            ).exists()

        posts = Post.objects.filter(author=user).order_by("-created_at")
        post_data = PostSerializer(posts, many=True, context={"request": request}).data

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "display_name": profile.display_name,
                "bio": profile.bio,
                "avatar": (
                    request.build_absolute_uri(profile.avatar.url)
                    if profile.avatar
                    else None
                ),
                "followers_count": followers_count,
                "following_count": following_count,
                "is_following": is_following,
                "posts": post_data,
            }
        )
