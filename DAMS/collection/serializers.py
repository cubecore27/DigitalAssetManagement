from rest_framework import serializers
import os, hashlib

from .models import *

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'
        read_only_fields = ['slug']


class CollectionAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionAsset
        fields = '__all__'