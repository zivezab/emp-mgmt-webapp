import io
import csv

from decimal import Decimal, InvalidOperation
from rest_framework import filters, serializers, viewsets
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.db import transaction
from .models import Employee


class EmployeeUploadView(View):
    def get(self, request):
        template_name = 'index.html'
        return render(request, template_name)

    def post(self, request):
        if 'file' not in request.FILES:
            return self.get(request)

        param_file = io.TextIOWrapper(request.FILES['file'].file)
        reader = csv.DictReader(param_file, fieldnames=('id', 'login', 'name', 'salary'))
        list_of_dict = list(reader)
        employees = []

        try:
            for row in list_of_dict:
                if row['id'].startswith('#') or row['salary'].lower() == 'salary':
                    continue
                if Decimal(row['salary']) < Decimal('0.00'):
                    raise Exception('Invalid salary: {0}'.format(row['salary']))
                employees.append(Employee(id=row['id'], login=row['login'], name=row['name'], salary=row['salary']))

            with transaction.atomic():
                Employee.objects.bulk_update_or_create(employees, ['login', 'name', 'salary'], match_field='id')
            return_msg = {'status': 'Upload completed'}
            status_code = 200
        except Exception as e:
            return_msg = {'status': 'Error while uploading data: {0}'.format(e)}
            status_code = 500

        return JsonResponse(return_msg, status=status_code)


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Employee
        fields = ['_id', 'id', 'login', 'name', 'salary']


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'name', 'login', 'salary']
    ordering = ('id',)

    def get_queryset(self):
        queryset = Employee.objects.all()
        min_salary = self.request.query_params.get('minSalary', None)
        max_salary = self.request.query_params.get('maxSalary', None)
        if min_salary is not None:
            try:
                min_salary = Decimal(min_salary)
                queryset = queryset.filter(salary__gte=min_salary)
            except InvalidOperation as _e:
                pass
        if max_salary is not None:
            try:
                max_salary = Decimal(max_salary)
                queryset = queryset.filter(salary__lte=max_salary)
            except InvalidOperation as _e:
                pass
        return queryset
