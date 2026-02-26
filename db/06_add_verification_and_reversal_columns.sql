-- Add treasurer role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'treasurer', 'public'));

-- Add verification tracking to donations
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_reversal boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reversal_reason text,
  ADD COLUMN IF NOT EXISTS reverses_id uuid REFERENCES donations(id),
  ADD COLUMN IF NOT EXISTS category text;

-- Add verification tracking to expenses
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_reversal boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS reversal_reason text,
  ADD COLUMN IF NOT EXISTS reverses_id uuid REFERENCES expenses(id),
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS vendor text,
  ADD COLUMN IF NOT EXISTS payment_mode text;

-- Add verified status to receipts
ALTER TABLE receipts
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;