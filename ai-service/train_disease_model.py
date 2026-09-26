"""
train_disease_model.py
Full training pipeline for PlantVillage-style crop disease CNN.

Dataset structure expected:
    dataset/
    ├── Healthy_Leaf/
    ├── Tomato_Early_Blight/
    ├── Tomato_Late_Blight/
    ├── Tomato_Leaf_Mold/
    ├── Potato_Early_Blight/
    ├── Potato_Late_Blight/
    ├── Corn_Rust/
    ├── Bacterial_Spot/
    ├── Powdery_Mildew/
    └── Mosaic_Virus/

Usage:
    python train_disease_model.py --dataset ./dataset --epochs 30 --output ./models/disease_cnn.h5
"""
import os
import argparse
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

import tensorflow as tf
from tensorflow.keras import layers, models, callbacks, optimizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

IMG_SIZE    = 224
BATCH_SIZE  = 32
NUM_CLASSES = 10


# ── Model architecture (MobileNetV2 transfer learning) ───────────────────────
def build_model(num_classes: int) -> tf.keras.Model:
    base = tf.keras.applications.MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    # Freeze base initially
    base.trainable = False

    model = models.Sequential([
        base,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.4),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation="softmax"),
    ])
    return model, base


# ── Data generators ───────────────────────────────────────────────────────────
def get_generators(dataset_dir: str):
    train_aug = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=30,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.1,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=False,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )
    val_aug = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2)

    train_gen = train_aug.flow_from_directory(
        dataset_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )
    val_gen = val_aug.flow_from_directory(
        dataset_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )
    return train_gen, val_gen


# ── Training ──────────────────────────────────────────────────────────────────
def train(dataset_dir: str, epochs: int, output_path: str):
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    train_gen, val_gen = get_generators(dataset_dir)
    num_classes = len(train_gen.class_indices)
    print(f"Classes found ({num_classes}): {train_gen.class_indices}")

    model, base = build_model(num_classes)
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    cb = [
        callbacks.ModelCheckpoint(output_path, save_best_only=True, monitor="val_accuracy", verbose=1),
        callbacks.EarlyStopping(patience=7, restore_best_weights=True, monitor="val_accuracy"),
        callbacks.ReduceLROnPlateau(factor=0.3, patience=3, min_lr=1e-6, verbose=1),
    ]

    print("\n── Phase 1: Training head (base frozen) ──")
    history1 = model.fit(train_gen, validation_data=val_gen, epochs=min(epochs, 15), callbacks=cb)

    # ── Fine-tune: unfreeze top 40 layers of base ─────────────────────────────
    print("\n── Phase 2: Fine-tuning top layers ──")
    base.trainable = True
    for layer in base.layers[:-40]:
        layer.trainable = False

    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    history2 = model.fit(train_gen, validation_data=val_gen, epochs=epochs, callbacks=cb)

    # ── Merge histories ───────────────────────────────────────────────────────
    acc  = history1.history["accuracy"]     + history2.history["accuracy"]
    val  = history1.history["val_accuracy"] + history2.history["val_accuracy"]
    loss = history1.history["loss"]         + history2.history["loss"]

    # ── Plot ──────────────────────────────────────────────────────────────────
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    ax1.plot(acc, label="Train Accuracy");  ax1.plot(val, label="Val Accuracy")
    ax1.set_title("Accuracy"); ax1.legend(); ax1.grid(True)
    ax2.plot(loss, label="Train Loss")
    ax2.set_title("Loss"); ax2.legend(); ax2.grid(True)
    plot_path = output_path.replace(".h5", "_training_plot.png")
    plt.savefig(plot_path, dpi=120, bbox_inches="tight")
    print(f"Training plot saved → {plot_path}")

    print(f"\nModel saved → {output_path}")
    print(f"Final val accuracy: {max(val):.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", default="./dataset",        help="Path to dataset directory")
    parser.add_argument("--epochs",  default=30, type=int,       help="Total training epochs")
    parser.add_argument("--output",  default="./models/disease_cnn.h5", help="Output model path")
    args = parser.parse_args()

    if not os.path.isdir(args.dataset):
        print(f"Dataset directory not found: {args.dataset}")
        print("Create dataset/ with one subfolder per disease class.")
        exit(1)

    train(args.dataset, args.epochs, args.output)
