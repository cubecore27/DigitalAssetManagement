from rest_framework import serializers
import os, hashlib

from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'