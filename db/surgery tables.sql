--------------------------------------------------------
-- 1. SURGERY MASTER
--------------------------------------------------------
CREATE TABLE core.surgery_master (
    master_surgery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

--------------------------------------------------------
-- 2. SURGERY INSTRUCTIONS
--------------------------------------------------------
CREATE TABLE core.surgery_instructions (
    instruction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID REFERENCES core.surgery_master(master_surgery_id) ON DELETE CASCADE,
    instruction_type VARCHAR(50), -- pre_op, post_op_daywise, diet
    instruction TEXT
);

--------------------------------------------------------
-- 3. SURGERY SYMPTOMS
--------------------------------------------------------
CREATE TABLE core.surgery_symptoms (
    symptom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID REFERENCES core.surgery_master(master_surgery_id) ON DELETE CASCADE,
    symptom_type VARCHAR(50), -- normal, warning
    symptom TEXT
);

--------------------------------------------------------
-- 4. SURGERY MEDICATIONS
--------------------------------------------------------
CREATE TABLE core.surgery_medications (
    med_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID REFERENCES core.surgery_master(master_surgery_id) ON DELETE CASCADE,
    name TEXT,
    dosage TEXT,
    timing TEXT
);

--------------------------------------------------------
-- 5. SURGERY FAQS
--------------------------------------------------------
CREATE TABLE core.surgery_faqs (
    faq_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID REFERENCES core.surgery_master(master_surgery_id) ON DELETE CASCADE,
    question TEXT,
    answer TEXT
);

--------------------------------------------------------
-- 6. RED FLAG SYMPTOMS
--------------------------------------------------------
CREATE TABLE core.redflag_symptoms (
    redflag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_surgery_id UUID REFERENCES core.surgery_master(master_surgery_id),
    symptom_text TEXT NOT NULL,
    severity VARCHAR(20)
);
