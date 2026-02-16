# EXECUTION PLAN

| Phase | Deliverable         | Depends On | Acceptance Criteria |
|-------|---------------------|------------|--------------------|
| 1     | Scaffold, config    | None       | Folder structure, lint, config files |
| 2     | DB schema, RLS      | 1          | SQL migrations, triggers, policies |
| 3     | Auth, admin protect | 2          | Supabase Auth, role checks, protected routes |
| 4     | Public pages        | 3          | Home, schedule, committee, donation, contact |
| 5     | Admin dashboard UI  | 4          | Dashboard, content manager, settings |
| 6     | Ledgers (immutable) | 5          | Append-only ledgers, no update/delete |
| 7     | Audit system        | 6          | Audit logs, tamper detection |
| 8     | Receipt generator   | 7          | PDF, QR, storage, DB record |
| 9     | Language engine     | 8          | Bilingual UI, receipts, admin |
| 10    | Messaging           | 9          | WhatsApp provider, mock sender |
| 11    | PWA enablement      | 10         | Manifest, offline, installable |
