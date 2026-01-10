-- =============================================
-- BATCH 6: MEDICATIONS FOR ALL SURGERIES
-- =============================================

-- 1. Appendectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('31294978-c3be-4e6f-b316-54a6a09db420', 'Paracetamol', '500 mg', 'Take every 6 hours for pain relief'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'Ibuprofen', '400 mg', 'Take twice daily after meals'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'Antibiotic (Cefixime)', '200 mg', 'Take twice daily for 5 days');

-- 2. Cholecystectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('87f5bb57-e153-457c-ab02-2c4e03596802', 'Paracetamol', '500 mg', 'Take every 6 hours if needed'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'Pantoprazole', '40 mg', 'Take once daily before breakfast'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'Antibiotic (Amoxiclav)', '625 mg', 'Take twice daily for 5 days');

-- 3. Hernia Repair
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'Paracetamol', '500 mg', 'Take every 6 hours for pain'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'Diclofenac', '50 mg', 'Take twice daily after food'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'Antibiotic (Cefuroxime)', '500 mg', 'Take twice daily for 5 days');

-- 4. Cesarean Section (C-Section)
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'Paracetamol', '650 mg', 'Take every 8 hours'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'Ibuprofen', '400 mg', 'Take twice daily'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'Iron Supplement', '1 tablet', 'Take once daily for 30 days');

-- 5. ACL Reconstruction
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'Paracetamol', '500 mg', 'Take every 6–8 hours'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'Ibuprofen', '400 mg', 'Take twice daily'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'Antibiotic (Cefixime)', '200 mg', 'Take twice daily for 5 days');

-- 6. Knee Replacement
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'Paracetamol', '650 mg', 'Take every 8 hours'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'Tramadol', '50 mg', 'Take once daily for pain'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'Blood Thinner (Aspirin)', '75 mg', 'Take once daily for 4 weeks');

-- 7. Hip Replacement
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'Paracetamol', '650 mg', 'Take every 8 hours'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'Tramadol', '50 mg', 'Take once daily'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'Aspirin', '75 mg', 'Take once daily for 4 weeks');

-- 8. Cataract Surgery
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'Moxifloxacin Eye Drops', '1 drop', 'Use 4 times daily for 1 week'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'Prednisolone Eye Drops', '1 drop', 'Use 3 times daily for 2 weeks'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'Paracetamol', '500 mg', 'Take if needed for pain');

-- 9. Tonsillectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'Paracetamol', '500 mg', 'Take every 6 hours'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'Ibuprofen', '400 mg', 'Take twice daily'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'Antibiotic (Amoxiclav)', '625 mg', 'Take twice daily for 5 days');

-- 10. Thyroidectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'Thyroxine', '75 mcg', 'Take once daily in the morning'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'Calcium Supplement', '1 tablet', 'Take twice daily'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'Paracetamol', '500 mg', 'Take if needed for pain');

-- 11. Ureteroscopy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'Tamsulosin', '0.4 mg', 'Take once daily at night'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'Paracetamol', '500 mg', 'Take every 6 hours if needed'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'Antibiotic (Ciprofloxacin)', '500 mg', 'Take twice daily for 5 days');

-- 12. Hemorrhoid Surgery
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'Paracetamol', '500 mg', 'Take every 6 hours'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'Stool Softener (Docusate)', '100 mg', 'Take once or twice daily'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'Antibiotic (Metronidazole)', '400 mg', 'Take twice daily for 5 days');

-- 13. Breast Lumpectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'Paracetamol', '500 mg', 'Take every 6 hours'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'Ibuprofen', '400 mg', 'Take twice daily'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'Antibiotic (Cefixime)', '200 mg', 'Take twice daily for 5 days');

-- 14. Hysterectomy
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'Paracetamol', '650 mg', 'Take every 8 hours'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'Ibuprofen', '400 mg', 'Take twice daily'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'Iron Supplement', '1 tablet', 'Take once daily for 30 days');

-- 15. Anal Fissure Surgery
INSERT INTO core.surgery_medications (master_surgery_id, name, dosage, timing) VALUES
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'Paracetamol', '500 mg', 'Take every 6 hours'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'Stool Softener (Docusate)', '100 mg', 'Take once daily'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'Antibiotic (Metronidazole)', '400 mg', 'Take twice daily for 5 days');
