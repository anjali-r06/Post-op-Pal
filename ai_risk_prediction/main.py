import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# =========================
# STEP 1: Load dataset
# =========================
df = pd.read_csv("data/data.csv")

# =========================
# STEP 2: Split input/output
# =========================
X = df.drop("risk", axis=1)
y = df["risk"]

# =========================
# STEP 3: Train model
# =========================
model = RandomForestClassifier()
model.fit(X, y)

print("✅ Model trained!")

# =========================
# STEP 4: Create model folder (IMPORTANT)
# =========================
os.makedirs("model", exist_ok=True)

# =========================
# STEP 5: Save model
# =========================
joblib.dump(model, "model/risk_model.pkl")

print("✅ Model saved!")

# =========================
# STEP 6: Test prediction (NO WARNING)
# =========================
test = pd.DataFrame([[45,1,3,1,3,1,110,4,0.8,0]],
columns=[
    "age","surgery_type","days","fever","pain","swelling",
    "heart_rate","sleep","wound_score","meds"
])

result = model.predict(test)

print("🎯 Predicted Risk:", result[0])

# =========================
# STEP 7: Verify file saved
# =========================
print("📂 Files in model folder:", os.listdir("model"))