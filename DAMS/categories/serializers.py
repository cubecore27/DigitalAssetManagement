from rest_framework import serializers
from .models import Category


class TreeCategorySerializer(serializers.ModelSerializer):
    """
    Recursively serializes Category instances along with their active subcategories
    up to the model-defined MAX_DEPTH.
    """
    subcategories = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'is_active',
            'created_at',
            'updated_at',
            'subcategories',
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_subcategories(self, obj):
        # Stop recursion at MAX_DEPTH
        if obj.get_depth() >= Category.MAX_DEPTH:
            return []

        # Only include active children, ordered by name
        children = obj.subcategories.filter(is_active=True).order_by('name')
        return TreeCategorySerializer(
            children,
            many=True,
            context=self.context
        ).data


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for create/update operations on Category, enforcing maximum depth.
    """
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'parent_category',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Determine the intended parent (new or existing)
        parent = attrs.get('parent_category') or getattr(self.instance, 'parent_category', None)

        # Enforce max depth constraint
        if parent and parent.get_depth() + 1 > Category.MAX_DEPTH:
            raise serializers.ValidationError({
                'parent_category': f"Maximum category depth is {Category.MAX_DEPTH} levels."
            })
        return attrs
