# collection/models.py
from django.db import models

class Collection(models.Model):
    name        = models.CharField(max_length=255)
    slug        = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    color_hex   = models.CharField(max_length=7, blank=True)
    asset_count = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    # lazy reference to Asset in assets app
    assets = models.ManyToManyField(
        'assets.Asset',
        through='collection.CollectionAsset',
        related_name='collections'
    )

    def __str__(self):
        return self.name
class CollectionAsset(models.Model):
    collection = models.ForeignKey('collection.Collection', on_delete=models.CASCADE)
    asset      = models.ForeignKey('assets.Asset',     on_delete=models.CASCADE)
    sort_order = models.IntegerField(default=0)
    added_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('collection','asset')
        ordering = ['sort_order']