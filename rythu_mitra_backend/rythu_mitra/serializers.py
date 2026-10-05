from rest_framework import serializers
from .models import PlantImage
from .models import CropRegistration

class PlantImageSerializer(serializers.ModelSerializer):

    class Meta:

        model = PlantImage

        fields = "__all__"


class CropRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CropRegistration

        fields = [
            "id",
            "farmer",
            "name",
            "ph_num",
            "village",
            "district",
            "acres",
            "crop_name",
            "crop_season",
            "farming_stage",
            "cultivation_date",
            "harvest_date",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "farmer",
            "created_at",
            "harvest_date",
        ]

    def validate(self, data):

        crop_name = data.get(
            "crop_name",
            ""
        ).strip().lower()

        crop_season = data.get(
            "crop_season"
        )

        harvest_date = data.get(
            "harvest_date"
        )

        valid_crops = [
            "paddy",
            "chilli",
            "maize",
            "cotton",
            "other",
        ]

        # -------------------------------------------------
        # VALIDATE CROP
        # -------------------------------------------------

        if crop_name not in valid_crops:

            raise serializers.ValidationError({
                "crop_name":
                    "Select a valid crop: "
                    "Paddy, Chilli, Maize, Cotton or Other."
            })

        # -------------------------------------------------
        # PADDY
        # -------------------------------------------------

        if crop_name == "paddy":

            if crop_season not in [
                "Sarva",
                "Dalwa"
            ]:

                raise serializers.ValidationError({
                    "crop_season":
                        "Paddy must have either "
                        "Sarva or Dalwa season."
                })

            # Harvest date is calculated automatically
            data["harvest_date"] = None

        # -------------------------------------------------
        # NON-PADDY
        # -------------------------------------------------

        else:

            data["crop_season"] = None

        # -------------------------------------------------
        # MAIZE
        # -------------------------------------------------

        if crop_name == "maize":

            if not harvest_date:

                raise serializers.ValidationError({
                    "harvest_date":
                        "Expected harvest date is required for Maize."
                })

        # -------------------------------------------------
        # CHILLI / COTTON / OTHER
        # -------------------------------------------------

        if crop_name in [
            "chilli",
            "cotton",
            "other"
        ]:

            data["harvest_date"] = None

        return data


