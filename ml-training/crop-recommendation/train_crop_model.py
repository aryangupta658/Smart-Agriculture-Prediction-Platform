# ============================================================
# Crop Recommendation Model Training Script
# Smart Agriculture Prediction Platform
# ============================================================

import os
import pickle

import pandas as pd

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB

from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


# ============================================================
# 1. Dataset Path
# ============================================================

DATASET_PATH = "Crop_recommendation.csv"
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)


# ============================================================
# 2. Load Dataset
# ============================================================

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Dataset shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())


# ============================================================
# 3. Basic Data Checks
# ============================================================

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Values:", df.duplicated().sum())

# Remove duplicates if present
df = df.drop_duplicates()

print("Shape after removing duplicates:", df.shape)


# ============================================================
# 4. Check Invalid Values
# ============================================================

print("\nInvalid Value Check:")

print("Invalid N:", df[df["N"] < 0].shape[0])
print("Invalid P:", df[df["P"] < 0].shape[0])
print("Invalid K:", df[df["K"] < 0].shape[0])
print("Invalid humidity:", df[(df["humidity"] < 0) | (df["humidity"] > 100)].shape[0])
print("Invalid ph:", df[(df["ph"] < 0) | (df["ph"] > 14)].shape[0])
print("Invalid rainfall:", df[df["rainfall"] < 0].shape[0])

# Remove invalid values if found
df = df[df["N"] >= 0]
df = df[df["P"] >= 0]
df = df[df["K"] >= 0]
df = df[(df["humidity"] >= 0) & (df["humidity"] <= 100)]
df = df[(df["ph"] >= 0) & (df["ph"] <= 14)]
df = df[df["rainfall"] >= 0]

print("Shape after invalid value cleaning:", df.shape)


# ============================================================
# 5. Feature and Target Split
# ============================================================

X = df.drop("label", axis=1)
y = df["label"]

print("\nInput features:")
print(X.columns.tolist())

print("\nTarget classes:")
print(y.unique())


# ============================================================
# 6. Label Encoding
# ============================================================

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

class_mapping = pd.DataFrame({
    "Crop_Label": label_encoder.classes_,
    "Encoded_Value": range(len(label_encoder.classes_))
})

print("\nClass Mapping:")
print(class_mapping)


# ============================================================
# 7. Train-Test Split
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

print("\nTrain-Test Split Completed")
print("X_train shape:", X_train.shape)
print("X_test shape:", X_test.shape)
print("y_train shape:", y_train.shape)
print("y_test shape:", y_test.shape)


# ============================================================
# 8. Feature Scaling
# ============================================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("\nFeature scaling completed.")


# ============================================================
# 9. Model Training and Comparison
# ============================================================

model_results = []

# ------------------------------------------------------------
# Logistic Regression
# ------------------------------------------------------------

lr = LogisticRegression(max_iter=5000)

