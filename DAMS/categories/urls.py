from django.urls import path
from .views import *

category_list = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

urlpatterns = [
    path('create/', category_list),
    path('categories/<int:pk>/', category_detail),
]