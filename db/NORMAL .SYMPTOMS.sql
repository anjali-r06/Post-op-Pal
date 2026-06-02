-- =============================================
-- BATCH 4: NORMAL SYMPTOMS FOR ALL SURGERIES (CORRECTED)
-- =============================================

-- 1. Appendectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('31294978-c3be-4e6f-b316-54a6a09db420', 'normal', 'Mild abdominal discomfort or soreness is normal for a few days.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'normal', 'Light swelling around incision site is expected.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'normal', 'Mild constipation or gas due to anesthesia.');

-- 2. Cholecystectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('87f5bb57-e153-457c-ab02-2c4e03596802', 'normal', 'Mild upper abdominal pain or bloating.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'normal', 'Shoulder pain due to gas used during surgery.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'normal', 'Loose stools for a few days.');

-- 3. Hernia Repair
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'normal', 'Mild groin discomfort and tightness.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'normal', 'Light bruising around surgical area.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'normal', 'Slight pain while standing or walking.');

-- 4. C-Section
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'normal', 'Mild vaginal bleeding for a few days.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'normal', 'Lower abdominal soreness.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'normal', 'Gas or bloating is common.');

-- 5. ACL Reconstruction
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'normal', 'Mild knee swelling for up to 2 weeks.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'normal', 'Stiffness while bending the knee.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'normal', 'Mild bruising around thigh or calf.');

-- 6. Knee Replacement
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'normal', 'Knee stiffness for several weeks.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'normal', 'Swelling around knee and ankle.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'normal', 'Mild warmth over the knee.');

-- 7. Hip Replacement
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'normal', 'Hip stiffness when walking.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'normal', 'Mild swelling around incision.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'normal', 'Soreness in thigh or buttocks.');

-- 8. Cataract Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'normal', 'Blurry vision for 1–2 days.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'normal', 'Mild redness in the eye.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'normal', 'Light sensitivity.');

-- 9. Tonsillectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'normal', 'White patches over tonsil area are normal.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'normal', 'Bad breath during healing.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'normal', 'Ear pain due to nerve connection.');

-- 10. Thyroidectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'normal', 'Neck stiffness when swallowing.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'normal', 'Mild swelling near incision.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'normal', 'Temporary hoarseness of voice.');

-- 11. Ureteroscopy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'normal', 'Burning while urinating for 1–2 days.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'normal', 'Slight blood in urine for 24–48 hours.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'normal', 'Frequent urge to urinate.');

-- 12. Hemorrhoid Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'normal', 'Pain during bowel movements for a few days.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'normal', 'Light bleeding on toilet paper.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'normal', 'Swelling around anal area.');

-- 13. Breast Lumpectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'normal', 'Mild soreness in breast.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'normal', 'Bruising around incision.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'normal', 'Slight fluid collection under skin.');

-- 14. Hysterectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'normal', 'Light vaginal spotting for a few days.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'normal', 'Mild abdominal cramps.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'normal', 'Low energy for a week.');

-- 15. Anal Fissure Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'normal', 'Mild pain during bowel movements.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'normal', 'Light bleeding for 1–2 days.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'normal', 'Warmth in the anal area.');
