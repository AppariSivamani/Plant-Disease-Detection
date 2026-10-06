import os
import tempfile
import json
import requests
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .disease_data import DISEASE_DATA
from .crop_data import CROP_DATA
from .models import Notification
from .utils import create_spray_notifications

from rest_framework import viewsets
from .models import CropRegistration
from .models import FarmerProfile
from .serializers import CropRegistrationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views import View
from rest_framework.views import APIView
from rest_framework.decorators import api_view


# ============================================================
# IMAGE DISEASE PREDICTION
# ============================================================

@csrf_exempt
def predict_image(request):
    from .ai_model.predict import predict_disease

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "error": "POST request required"
            },
            status=400
        )

    if "image" not in request.FILES:

        return JsonResponse(
            {
                "success": False,
                "error": "No image uploaded"
            },
            status=400
        )

    image = request.FILES["image"]

    temp_path = None

    try:

        # ----------------------------------------------------
        # Create temporary image file
        # ----------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temp:

            for chunk in image.chunks():

                temp.write(chunk)

            temp_path = temp.name


        # ----------------------------------------------------
        # Predict disease
        # ----------------------------------------------------

        result = predict_disease(temp_path)


        return JsonResponse(
            {
                "success": True,
                "predictions": result
            }
        )


    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "error": str(e)
            },
            status=500
        )


    finally:

        # ----------------------------------------------------
        # Delete temporary image
        # ----------------------------------------------------

        if temp_path and os.path.exists(temp_path):

            os.remove(temp_path)


# ============================================================
# AI ASSISTANT
# ============================================================

