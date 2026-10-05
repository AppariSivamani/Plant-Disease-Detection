import os
import random
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array, array_to_img

# Dataset Folder
DATASET_PATH = "dataset"

# Target images per class
TARGET_IMAGES = 350

# Augmentation
datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    zoom_range=0.15,
    shear_range=0.1,
    horizontal_flip=True,
    brightness_range=[0.9, 1.1],
    fill_mode="nearest"
)

# Loop through every class
for class_name in os.listdir(DATASET_PATH):

    class_path = os.path.join(DATASET_PATH, class_name)

    if not os.path.isdir(class_path):
        continue

    images = [
        f for f in os.listdir(class_path)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    current_count = len(images)

    print(f"{class_name} -> {current_count} images")

    if current_count >= TARGET_IMAGES:
        print("Already enough images\n")
        continue

    need = TARGET_IMAGES - current_count

    print(f"Generating {need} images...")

    generated = 0

    while generated < need:

        img_name = random.choice(images)

        img_path = os.path.join(class_path, img_name)

        img = load_img(img_path, target_size=(224,224))
        x = img_to_array(img)
        x = x.reshape((1,) + x.shape)

        for batch in datagen.flow(
                x,
                batch_size=1):

            aug_img = array_to_img(batch[0])

            save_name = f"aug_{generated}.jpg"

            aug_img.save(
                os.path.join(class_path, save_name)
            )

            generated += 1

            if generated >= need:
                break

    print("Done\n")

print("===================================")
print("Dataset Augmentation Completed")
print("===================================")