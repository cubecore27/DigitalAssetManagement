from rest_framework import serializers

class StorageStatsSerializer(serializers.Serializer):
    folder_path = serializers.CharField()
    total_bytes = serializers.IntegerField()
    total_mb = serializers.FloatField()
    file_count = serializers.IntegerField()
