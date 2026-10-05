import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)

from sklearn.utils.class_weight import compute_class_weight

# ===========================
# Dataset Path
# ===========================

DATASET_PATH = "dataset"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 50

# ===========================
# Data Generator
# ===========================

train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,

    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    zoom_range=0.15,
    shear_range=0.1,
    horizontal_flip=True,
    brightness_range=[0.9,1.1],
    fill_mode="nearest"
)

train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training",
    shuffle=True
)

validation_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation",
    shuffle=False
)

print("\nClass Names")
print(train_generator.class_indices)

print("\nTotal Classes:", train_generator.num_classes)

# ===========================
# Save Class Names
# ===========================

os.makedirs("models", exist_ok=True)

with open("models/class_names.json","w") as f:
    json.dump(train_generator.class_indices,f)

# ===========================
# Class Weights
# ===========================

labels = train_generator.classes

class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(labels),
    y=labels
)

class_weights = dict(enumerate(class_weights))

print("\nClass Weights")
print(class_weights)

# ===========================
# EfficientNetB0
# ===========================

base_model = EfficientNetB0(
    weights="imagenet",
    include_top=False,
    input_shape=(224,224,3)
)

base_model.trainable = True

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)

outputs = Dense(
    train_generator.num_classes,
    activation="softmax"
)(x)

model = Model(
    inputs=base_model.input,
    outputs=outputs
)

# ===========================
# Compile
# ===========================

model.compile(
    optimizer=Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ===========================
# Callbacks
# ===========================

checkpoint = ModelCheckpoint(
    "models/best_model.keras",
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=8,
    restore_best_weights=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.2,
    patience=3,
    min_lr=1e-7,
    verbose=1
)

callbacks = [
    checkpoint,
    early_stop,
    reduce_lr
]

# ===========================
# Training
# ===========================

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS,
    callbacks=callbacks,
    class_weight=class_weights
)

# ===========================
# Save Final Model
# ===========================

model.save("models/rice_disease_model.keras")

print("\n✅ Training Completed")
print("Model Saved : models/rice_disease_model.keras")
print("Best Model  : models/best_model.keras")