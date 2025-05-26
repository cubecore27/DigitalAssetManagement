# categories/models.py
from django.db import models

class Category(models.Model):
    name            = models.CharField(max_length=255)
    slug            = models.SlugField(max_length=255, unique=True)
    description     = models.TextField(blank=True)
    parent_category = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='subcategories'
    )
    sort_order      = models.IntegerField(default=0)
    is_active       = models.BooleanField(default=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order','name']

    def __str__(self):
        return self.name
