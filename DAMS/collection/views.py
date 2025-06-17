from rest_framework import viewsets
from rest_framework.decorators import action
from .models import *
from .serializers import *
from rest_framework.response import Response
from .models import CollectionAsset
from assets.serializers import AssetSerializer  # Assuming you already have this



class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer  # your own Collection serializer

    @action(detail=True, methods=['get'])
    def assets(self, request, pk=None):
        # Get assets linked to this collection
        collection_assets = CollectionAsset.objects.filter(collection_id=pk)
        assets = [ca.asset for ca in collection_assets]
        serializer = AssetSerializer(assets, many=True)
        return Response(serializer.data)



class CollectionAssetViewSet(viewsets.ModelViewSet):
    queryset = CollectionAsset.objects.all()
    serializer_class = CollectionAssetSerializer

    def retrieve(self, request, *args, **kwargs):
        collection_asset = self.get_object()
        asset = collection_asset.asset
        serializer = AssetSerializer(asset)
        return Response(serializer.data)
