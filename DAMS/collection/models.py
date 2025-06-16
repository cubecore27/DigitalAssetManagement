# collection/models.py
from django.db import models
from django.utils.text import slugify

class Collection(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(max_length=255, blank=True, null=False, unique=True)
    description = models.TextField(blank=True)
    color_hex = models.CharField(max_length=7, blank=True, default="#808080")
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
    
    def save(self, *args, **kwargs):
        if not self.slug or self.slug != slugify(self.name):
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Collection.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
class CollectionAsset(models.Model):
    collection = models.ForeignKey('collection.Collection', on_delete=models.CASCADE)
    asset      = models.ForeignKey('assets.Asset',     on_delete=models.CASCADE)
    added_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('collection','asset')