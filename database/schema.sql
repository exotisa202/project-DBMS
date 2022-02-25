-- Fresh PostgreSQL schema for supported application workflows.
-- Non-destructive: no DROP, account credentials, or historical donor data.
BEGIN;
CREATE SCHEMA IF NOT EXISTS badhon;
CREATE TABLE IF NOT EXISTS badhon.donor (
    donor_id integer PRIMARY KEY CHECK (donor_id > 0),
    donor_name varchar(255) NOT NULL,
    birth_date date NOT NULL,
    blood_group varchar(3) NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    last_date_of_donation date,
    phone_number varchar(255),
    email varchar(255),
    location varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS badhon.blood_bank (
    blood_bank_id integer NOT NULL CHECK (blood_bank_id > 0),
    blood_bank_name varchar(255) NOT NULL,
    blood_group varchar(3) NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    amount integer NOT NULL CHECK (amount >= 0),
    PRIMARY KEY (blood_bank_id, blood_group)
);
CREATE TABLE IF NOT EXISTS badhon.request (
    request_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    hospital varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    blood_group varchar(3) NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-'))
);
COMMIT;
