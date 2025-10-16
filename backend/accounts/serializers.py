from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Follow
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(
        source="profile.display_name", allow_blank=True, required=False
    )
    avatar = serializers.ImageField(source="profile.avatar", read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "display_name", "avatar")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "password2",
            "email",
            "first_name",
            "last_name",
        )

    def validate_username(self, value):
        normalized = value.lower()
        if User.objects.filter(username__iexact=normalized).exists():
            raise serializers.ValidationError("This username is already taken.")
        return normalized

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        normalized = value.lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("This email is already registered.")
        return normalized

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"].lower(),
            email=validated_data["email"].lower(),
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", required=False)
    email = serializers.EmailField(source="user.email", required=False)

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

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        user = instance.user

        if "username" in user_data:
            normalized_username = user_data["username"].lower()
            if (
                User.objects.exclude(pk=user.pk)
                .filter(username__iexact=normalized_username)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"username": "This username is already taken."}
                )
            user.username = normalized_username

        if "email" in user_data:
            normalized_email = user_data["email"].lower()
            if (
                User.objects.exclude(pk=user.pk)
                .filter(email__iexact=normalized_email)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"email": "This email is already registered."}
                )
            user.email = normalized_email

        user.save()
        return super().update(instance, validated_data)


class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.PrimaryKeyRelatedField(read_only=True)
    following = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Follow
        fields = ("id", "follower", "following", "created_at")
