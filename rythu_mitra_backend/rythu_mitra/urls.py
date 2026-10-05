from django.urls import path
from .views import predict_image, assistant, CropRegistrationView,  MyCropView, TeluguTransliterationView, get_notifications, farmer_weather
from .views import farmer_weather_alert, LoginView, get_weather_by_location, whatsapp_webhook
from .views import (get_weather)


urlpatterns = [
    path("predict/", predict_image),
    
    path("assistant/", assistant),

    path("crop-registration/", CropRegistrationView.as_view(), name="crop-registration"),

    path("my-crop/", MyCropView.as_view(), name="my-crop"),

    path("transliterate-telugu/", TeluguTransliterationView.as_view(), name="transliterate-telugu"),

    path("notifications/<int:crop_id>/", get_notifications, name="get_notifications"),

    path("weather/<int:crop_id>/", get_weather, name="get_weather"),

    path("farmer-weather/", farmer_weather, name="farmer-weather"),

    path("farmer-weather-alert/", farmer_weather_alert, name="farmer-weather-alert"),

    path("login/", LoginView.as_view(), name="login"),

    path("weather-by-location/", get_weather_by_location, name="weather-by-location"),

    path("webhook/", whatsapp_webhook, name="whatsapp_webhook"),

]


