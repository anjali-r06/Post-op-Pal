-- Post-Op Pal schema (run in post_op_pal database)

-- extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS messaging;
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS audit;

-- Enums (create if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_sender') THEN
    CREATE TYPE message_sender AS ENUM ('patient','bot','staff');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
    CREATE TYPE alert_severity AS ENUM ('low','medium','high');
  END IF;
END$$;

-- CORE: patients
CREATE TABLE IF NOT EXISTS core.patients (
  patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  phone_whatsapp_id TEXT UNIQUE,
  dob DATE,
  sex VARCHAR(16),
  language_preference VARCHAR(16) DEFAULT 'hi',
  address TEXT,
  village TEXT,
  district TEXT,
  state VARCHAR(64) DEFAULT 'Uttarakhand',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON core.patients (phone_whatsapp_id);
CREATE INDEX IF NOT EXISTS idx_patients_region ON core.patients (state, district);

-- CORE: surgeries (episodes)
CREATE TABLE IF NOT EXISTS core.surgeries (
  surgery_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES core.patients(patient_id) ON DELETE CASCADE,
  hospital_id UUID, -- optional
  surgery_type TEXT,
  admission_date TIMESTAMP WITH TIME ZONE,
  discharge_date TIMESTAMP WITH TIME ZONE,
  discharge_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surgeries_patient ON core.surgeries (patient_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_discharge ON core.surgeries (discharge_date);

-- CORE: patient_alerts
CREATE TABLE IF NOT EXISTS core.patient_alerts (
  alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES core.patients(patient_id) ON DELETE CASCADE,
  surgery_id UUID REFERENCES core.surgeries(surgery_id),
  severity alert_severity DEFAULT 'low',
  alert_reason TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_patient ON core.patient_alerts (patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON core.patient_alerts (severity);

-- MESSAGING: conversations
CREATE TABLE IF NOT EXISTS messaging.conversations (
  convo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES core.patients(patient_id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_conversations_patient ON messaging.conversations (patient_id);

-- MESSAGING: messages
CREATE TABLE IF NOT EXISTS messaging.messages (
  message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  convo_id UUID REFERENCES messaging.conversations(convo_id) ON DELETE CASCADE,
  patient_id UUID REFERENCES core.patients(patient_id) ON DELETE CASCADE,
  sender message_sender DEFAULT 'patient',
  inbound BOOLEAN DEFAULT true,
  message_text TEXT,
  attachments JSONB, -- optional
  language_detected VARCHAR(16),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_convo ON messaging.messages (convo_id);
CREATE INDEX IF NOT EXISTS idx_messages_patient ON messaging.messages (patient_id);

-- ADMIN / AUDIT example (minimal)
CREATE TABLE IF NOT EXISTS admin.staff_user (
  staff_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit.events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT,
  actor TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Small helper: update triggers to auto-set updated_at (optional)
CREATE OR REPLACE FUNCTION core.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'patients_updated_at') THEN
    CREATE TRIGGER patients_updated_at BEFORE UPDATE ON core.patients
    FOR EACH ROW EXECUTE FUNCTION core.update_updated_at_column();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'surgeries_updated_at') THEN
    CREATE TRIGGER surgeries_updated_at BEFORE UPDATE ON core.surgeries
    FOR EACH ROW EXECUTE FUNCTION core.update_updated_at_column();
  END IF;
END$$;

-- Done
