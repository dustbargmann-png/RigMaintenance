-- MRI trailer checklist templates, built from the same real-world documents
-- pattern used for the CT trailer template: inside assessment, outside
-- assessment, coil/phantom inventory check, and cleaning checklist.
-- Scoped to the existing company (matches the CT trailer template's company_id).

with new_template as (
  insert into checklist_templates (company_id, name, category, interval_days)
  values ('51a7bf2d-7bc9-4d02-b76c-7c471770e408', 'Inside MRI Trailer Assessment', 'MRI Trailer', 90)
  returning id
)
insert into checklist_items (template_id, label, sort_order, response_type, is_required)
select id, label, sort_order, response_type, true
from new_template, (values
  ('Helium pressure (psi)', 1, 'number'),
  ('Helium level (%)', 2, 'number'),
  ('Cold head report noted in MRI room', 3, 'yes_no'),
  ('Number of fire extinguishers', 4, 'number'),
  ('Fire extinguisher service date', 5, 'date'),
  ('Fire suppression system serviced', 6, 'yes_no'),
  ('Fire alarm / smoke detector annual check date', 7, 'date'),
  ('Patient lift power-off switch present', 8, 'yes_no'),
  ('Roll-up door power-off switch present', 9, 'yes_no'),
  ('Code Blue button present', 10, 'yes_no'),
  ('Nurse call button present', 11, 'yes_no'),
  ('T.R. Arnold ID number', 12, 'text'),
  ('California HUD sticker ID number', 13, 'text'),
  ('Industrialized Building Commission sticker ID number', 14, 'text'),
  ('Canada CSA sticker ID number', 15, 'text'),
  ('Blue ELT sticker ID number', 16, 'text'),
  ('Michigan sticker ID number', 17, 'text'),
  ('Med-Rad power injector next service date', 18, 'date'),
  ('Med-Rad power injector serial number', 19, 'text'),
  ('Med-Rad power injector bar code', 20, 'text'),
  ('Med-Rad injector (second unit) bar code', 21, 'text'),
  ('Insight system ID', 22, 'text'),
  ('System type', 23, 'text'),
  ('System upgrade date', 24, 'text'),
  ('Magnet serial number (CP)', 25, 'text'),
  ('Magnet ID plate serial number', 26, 'text'),
  ('MAC address', 27, 'text'),
  ('Guided install software release', 28, 'text'),
  ('Install temporary service key host ID', 29, 'text'),
  ('Patient records / exams count', 30, 'number'),
  ('Patient records deleted count', 31, 'number'),
  ('RF fingers around MRI room door (four edges) good', 32, 'yes_no'),
  ('Patient privacy curtain present', 33, 'yes_no'),
  ('Patient pads — count', 34, 'number'),
  ('Patient pads condition good', 35, 'yes_no'),
  ('Patient straps — count', 36, 'number'),
  ('Patient straps condition good', 37, 'yes_no'),
  ('Patient sand-bags — count', 38, 'number'),
  ('Patient sand-bags condition good', 39, 'yes_no'),
  ('Patient entertainment system type', 40, 'text'),
  ('Patient headphones — count', 41, 'number'),
  ('Patient headphones condition good', 42, 'yes_no'),
  ('Chair condition good', 43, 'yes_no'),
  ('Chair bar codes', 44, 'text')
) as items(label, sort_order, response_type);

with new_template as (
  insert into checklist_templates (company_id, name, category, interval_days)
  values ('51a7bf2d-7bc9-4d02-b76c-7c471770e408', 'Outside MRI Trailer Assessment', 'MRI Trailer', 90)
  returning id
)
insert into checklist_items (template_id, label, sort_order, response_type, is_required)
select id, label, sort_order, response_type, true
from new_template, (values
  ('Annual vehicle / DOT inspection date', 1, 'date'),
  ('Trailer VIN number', 2, 'text'),
  ('Trailer system ID number', 3, 'text'),
  ('Trailer manufacturing date', 4, 'date'),
  ('Trailer job number', 5, 'text'),
  ('Trailer tag number', 6, 'text'),
  ('Trailer tag expiration date', 7, 'date'),
  ('Trailer condition good', 8, 'yes_no'),
  ('Entry stairs good', 9, 'yes_no'),
  ('Entry door and lift door good', 10, 'yes_no'),
  ('Roll door key lock (outside) present', 11, 'yes_no'),
  ('Patient lift key lock (outside) present', 12, 'yes_no'),
  ('Trailer lift condition good', 13, 'yes_no'),
  ('Trailer lift last serviced date', 14, 'date'),
  ('Trailer awning condition good', 15, 'yes_no'),
  ('Number of lift remotes', 16, 'number'),
  ('Lift remotes condition good', 17, 'yes_no'),
  ('Trailer extension power corded', 18, 'yes_no'),
  ('Tire tread — left front outer (32nds)', 19, 'number'),
  ('Tire tread — left front inner (32nds)', 20, 'number'),
  ('Tire tread — left rear outer (32nds)', 21, 'number'),
  ('Tire tread — left rear inner (32nds)', 22, 'number'),
  ('Tire tread — right front outer (32nds)', 23, 'number'),
  ('Tire tread — right front inner (32nds)', 24, 'number'),
  ('Tire tread — right rear outer (32nds)', 25, 'number'),
  ('Tire tread — right rear inner (32nds)', 26, 'number')
) as items(label, sort_order, response_type);

with new_template as (
  insert into checklist_templates (company_id, name, category, interval_days)
  values ('51a7bf2d-7bc9-4d02-b76c-7c471770e408', 'MRI Coil & Phantom Inventory Check', 'MRI Trailer', 90)
  returning id
)
insert into checklist_items (template_id, label, sort_order, response_type, is_required)
select id, label, sort_order, response_type, true
from new_template, (values
  ('Standard 4-channel knee coil present', 1, 'yes_no'),
  ('8-channel brain coil present', 2, 'yes_no'),
  ('8-channel knee coil present', 3, 'yes_no'),
  ('8-channel torso array coil (both parts) present', 4, 'yes_no'),
  ('8-channel CTL coil present', 5, 'yes_no'),
  ('8-channel anterior cervical spine bridge present', 6, 'yes_no'),
  ('8-channel CTL coil adaptor box present', 7, 'yes_no'),
  ('Neurovascular array head coil (1) present', 8, 'yes_no'),
  ('Neurovascular array head coil (2) present', 9, 'yes_no'),
  ('1.5 split head coil present', 10, 'yes_no'),
  ('Flex coil present', 11, 'yes_no'),
  ('Phase array shoulder coil present', 12, 'yes_no'),
  ('Wrist coil present', 13, 'yes_no'),
  ('Wrist coil riser present', 14, 'yes_no'),
  ('Wrist coil base plate present', 15, 'yes_no'),
  ('Head-neck spine array TL spine unit present', 16, 'yes_no'),
  ('Head-neck spine array neck/chest unit present', 17, 'yes_no'),
  ('Head-neck spine array posterior unit present', 18, 'yes_no'),
  ('Head-neck spine array HUN anterior unit present', 19, 'yes_no'),
  ('Head-neck spine array ANT adapter unit present', 20, 'yes_no'),
  ('O2 sensor present', 21, 'yes_no'),
  ('Respiratory bellows present', 22, 'yes_no'),
  ('Phantom: short loader with medium sphere present', 23, 'yes_no'),
  ('Phantom: 5343347 Rev2 (1) present', 24, 'yes_no'),
  ('Phantom: 5343347 Rev2 (2) present', 25, 'yes_no'),
  ('Phantom: rubber bottle holder present', 26, 'yes_no'),
  ('Phantom: medium plastic bottle present', 27, 'yes_no'),
  ('Phantom: DQA SNR with holder present', 28, 'yes_no'),
  ('Phantom: 5342679 Rev2 present', 29, 'yes_no'),
  ('Phantom: 5342681 Rev2 present', 30, 'yes_no'),
  ('Phantom: 5342681 wrist coil phantom present', 31, 'yes_no'),
  ('Phantom: foot/ankle coil phantom present', 32, 'yes_no'),
  ('Phantom: small sphere (1) present', 33, 'yes_no'),
  ('Phantom: small sphere (2) present', 34, 'yes_no'),
  ('Phantom: MRS sphere present', 35, 'yes_no'),
  ('Phantom: X-large split phantom with sphere present', 36, 'yes_no'),
  ('Phantom: round sphere holder present', 37, 'yes_no'),
  ('Phantom: large short loader with sphere present', 38, 'yes_no'),
  ('Phantom: phantom bottle holder present', 39, 'yes_no'),
  ('Phantom: soft phantom pads (6) present', 40, 'yes_no')
) as items(label, sort_order, response_type);

with new_template as (
  insert into checklist_templates (company_id, name, category, interval_days)
  values ('51a7bf2d-7bc9-4d02-b76c-7c471770e408', 'MRI Trailer Cleaning Checklist', 'MRI Trailer', 30)
  returning id
)
insert into checklist_items (template_id, label, sort_order, response_type, is_required)
select id, label, sort_order, response_type, true
from new_template, (values
  ('Light fixtures', 1, 'pass_fail'),
  ('Top of doors and door frames', 2, 'pass_fail'),
  ('Door facing and door knobs (inside and outside)', 3, 'pass_fail'),
  ('Inside cabinets and cabinet doors', 4, 'pass_fail'),
  ('Counters', 5, 'pass_fail'),
  ('Outside of CP monitor and tower', 6, 'pass_fail'),
  ('Monitor screens (monitor cleaning solution)', 7, 'pass_fail'),
  ('Coils and arrays wiped down', 8, 'pass_fail'),
  ('Under counters', 9, 'pass_fail'),
  ('Floors swept / mopped', 10, 'pass_fail')
) as items(label, sort_order, response_type);
