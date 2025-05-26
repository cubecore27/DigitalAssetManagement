from rest_framework import viewsets
from .models import *
from .serializers import *

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class CollectionAssetViewSet(viewsets.ModelViewSet):
    queryset = CollectionAsset.objects.all()
    serializer_class = CollectionAssetSerializer


class AssetCategoryViewSet(viewsets.ModelViewSet):
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer


class AssetTagViewSet(viewsets.ModelViewSet):
    queryset = AssetTag.objects.all()
    serializer_class = AssetTagSerializer


class ThumbnailViewSet(viewsets.ModelViewSet):
    queryset = Thumbnail.objects.all()
    serializer_class = ThumbnailSerializer


class AssetVersionViewSet(viewsets.ModelViewSet):
    queryset = AssetVersion.objects.all()
    serializer_class = AssetVersionSerializer


class SearchIndexViewSet(viewsets.ModelViewSet):
    queryset = SearchIndex.objects.all()
    serializer_class = SearchIndexSerializer


class AssetActivityViewSet(viewsets.ModelViewSet):
    queryset = AssetActivity.objects.all()
    serializer_class = AssetActivitySerializer
