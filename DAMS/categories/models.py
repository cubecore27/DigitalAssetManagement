# categories/models.py
from django.db import models
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    MAX_DEPTH = 3  # Maximum allowed depth: Level 1 (root) → Level 2 → Level 3

    name            = models.CharField(max_length=255)
    slug            = models.SlugField(max_length=255, unique=True)
    description     = models.TextField(blank=True)
    parent_category = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='subcategories'
    )
    is_active       = models.BooleanField(default=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_depth(self):
        """Calculates current category depth."""
        depth = 1
        parent = self.parent_category
        while parent:
            depth += 1
            parent = parent.parent_category
        return depth

    # def clean(self):
    #     """Ensures the category is not nested more than MAX_DEPTH levels."""
    #     if self.get_depth() > self.MAX_DEPTH:
    #         raise ValidationError(f"Maximum category depth is {self.MAX_DEPTH} levels.")

    def save(self, *args, **kwargs):

        if not self.slug or self.slug != slugify(self.name):
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        # self.full_clean()  # Triggers clean() and raises error if invalid
        super().save(*args, **kwargs)