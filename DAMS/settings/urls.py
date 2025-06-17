from django.urls import path
from .views import StorageStatsView, AssetStatsAPIView, SystemStatsView

urlpatterns = [
    path('storage-stats/', StorageStatsView.as_view(), name='storage-stats'),
    path('asset-stats/', AssetStatsAPIView.as_view(), name='asset-stats'),
    path('system-stats/', SystemStatsView.as_view(), name='system-stats'),
]
