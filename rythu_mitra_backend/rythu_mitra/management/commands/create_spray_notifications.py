from django.core.management.base import BaseCommand

from rythu_mitra.models import CropRegistration
from rythu_mitra.utils import create_spray_notifications


class Command(BaseCommand):
    help = "Create upcoming crop spraying notifications"

    def handle(self, *args, **kwargs):

        crops = CropRegistration.objects.all()

        created_count = 0

        for crop in crops:

            before_count = crop.notifications.count()

            create_spray_notifications(crop)

            after_count = crop.notifications.count()

            if after_count > before_count:
                created_count += after_count - before_count

        self.stdout.write(
            self.style.SUCCESS(
                f"{created_count} spraying notifications created."
            )
        )