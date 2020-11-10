from decimal import Decimal

from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext as _
from bulk_update_or_create import BulkUpdateOrCreateQuerySet


class BaseClass(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Employee(BaseClass):
    objects = BulkUpdateOrCreateQuerySet.as_manager()
    _id = models.AutoField(primary_key=True)
    # I personally prefer auto number field as primary key and not editable
    # because by simply changing pk value will cause more issues in future especially maintainability
    id = models.CharField(_(u'ID'), unique=True, db_index=True, max_length=20, blank=False)
    login = models.CharField(_(u'Login'), unique=True, db_index=True, max_length=50, blank=False)
    name = models.CharField(_(u'Name'), max_length=120, blank=False)
    salary = models.DecimalField(_(u'Salary'), max_digits=20, decimal_places=3,
                                 validators=[MinValueValidator(Decimal('0.00'))], default=0, blank=False)

    def __str__(self):
        return self.id