lr_cv_scores = cross_val_score(
    lr,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

lr.fit(X_train_scaled, y_train)

y_train_pred_lr = lr.predict(X_train_scaled)
y_pred_lr = lr.predict(X_test_scaled)

lr_train_accuracy = accuracy_score(y_train, y_train_pred_lr)
lr_test_accuracy = accuracy_score(y_test, y_pred_lr)

model_results.append({
    "Model": "Logistic Regression",
    "Training Accuracy": lr_train_accuracy,
    "Mean CV Accuracy": lr_cv_scores.mean(),
    "CV Standard Deviation": lr_cv_scores.std(),
    "Test Accuracy": lr_test_accuracy
})


# ------------------------------------------------------------
# SVM
# ------------------------------------------------------------

svm = SVC(kernel="rbf", probability=True, random_state=42)

svm_cv_scores = cross_val_score(
    svm,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

svm.fit(X_train_scaled, y_train)

y_train_pred_svm = svm.predict(X_train_scaled)
y_pred_svm = svm.predict(X_test_scaled)

svm_train_accuracy = accuracy_score(y_train, y_train_pred_svm)
svm_test_accuracy = accuracy_score(y_test, y_pred_svm)

model_results.append({
    "Model": "SVM",
    "Training Accuracy": svm_train_accuracy,
    "Mean CV Accuracy": svm_cv_scores.mean(),
    "CV Standard Deviation": svm_cv_scores.std(),
    "Test Accuracy": svm_test_accuracy
})


# ------------------------------------------------------------
# KNN
# ------------------------------------------------------------

knn = KNeighborsClassifier(n_neighbors=5)

knn_cv_scores = cross_val_score(
    knn,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

knn.fit(X_train_scaled, y_train)

y_train_pred_knn = knn.predict(X_train_scaled)
y_pred_knn = knn.predict(X_test_scaled)

knn_train_accuracy = accuracy_score(y_train, y_train_pred_knn)
knn_test_accuracy = accuracy_score(y_test, y_pred_knn)

model_results.append({
    "Model": "KNN",
    "Training Accuracy": knn_train_accuracy,
    "Mean CV Accuracy": knn_cv_scores.mean(),
    "CV Standard Deviation": knn_cv_scores.std(),
    "Test Accuracy": knn_test_accuracy
})


# ------------------------------------------------------------
# Decision Tree
# ------------------------------------------------------------

dt = DecisionTreeClassifier(random_state=42)

dt_cv_scores = cross_val_score(
    dt,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

dt.fit(X_train_scaled, y_train)

y_train_pred_dt = dt.predict(X_train_scaled)
y_pred_dt = dt.predict(X_test_scaled)

dt_train_accuracy = accuracy_score(y_train, y_train_pred_dt)
dt_test_accuracy = accuracy_score(y_test, y_pred_dt)

model_results.append({
    "Model": "Decision Tree",
    "Training Accuracy": dt_train_accuracy,
    "Mean CV Accuracy": dt_cv_scores.mean(),
    "CV Standard Deviation": dt_cv_scores.std(),
    "Test Accuracy": dt_test_accuracy
})


# ------------------------------------------------------------
# Random Forest
# ------------------------------------------------------------

rf = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

rf_cv_scores = cross_val_score(
    rf,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

rf.fit(X_train_scaled, y_train)

y_train_pred_rf = rf.predict(X_train_scaled)
y_pred_rf = rf.predict(X_test_scaled)

rf_train_accuracy = accuracy_score(y_train, y_train_pred_rf)
rf_test_accuracy = accuracy_score(y_test, y_pred_rf)

model_results.append({
    "Model": "Random Forest",
    "Training Accuracy": rf_train_accuracy,
    "Mean CV Accuracy": rf_cv_scores.mean(),
    "CV Standard Deviation": rf_cv_scores.std(),
    "Test Accuracy": rf_test_accuracy
})


# ------------------------------------------------------------
# Naive Bayes
# ------------------------------------------------------------

nb = GaussianNB()

nb_cv_scores = cross_val_score(
    nb,
    X_train_scaled,
    y_train,
    cv=5,
    scoring="accuracy"
)

nb.fit(X_train_scaled, y_train)

y_train_pred_nb = nb.predict(X_train_scaled)
y_pred_nb = nb.predict(X_test_scaled)

nb_train_accuracy = accuracy_score(y_train, y_train_pred_nb)
nb_test_accuracy = accuracy_score(y_test, y_pred_nb)

model_results.append({
    "Model": "Naive Bayes",
    "Training Accuracy": nb_train_accuracy,
    "Mean CV Accuracy": nb_cv_scores.mean(),
    "CV Standard Deviation": nb_cv_scores.std(),
    "Test Accuracy": nb_test_accuracy
})


# ============================================================
# 10. Model Comparison
# ============================================================

model_comparison = pd.DataFrame(model_results)

model_comparison = model_comparison.sort_values(
    by="Test Accuracy",
    ascending=False
)

print("\nModel Comparison:")
print(model_comparison)


# ============================================================
# 11. Select Final Model
# ============================================================

final_model = rf

print("\nFinal Selected Model: Random Forest")


# ============================================================
# 12. Final Model Evaluation
# ============================================================

y_pred_final = final_model.predict(X_test_scaled)

print("\nRandom Forest Classification Report:")
print(classification_report(
    y_test,
    y_pred_final,
    target_names=label_encoder.classes_
))

cm = confusion_matrix(y_test, y_pred_final)

print("\nRandom Forest Confusion Matrix:")
print(cm)


# ============================================================
# 13. Feature Importance
# ============================================================

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": final_model.feature_importances_
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importance:")
print(feature_importance)


# ============================================================
# 14. Save Model, Scaler, and Label Encoder
# ============================================================

model_path = os.path.join(MODEL_DIR, "crop_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "crop_scaler.pkl")
encoder_path = os.path.join(MODEL_DIR, "crop_label_encoder.pkl")

with open(model_path, "wb") as f:
    pickle.dump(final_model, f)

with open(scaler_path, "wb") as f:
    pickle.dump(scaler, f)

with open(encoder_path, "wb") as f:
    pickle.dump(label_encoder, f)

print("\nModel files saved successfully:")
print(model_path)
print(scaler_path)
print(encoder_path)


# ============================================================
# 15. Test Saved Model
# ============================================================

with open(model_path, "rb") as f:
    loaded_model = pickle.load(f)

with open(scaler_path, "rb") as f:
    loaded_scaler = pickle.load(f)

with open(encoder_path, "rb") as f:
    loaded_label_encoder = pickle.load(f)

sample_input = pd.DataFrame([{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.8,
    "humidity": 82.0,
    "ph": 6.5,
    "rainfall": 202.0
}])

sample_input_scaled = loaded_scaler.transform(sample_input)

sample_prediction = loaded_model.predict(sample_input_scaled)

sample_crop = loaded_label_encoder.inverse_transform(sample_prediction)

print("\nSample Prediction Test:")
print("Recommended Crop:", sample_crop[0])