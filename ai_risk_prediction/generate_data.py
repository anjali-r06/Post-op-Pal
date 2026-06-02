import pandas as pd
import random

data = []

for i in range(100):
    age = random.randint(20, 70)
    surgery_type = random.randint(1, 5)
    days = random.randint(1, 15)
    fever = random.randint(0, 1)
    pain = random.randint(1, 3)
    swelling = random.randint(0, 1)
    heart_rate = random.randint(60, 120)
    sleep = random.randint(3, 8)
    wound_score = round(random.uniform(0.1, 0.9), 2)
    meds = random.randint(0, 1)

    # simple logic for risk
    if wound_score > 0.7 or heart_rate > 105:
        risk = "High"
    elif wound_score > 0.4:
        risk = "Medium"
    else:
        risk = "Low"

    data.append([age, surgery_type, days, fever, pain, swelling,
                 heart_rate, sleep, wound_score, meds, risk])

df = pd.DataFrame(data, columns=[
    "age","surgery_type","days","fever","pain","swelling",
    "heart_rate","sleep","wound_score","meds","risk"
])

df.to_csv("data/data.csv", index=False)

print("✅ 100 rows generated!")
df.to_csv("data/data.csv", index=False)

print("✅ 100 rows generated!")