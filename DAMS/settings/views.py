import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import StorageStatsSerializer
from assets.models import Asset
from django.db.models import Count, Sum, Avg, Max, Q

class StorageStatsView(GenericAPIView):
    serializer_class = StorageStatsSerializer

    def get(self, request, *args, **kwargs):
        # upload_folder = os.path.join(settings.MEDIA_ROOT, 'uploaded_assets')
        upload_folder = os.path.join('uploaded_assets')

        total_size = 0
        file_count = 0

        if not os.path.exists(upload_folder):
            return Response({"error": f"Folder does not exist: {upload_folder}"},
                            status=status.HTTP_404_NOT_FOUND)

        for root, dirs, files in os.walk(upload_folder):
            for file in files:
                try:
                    filepath = os.path.join(root, file)
                    total_size += os.path.getsize(filepath)
                    file_count += 1
                except Exception:
                    continue

        data = {
            "folder_path": upload_folder,
            "total_bytes": total_size,
            "total_mb": round(total_size / (1024 * 1024), 2),
            "file_count": file_count,
        }

        serializer = self.get_serializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AssetStatsAPIView(APIView):
    def get(self, request, *args, **kwargs):
        total_assets = Asset.objects.count()

        asset_type_distribution = dict(
            Asset.objects.values_list('asset_type')
            .annotate(count=Count('id'))
        )

        storage_data = Asset.objects.aggregate(
            total_bytes=Sum('file_size'),
            average_file_size=Avg('file_size'),
            max_file_size=Max('file_size')
        )

        largest_asset = Asset.objects.order_by('-file_size').first()
        largest_asset_info = {
            "id": largest_asset.id,
            "filename": largest_asset.filename,
            "file_size": largest_asset.file_size,
        } if largest_asset else None

        metadata_completeness = {
            "missing_titles": Asset.objects.filter(Q(title="") | Q(title__isnull=True)).count(),
            "missing_dimensions": Asset.objects.filter(Q(width__isnull=True) | Q(height__isnull=True)).count(),
            "missing_descriptions": Asset.objects.filter(Q(description="") | Q(description__isnull=True)).count(),
        }

        complete_metadata_assets = Asset.objects.exclude(
            Q(title="") | Q(title__isnull=True) |
            Q(description="") | Q(description__isnull=True) |
            Q(width__isnull=True) | Q(height__isnull=True)
        ).count()

        metadata_completeness["percent_complete"] = round(
            (complete_metadata_assets / total_assets * 100) if total_assets else 0, 2
        )

        assets_without_tags = Asset.objects.filter(tags=None).count()
        average_tags_per_asset = Asset.objects.annotate(tag_count=Count('tags')).aggregate(
            avg=Avg('tag_count'))['avg'] or 0

        recent_activity = {
            "assets_added_last_7_days": Asset.objects.filter(created_at__gte="2025-06-09").count(),
            "assets_not_accessed_in_90_days": Asset.objects.filter(last_accessed_at__lte="2025-03-18").count(),
        }

        stats = {
            "total_assets": total_assets,
            "asset_type_distribution": asset_type_distribution,
            "storage": {
                **storage_data,
                "largest_file": largest_asset_info
            },
            "metadata_completeness": metadata_completeness,
            "tagging": {
                "assets_without_tags": assets_without_tags,
                "average_tags_per_asset": round(average_tags_per_asset, 2),
            },
            "recent_activity": recent_activity
        }

        return Response(stats, status=status.HTTP_200_OK)

class SystemStatsView(APIView):
    def get(self, request, *args, **kwargs):
        assets = Asset.objects.all()

        # Global Stats
        total_assets = assets.count()
        total_storage = assets.aggregate(total=Sum('file_size'))['total'] or 0

        # Breakdown by MIME type
        mime_stats_qs = assets.values('mime_type').annotate(
            count=Count('id'),
            total_size=Sum('file_size')
        )

        mime_breakdown = {
            mime['mime_type']: {
                'count': mime['count'],
                'total_size': mime['total_size']
            } for mime in mime_stats_qs
        }

        # Breakdown by asset_type
        type_stats_qs = assets.values('asset_type').annotate(
            count=Count('id'),
            total_size=Sum('file_size')
        )

        type_breakdown = {
            asset['asset_type']: {
                'count': asset['count'],
                'total_size': asset['total_size']
            } for asset in type_stats_qs
        }

        data = {
            'total_assets': total_assets,
            'total_storage': total_storage,
            'asset_type_breakdown': type_breakdown,
            'mime_type_breakdown': mime_breakdown,
        }

        return Response(data, status=status.HTTP_200_OK)