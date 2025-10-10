from rest_framework import serializers
from .models import Post, Like, Comment
from django.contrib.auth.models import User
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "user", "content", "created_at")


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source="likes.count", read_only=True)
    comments_count = serializers.IntegerField(source="comments.count", read_only=True)
    comments = CommentSerializer(
        many=True, read_only=True
    )  # optional: include comments

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "content",
            "created_at",
            "updated_at",
            "likes_count",
            "comments_count",
            "comments",
        )
