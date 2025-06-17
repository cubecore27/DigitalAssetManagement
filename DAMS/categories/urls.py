# categories/urls.py

from django.urls import path, include
from .views import CategoryTreeAPIView

from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')


urlpatterns = [
    path(
        'tree/',
        CategoryTreeAPIView.as_view(),   # ← no positional args here
        name='category-tree'
    ),
    path('', include(router.urls)),
]
