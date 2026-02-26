-- Create is_treasurer function
CREATE OR REPLACE FUNCTION public.is_treasurer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('treasurer', 'admin')
  );
$$;

-- Add RLS policies for treasurer
CREATE POLICY treasurer_verify_donations ON donations
  FOR UPDATE USING (public.is_treasurer());

CREATE POLICY treasurer_verify_expenses ON expenses
  FOR UPDATE USING (public.is_treasurer());

CREATE POLICY treasurer_manage_receipts ON receipts
  FOR UPDATE USING (public.is_treasurer());