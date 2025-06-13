# railway/utils.py
from django.conf import settings
from rest_framework.exceptions import PermissionDenied

def check_admin_api_key(request):
    if request.headers.get("X-ADMIN-KEY") != settings.ADMIN_API_KEY:
        raise PermissionDenied("Invalid Admin API Key")
