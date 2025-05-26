from django.urls import path
from .views import *

# Helper function to bind view actions
tag_list = TagViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
tag_detail = TagViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

urlpatterns = [
    path('tags/', tag_list),
    path('tags/<int:pk>/', tag_detail),
]
