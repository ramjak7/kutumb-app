-- Migration 08: Add verification and reversal procedures
-- Date: 2026-02-18
-- Purpose: Create stored procedures for donation/expense verification and reversal

-- Create verification function for donations
CREATE OR REPLACE FUNCTION verify_donation(donation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  donation_creator uuid;
BEGIN
  -- Get the creator of the donation
  SELECT user_id INTO donation_creator FROM donations WHERE id = donation_id;
  
  -- Prevent self-verification
  IF donation_creator = auth.uid() THEN
    RAISE EXCEPTION 'Cannot verify your own donation';
  END IF;
  
  -- Check if already verified
  IF EXISTS (SELECT 1 FROM donations WHERE id = donation_id AND verified = true) THEN
    RAISE EXCEPTION 'Donation already verified';
  END IF;
  
  -- Verify donation
  UPDATE donations 
  SET verified = true, 
      verified_by = auth.uid(), 
      verified_at = now()
  WHERE id = donation_id;
  
  -- Auto-verify associated receipt
  UPDATE receipts 
  SET verified = true, 
      verified_at = now()
  WHERE donation_id = donation_id;
END;
$$;

-- Create verification function for expenses
CREATE OR REPLACE FUNCTION verify_expense(expense_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expense_creator uuid;
BEGIN
  SELECT user_id INTO expense_creator FROM expenses WHERE id = expense_id;
  
  IF expense_creator = auth.uid() THEN
    RAISE EXCEPTION 'Cannot verify your own expense';
  END IF;
  
  IF EXISTS (SELECT 1 FROM expenses WHERE id = expense_id AND verified = true) THEN
    RAISE EXCEPTION 'Expense already verified';
  END IF;
  
  UPDATE expenses 
  SET verified = true, 
      verified_by = auth.uid(), 
      verified_at = now()
  WHERE id = expense_id;
END;
$$;

-- Create reversal function for donations
CREATE OR REPLACE FUNCTION reverse_donation(
  original_id uuid, 
  reversal_reason text,
  new_amount numeric DEFAULT NULL,
  new_donor_name text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  original_record donations;
  reversal_id uuid;
  new_entry_id uuid;
BEGIN
  -- Get original record
  SELECT * INTO original_record FROM donations WHERE id = original_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;
  
  IF original_record.verified = false THEN
    RAISE EXCEPTION 'Only verified donations can be reversed';
  END IF;
  
  -- Create reversal entry (negative amount)
  INSERT INTO donations (
    festival_id, user_id, amount, donor_name, payment_mode,
    transaction_number, donor_phone, donor_email, donor_address, donor_pan,
    donor_details, verified, hash, is_reversal, reversal_reason, reverses_id, category
  ) VALUES (
    original_record.festival_id, auth.uid(), -original_record.amount,
    original_record.donor_name, original_record.payment_mode,
    original_record.transaction_number, original_record.donor_phone,
    original_record.donor_email, original_record.donor_address, original_record.donor_pan,
    original_record.donor_details, true,
    encode(digest(concat('reversal-', original_id::text, now()::text), 'sha256'), 'hex'),
    true, reversal_reason, original_id, original_record.category
  ) RETURNING id INTO reversal_id;
  
  -- Create new corrected entry if new_amount provided
  IF new_amount IS NOT NULL AND new_amount > 0 THEN
    INSERT INTO donations (
      festival_id, user_id, amount, donor_name, payment_mode,
      transaction_number, donor_phone, donor_email, donor_address, donor_pan,
      donor_details, verified, hash, category
    ) VALUES (
      original_record.festival_id, auth.uid(), new_amount,
      COALESCE(new_donor_name, original_record.donor_name),
      original_record.payment_mode, original_record.transaction_number,
      original_record.donor_phone, original_record.donor_email,
      original_record.donor_address, original_record.donor_pan,
      original_record.donor_details, false,
      encode(digest(concat('corrected-', original_id::text, now()::text), 'sha256'), 'hex'),
      original_record.category
    ) RETURNING id INTO new_entry_id;
  END IF;
  
  RETURN reversal_id;
END;
$$;

-- Create reversal function for expenses
CREATE OR REPLACE FUNCTION reverse_expense(
  original_id uuid,
  reversal_reason text,
  new_amount numeric DEFAULT NULL,
  new_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  original_record expenses;
  reversal_id uuid;
  new_entry_id uuid;
BEGIN
  SELECT * INTO original_record FROM expenses WHERE id = original_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expense not found';
  END IF;
  
  IF original_record.verified = false THEN
    RAISE EXCEPTION 'Only verified expenses can be reversed';
  END IF;
  
  -- Create reversal entry
  INSERT INTO expenses (
    festival_id, user_id, amount, description, category, vendor,
    payment_mode, expense_details, verified, hash, is_reversal,
    reversal_reason, reverses_id
  ) VALUES (
    original_record.festival_id, auth.uid(), -original_record.amount,
    original_record.description, original_record.category, original_record.vendor,
    original_record.payment_mode, original_record.expense_details, true,
    encode(digest(concat('reversal-', original_id::text, now()::text), 'sha256'), 'hex'),
    true, reversal_reason, original_id
  ) RETURNING id INTO reversal_id;
  
  -- Create new corrected entry if new_amount provided
  IF new_amount IS NOT NULL AND new_amount > 0 THEN
    INSERT INTO expenses (
      festival_id, user_id, amount, description, category, vendor,
      payment_mode, expense_details, verified, hash
    ) VALUES (
      original_record.festival_id, auth.uid(), new_amount,
      COALESCE(new_description, original_record.description),
      original_record.category, original_record.vendor,
      original_record.payment_mode, original_record.expense_details, false,
      encode(digest(concat('corrected-', original_id::text, now()::text), 'sha256'), 'hex')
    ) RETURNING id INTO new_entry_id;
  END IF;
  
  RETURN reversal_id;
END;
$$;