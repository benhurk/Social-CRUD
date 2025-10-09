from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Follow


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(
        source="profile.display_name", allow_blank=True, required=False
    )
    avatar = serializers.ImageField(source="profile.avatar", read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "display_name", "avatar")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    display_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "display_name")

    def create(self, validated_data):
        display_name = validated_data.pop("display_name", "")
        user = User(
            username=validated_data["username"], email=validated_data.get("email", "")
        )
        user.set_password(validated_data["password"])
        user.save()
        user.profile.display_name = display_name
        user.profile.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "email",
            "display_name",
            "bio",
            "avatar",
            "created_at",
        )


class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.PrimaryKeyRelatedField(read_only=True)
    following = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Follow
        fields = ("id", "follower", "following", "created_at")
