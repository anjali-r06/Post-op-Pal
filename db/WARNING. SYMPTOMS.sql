-- =============================================
-- BATCH 5: WARNING SYMPTOMS FOR ALL SURGERIES
-- =============================================

-- 1. Appendectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('31294978-c3be-4e6f-b316-54a6a09db420', 'warning', 'High fever above 100.4°F or chills.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'warning', 'Severe abdominal pain increasing over time.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'warning', 'Pus or foul-smelling discharge from incision.');

-- 2. Cholecystectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('87f5bb57-e153-457c-ab02-2c4e03596802', 'warning', 'Yellowing of eyes or skin (jaundice).'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'warning', 'Severe upper abdominal pain that does not improve.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'warning', 'Persistent vomiting or inability to eat.');

-- 3. Hernia Repair
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'warning', 'Sudden severe groin or abdominal pain.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'warning', 'Large swelling that becomes hard or red.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'warning', 'Vomiting or inability to pass stool or gas.');

-- 4. C-Section
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'warning', 'Heavy vaginal bleeding soaking more than one pad per hour.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'warning', 'High fever or foul-smelling discharge.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'warning', 'Severe abdominal pain or difficulty breathing.');

-- 5. ACL Reconstruction
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'warning', 'Sudden intense knee pain or inability to move leg.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'warning', 'Calf swelling or pain (possible blood clot).'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'warning', 'Severe redness or pus from incision.');

-- 6. Knee Replacement
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'warning', 'Sudden increase in knee swelling or redness.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'warning', 'Shortness of breath or chest pain (possible clot).'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'warning', 'Drainage or foul smell from incision.');

-- 7. Hip Replacement
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'warning', 'Leg turning blue or numb (possible nerve/blood issue).'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'warning', 'Sudden severe hip pain indicating dislocation.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'warning', 'High fever or leakage from wound.');

-- 8. Cataract Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'warning', 'Sudden vision loss or severe eye pain.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'warning', 'Increasing redness or pus discharge.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'warning', 'Flashes of light or many floaters.');

-- 9. Tonsillectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'warning', 'Blood in saliva or vomiting blood.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'warning', 'Severe dehydration (no urine for 8+ hrs).'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'warning', 'High fever or increased throat pain.');

-- 10. Thyroidectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'warning', 'Difficulty breathing or swallowing.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'warning', 'Sudden swelling in neck.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'warning', 'Severe muscle cramps or tingling (low calcium).');

-- 11. Ureteroscopy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'warning', 'High fever or chills (possible infection).'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'warning', 'Inability to urinate.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'warning', 'Severe flank pain not relieved by medication.');

-- 12. Hemorrhoid Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'warning', 'Heavy rectal bleeding.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'warning', 'High fever or severe pain.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'warning', 'Pus or foul-smelling discharge.');

-- 13. Breast Lumpectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'warning', 'Rapid breast swelling or hardness.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'warning', 'Pus or foul-smelling discharge.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'warning', 'High fever or chills.');

-- 14. Hysterectomy
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'warning', 'Heavy bleeding or passing large clots.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'warning', 'Severe abdominal pain or vomiting.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'warning', 'Foul-smelling vaginal discharge.');

-- 15. Anal Fissure Surgery
INSERT INTO core.surgery_symptoms (master_surgery_id, symptom_type, symptom) VALUES
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'warning', 'Heavy bleeding during bowel movement.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'warning', 'High fever or chills.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'warning', 'Severe pain not relieved by medication.');
