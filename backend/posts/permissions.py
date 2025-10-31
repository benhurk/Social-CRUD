from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Allow full access to object owners; read-only for others."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "author", None) or getattr(obj, "user", None)
        return owner == request.user
