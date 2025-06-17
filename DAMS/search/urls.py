from django.urls import path
from .views import ImageIndexingView,SimilarAssetAPIView

urlpatterns = [
    path('index/', ImageIndexingView.as_view(), name='index-images'),
    path('similar/<int:asset_id>/', SimilarAssetAPIView.as_view(), name='similar-assets'),
]



