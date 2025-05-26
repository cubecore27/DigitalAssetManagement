from rest_framework import serializers
import os, hashlib

from .models import *
from categories.models import Category
from tags.models       import Tag


class AssetSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = Asset
        fields = [
            'id', 'file', 'title', 'description', 'asset_type',
            'category_ids', 'tag_ids',
            'created_at', 'updated_at', 'file_path',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'file_path']

    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, source='categories', write_only=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, source='tags', write_only=True
    )

    def create(self, validated_data):
        upload_file = validated_data.pop('file')
        categories = validated_data.pop('categories', [])
        tags = validated_data.pop('tags', [])

        original_filename = upload_file.name
        file_ext = os.path.splitext(original_filename)[1].lstrip('.')
        file_size = upload_file.size
        mime_type = upload_file.content_type

        md5 = hashlib.md5(upload_file.read()).hexdigest()
        upload_file.seek(0)
        sha256 = hashlib.sha256(upload_file.read()).hexdigest()
        upload_file.seek(0)

        filename = f"{sha256[:16]}.{file_ext}"
        upload_dir = 'uploaded_assets'
        path = os.path.join(upload_dir, filename)

        os.makedirs(upload_dir, exist_ok=True)
        with open(path, 'wb+') as out:
            for chunk in upload_file.chunks():
                out.write(chunk)

        asset = Asset.objects.create(
            filename=filename,
            original_filename=original_filename,
            file_path=path,
            file_extension=file_ext,
            file_size=file_size,
            mime_type=mime_type,
            asset_type=validated_data.get('asset_type'),
            title=validated_data.get('title', original_filename),
            description=validated_data.get('description', ''),
            checksum_md5=md5,
            checksum_sha256=sha256,
        )

        asset.categories.set(categories)
        asset.tags.set(tags)
        return asset


class AssetCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetCategory
        fields = '__all__'


class AssetTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetTag
        fields = '__all__'


class ThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thumbnail
        fields = '__all__'


class AssetVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetVersion
        fields = '__all__'


class SearchIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchIndex
        fields = '__all__'


class AssetActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetActivity
        fields = '__all__'
