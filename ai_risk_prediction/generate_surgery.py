import pandas as pd

data = [
    [1, "Appendectomy", 10, "medium"],
    [2, "Cholecystectomy", 12, "medium"],
    [3, "Hernia Repair", 15, "medium"],
    [4, "Cesarean Section", 20, "high"],
    [5, "ACL Reconstruction", 30, "high"],
    [6, "Knee Replacement", 40, "high"],
    [7, "Hip Replacement", 45, "high"],
    [8, "Cataract Surgery", 7, "low"],
    [9, "Tonsillectomy", 8, "low"],
    [10, "Thyroidectomy", 15, "medium"],
    [11, "Ureteroscopy", 10, "medium"],
    [12, "Hemorrhoid Surgery", 12, "medium"],
    [13, "Breast Lumpectomy", 20, "medium"],
    [14, "Hysterectomy", 30, "high"],
    [15, "Anal Fissure Surgery", 10, "medium"]
]

df = pd.DataFrame(data, columns=[
    "surgery_type", "name", "recovery_days", "risk_level"
])

df.to_csv("data/surgery_info.csv", index=False)

print("✅ surgery_info.csv created!")