@csrf_exempt
def assistant(request):

    # ========================================================
    # METHOD CHECK
    # ========================================================

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "error": "POST request required"
            },
            status=400
        )


    try:

        # ====================================================
        # READ JSON
        # ====================================================

        data = json.loads(request.body)


        question = data.get(
            "question",
            ""
        ).strip()


        language = data.get(
            "language",
            "en"
        )


        # ====================================================
        # LANGUAGE VALIDATION
        # ====================================================

        if language not in ["en", "te"]:

            language = "en"


        # ====================================================
        # EMPTY QUESTION
        # ====================================================

        if not question:

            return JsonResponse(
                {
                    "success": False,
                    "error": (
                        "Question is required"
                    )
                },
                status=400
            )


        # ====================================================
        # LOWERCASE QUESTION
        # ====================================================

        question_lower = question.lower()


        # ====================================================
        # ====================================================
        # 1. FIND DISEASE
        # ====================================================
        # ====================================================

        found_disease = None


        for disease_key, disease in DISEASE_DATA.items():

            # ------------------------------------------------
            # English disease key
            # ------------------------------------------------

            disease_key_lower = str(
                disease_key
            ).lower()


            # ------------------------------------------------
            # English name
            # ------------------------------------------------

            name_data = disease.get(
                "name",
                {}
            )


            disease_name_en = str(
                name_data.get(
                    "en",
                    ""
                )
            ).lower()


            # ------------------------------------------------
            # Telugu name
            # ------------------------------------------------

            disease_name_te = str(
                name_data.get(
                    "te",
                    ""
                )
            )


            # ------------------------------------------------
            # Check English key
            # ------------------------------------------------

            if (
                disease_key_lower
                and disease_key_lower in question_lower
            ):

                found_disease = disease_key

                break


            # ------------------------------------------------
            # Check English name
            # ------------------------------------------------

            if (
                disease_name_en
                and disease_name_en in question_lower
            ):

                found_disease = disease_key

                break


            # ------------------------------------------------
            # Check Telugu name
            # ------------------------------------------------

            if (
                disease_name_te
                and disease_name_te in question
            ):

                found_disease = disease_key

                break


        # ====================================================
        # 2. DISEASE FOUND
        # ====================================================

        if found_disease:

            disease = DISEASE_DATA[
                found_disease
            ]


            # ------------------------------------------------
            # Basic information
            # ------------------------------------------------

            name = disease.get(
                "name",
                {}
            ).get(
                language,
                disease.get(
                    "name",
                    {}
                ).get(
                    "en",
                    found_disease
                )
            )


            symptoms = disease.get(
                "symptoms",
                {}
            ).get(
                language,
                ""
            )


            causes = disease.get(
                "causes",
                {}
            ).get(
                language,
                ""
            )


            prevention = disease.get(
                "prevention",
                {}
            ).get(
                language,
                ""
            )


            # ------------------------------------------------
            # Chemical treatment
            # ------------------------------------------------

            chemical = disease.get(
                "chemicalTreatment",
                {}
            )


            chemical_first = chemical.get(
                "firstApplication",
                {}
            )


            chemical_follow = chemical.get(
                "followUpApplication",
                {}
            )


            # ------------------------------------------------
            # Natural treatment
            # ------------------------------------------------

            natural = disease.get(
                "naturalTreatment",
                {}
            )


            natural_first = natural.get(
                "firstApplication",
                {}
            )


            natural_follow = natural.get(
                "followUpApplication",
                {}
            )


            # ------------------------------------------------
            # Helper function
            # ------------------------------------------------

            def get_language_value(
                obj,
                key
            ):

                value = obj.get(
                    key,
                    {}
                )

                if isinstance(value, dict):

                    return value.get(
                        language,
                        value.get(
                            "en",
                            ""
                        )
                    )

                return value


            # ------------------------------------------------
            # Return disease response
            # ------------------------------------------------

            return JsonResponse({

                "success": True,

                "found": True,

                "type": "disease",

                "disease": found_disease,

                "question": question,

                "language": language,


                "data": {

                    # ========================================
                    # BASIC INFORMATION
                    # ========================================

                    "name": name,

                    "symptoms": symptoms,

                    "causes": causes,

                    "prevention": prevention,


                    # ========================================
                    # CHEMICAL TREATMENT
                    # ========================================

                    "chemicalTreatment": {

                        "firstApplication": {

                            "product":
                                get_language_value(
                                    chemical_first,
                                    "product"
                                ),

                            "dosage":
                                get_language_value(
                                    chemical_first,
                                    "dosage"
                                ),

                            "dosagePerAcre":
                                get_language_value(
                                    chemical_first,
                                    "dosagePerAcre"
                                ),

                            "timing":
                                get_language_value(
                                    chemical_first,
                                    "timing"
                                ),
                        },


                        "followUpApplication": {

                            "product":
                                get_language_value(
                                    chemical_follow,
                                    "product"
                                ),

                            "dosage":
                                get_language_value(
                                    chemical_follow,
                                    "dosage"
                                ),

                            "dosagePerAcre":
                                get_language_value(
                                    chemical_follow,
                                    "dosagePerAcre"
                                ),

                            "timing":
                                get_language_value(
                                    chemical_follow,
                                    "timing"
                                ),
                        }

                    },


                    # ========================================
                    # NATURAL TREATMENT
                    # ========================================

                    "naturalTreatment": {

                        "firstApplication": {

                            "product":
                                get_language_value(
                                    natural_first,
                                    "product"
                                ),

                            "dosage":
                                get_language_value(
                                    natural_first,
                                    "dosage"
                                ),

                            "dosagePerAcre":
                                get_language_value(
                                    natural_first,
                                    "dosagePerAcre"
                                ),

                            "timing":
                                get_language_value(
                                    natural_first,
                                    "timing"
                                ),
                        },


                        "followUpApplication": {

                            "product":
                                get_language_value(
                                    natural_follow,
                                    "product"
                                ),

                            "dosage":
                                get_language_value(
                                    natural_follow,
                                    "dosage"
                                ),

                            "dosagePerAcre":
                                get_language_value(
                                    natural_follow,
                                    "dosagePerAcre"
                                ),

                            "timing":
                                get_language_value(
                                    natural_follow,
                                    "timing"
                                ),
                        }

                    }

                }

            })


        # ====================================================
        # ====================================================
        # 3. DISEASE NOT FOUND
        #
        # IMPORTANT:
        # DO NOT RETURN HERE.
        #
        # We must continue and search CROP_DATA.
        # ====================================================
        # ====================================================


        # ====================================================
        # 4. FIND CROP
        # ====================================================

        found_crop = None


        for crop_key, crop in CROP_DATA.items():

            aliases = crop.get(
                "aliases",
                []
            )


            for alias in aliases:

                if not alias:
                    continue


                alias_lower = str(
                    alias
                ).lower().strip()


                # --------------------------------------------
                # English aliases
                # --------------------------------------------

                if (
                    alias_lower
                    and alias_lower in question_lower
                ):

                    found_crop = crop_key

                    break


            if found_crop:

                break


        # ====================================================
        # 5. CROP FOUND
        # ====================================================

        if found_crop:

            crop = CROP_DATA[
                found_crop
            ]


            # ------------------------------------------------
            # IMPORTANT
            #
            # We return the COMPLETE crop object.
            #
            # React will receive:
            #
            # answer.data.name
            # answer.data.before_cultivation
            # answer.data.first_stage
            # answer.data.second_stage
            # answer.data.third_stage
            # answer.data.budget
            # ------------------------------------------------

            return JsonResponse({

                "success": True,

                "found": True,

                "type": "crop",

                "crop": found_crop,

                "question": question,

                "language": language,

                "data": crop

            })


        # ====================================================
        # ====================================================
        # 6. NOTHING FOUND
        # ====================================================
        # ====================================================

        if language == "te":

            message = (
                "క్షమించండి, మీ ప్రశ్నను "
                "అర్థం చేసుకోలేకపోయాము."
            )

        else:

            message = (
                "Sorry, we can't understand "
                "your question."
            )


        return JsonResponse({

            "success": True,

            "found": False,

            "question": question,

            "language": language,

            "message": message

        })


    # ========================================================
    # INVALID JSON
    # ========================================================

    except json.JSONDecodeError:

        return JsonResponse({

            "success": False,

            "error": "Invalid JSON"

        }, status=400)


    # ========================================================
    # OTHER ERRORS
    # ========================================================

    except Exception as e:

        print(
            "ASSISTANT ERROR:",
            str(e)
        )

        return JsonResponse({

            "success": False,

            "error": str(e)

        }, status=500)





