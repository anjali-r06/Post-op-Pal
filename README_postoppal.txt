PostOpPal Backend Demo - Files & Run Instructions

Files created for you (paths on this machine):
- /mnt/data/app.py             (FastAPI backend)
- /mnt/data/requirements.txt   (Python dependencies)
- /mnt/data/README_postoppal.txt (this file)

Prerequisites (install if not present):
1. Python 3.9+
2. pip
3. (Optional) pgAdmin to inspect the database

How to run (Windows PowerShell):
1. Open PowerShell and navigate to the folder where files are located:
   cd /mnt/data

2. Create a Python virtual environment and activate it:
   python -m venv .venv
   .\.venv\Scripts\activate

3. Install dependencies:
   pip install -r requirements.txt

4. Set the DATABASE_URL environment variable (example):
   $env:DATABASE_URL = "postgresql://app_user:AppPass123!@localhost:5432/postoppal"

   - Replace user/password/host/port with your DB credentials.
   - For cloud DB, use host provided by your provider.

5. Run the backend:
   uvicorn app:app --reload --port 8000

6. Test endpoints:
   - Health check: http://127.0.0.1:8000/health
   - List patients: http://127.0.0.1:8000/patients
   - Simulate inbound (example curl):
     curl -X POST "http://127.0.0.1:8000/simulate_inbound" -H "Content-Type: application/json" -d '{"patient_hospital_id":"HOSP-001","body":"I have severe pain"}'

How to verify db changes:
- Open pgAdmin or psql and run:
  SELECT * FROM messages ORDER BY created_at DESC LIMIT 5;
  SELECT * FROM alerts ORDER BY created_at DESC LIMIT 5;

Schema file path used earlier:
- /mnt/data/postoppal_schema.sql

Notes:
- Ensure the DB user in DATABASE_URL (app_user) has INSERT privileges on messages and alerts and SELECT on patients.
- If DATABASE_URL is not set, the app will not start and will show an error telling you to set it.
