from django.urls import path
from .views import *

# Helper function to bind view actions

asset_list = AssetViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
asset_detail = AssetViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

asset_category_list = AssetCategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
asset_category_detail = AssetCategoryViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

asset_tag_list = AssetTagViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
asset_tag_detail = AssetTagViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

thumbnail_list = ThumbnailViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
thumbnail_detail = ThumbnailViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

version_list = AssetVersionViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
version_detail = AssetVersionViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

search_index_list = SearchIndexViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
search_index_detail = SearchIndexViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

activity_list = AssetActivityViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
activity_detail = AssetActivityViewSet.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

urlpatterns = [
    path('assets/', asset_list),
    path('assets/<int:pk>/', asset_detail),

    path('asset-categories/', asset_category_list),
    path('asset-categories/<int:pk>/', asset_category_detail),

    path('asset-tags/', asset_tag_list),
    path('asset-tags/<int:pk>/', asset_tag_detail),

    path('thumbnails/', thumbnail_list),
    path('thumbnails/<int:pk>/', thumbnail_detail),

    path('versions/', version_list),
    path('versions/<int:pk>/', version_detail),

    path('search-indexes/', search_index_list),
    path('search-indexes/<int:pk>/', search_index_detail),

    path('activities/', activity_list),
    path('activities/<int:pk>/', activity_detail),
]