class CropRegistrationView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # =====================================================
    # CREATE NEW CROP
    # =====================================================

    def post(self, request):

        serializer = CropRegistrationSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # SAVE CROP
        # Automatically link crop to logged-in farmer
        # -------------------------------------------------

        crop = serializer.save(
            farmer=request.user
        )

        # -------------------------------------------------
        # PADDY HARVEST DATE
        # -------------------------------------------------

        crop_name = (
            crop.crop_name or ""
        ).strip().lower()

        if crop_name == "paddy":

            season = (
                crop.crop_season or ""
            ).strip()

            duration = None

            if season.lower() == "dalwa":

                duration = 135

            elif season.lower() == "sarva":

                duration = 145

            if (
                duration
                and crop.cultivation_date
            ):

                crop.harvest_date = (
                    crop.cultivation_date
                    + timedelta(days=duration)
                )

                crop.save(
                    update_fields=[
                        "harvest_date"
                    ]
                )

        # -------------------------------------------------
        # CREATE SPRAYING NOTIFICATIONS
        # -------------------------------------------------

        create_spray_notifications(crop)

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        response_serializer = (
            CropRegistrationSerializer(crop)
        )

        return Response(
            {
                "success": True,
                "message": "Crop registration successful",
                "data": response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    # =====================================================
    # UPDATE EXISTING CROP
    # =====================================================

    def put(self, request, pk):

        # -------------------------------------------------
        # GET ONLY LOGGED-IN FARMER'S CROP
        # -------------------------------------------------

        try:

            crop = CropRegistration.objects.get(
                pk=pk,
                farmer=request.user
            )

        except CropRegistration.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Crop not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # DELETE OLD SPRAYING NOTIFICATIONS
        # -------------------------------------------------

        crop.notifications.filter(
            notification_type="spraying"
        ).delete()

        # -------------------------------------------------
        # UPDATE CROP
        # -------------------------------------------------

        serializer = CropRegistrationSerializer(
            crop,
            data=request.data,
            partial=False
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # SAVE UPDATED CROP
        # Keep the same farmer
        # -------------------------------------------------

        crop = serializer.save(
            farmer=request.user
        )

        # -------------------------------------------------
        # PADDY HARVEST DATE
        # -------------------------------------------------

        crop_name = (
            crop.crop_name or ""
        ).strip().lower()

        if crop_name == "paddy":

            season = (
                crop.crop_season or ""
            ).strip()

            duration = None

            if season.lower() == "dalwa":

                duration = 135

            elif season.lower() == "sarva":

                duration = 145

            # ---------------------------------------------
            # UPDATE HARVEST DATE
            # ---------------------------------------------

            if (
                duration
                and crop.cultivation_date
            ):

                crop.harvest_date = (
                    crop.cultivation_date
                    + timedelta(days=duration)
                )

            else:

                crop.harvest_date = None

            crop.save(
                update_fields=[
                    "harvest_date"
                ]
            )

        else:

            crop.harvest_date = None

            crop.save(
                update_fields=[
                    "harvest_date"
                ]
            )

        # -------------------------------------------------
        # CREATE NEW SPRAYING NOTIFICATIONS
        # -------------------------------------------------

        create_spray_notifications(crop)

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        response_serializer = (
            CropRegistrationSerializer(crop)
        )

        return Response(
            {
                "success": True,
                "message": "Crop updated successfully.",
                "data": response_serializer.data
            },
            status=status.HTTP_200_OK
        )






class MyCropView(View):

    def get(self, request):

        # ----------------------------------------------------
        # GET ALL REGISTERED CROPS
        # ----------------------------------------------------

        crops = (
            CropRegistration.objects
            .all()
            .order_by("-created_at")
        )

        data = []

        today = timezone.localdate()

        # ----------------------------------------------------
        # LOOP THROUGH CROPS
        # ----------------------------------------------------

        for crop in crops:

            crop_name = (
                crop.crop_name or ""
            ).strip()

            crop_name_lower = crop_name.lower()

            # =================================================
            # CROP AGE
            # =================================================

            crop_age = 0

            if crop.cultivation_date:

                crop_age = (
                    today - crop.cultivation_date
                ).days

                if crop_age < 0:
                    crop_age = 0

            # =================================================
            # DEFAULT VALUES
            # =================================================

            duration = None
            progress = None
            has_harvest_date = False

            # =================================================
            # PADDY
            # =================================================

            if crop_name_lower == "paddy":

                # ---------------------------------------------
                # GET SEASON
                # ---------------------------------------------

                season = (
                    crop.crop_season or ""
                ).strip()

                # ---------------------------------------------
                # GET DURATION
                # ---------------------------------------------

                if season == "Dalwa":
                    duration = 135

                elif season == "Sarva":
                    duration = 145

                # ---------------------------------------------
                # HARVEST DATE
                # ---------------------------------------------

                if (
                    duration
                    and crop.cultivation_date
                ):

                    calculated_harvest = (
                        crop.cultivation_date
                        + timedelta(days=duration)
                    )

                    if (
                        crop.harvest_date
                        != calculated_harvest
                    ):

                        crop.harvest_date = (
                            calculated_harvest
                        )

                        crop.save(
                            update_fields=[
                                "harvest_date"
                            ]
                        )

                    has_harvest_date = True

                # ---------------------------------------------
                # PROGRESS
                # ---------------------------------------------

                if duration:

                    progress = (
                        crop_age / duration
                    ) * 100

                    if progress > 100:
                        progress = 100

            # =================================================
            # MAIZE
            # =================================================

            elif crop_name_lower == "maize":

                if crop.harvest_date:

                    has_harvest_date = True

                    if crop.cultivation_date:

                        total_days = (
                            crop.harvest_date
                            - crop.cultivation_date
                        ).days

                        if total_days > 0:

                            duration = total_days

                            progress = (
                                crop_age / duration
                            ) * 100

                            if progress > 100:
                                progress = 100

            # =================================================
            # CHILLI / COTTON / OTHER
            # =================================================

            elif crop_name_lower in [
                "chilli",
                "cotton",
                "other"
            ]:

                duration = None
                progress = None
                has_harvest_date = False

            # =================================================
            # CROP REPORT
            # =================================================

            crop_report = []

            # =================================================
            # FUTURE SPRAYING
            # =================================================

            future_spraying = []

            # ------------------------------------------------
            # ONLY PADDY + SEASON
            # ------------------------------------------------

            if (
                crop_name_lower == "paddy"
                and crop.crop_season
                and crop.cultivation_date
            ):

                # ---------------------------------------------
                # FIND CROP DATA
                # ---------------------------------------------

                season_data = CROP_DATA.get(
                    crop.crop_season
                )

                if season_data:

                    schedule = season_data.get(
                        "schedule",
                        []
                    )

                    # -----------------------------------------
                    # CREATE REPORT
                    # -----------------------------------------

                    for activity in schedule:

                        day = activity.get("day")

                        if day is None:
                            continue

                        # -------------------------------------
                        # ACTIVITY DATE
                        # -------------------------------------

                        activity_date = (
                            crop.cultivation_date
                            + timedelta(days=day)
                        )

                        # -------------------------------------
                        # DAYS REMAINING
                        # -------------------------------------

                        days_remaining = (
                            activity_date - today
                        ).days

                        # -------------------------------------
                        # ACTIVITY STATUS
                        # -------------------------------------

                        if today > activity_date:

                            activity_status = (
                                "completed"
                            )

                        elif today == activity_date:

                            activity_status = (
                                "today"
                            )

                        else:

                            activity_status = (
                                "upcoming"
                            )

                        # -------------------------------------
                        # LANGUAGE DATA
                        # -------------------------------------

                        product = activity.get(
                            "product",
                            {}
                        )

                        dosage = activity.get(
                            "dosage",
                            {}
                        )

                        stage = activity.get(
                            "stage",
                            ""
                        )

                        # =====================================
                        # FUTURE SPRAYING
                        # =====================================
                        #
                        # Notify/show farmer before the
                        # spraying date.
                        #
                        # Here we consider the next 3 days.
                        #
                        # Example:
                        # today = Day 33
                        # spraying = Day 36
                        # days_remaining = 3
                        #
                        # It will appear in future_spraying.
                        # =====================================

                        if (
                            1 <= days_remaining <= 3
                        ):

                            future_spraying.append(
                                {
                                    "day": day,
                                    "date": (
                                        activity_date
                                        .isoformat()
                                    ),
                                    "days_remaining":
                                        days_remaining,
                                    "stage": activity.get("stage", ""),
                                    "product": product,
                                    "dosage": dosage
                                }
                            )

                        # -------------------------------------
                        # ADD TO FULL CROP REPORT
                        # -------------------------------------

                        crop_report.append(
                            {
                                "day": day,

                                "date":
                                    activity_date.isoformat(),

                                "stage":
                                    stage,

                                "product":
                                    product,

                                "dosage":
                                    dosage,

                                "status":
                                    activity_status
                            }
                        )

            # =================================================
            # SORT FUTURE SPRAYING
            # =================================================

            future_spraying.sort(
                key=lambda x: x["day"]
            )

            # =================================================
            # SORT CROP REPORT
            # =================================================

            crop_report.sort(
                key=lambda x: x["day"]
            )

            # =================================================
            # FIXED DURATION
            # =================================================

            if (
                crop_name_lower == "paddy"
                and crop.crop_season
            ):

                fixed_duration = True

            elif crop_name_lower == "maize":

                fixed_duration = True

            else:

                fixed_duration = False

            # =================================================
            # FINAL DATA
            # =================================================

            data.append(
                {
                    "id":
                        crop.id,

                    "farmer":
                        crop.farmer_id,

                    "name":
                        crop.name,

                    "ph_num":
                        crop.ph_num,

                    "village":
                        crop.village,

                    "district":
                        crop.district,

                    "acres":
                        float(crop.acres),

                    # -----------------------------------------
                    # CROP DETAILS
                    # -----------------------------------------

                    "crop_name":
                        crop.crop_name,

                    "crop_season":
                        crop.crop_season,

                    "farming_stage":
                        crop.farming_stage,

                    "cultivation_date":
                        (
                            crop.cultivation_date.isoformat()
                            if crop.cultivation_date
                            else None
                        ),

                    "harvest_date":
                        (
                            crop.harvest_date.isoformat()
                            if crop.harvest_date
                            else None
                        ),

                    "crop_age":
                        crop_age,

                    "duration":
                        duration,

                    "progress":
                        (
                            round(progress, 1)
                            if progress is not None
                            else None
                        ),

                    "has_harvest_date":
                        has_harvest_date,

                    "fixed_duration":
                        fixed_duration,

                    # -----------------------------------------
                    # COMPLETE CROP REPORT
                    # -----------------------------------------

                    "crop_report":
                        crop_report,

                    # -----------------------------------------
                    # FUTURE SPRAYING
                    # -----------------------------------------

                    "future_spraying":
                        future_spraying
                }
            )

        # =====================================================
        # RESPONSE
        # =====================================================

        return JsonResponse(
            {
                "success": True,

                "count":
                    len(data),

                "data":
                    data
            }
        )


    
class TeluguTransliterationView(APIView):
    

    def post(self, request):

        name = request.data.get("name", "").strip()

        if not name:
            return Response(
                {
                    "success": False,
                    "message": "Name is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            url = (
                "https://inputtools.google.com/"
                "request?itc=te-t-i0-und"
                "&num=1"
                "&cp=0"
                "&cs=1"
                "&ie=utf-8"
                "&oe=utf-8"
            )

            response = requests.post(
                url,
                data={
                    "text": name
                },
                timeout=10
            )

            result = response.json()

            if (
                result
                and result[0] == "SUCCESS"
                and len(result) > 1
                and result[1]
            ):

                suggestions = result[1][0][1]

                if suggestions:

                    return Response({
                        "success": True,
                        "original": name,
                        "telugu": suggestions[0]
                    })

            return Response({
                "success": False,
                "original": name,
                "telugu": name
            })

        except Exception as e:

            print("Transliteration Error:", e)

            return Response({
                "success": False,
                "original": name,
                "telugu": name
            })


def get_crop_report(crop):
    """
    Calculate crop report based on Paddy season
    and cultivation date.
    """

    # =========================================
    # ONLY PADDY
    # =========================================

    crop_name = (crop.crop_name or "").strip()

    if crop_name.lower() != "paddy":
        return []

    # =========================================
    # GET SEASON
    # =========================================

    season = (crop.crop_season or "").strip()

    if season.lower() == "dalwa":
        crop_key = "Dalwa"

    elif season.lower() == "sarva":
        crop_key = "Sarva"

    else:
        return []

    # =========================================
    # GET CROP DATA
    # =========================================

    crop_data = CROP_DATA.get(crop_key)

    if not crop_data or not crop.cultivation_date:
        return []

    # =========================================
    # CROP AGE
    # =========================================

    today = timezone.localdate()

    crop_age = (
        today - crop.cultivation_date
    ).days

    if crop_age < 0:
        crop_age = 0

    report = []

    # =========================================
    # SCHEDULE
    # =========================================

    for item in crop_data.get("schedule", []):

        day = item.get("day")

        if day is None:
            continue

        task_date = (
            crop.cultivation_date
            + timedelta(days=day)
        )

        # =====================================
        # STATUS
        # =====================================

        if crop_age > day:
            status = "completed"

        elif crop_age == day:
            status = "today"

        else:
            status = "upcoming"

        # =====================================
        # ADD ACTIVITY
        # =====================================

        report.append({
            "day": day,
            "date": task_date.isoformat(),
            "stage": item.get("stage", ""),
            "product": item.get("product", {}),
            "dosage": item.get("dosage", {}),
            "status": status,
        })

    # =========================================
    # HARVEST
    # =========================================

    duration = crop_data.get("duration")

    if duration:

        harvest_date = (
            crop.cultivation_date
            + timedelta(days=duration)
        )

        if crop_age > duration:
            status = "completed"

        elif crop_age == duration:
            status = "today"

        else:
            status = "upcoming"

        report.append({
            "day": duration,
            "date": harvest_date.isoformat(),
            "type": "harvest",
            "stage": "harvest",
            "product": {
                "en": "Harvest",
                "te": "కోత",
            },
            "dosage": {
                "en": "Crop is ready for harvest",
                "te": "పంట కోతకు సిద్ధంగా ఉంటుంది",
            },
            "status": status,
        })

    # =========================================
    # SORT
    # =========================================

    report.sort(
        key=lambda x: x["day"]
    )

    return report


def get_notifications(request, crop_id):
    """
    Get notifications only for the selected farmer/crop.
    """

    try:
        crop = CropRegistration.objects.get(pk=crop_id)

    except CropRegistration.DoesNotExist:

        return JsonResponse(
            {
                "success": False,
                "message": "Crop not found."
            },
            status=404
        )

    notifications = (
        Notification.objects
        .filter(farmer=crop)
        .order_by("-created_at")
    )

    data = []

    for notification in notifications:

        data.append({
            "id": notification.id,

            "farmer_id": notification.farmer_id,

            "title": notification.title,

            "message": notification.message,

            "title_te": notification.title_te,

            "message_te": notification.message_te,

            "notification_type":
                notification.notification_type,

            "spray_date":
                notification.spray_date.isoformat()
                if notification.spray_date
                else None,

            "days_remaining":
                notification.days_remaining,

            "is_read":
                notification.is_read,

            "created_at":
                notification.created_at.isoformat(),
        })

    return JsonResponse({
        "success": True,

        "crop_id": crop.id,

        "farmer_name": crop.name,

        "count": len(data),

        "unread_count": sum(
            1 for notification in notifications
            if not notification.is_read
        ),

        "notifications": data
    })



def get_weather(request, crop_id):
    """
    Get current weather for the selected farmer/crop
    based on village + district.
    """

    crop = get_object_or_404(
        CropRegistration,
        pk=crop_id
    )

    village = crop.village.strip()
    district = crop.district.strip()

    if not village and not district:
        return JsonResponse(
            {
                "success": False,
                "message": "Farmer location is not available."
            },
            status=400
        )

    api_key = getattr(
        settings,
        "OPENWEATHER_API_KEY",
        None
    )

    if not api_key:
        return JsonResponse(
            {
                "success": False,
                "message": "OpenWeather API key is not configured."
            },
            status=500
        )

    # -------------------------------------------------
    # STEP 1: Convert farmer address -> coordinates
    # -------------------------------------------------

    location_query = f"{village}, {district}, Andhra Pradesh, IN"

    geocode_url = (
        "https://api.openweathermap.org/geo/1.0/direct"
    )

    try:

        geo_response = requests.get(
            geocode_url,
            params={
                "q": location_query,
                "limit": 1,
                "appid": api_key
            },
            timeout=10
        )

        geo_response.raise_for_status()

        locations = geo_response.json()

    except requests.RequestException as error:

        print("Geocoding error:", error)

        return JsonResponse(
            {
                "success": False,
                "message": "Unable to find farmer location."
            },
            status=502
        )

    if not locations:

        return JsonResponse(
            {
                "success": False,
                "message": (
                    f"Location not found for "
                    f"{village}, {district}."
                )
            },
            status=404
        )

    latitude = locations[0].get("lat")
    longitude = locations[0].get("lon")

    location_name = locations[0].get(
        "name",
        village
    )

    # -------------------------------------------------
    # STEP 2: Get current weather
    # -------------------------------------------------

    weather_url = (
        "https://api.openweathermap.org/data/2.5/weather"
    )

    try:

        weather_response = requests.get(
            weather_url,
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": api_key,
                "units": "metric"
            },
            timeout=10
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

    except requests.RequestException as error:

        print("Weather API error:", error)

        return JsonResponse(
            {
                "success": False,
                "message": "Unable to fetch weather information."
            },
            status=502
        )

    # -------------------------------------------------
    # STEP 3: Prepare response
    # -------------------------------------------------

    weather = weather_data.get(
        "weather",
        [{}]
    )[0]

    main = weather_data.get(
        "main",
        {}
    )

    wind = weather_data.get(
        "wind",
        {}
    )

    return JsonResponse(
        {
            "success": True,

            "crop_id": crop.id,

            "farmer_name": crop.name,

            "location": {
                "village": village,
                "district": district,
                "name": location_name,
                "latitude": latitude,
                "longitude": longitude
            },

            "weather": {
                "temperature": main.get("temp"),
                "feels_like": main.get("feels_like"),
                "humidity": main.get("humidity"),
                "pressure": main.get("pressure"),

                "condition": weather.get("main"),
                "description": weather.get("description"),

                "icon": weather.get("icon"),

                "wind_speed": wind.get("speed"),
                "wind_direction": wind.get("deg")
            }
        }
    )


@api_view(["GET"])
def farmer_weather(request):
    village = request.GET.get("village")
    district = request.GET.get("district")

    if not village or not district:
        return Response({
            "success": False,
            "message": "Village and district are required."
        }, status=400)

    api_key = settings.OPENWEATHER_API_KEY

    if not api_key:
        return Response({
            "success": False,
            "message": "Weather API key is not configured."
        }, status=500)

    location = f"{village}, {district}, India"

    try:

        # ==========================================
        # GET LATITUDE AND LONGITUDE
        # ==========================================

        geocode_url = "https://api.openweathermap.org/geo/1.0/direct"

        geocode_response = requests.get(
            geocode_url,
            params={
                "q": location,
                "limit": 1,
                "appid": api_key
            },
            timeout=10
        )

        geocode_response.raise_for_status()

        locations = geocode_response.json()

        if not locations:

            return Response({
                "success": False,
                "message": "Unable to find this farmer location."
            }, status=404)

        latitude = locations[0]["lat"]
        longitude = locations[0]["lon"]

        # ==========================================
        # GET WEATHER
        # ==========================================

        weather_url = (
            "https://api.openweathermap.org/data/2.5/weather"
        )

        weather_response = requests.get(
            weather_url,
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": api_key,
                "units": "metric"
            },
            timeout=10
        )

        weather_response.raise_for_status()

        weather = weather_response.json()

        # ==========================================
        # WEATHER DATA
        # ==========================================

        weather_data = {
            "location": location,

            "latitude": latitude,
            "longitude": longitude,

            "temperature": weather["main"]["temp"],

            "feels_like": weather["main"]["feels_like"],

            "humidity": weather["main"]["humidity"],

            "pressure": weather["main"]["pressure"],

            "weather": weather["weather"][0]["main"],

            "description": weather["weather"][0]["description"],

            "icon": weather["weather"][0]["icon"],

            "wind_speed": weather["wind"]["speed"],

            "clouds": weather["clouds"]["all"],

            "visibility": weather.get("visibility", 0),

        }

        return Response({
            "success": True,
            "data": weather_data
        })

    except requests.exceptions.RequestException as error:

        print("Weather API Error:", error)

        return Response({
            "success": False,
            "message": "Unable to fetch weather information."
        }, status=500)

    except Exception as error:

        print("Weather Error:", error)

        return Response({
            "success": False,
            "message": "Something went wrong while fetching weather."
        }, status=500)


@api_view(["GET"])
def farmer_weather_alert(request):

    village = request.GET.get("village")
    district = request.GET.get("district")

    if not village or not district:
        return Response({
            "success": False,
            "message": "Village and district are required."
        }, status=400)

    api_key = settings.OPENWEATHER_API_KEY

    if not api_key:
        return Response({
            "success": False,
            "message": "Weather API key is not configured."
        }, status=500)

    location = f"{village}, {district}, India"

    try:

        # =====================================================
        # STEP 1
        # GET LOCATION COORDINATES
        # =====================================================

        geocode_response = requests.get(
            "https://api.openweathermap.org/geo/1.0/direct",
            params={
                "q": location,
                "limit": 1,
                "appid": api_key
            },
            timeout=10
        )

        geocode_response.raise_for_status()

        locations = geocode_response.json()

        if not locations:

            return Response({
                "success": False,
                "message": "Location not found."
            }, status=404)

        latitude = locations[0]["lat"]
        longitude = locations[0]["lon"]

        # =====================================================
        # STEP 2
        # GET FORECAST
        # =====================================================

        forecast_response = requests.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": api_key,
                "units": "metric"
            },
            timeout=10
        )

        forecast_response.raise_for_status()

        forecast = forecast_response.json()

        forecast_list = forecast.get("list", [])

        # =====================================================
        # STEP 3
        # CHECK NEXT 24 HOURS
        # =====================================================

        rain_forecast = []

        for item in forecast_list[:8]:

            rain_probability = item.get("pop", 0) * 100

            weather_info = item.get("weather", [{}])[0]

            weather_main = weather_info.get(
                "main",
                ""
            ).lower()

            weather_description = weather_info.get(
                "description",
                ""
            )

            rain_amount = 0

            if "rain" in item:

                rain_data = item.get("rain", {})

                rain_amount = (
                    rain_data.get("3h", 0)
                )

            if (
                rain_probability >= 40
                or "rain" in weather_main
                or rain_amount > 0
            ):

                rain_forecast.append({

                    "time": item.get("dt_txt"),

                    "probability": round(
                        rain_probability
                    ),

                    "rain_amount": rain_amount,

                    "description":
                        weather_description

                })

        # =====================================================
        # STEP 4
        # CREATE ALERT
        # =====================================================

        alert = None

        if rain_forecast:

            maximum_probability = max(
                item["probability"]
                for item in rain_forecast
            )

            maximum_rain = max(
                item["rain_amount"]
                for item in rain_forecast
            )

            # -------------------------------------------------
            # HEAVY RAIN
            # -------------------------------------------------

            if (
                maximum_probability >= 80
                or maximum_rain >= 10
            ):

                alert = {

                    "type": "heavy_rain",

                    "severity": "high",

                    "title": "Heavy Rain Alert",

                    "title_te":
                        "భారీ వర్ష సూచన",

                    "message":
                        "Heavy rainfall is expected in your area.",

                    "message_te":
                        "మీ ప్రాంతంలో భారీ వర్షాలు కురిసే అవకాశం ఉంది.",

                    "precautions": [

                        "Ensure proper field drainage.",

                        "Protect harvested crops.",

                        "Avoid unnecessary field work.",

                        "Protect farm equipment.",

                        "Check crops for waterlogging."

                    ],

                    "precautions_te": [

                        "పొలంలో నీరు నిల్వ ఉండకుండా కాలువలు పరిశీలించండి.",

                        "కోతకు సిద్ధంగా ఉన్న పంటలను సురక్షిత ప్రదేశానికి తరలించండి.",

                        "అవసరం లేని సమయంలో పొలంలో పని చేయవద్దు.",

                        "వ్యవసాయ పరికరాలను సురక్షితంగా ఉంచండి.",

                        "పంటలో నీరు నిలిచిందో లేదో పరిశీలించండి."

                    ],

                    "probability":
                        maximum_probability,

                    "rain_amount":
                        maximum_rain

                }

            # -------------------------------------------------
            # NORMAL RAIN
            # -------------------------------------------------

            else:

                alert = {

                    "type": "rain",

                    "severity": "medium",

                    "title": "Rain Alert",

                    "title_te":
                        "వర్ష సూచన",

                    "message":
                        "Rain is expected in your area.",

                    "message_te":
                        "మీ ప్రాంతంలో వర్షాలు కురిసే అవకాశం ఉంది.",

                    "precautions": [

                        "Avoid pesticide spraying before rain.",

                        "Avoid fertilizer application before heavy rain.",

                        "Check field drainage.",

                        "Protect harvested crops."

                    ],

                    "precautions_te": [

                        "వర్షానికి ముందు పురుగుమందులు పిచికారీ చేయవద్దు.",

                        "భారీ వర్షానికి ముందు ఎరువులు వేయవద్దు.",

                        "పొలంలోని నీటి పారుదల వ్యవస్థను పరిశీలించండి.",

                        "కోతకు సిద్ధంగా ఉన్న పంటలను రక్షించండి."

                    ],

                    "probability":
                        maximum_probability,

                    "rain_amount":
                        maximum_rain

                }

        # =====================================================
        # NO RAIN
        # =====================================================

        return Response({

            "success": True,

            "location": location,

            "latitude": latitude,

            "longitude": longitude,

            "rain_expected":
                bool(rain_forecast),

            "alert": alert,

            "forecast": rain_forecast

        })

    except requests.exceptions.RequestException as error:

        print(
            "Weather API Error:",
            error
        )

        return Response({

            "success": False,

            "message":
                "Unable to fetch weather forecast."

        }, status=500)

    except Exception as error:

        print(
            "Weather Alert Error:",
            error
        )

        return Response({

            "success": False,

            "message":
                "Something went wrong while checking weather."

        }, status=500)



class LoginView(APIView):

    def post(self, request):

        phone_number = request.data.get("phone_number")
        password = request.data.get("password")

        if not phone_number or not password:
            return Response(
                {
                    "success": False,
                    "message": "Phone number and password are required."
                },
                status=400
            )

        phone_number = phone_number.strip()

        # Check existing farmer
        profile = FarmerProfile.objects.filter(
            phone_number=phone_number
        ).first()

        is_new_farmer = False

        if profile:

            # -----------------------------
            # OLD FARMER
            # -----------------------------

            user = profile.user

            user = authenticate(
                username=user.username,
                password=password
            )

            if user is None:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid phone number or password."
                    },
                    status=401
                )

        else:

            # -----------------------------
            # NEW FARMER
            # -----------------------------

            is_new_farmer = True

            user = User.objects.filter(
                username=phone_number
            ).first()

            if user is None:

                user = User.objects.create_user(
                    username=phone_number,
                    password=password
                )

            else:

                user.set_password(password)
                user.save()

            profile = FarmerProfile.objects.create(
                user=user,
                phone_number=phone_number
            )

        # Token
        token, created = Token.objects.get_or_create(
            user=user
        )

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "token": token.key,
                "is_new_farmer": is_new_farmer,

                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "phone_number": profile.phone_number,
                    "email": user.email,
                }
            },
            status=200
        )



