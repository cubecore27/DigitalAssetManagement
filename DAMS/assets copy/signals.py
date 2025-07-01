from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Asset
import os

@receiver(post_delete, sender=Asset)
def delete_asset_file(sender, instance, **kwargs):
    print("delete flow sensed")
    if instance.file_path and os.path.isfile(instance.file_path):
        try:
            os.remove(instance.file_path)
        except Exception as e:
            # Optional: log or handle file deletion error
            pass
