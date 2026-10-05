from django.contrib import admin
from .models import CropRegistration, Notification, FarmerProfile
from .utils import create_spray_notifications


@admin.register(CropRegistration)
class CropRegistrationAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        old_cultivation_date = None

        if change and obj.pk:
            old_cultivation_date = (
                CropRegistration.objects
                .filter(pk=obj.pk)
                .values_list("cultivation_date", flat=True)
                .first()
            )

        date_changed = old_cultivation_date != obj.cultivation_date

        # Save the new cultivation date
        super().save_model(request, obj, form, change)

        # If cultivation date changed, refresh spraying notifications
        if date_changed:
            Notification.objects.filter(
                farmer=obj,
                notification_type="spraying"
            ).delete()

            create_spray_notifications(obj)


admin.site.register(FarmerProfile)