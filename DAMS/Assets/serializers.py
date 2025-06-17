from rest_framework import serializers
import os, hashlib

from .models import *
from categories.models import Category
from tags.models       import Tag
import mimetypes


class AssetSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, source='categories', write_only=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, source='tags', write_only=True
    )

    class Meta:
        model = Asset
        fields = [
            'id', 'file', 'title', 'description',
            'category_ids', 'tag_ids',
            'created_at', 'updated_at', 'file_path', 'asset_type',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'file_path', 'asset_type', ]

    def create(self, validated_data):
        upload_file = validated_data.pop('file')
        categories = validated_data.pop('categories', [])
        tags = validated_data.pop('tags', [])

        # Default fields if not provided
        title = validated_data.get('title', upload_file.name)
        description = validated_data.get('description', '')

        original_filename = upload_file.name
        file_ext = os.path.splitext(original_filename)[1].lstrip('.')
        file_size = upload_file.size
        mime_type = upload_file.content_type or mimetypes.guess_type(original_filename)[0]

        asset_type = self._guess_asset_type(mime_type)

        # Calculate checksums
        md5, sha256 = self._generate_checksums(upload_file)

        # Generate filename and path
        filename = f"{sha256[:16]}.{file_ext}"
        path = self._save_file(upload_file, filename, mime_type)

        # Create asset instance
        asset = Asset.objects.create(
            filename=filename,
            original_filename=original_filename,
            file_path=path,
            file_extension=file_ext,
            file_size=file_size,
            mime_type=mime_type,
            asset_type=asset_type,
            title=title,
            description=description,
            checksum_md5=md5,
            checksum_sha256=sha256,
        )

        asset.categories.set(categories)
        asset.tags.set(tags)
        return asset

    def _generate_checksums(self, file_obj):
        content = file_obj.read()
        md5 = hashlib.md5(content).hexdigest()
        sha256 = hashlib.sha256(content).hexdigest()
        file_obj.seek(0)
        return md5, sha256
    
    def _guess_asset_type(self, mime_type):
        if not mime_type:
            return 'unknown'

        if mime_type.startswith('image/'):
            return 'image'
        elif mime_type.startswith('video/'):
            return 'video'
        elif mime_type.startswith('audio/'):
            return 'audio'
        elif mime_type in ['application/pdf']:
            return 'document'
        elif mime_type.startswith('text/'):
            return 'text'
        else:
            return 'other'


    def _save_file(self, file_obj, filename, mime_type):
        # Determine upload folder
        if mime_type and mime_type.startswith('image/'):
            upload_dir = 'uploaded_assets/images'
        else:
            upload_dir = 'uploaded_assets/others'

        os.makedirs(upload_dir, exist_ok=True)
        path = os.path.join(upload_dir, filename)

        with open(path, 'wb+') as out_file:
            for chunk in file_obj.chunks():
                out_file.write(chunk)

        return path



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
