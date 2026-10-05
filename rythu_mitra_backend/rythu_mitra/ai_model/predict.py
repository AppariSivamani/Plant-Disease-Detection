import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "models", "class_names.json")

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Load class names
with open(CLASS_PATH, "r") as f:
    class_indices = json.load(f)

class_names = list(class_indices.keys())

def predict_disease(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img, verbose=0)[0]

    top3 = prediction.argsort()[-3:][::-1]

    result = []
    for i in top3:
        result.append({
            "disease": class_names[i],
            "confidence": round(float(prediction[i] * 100), 2)
        })

    return result