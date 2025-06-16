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
                model_name='vgg19',
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
    def post(self, request, *args, **kwargs):
        asset_id = request.data.get('asset_id')
        if not asset_id:
            return Response({'error': 'asset_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        asset = get_object_or_404(Asset, id=asset_id)

        if asset.asset_type != 'image':
            return Response({'error': 'Asset is not an image'}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare the environment and image list
        os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

        # Load all image paths from your Asset model (filter by image type)
        image_qs = Asset.objects.filter(asset_type='image')
        image_list = [a.file_path for a in image_qs]

        # Initialize DeepImageSearch
        st = Search_Setup(image_list=image_list, model_name='vgg19', pretrained=True, image_count=len(image_list))

        with patch('builtins.input', return_value='no'):
            st.run_index()

        # Get similar images
        similar_results = st.get_similar_images(asset.file_path, number_of_images=10)
        similar_paths = list(similar_results.values())

        # Map back to Asset IDs
        similar_assets = Asset.objects.filter(file_path__in=similar_paths).values('id', 'file_path')
        return Response({'similar_asset_ids': [a['id'] for a in similar_assets]})