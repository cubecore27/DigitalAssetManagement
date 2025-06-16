# tags/models.py
from django.db import models

class Tag(models.Model):
    name        = models.CharField(max_length=255)
    slug        = models.SlugField(max_length=255, unique=True)
    color_hex = models.CharField(max_length=7, blank=True, default="#808080")
    description = models.TextField(blank=True)
    # usage_count = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
