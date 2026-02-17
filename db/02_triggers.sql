-- TRIGGERS: Audit Logging & Immutability

-- Function: log_audit()
CREATE OR REPLACE FUNCTION log_audit() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, before, after, hash)
  VALUES (
    current_setting('request.jwt.claims', true)::json->>'sub',
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    row_to_json(OLD),
    row_to_json(NEW),
    encode(digest(row_to_json(NEW)::text, 'sha256'), 'hex')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: prevent_update_delete()
CREATE OR REPLACE FUNCTION prevent_update_delete() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates and deletes are not allowed on immutable tables.';
END;
$$ LANGUAGE plpgsql;

-- Triggers for donations
CREATE TRIGGER donations_audit
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER donations_immutable
BEFORE UPDATE OR DELETE ON donations
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

-- Triggers for expenses
CREATE TRIGGER expenses_audit
AFTER INSERT OR UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER expenses_immutable
BEFORE UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

-- Triggers for receipts
CREATE TRIGGER receipts_audit
AFTER INSERT OR UPDATE ON receipts
FOR EACH ROW EXECUTE FUNCTION log_audit();

-- Triggers for audit_logs (self-hash)
CREATE TRIGGER audit_logs_hash
BEFORE INSERT OR UPDATE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION log_audit();

