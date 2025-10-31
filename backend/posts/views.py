from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from accounts.models import Follow
from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer
from .permissions import IsOwnerOrReadOnly


class PostViewSet(viewsets.ModelViewSet):
    """CRUD for posts + like/unlike toggle."""

    queryset = (
        Post.objects.select_related("author")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(
        detail=True,
        methods=["post", "get"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            is_liked = Like.objects.filter(user=request.user, post=post).exists()
            return Response({"is_liked": is_liked, "likes_count": post.likes.count()})

        """Toggle like/unlike on a post."""
        obj, created = Like.objects.get_or_create(user=request.user, post=post)
        if created:
            return Response(
                {"detail": "Liked", "likes_count": post.likes.count() + 1},
                status=status.HTTP_201_CREATED,
            )
        obj.delete()
        return Response(
            {"detail": "Unliked", "likes_count": post.likes.count() - 1},
            status=status.HTTP_200_OK,
        )


class CommentViewSet(viewsets.ModelViewSet):
    """CRUD for comments under a post."""

    serializer_class = CommentSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,
    ]

    def get_queryset(self):
        post_pk = self.kwargs.get("post_pk")
        return (
            Comment.objects.filter(post_id=post_pk)
            .select_related("user", "post")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        post_pk = self.kwargs.get("post_pk")
        post = get_object_or_404(Post, pk=post_pk)
        serializer.save(user=self.request.user, post=post)


class FeedView(generics.ListAPIView):
    """List posts by followed users + own posts."""

    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        following_pks = Follow.objects.filter(follower=user).values_list(
            "following_id", flat=True
        )
        return (
            Post.objects.filter(author__in=list(following_pks) + [user.pk])
            .select_related("author")
            .prefetch_related("likes", "comments")
            .order_by("-created_at")
        )