def get_weather_by_location(request):

    location = request.GET.get("location", "").strip()

    if not location:
        return JsonResponse(
            {
                "success": False,
                "message": "Location is required."
            },
            status=400
        )

    api_key = getattr(
        settings,
        "OPENWEATHER_API_KEY",
        None
    )

    if not api_key:
        return JsonResponse(
            {
                "success": False,
                "message": "OpenWeather API key is not configured."
            },
            status=500
        )

    # ---------------------------------------
    # STEP 1: Geocoding
    # ---------------------------------------

    geocode_url = (
        "https://api.openweathermap.org/geo/1.0/direct"
    )

    # User may give:
    # Kunavaram Razole
    #
    # Search inside Andhra Pradesh, India

    search_location = (
        f"{location}, Andhra Pradesh, India"
    )

    try:

        geo_response = requests.get(
            geocode_url,
            params={
                "q": search_location,
                "limit": 5,
                "appid": api_key
            },
            timeout=10
        )

        geo_response.raise_for_status()

        locations = geo_response.json()

    except requests.RequestException as error:

        print("Geocoding error:", error)

        return JsonResponse(
            {
                "success": False,
                "message": "Unable to find the given location."
            },
            status=502
        )

    if not locations:

        return JsonResponse(
            {
                "success": False,
                "message": f"Location not found: {location}"
            },
            status=404
        )

    # ---------------------------------------
    # STEP 2: Select location
    # ---------------------------------------

    selected = locations[0]

    latitude = selected.get("lat")
    longitude = selected.get("lon")

    location_name = selected.get(
        "name",
        location
    )

    state = selected.get(
        "state",
        "Andhra Pradesh"
    )

    country = selected.get(
        "country",
        "IN"
    )

    # ---------------------------------------
    # STEP 3: Weather
    # ---------------------------------------

    weather_url = (
        "https://api.openweathermap.org/data/2.5/weather"
    )

    try:

        weather_response = requests.get(
            weather_url,
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": api_key,
                "units": "metric"
            },
            timeout=10
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()

    except requests.RequestException as error:

        print("Weather API error:", error)

        return JsonResponse(
            {
                "success": False,
                "message": "Unable to fetch weather information."
            },
            status=502
        )

    # ---------------------------------------
    # STEP 4: Prepare data
    # ---------------------------------------

    weather = weather_data.get(
        "weather",
        [{}]
    )[0]

    main = weather_data.get(
        "main",
        {}
    )

    wind = weather_data.get(
        "wind",
        {}
    )

    return JsonResponse(
        {
            "success": True,

            "location": {
                "searched": location,
                "name": location_name,
                "state": state,
                "country": country,
                "latitude": latitude,
                "longitude": longitude
            },

            "weather": {

                "temperature": main.get("temp"),

                "feels_like": main.get(
                    "feels_like"
                ),

                "humidity": main.get(
                    "humidity"
                ),

                "pressure": main.get(
                    "pressure"
                ),

                "condition": weather.get(
                    "main"
                ),

                "description": weather.get(
                    "description"
                ),

                "icon": weather.get(
                    "icon"
                ),

                "wind_speed": wind.get(
                    "speed"
                ),

                "wind_direction": wind.get(
                    "deg"
                )
            }
        }
    )


VERIFY_TOKEN = "rythu_mitra_verify_123"


@csrf_exempt
def whatsapp_webhook(request):

    if request.method == "GET":
        mode = request.GET.get("hub.mode")
        token = request.GET.get("hub.verify_token")
        challenge = request.GET.get("hub.challenge")

        print("MODE:", mode)
        print("TOKEN:", token)
        print("CHALLENGE:", challenge)

        if mode == "subscribe" and token == VERIFY_TOKEN:
            return HttpResponse(challenge)

        return HttpResponse("Verification failed", status=403)

    if request.method == "POST":
        data = json.loads(request.body)

        print(json.dumps(data, indent=2))

        return JsonResponse({"status": "received"})

    return HttpResponse(status=405)