# AUDIT AND IMMUTABILITY RULES

## Append-Only Financial Records
- Donations and expenses are append-only
- No hard delete allowed

## No Delete Policy
- Delete triggers disabled on financial tables

## No Update-After-Verify
- Once verified, records cannot be updated

## Reversal-Entry Method
- Corrections require reversal entries (negative amount)

## Hash Validation
- All financial records include sha256 hash
- Hash covers all relevant fields

## Audit Logging Rules
- All admin actions logged
- Before/after snapshots stored
- Audit logs include hash for tamper detection

## Tamper Detection Method
- Hash validation on read
- Audit logs cross-checked

## Admin Accountability Model
- Every admin action is logged
- Role-based access enforced
- Audit logs visible to admins
