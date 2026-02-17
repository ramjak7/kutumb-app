-- SUPABASE SCHEMA: ERD and Table Definitions
-- This file defines the initial schema for the Kutumb Festival App

-- Table: festivals
CREATE TABLE festivals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    theme_colors jsonb,
    logos jsonb,
    banners jsonb,
    program_data jsonb,
    committee_data jsonb,
    receipt_footer text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: users
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    role text NOT NULL CHECK (role IN ('admin', 'public')),
    name text,
    festival_id uuid REFERENCES festivals(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: donations
CREATE TABLE donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    festival_id uuid REFERENCES festivals(id),
    user_id uuid REFERENCES users(id),
    amount numeric(12,2) NOT NULL CHECK (amount > 0),
    donor_details jsonb NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: expenses
CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    festival_id uuid REFERENCES festivals(id),
    user_id uuid REFERENCES users(id),
    amount numeric(12,2) NOT NULL CHECK (amount > 0),
    expense_details jsonb NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: receipts
CREATE TABLE receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id uuid REFERENCES donations(id),
    festival_id uuid REFERENCES festivals(id),
    pdf_url text NOT NULL,
    receipt_number text NOT NULL,
    qr_code text NOT NULL,
    hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: content_blocks
CREATE TABLE content_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    festival_id uuid REFERENCES festivals(id),
    key text NOT NULL,
    content jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: translations
CREATE TABLE translations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    festival_id uuid REFERENCES festivals(id),
    key text NOT NULL,
    en text NOT NULL,
    hi text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: audit_logs
CREATE TABLE audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    before jsonb,
    after jsonb,
    hash text NOT NULL,
    timestamp timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_festival_id ON donations(festival_id);
CREATE INDEX idx_expense_festival_id ON expenses(festival_id);
CREATE INDEX idx_receipt_festival_id ON receipts(festival_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);

