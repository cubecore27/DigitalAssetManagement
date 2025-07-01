import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

# Required to prevent OpenMP conflicts
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from DeepImageSearch import Load_Data, Search_Setup
from unittest.mock import patch

from assets.models import Asset


class ImageIndexingView(APIView):
    def post(self, request):
        try:
            # You can later get folders from request.data if needed
            image_list = Load_Data().from_folder(['uploaded_assets/images'])

            if not image_list:
                return Response(
                    {"detail": "No images found in folder."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            st = Search_Setup(
                image_list=image_list,
                model_name='mobilenet_v2',
                pretrained=True,
                image_count=100
            )

            with patch('builtins.input', return_value='yes'):
                st.run_index()

            return Response(
                {"detail": "Image indexing completed.", "image_count": len(image_list)},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SimilarAssetAPIView(APIView):
    def get(self, request, asset_id, *args, **kwargs):
        asset = get_object_or_404(Asset, id=asset_id)

        if asset.asset_type != 'image':
            # Fetch 30 random image assets
            random_images = Asset.objects.filter(asset_type='image').order_by('?')[:30]
            response_data = [
                {
                    "id": a.id,
                    "title": a.title,
                    "description": a.description,
                    "created_at": a.created_at.isoformat(),
                    "updated_at": a.updated_at.isoformat(),
                    "file_path": a.file_path,
                    "asset_type": a.asset_type,
                }
                for a in random_images
            ]
            return Response(response_data, status=status.HTTP_200_OK)

        os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

        image_qs = Asset.objects.filter(asset_type='image')
        image_list = [a.file_path for a in image_qs]

        st = Search_Setup(
            image_list=image_list,
            model_name='mobilenet_v2',
            pretrained=True,
            image_count=len(image_list)
        )
        with patch('builtins.input', return_value='no'):
            st.run_index()

        similar_results = st.get_similar_images(asset.file_path, number_of_images=15)
        similar_paths = list(similar_results.values())

        similar_qs = Asset.objects.filter(file_path__in=similar_paths)

        response_data = []
        for a in similar_qs:
            response_data.append({
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "created_at": a.created_at.isoformat(),
                "updated_at": a.updated_at.isoformat(),
                "file_path": a.file_path,
                "asset_type": a.asset_type,
            })

        return Response(response_data, status=status.HTTP_200_OK)