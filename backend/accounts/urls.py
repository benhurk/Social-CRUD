from django.urls import path
from .views import RegisterView, ProfileView, ChangePasswordView, FollowToggleView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path(
        "profile/change-password/", ChangePasswordView.as_view(), name="change-password"
    ),
    path(
        "users/<str:username>/follow-toggle/",
        FollowToggleView.as_view(),
        name="follow-toggle",
    ),
]
