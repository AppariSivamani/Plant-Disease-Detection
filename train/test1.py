import os
from predict import predict_disease

folder = "dataset/Leaf_Blast"

for file in os.listdir(folder)[:10]:
    disease, confidence = predict_disease(os.path.join(folder, file))
    print(file, "->", disease, f"{confidence*100:.2f}%")

if confidence < 0.60:
    print("Low confidence prediction. Please upload a clearer image.")
else:
    print(disease)