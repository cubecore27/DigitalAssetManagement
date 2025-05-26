# assets/models.py
from django.db import models
from django.utils import timezone

class Asset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('images', 'Images'),
        ('3d_files', '3D Files'),
    ]
    filename          = models.CharField(max_length=255)
    original_filename = models.CharField(max_length=255)
    file_path         = models.CharField(max_length=512)
    file_extension    = models.CharField(max_length=16)
    file_size         = models.BigIntegerField()
    mime_type         = models.CharField(max_length=64)
    asset_type        = models.CharField(max_length=16, choices=ASSET_TYPE_CHOICES)
    title             = models.CharField(max_length=255, blank=True)
    description       = models.TextField(blank=True)
    checksum_md5      = models.CharField(max_length=32)
    checksum_sha256   = models.CharField(max_length=64)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    last_accessed_at  = models.DateTimeField(default=timezone.now)
    width             = models.IntegerField(null=True, blank=True)
    height            = models.IntegerField(null=True, blank=True)
    color_profile     = models.CharField(max_length=64, blank=True)
    metadata_json     = models.JSONField(blank=True, default=dict)

    # Use string references for M2M through models in the same app
    categories = models.ManyToManyField(
        'assets.Category',
        through='assets.AssetCategory',
        related_name='assets'
    )
    tags = models.ManyToManyField(
        'assets.Tag',
        through='assets.AssetTag',
        related_name='assets'
    )

    def __str__(self):
        return self.title or self.filename


class AssetCategory(models.Model):
    asset    = models.ForeignKey('assets.Asset',    on_delete=models.CASCADE)
    category = models.ForeignKey('assets.Category', on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('asset', 'category')


class AssetTag(models.Model):
    asset = models.ForeignKey('assets.Asset', on_delete=models.CASCADE)
    tag   = models.ForeignKey('assets.Tag',   on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('asset', 'tag')


class Thumbnail(models.Model):
    SIZE_CHOICES = [('small','Small'),('medium','Medium'),('large','Large')]
    asset      = models.ForeignKey('assets.Asset', on_delete=models.CASCADE, related_name='thumbnails')
    size_name  = models.CharField(max_length=10, choices=SIZE_CHOICES)
    width      = models.IntegerField()
    height     = models.IntegerField()
    file_path  = models.CharField(max_length=512)
    file_size  = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('asset', 'size_name')


class AssetVersion(models.Model):
    asset          = models.ForeignKey('assets.Asset', on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    file_path      = models.CharField(max_length=512)
    file_size      = models.BigIntegerField()
    checksum_md5   = models.CharField(max_length=32)
    change_notes   = models.TextField(blank=True)
    is_current     = models.BooleanField(default=False)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('asset', 'version_number')


class SearchIndex(models.Model):
    asset             = models.OneToOneField('assets.Asset', on_delete=models.CASCADE, related_name='search_index')
    searchable_content= models.TextField()
    keywords          = models.TextField(blank=True)
    indexed_at        = models.DateTimeField(auto_now_add=True)


class AssetActivity(models.Model):
    ACTIVITY_CHOICES = [('viewed','Viewed'),('downloaded','Downloaded'),('modified','Modified')]
    asset           = models.ForeignKey('assets.Asset', on_delete=models.CASCADE, related_name='activities')
    activity_type   = models.CharField(max_length=32, choices=ACTIVITY_CHOICES)
    activity_details= models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
