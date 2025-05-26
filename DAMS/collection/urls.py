from django.urls import path
from .views import *

# Helper function to bind view actions
collection_list = CollectionViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
collection_detail = CollectionViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})


urlpatterns = [
    path('collections/', collection_list),
    path('collections/<int:pk>/', collection_detail),
]
