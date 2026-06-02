-- ============================================
-- DETAILED INSTRUCTIONS FOR ALL 15 SURGERIES
-- ============================================

-- APPENDECTOMY
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Activity: Avoid strenuous activity for 1 week. Light walking is encouraged to prevent blood clots. Avoid bending or lifting anything heavier than 4–5 kg.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Wound Care: Keep incision dry for 48 hours. Do not scratch or apply powders/ointments unless prescribed. Watch for redness or discharge.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Bathing: Sponge baths for 48 hours. Full shower allowed afterward unless doctor instructs otherwise.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Diet: Start with liquids, then soft food. Resume normal diet gradually. Avoid spicy, oily food for 3–4 days.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Pain Management: Take prescribed pain medication on schedule. Mild abdominal discomfort and gas pain are common.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Warning Signs: Persistent vomiting, increasing abdominal pain, fever above 100.4°F, pus from incision.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Follow-Up: Usually 7–10 days after surgery for suture check/removal.'),
('31294978-c3be-4e6f-b316-54a6a09db420', 'detailed', 'Emergency: Go to ER if severe abdominal pain, breathlessness, heavy bleeding, or swelling occurs.');

-- CHOLECYSTECTOMY
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Activity: Avoid lifting heavy objects for 2 weeks. Light walking is allowed.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Wound Care: Keep dressings dry. Remove dressing after 48 hours if advised. Mild shoulder pain from gas is normal.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Bathing: Shower after 48 hours; avoid scrubbing incision.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Diet: Follow a low-fat diet for 1–2 weeks. Avoid oily and fried foods.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Pain Management: Take prescribed painkillers. Gas pain and bloating may occur.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Warning Signs: Yellowing of eyes, constant vomiting, severe pain, fever.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Follow-Up: As per surgeon’s advice, usually in 1 week.'),
('87f5bb57-e153-457c-ab02-2c4e03596802', 'detailed', 'Emergency: Seek help for severe abdominal pain, uncontrollable vomiting, or bleeding.');

-- HERNIA REPAIR
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Activity: No lifting heavy objects for 6 weeks. Walking encouraged. Avoid straining.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Wound Care: Keep incision dry. Watch for swelling.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Bathing: Shower allowed after 48 hours.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Diet: High-fiber diet to avoid constipation. Drink plenty of water.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Pain Management: Pain may last 3–7 days. Take meds regularly.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Warning Signs: Increasing swelling, fever, redness, vomiting.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Follow-Up: Typically after 7–10 days.'),
('c898a49e-5606-4a68-bdb4-b5825936d5f6', 'detailed', 'Emergency: Sudden severe groin pain or vomiting.');

-- C-SECTION
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Activity: Avoid heavy lifting and climbing stairs for 2 weeks. Support your abdomen while coughing or standing.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Wound Care: Keep incision dry. Look for redness or foul smell. Wear loose clothing.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Bathing: Sponge bath for 48 hours, then gentle shower. Do not scrub incision.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Diet: Start with liquids, then soft food. High-fiber diet to avoid constipation.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Pain Management: Take prescribed painkillers right after feeding if breastfeeding.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Warning Signs: Heavy bleeding, fever, foul-smelling discharge from wound or vagina.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Follow-Up: Usually after 7 days for wound check.'),
('b623b4e3-c003-46f9-9e82-7626b2173e2b', 'detailed', 'Emergency: Severe abdominal pain, difficulty breathing, or sudden dizziness.');

-- ACL RECONSTRUCTION
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Activity: Use crutches for 1–2 weeks. Avoid weight-bearing unless allowed.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Wound Care: Keep dressing intact. Ice knee for 20 mins every 3 hours.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Bathing: Keep incision dry for 72 hours.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Diet: Protein-rich diet to support ligament healing.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Pain Management: Anti-inflammatory medication helps reduce swelling.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Warning Signs: Severe swelling, knee turning blue, numbness in foot.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Follow-Up: Physical therapy starts within 1 week.'),
('b0177ca1-c9d7-46f5-bec2-95c09b2ed045', 'detailed', 'Emergency: Sudden calf swelling or chest pain.');

-- KNEE REPLACEMENT
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Activity: Walk with walker support. Avoid twisting and kneeling.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Wound Care: Change dressing only if instructed. Keep incision clean.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Bathing: Shower after 3 days, keeping incision dry.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Diet: Protein and calcium rich diet to rebuild strength.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Pain Management: Blood thinner + pain medicines essential.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Warning Signs: Increasing redness, fever, leg swelling.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Follow-Up: First review in 7–10 days.'),
('e5797b86-3c33-420b-9ca3-bf60d54571c7', 'detailed', 'Emergency: Sudden chest pain or breathlessness.');

