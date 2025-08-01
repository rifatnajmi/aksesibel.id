---
title: Cerita
default_child_type: blog-item
admin:
    children_display_order: collection
content:
    items: '@self.children'
    lang: all
    limit: 3
    order:
        by: date
        dir: desc
    pagination: true
routable: true
child_type: blog-item
metadata:
    description: 'Cerita teman disabilitas dan neurodivergen tentang hambatan yang sering mereka hadapi.'
---

