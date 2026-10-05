from datetime import timedelta

from django.utils import timezone

from .models import Notification


CROP_DATA = {

    "Dalwa": {

        "name": {
            "en": "Dalwa (Kharif)",
            "te": "దల్వా (ఖరీఫ్)"
        },

        "aliases": [
            "dalwa",
            "dalwa crop",
            "kharif",
            "kharif crop",
            "dalwa kharif",
            "దల్వా",
            "దల్వా పంట",
            "ఖరీఫ్",
            "ఖరీఫ్ పంట"
        ],

        "duration": 135,

        "before_cultivation": {

            "seed": {
                "en": "Paddy seed - 25 kg per acre",
                "te": "వరి విత్తనం - ఎకరానికి 25 కిలోలు"
            },

            "dap": {
                "en": "DAP - 50kg per acre and urea 25kg per acre during land preparation.",
                "te": "నేల తయారీ సమయంలో ఎకరాకు 50 కిలోల DAP మరియు 25 కిలోల యూరియా."
            }
        },

        "schedule": [

            {
                "day": 3,
                "stage": "after_cultivation",
                "product": {
                    "en": "UPL Eros Herbicide",
                    "te": "UPL Eros కలుపు మందు"
                },
                "dosage": {
                    "en": "3kg per acre",
                    "te": "ఎకరాకు 3 కిలోలు"
                }
            },

            {
                "day": 15,
                "stage": "first_stage",
                "product": {
                    "en": "10.26.26 + Urea",
                    "te": "10.26.26 + యూరియా"
                },
                "dosage": {
                    "en": "50kg 10.26.26 + 25kg Urea per acre",
                    "te": "ఎకరాకు 50 కిలోల 10.26.26 + 25 కిలోల యూరియా"
                }
            },

            {
                "day": 20,
                "stage": "first_stage",
                "product": {
                    "en": "UPL Kevuka (Gulikalu)",
                    "te": "UPL కెవుకా (గుళికలు)"
                },
                "dosage": {
                    "en": "3kg per acre",
                    "te": "ఎకరాకు 3 కిలోలు"
                }
            },

            {
                "day": 30,
                "stage": "first_stage",
                "product": {
                    "en": "Chelamin Plus",
                    "te": "చెలమిన్ ప్లస్"
                },
                "dosage": {
                    "en": "500g per acre",
                    "te": "ఎకరాకు 500 గ్రాములు"
                }
            },

            {
                "day": 32,
                "stage": "second_stage",
                "product": {
                    "en": "Urea",
                    "te": "యూరియా"
                },
                "dosage": {
                    "en": "50kg per acre",
                    "te": "ఎకరాకు 50 కిలోలు"
                }
            },

            {
                "day": 36,
                "stage": "second_stage",
                "product": {
                    "en": "Aggi Thegulu [Beam] - Spray",
                    "te": "అగ్గి తెగులు [బీమ్] - పిచికారీ"
                },
                "dosage": {
                    "en": "120g per acre",
                    "te": "ఎకరాకు 120 గ్రాములు"
                }
            },

            {
                "day": 45,
                "stage": "second_stage",
                "product": {
                    "en": "Urea + Potassium",
                    "te": "యూరియా + పొటాషియం"
                },
                "dosage": {
                    "en": "25kg each per acre",
                    "te": "ఎకరాకు చెరో 25 కిలోలు"
                }
            },

            {
                "day": 50,
                "stage": "second_stage",
                "product": {
                    "en": "Incipio + Antracol",
                    "te": "ఇన్సిపియో + ఆంట్రాకోల్"
                },
                "dosage": {
                    "en": "40ml Incipio + 500g Antracol per acre",
                    "te": "ఎకరాకు 40 మి.లీ ఇన్సిపియో + 500 గ్రాముల ఆంట్రాకోల్"
                }
            },

            {
                "day": 70,
                "stage": "second_stage",
                "product": {
                    "en": "Furadan 3G Insecticide (Gulikalu)",
                    "te": "ఫురాడాన్ 3G పురుగుమందు (గులికలు)"
                },
                "dosage": {
                    "en": "10kg per acre",
                    "te": "ఎకరాకు 10 కిలోలు"
                }
            },

            {
                "day": 90,
                "stage": "third_stage",
                "product": {
                    "en": "Corteva Beam Fungicide - Meda Virupu",
                    "te": "మెడ విరుపు తెగులు కోసం Corteva Beam శిలీంధ్రనాశిని"
                },
                "dosage": {
                    "en": "120g per acre",
                    "te": "ఎకరాకు 120 గ్రాములు"
                }
            },

            {
                "day": 100,
                "stage": "third_stage",
                "product": {
                    "en": "Avancer Glow",
                    "te": "అవాన్సర్ గ్లో"
                },
                "dosage": {
                    "en": "600g per acre",
                    "te": "ఎకరాకు 600 గ్రాములు"
                }
            },

            {
                "day": 120,
                "stage": "third_stage",
                "product": {
                    "en": "Pexalon",
                    "te": "పెక్సలాన్"
                },
                "dosage": {
                    "en": "150ml per acre",
                    "te": "ఎకరాకు 150 మి.లీ"
                }
            }
        ],

        "budget": {
            "en": "₹35,000",
            "te": "₹35,000"
        }
    },


    "Sarva": {

        "name": {
            "en": "Sarva",
            "te": "సార్వ"
        },

        "aliases": [
            "sarva",
            "Rabi",
            "sarva crop",
            "సార్వ",
            "సార్వ పంట",
            "రెండో పంట",
            "రెండవ పంట"
        ],

        "duration": 145,

        "before_cultivation": {

            "seed": {
                "en": "Paddy seed - 25 kg per acre",
                "te": "వరి విత్తనం - ఎకరానికి 25 కిలోలు"
            },

            "dap": {
                "en": "DAP - 50kg per acre and urea 25kg per acre during land preparation.",
                "te": "నేల తయారీ సమయంలో ఎకరాకు 50 కిలోల DAP మరియు 25 కిలోల యూరియా."
            }
        },

        "schedule": [

            {
                "day": 3,
                "stage": "after_cultivation",
                "product": {
                    "en": "UPL Eros Herbicide",
                    "te": "UPL Eros కలుపు మందు"
                },
                "dosage": {
                    "en": "3kg per acre",
                    "te": "ఎకరాకు 3 కిలోలు"
                }
            },

            {
                "day": 20,
                "stage": "first_stage",
                "product": {
                    "en": "10.26.26 + Urea",
                    "te": "10.26.26 + యూరియా"
                },
                "dosage": {
                    "en": "50kg 10.26.26 + 25kg Urea per acre",
                    "te": "ఎకరాకు 50 కిలోల 10.26.26 + 25 కిలోల యూరియా"
                }
            },

            {
                "day": 25,
                "stage": "first_stage",
                "product": {
                    "en": "UPL Kevuka (Gulikalu)",
                    "te": "UPL కెవుకా (గుళికలు)"
                },
                "dosage": {
                    "en": "3kg per acre",
                    "te": "ఎకరాకు 3 కిలోలు"
                }
            },

            {
                "day": 40,
                "stage": "second_stage",
                "product": {
                    "en": "Urea + Potassium",
                    "te": "యూరియా + పొటాషియం"
                },
                "dosage": {
                    "en": "25kg each per acre",
                    "te": "ఎకరాకు చెరో 25 కిలోలు"
                }
            },

            {
                "day": 50,
                "stage": "third_stage",
                "product": {
                    "en": "Avancer Glow + Incipio",
                    "te": "అవాన్సర్ గ్లో + ఇన్సిపియో"
                },
                "dosage": {
                    "en": "600g Avancer Glow + 500g Incipio per acre",
                    "te": "ఎకరాకు 600 గ్రాముల అవాన్సర్ గ్లో + 500 గ్రాముల ఇన్సిపియో"
                }
            }
        ],

        "budget": {
            "en": "₹20,000",
            "te": "₹20,000"
        }
    }
}