-- HIP REPLACEMENT
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Activity: Avoid bending hip beyond 90°. Use support for walking.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Wound Care: Keep area clean. Swelling is normal for 2 weeks.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Bathing: Shower allowed after 3 days.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Diet: Iron, calcium, and protein-rich diet.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Pain Management: Pain meds + ice packs recommended.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Warning Signs: Leg turning blue, severe hip pain, fever.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Follow-Up: Typically after 2 weeks.'),
('9d1551cc-e8c7-4802-8d31-610cf070374a', 'detailed', 'Emergency: Sudden inability to move leg.');

-- CATARACT SURGERY
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Activity: Avoid rubbing eyes and avoid dust exposure.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Wound Care: Use eye shield during sleep.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Bathing: Avoid water entering eyes for 1 week.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Diet: Normal diet. Manage sugar if diabetic.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Pain Management: Eye drops are mandatory.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Warning Signs: Severe pain, sudden vision drop, redness.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Follow-Up: Usually next day, then after 1 week.'),
('c57c25f4-703c-4103-8fa8-b63d3ea91d6e', 'detailed', 'Emergency: Sudden loss of vision.');

-- TONSILLECTOMY
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Activity: Avoid shouting or long talking.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Wound Care: White patches in throat are normal.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Bathing: Normal bathing allowed.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Diet: Cold liquids & soft food recommended.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Pain Management: Pain peaks on day 3–5.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Warning Signs: Bleeding from mouth or nose.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Follow-Up: After 1 week.'),
('3d7ae79b-7e31-4352-bf71-116a2dfcd7c4', 'detailed', 'Emergency: Heavy bleeding.');

INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Wound Care: Watch for swelling or hoarseness.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Bathing: Shower after 48 hours.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Diet: Soft food initially.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Pain Management: Take pain meds. Muscle soreness is normal.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Warning Signs: Difficulty breathing or swallowing.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Follow-Up: Thyroid hormone levels checked after 1–2 weeks.'),
('45285cee-ea8e-4c45-b7d1-3be62d52b9b7', 'detailed', 'Emergency: Sudden neck swelling.');
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Activity: Mild burning during urination normal for 24–48 hrs.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Wound Care: No external wounds. Hydration is key.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Bathing: Normal bathing allowed.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Diet: Drink 2–3 liters water daily.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Pain Management: Pain meds and alpha-blockers recommended.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Warning Signs: Severe flank pain, fever, difficulty urinating.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Follow-Up: Removal of stent (if placed) after 7–10 days.'),
('b6b48a21-b484-40f6-a3de-c69aba7b6512', 'detailed', 'Emergency: Cannot pass urine + fever.');
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Activity: Avoid sitting for long periods. Use cushion.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Wound Care: Sitz bath twice daily.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Bathing: Normal bathing allowed.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Diet: High-fiber food and hydration.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Pain Management: Pain expected for 5–7 days.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Warning Signs: Heavy bleeding, fever.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Follow-Up: Doctor visit after 1 week.'),
('4a87d21c-6bb6-41d3-935f-4c64a58e539a', 'detailed', 'Emergency: Uncontrolled bleeding.');
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Activity: Avoid raising arm above shoulder level.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Wound Care: Mild swelling normal. Keep bandage dry.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Bathing: Sponge bath 48 hours.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Diet: Regular diet.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Pain Management: Pain meds + cold packs.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Warning Signs: Redness spreading or pus.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Follow-Up: Review in 1 week.'),
('3d9eeae5-9e57-4da3-bd5d-b9be4a126fa5', 'detailed', 'Emergency: Sudden swelling or bleeding.');
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Activity: No intercourse and no lifting heavy items for 6 weeks.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Wound Care: Keep incision clean. Spotting is normal.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Bathing: Gentle shower allowed after 2 days.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Diet: High fiber to prevent constipation.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Pain Management: Pain meds + rest.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Warning Signs: Heavy bleeding, strong abdominal pain.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Follow-Up: 7–10 days.'),
('87ff13a6-0372-4b6f-bf09-633abfd1ba69', 'detailed', 'Emergency: Dizziness or fainting due to bleeding.');
INSERT INTO core.surgery_instructions (master_surgery_id, instruction_type, instruction) VALUES
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Activity: Avoid long sitting. Take short walks.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Wound Care: Sitz bath 2–3 times/day.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Bathing: Normal bath allowed.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Diet: High-fiber diet to prevent straining.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Pain Management: Pain gel + warm water helps.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Warning Signs: Bleeding that fills toilet bowl.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Follow-Up: Visit after 1 week.'),
('d5095df1-2dba-48db-8737-4ff9c71b03ee', 'detailed', 'Emergency: Uncontrolled bleeding or fever.');
