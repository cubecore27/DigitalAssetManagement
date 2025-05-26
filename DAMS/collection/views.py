from rest_framework import viewsets
from .models import *
from .serializers import *


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer