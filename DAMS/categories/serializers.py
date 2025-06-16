from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['slug']

    def validate(self, attrs):
        parent = attrs.get('parent_category')

        # If updating and no parent is in the attrs, fallback to current instance
        if not parent and self.instance:
            parent = self.instance.parent_category

        if parent and parent.get_depth() + 1 > Category.MAX_DEPTH:
            raise serializers.ValidationError({
                'parent_category': f"Maximum category depth is {Category.MAX_DEPTH} levels."
            })

        return attrs