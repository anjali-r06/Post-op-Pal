from fastapi import FastAPI
import joblib
import pandas as pd

# =========================
# CREATE APP (VERY IMPORTANT)
# =========================
app = FastAPI()

# =========================
# LOAD MODEL
# =========================
model = joblib.load("model/risk_model.pkl")

# =========================
# HOME ROUTE
# =========================
@app.get("/")
def home():
    return {"message": "API is running"}

# =========================
# PREDICT ROUTE
# =========================
@app.post("/predict")
def predict(data: dict):

    input_data = pd.DataFrame([[ 
        data["age"],
        data["surgery_type"],
        data["days"],
        data["fever"],
        data["pain"],
        data["swelling"],
        data["heart_rate"],
        data["sleep"],
        data["wound_score"],
        data["meds"]
    ]],
    columns=[
        "age","surgery_type","days","fever","pain","swelling",
        "heart_rate","sleep","wound_score","meds"
    ])

    result = model.predict(input_data)

    return {"risk": result[0]}