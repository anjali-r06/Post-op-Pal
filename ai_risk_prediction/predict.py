import joblib
import pandas as pd

# =========================
# STEP 1: Load saved model
# =========================
model = joblib.load("model/risk_model.pkl")

print("✅ Model loaded!")

# =========================
# STEP 2: Take input (example)
# =========================
input_data = pd.DataFrame([[45,1,3,1,3,1,110,4,0.8,0]],
columns=[
    "age","surgery_type","days","fever","pain","swelling",
    "heart_rate","sleep","wound_score","meds"
])

# =========================
# STEP 3: Predict
# =========================
result = model.predict(input_data)

print("🎯 Predicted Risk:", result[0])