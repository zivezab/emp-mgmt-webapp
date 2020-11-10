from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('', views.EmployeeViewSet)

urlpatterns = [
    path('upload/', views.EmployeeUploadView.as_view(), name='upload'),
    path('', include(router.urls)),
]