def create_spray_notifications(crop):
    """
    Create spraying notifications for 3, 2, 1 and 0 days
    before/on the spraying date.
    """

    crop_name = (
        crop.crop_name or ""
    ).strip()

    if crop_name.lower() != "paddy":
        return

    season = (
        crop.crop_season or ""
    ).strip()

    if season.lower() == "dalwa":
        crop_key = "Dalwa"

    elif season.lower() == "sarva":
        crop_key = "Sarva"

    else:
        return

    crop_data = CROP_DATA.get(crop_key)

    if not crop_data:
        return

    if not crop.cultivation_date:
        return

    today = timezone.localdate()

    for item in crop_data.get("schedule", []):

        day = item.get("day")

        if day is None:
            continue

        spray_date = (
            crop.cultivation_date
            + timedelta(days=day)
        )

        days_remaining = (
            spray_date - today
        ).days

        print(
            f"Crop: {crop.crop_name} | "
            f"Season: {crop.crop_season} | "
            f"Day: {day} | "
            f"Spray Date: {spray_date} | "
            f"Today: {today} | "
            f"Remaining: {days_remaining}"
        )

        # Notify 3, 2, 1 and 0 days before/on spray date
        if days_remaining not in [3, 2, 1, 0]:
            continue

        product = item.get(
            "product",
            {}
        )

        dosage = item.get(
            "dosage",
            {}
        )

        product_en = product.get(
            "en",
            ""
        )

        dosage_en = dosage.get(
            "en",
            ""
        )

        product_te = product.get(
            "te",
            ""
        )

        dosage_te = dosage.get(
            "te",
            ""
        )

        # ---------------------------------------------
        # TITLE
        # ---------------------------------------------

        if days_remaining == 0:

            title = "Spraying Today"
            title_te = "ఈరోజు పిచికారీ చేయాలి"

        else:

            title = "Upcoming Spraying"
            title_te = "రాబోయే పిచికారీ"

        # ---------------------------------------------
        # MESSAGE
        # ---------------------------------------------

        if days_remaining == 0:

            message = (
                f"{product_en} spraying is scheduled "
                f"today ({spray_date.strftime('%d-%m-%Y')}). "
                f"Dosage: {dosage_en}"
            )

            message_te = (
                f"{product_te} పిచికారీ ఈరోజు చేయాలి. "
                f"పిచికారీ తేదీ: "
                f"{spray_date.strftime('%d-%m-%Y')}. "
                f"మోతాదు: {dosage_te}"
            )

        else:

            message = (
                f"{product_en} spraying is scheduled "
                f"in {days_remaining} day(s) "
                f"on {spray_date.strftime('%d-%m-%Y')}. "
                f"Dosage: {dosage_en}"
            )

            message_te = (
                f"{product_te} పిచికారీ చేయాలి. "
                f"ఇంకా {days_remaining} రోజులు ఉన్నాయి. "
                f"పిచికారీ తేదీ: "
                f"{spray_date.strftime('%d-%m-%Y')}. "
                f"మోతాదు: {dosage_te}"
            )

        # ---------------------------------------------
        # CREATE / UPDATE NOTIFICATION
        # ---------------------------------------------

        notification, created = (
            Notification.objects.get_or_create(
                farmer=crop,
                notification_type="spraying",
                spray_date=spray_date,
                defaults={
                    "title": title,
                    "message": message,
                    "title_te": title_te,
                    "message_te": message_te,
                    "days_remaining": days_remaining,
                }
            )
        )

        # ---------------------------------------------
        # UPDATE EXISTING NOTIFICATION
        # ---------------------------------------------

        if not created:

            notification.title = title
            notification.message = message
            notification.title_te = title_te
            notification.message_te = message_te
            notification.days_remaining = days_remaining

            notification.save(
                update_fields=[
                    "title",
                    "message",
                    "title_te",
                    "message_te",
                    "days_remaining",
                ]
            )

        # ---------------------------------------------
        # DEBUG
        # ---------------------------------------------

        if created:

            print(
                f"NOTIFICATION CREATED → "
                f"{product_en} | "
                f"{spray_date} | "
                f"{days_remaining} days remaining"
            )

        else:

            print(
                f"NOTIFICATION UPDATED/EXISTS → "
                f"{product_en} | "
                f"{spray_date} | "
                f"{days_remaining} days remaining"
            )