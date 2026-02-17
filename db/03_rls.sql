-- RLS POLICIES: Secure, Role-Based Access

-- Enable RLS
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can insert/update festivals
CREATE POLICY admin_manage_festivals ON festivals
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Users can read their own user row, admins can read all
CREATE POLICY user_read_own ON users
  FOR SELECT USING (id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Only admins can insert donations/expenses/receipts
CREATE POLICY admin_insert_donations ON donations
  FOR INSERT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY admin_insert_expenses ON expenses
  FOR INSERT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY admin_insert_receipts ON receipts
  FOR INSERT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Public can read public content, admins can read all
CREATE POLICY public_read_content ON content_blocks
  FOR SELECT USING (true);
CREATE POLICY public_read_translations ON translations
  FOR SELECT USING (true);

-- Policy: Only admins can insert/update content/translation
CREATE POLICY admin_manage_content ON content_blocks
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY admin_manage_translations ON translations
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Only admins can view audit logs
CREATE POLICY admin_view_audit ON audit_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

