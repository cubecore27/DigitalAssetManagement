# categories/views.py

from rest_framework import generics
from rest_framework import viewsets
from .models import Category
from .serializers import CategorySerializer, TreeCategorySerializer

class CategoryTreeAPIView(generics.ListAPIView):
    """
    Returns a nested tree of categories, starting from all root nodes.
    """
    serializer_class = TreeCategorySerializer

    def get_queryset(self):
        return Category.objects\
            .filter(parent_category__isnull=True, is_active=True)\
            .order_by('name')

class CategoryViewSet(viewsets.ModelViewSet):
    """
    list   → GET    /categories/
    retrieve → GET   /categories/{pk}/
    create  → POST   /categories/
    update  → PUT    /categories/{pk}/
    partial_update → PATCH  /categories/{pk}/
    destroy → DELETE /categories/{pk}/
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer