-- Optional fictional demonstration records only. Safe to run repeatedly.
BEGIN;
INSERT INTO badhon.donor (donor_id, donor_name, birth_date, blood_group, last_date_of_donation, phone_number, email, location)
VALUES (9001, 'Synthetic Donor A', DATE '2000-01-01', 'AB+', DATE '2025-01-01', 'not-a-phone', 'donor-a@example.invalid', 'Example Town')
ON CONFLICT (donor_id) DO NOTHING;
INSERT INTO badhon.blood_bank (blood_bank_id, blood_bank_name, blood_group, amount)
VALUES (9001, 'Synthetic Blood Bank', 'AB+', 5)
ON CONFLICT (blood_bank_id, blood_group) DO NOTHING;
COMMIT;
