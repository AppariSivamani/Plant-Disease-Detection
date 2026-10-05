import tensorflow as tf
import numpy as np
import json

from tensorflow.keras.preprocessing import image

# Load model
model = tf.keras.models.load_model("models/best_model.keras")

# Load class names
with open("models/class_names.json") as f:
    class_indices = json.load(f)

class_names = list(class_indices.keys())


def predict_disease(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)[0]

    top3 = prediction.argsort()[-3:][::-1]

    print("\nTop 3 Predictions:")

    for i in top3:
        print(f"{class_names[i]} : {prediction[i]*100:.2f}%")

    best = top3[0]
    disease = class_names[best]
    confidence = float(prediction[best])

    if confidence < 0.60:
        print("\n⚠️ Low confidence prediction.")

    else:
        print(f"\nDisease: {disease}")
        print(f"Confidence : {confidence*100:.2f}%")

    return disease, confidence

print(class_names)