from django.db import models
from django.contrib.auth.models import User

class PlantImage(models.Model):
    image = models.ImageField(upload_to="plant_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


class CropRegistration(models.Model):

    farmer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="crop_registrations",
        null=True,
        blank=True
    )

    name = models.CharField(
        max_length=100
    )

    ph_num = models.CharField(
        max_length=10
    )


    village = models.CharField(
        max_length=100
    )

    district = models.CharField(
        max_length=100
    )

    acres = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )

    crop_name = models.CharField(
        max_length=100
    )

    crop_season = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    farming_stage = models.CharField(
        max_length=100
    )

    cultivation_date = models.DateField()

    harvest_date = models.DateField(
        null=True,
        blank=True
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        if self.crop_season:

            return (
                f"{self.name} - "
                f"{self.crop_name} - "
                f"{self.crop_season}"
            )

        return (
            f"{self.name} - "
            f"{self.crop_name}"
        )


class Notification(models.Model):

    farmer = models.ForeignKey(
        CropRegistration,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    title_te = models.CharField(
        max_length=255,
        blank=True
    )

    message_te = models.TextField(
        blank=True
    )

    notification_type = models.CharField(
        max_length=50,
        default="spraying"
    )

    spray_date = models.DateField(
        null=True,
        blank=True
    )

    days_remaining = models.IntegerField(
        null=True,
        blank=True
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class FarmerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farmer_profile"
    )

    phone_number = models.CharField(
        max_length=10,
        unique=True
    )

    def __str__(self):
        return self.user.first_name or self.user.username

