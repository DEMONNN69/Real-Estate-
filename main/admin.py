from django.contrib import admin
from .models import*
# Register your models here.
admin.site.register(Property)
admin.site.register(Photo)
admin.site.register(inq)
admin.site.register(Amenity)
admin.site.register(agent_inquiry)
admin.site.site_header = "NCPR Admin"
admin.site.site_title = "NCPR Admin Portal"
admin.site.index_title = "Welcome to NCPR Dashboard"