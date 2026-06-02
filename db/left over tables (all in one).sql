--------------------------------------------------------
-- CREATE SCHEMA
--------------------------------------------------------
DROP SCHEMA IF EXISTS core CASCADE;
CREATE SCHEMA core;
SET search_path TO core;

--------------------------------------------------------
-- 1. PATIENTS TABLE
--------------------------------------------------------
DROP TABLE IF EXISTS patients CASCADE;
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    whatsapp_number VARCHAR(20) UNIQUE NOT NULL,
    age INT,
    gender VARCHAR(10),
    master_surgery_id UUID,
    surgery_date DATE,
    language_preference VARCHAR(20) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 2. DAILY CHECK-INS
--------------------------------------------------------
DROP TABLE IF EXISTS daily_checkins CASCADE;
CREATE TABLE daily_checkins (
    checkin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    pain_score INT,
    swelling_level VARCHAR(20),
    fever BOOLEAN,
    mobility_level VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 3. CONVERSATION LOGS
--------------------------------------------------------
DROP TABLE IF EXISTS conversation_logs CASCADE;
CREATE TABLE conversation_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    message_from VARCHAR(20),
    message_text TEXT,
    message_type VARCHAR(20),
    timestamp TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 4. EMERGENCY ALERTS
--------------------------------------------------------
DROP TABLE IF EXISTS emergency_alerts CASCADE;
CREATE TABLE emergency_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    symptom_detected VARCHAR(200),
    severity VARCHAR(20),
    alert_time TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'open'
);

--------------------------------------------------------
-- 5. APPOINTMENTS
--------------------------------------------------------
DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    master_surgery_id UUID,
    appointment_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled'
);

--------------------------------------------------------
-- 6. MESSAGE TEMPLATES
--------------------------------------------------------
DROP TABLE IF EXISTS message_templates CASCADE;
CREATE TABLE message_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(100),
    template_text TEXT,
    language VARCHAR(20) DEFAULT 'English'
);

--------------------------------------------------------
-- 7. HOSPITAL USERS
--------------------------------------------------------
DROP TABLE IF EXISTS hospital_users CASCADE;
CREATE TABLE hospital_users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    role VARCHAR(50),
    email VARCHAR(150) UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 8. AUDIT LOGS
--------------------------------------------------------
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES hospital_users(user_id) ON DELETE SET NULL,
    action TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 9. SURGERY PROTOCOLS
--------------------------------------------------------
DROP TABLE IF EXISTS surgery_protocols CASCADE;
CREATE TABLE surgery_protocols (
    protocol_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID,
    day_number INT,
    instruction TEXT
);

--------------------------------------------------------
-- 10. MEDIA FILES
--------------------------------------------------------
DROP TABLE IF EXISTS media_files CASCADE;
CREATE TABLE media_files (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    file_type VARCHAR(20),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 11. LANGUAGES
--------------------------------------------------------
DROP TABLE IF EXISTS languages CASCADE;
CREATE TABLE languages (
    language_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50),
    code VARCHAR(10)
);

--------------------------------------------------------
-- 12. EDUCATION LIBRARY
--------------------------------------------------------
DROP TABLE IF EXISTS education_library CASCADE;
CREATE TABLE education_library (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID,
    title TEXT,
    content TEXT,
    media_link TEXT
);

--------------------------------------------------------
-- 13. BOT EVENTS
--------------------------------------------------------
DROP TABLE IF EXISTS bot_events CASCADE;
CREATE TABLE bot_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    event_type VARCHAR(100),
    event_details TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 14. CONFIG KV (KEY-VALUE CONFIG)
--------------------------------------------------------
DROP TABLE IF EXISTS config_kv CASCADE;
CREATE TABLE config_kv (
    key TEXT PRIMARY KEY,
    value TEXT
);

--------------------------------------------------------
-- 15. REMINDERS
--------------------------------------------------------
DROP TABLE IF EXISTS reminders CASCADE;
CREATE TABLE reminders (
    reminder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    reminder_text TEXT,
    scheduled_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

--------------------------------------------------------
-- 16. PATIENT ALERTS (custom table)
--------------------------------------------------------
DROP TABLE IF EXISTS patient_alerts CASCADE;
CREATE TABLE patient_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    alert_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'unread'
);

--------------------------------------------------------
-- 17. SURGERIES (your custom table)
--------------------------------------------------------
DROP TABLE IF EXISTS surgeries CASCADE;
CREATE TABLE surgeries (
    surgery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(patient_id),
    surgery_name TEXT,
    surgery_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
