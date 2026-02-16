# PROJECT SCOPE

## Objectives
- Build a bilingual, audit-safe, cross-platform PWA for festival societies
- Enable public information, donation, and admin management
- Ensure financial immutability and audit safety
- Support festival reusability and configuration

## In-Scope Features
- Public festival website (Home, Schedule, Committee, Donation Info, Contact)
- Admin dashboard (Login, ledgers, receipts, audit logs, content manager, settings)
- Donation and expense ledgers (append-only, immutable)
- PDF receipt generation and WhatsApp sending
- Bilingual UI (Hindi/English)
- Festival configuration via DB
- Secure 2-year data retention
- PWA support (offline, installable)

## Out-of-Scope Items
- Non-festival event types
- Custom mobile apps (native)
- Third-party payment gateway integration (beyond WhatsApp)
- Non-Supabase DBs
- Non-Next.js frameworks

## User Roles
- Public visitor
- Donor
- Admin (committee member)

## Public vs Admin Capabilities
- Public: View pages, donate, contact
- Admin: Manage ledgers, verify donations, generate/send receipts, manage content, view audit logs, export reports, configure festival

## Reusability Goals
- Festival branding, content, and settings fully configurable via DB
- No code changes required for new festival

## Audit & Compliance Goals
- All financial actions logged
- Immutability enforced (no delete/update after verify)
- Hash-protected records
- Server timestamps only
- Audit logs with before/after snapshots

## Language Requirements
- Full bilingual support (UI, forms, receipts, admin)
- Translation dictionaries (en.json, hi.json)
- No hardcoded UI text

## Data Retention Requirements
- Secure storage for 2 years
- Enforced via DB triggers and policies

## Non-Functional Requirements
- Responsive, mobile-friendly
- Secure authentication and access control
- Fast, reliable, offline-capable
- Strict TypeScript, input validation

## Success Criteria
- All modules delivered per phased plan
- No financial record edits/deletes
- Audit logs for all admin actions
- Bilingual UI and receipts
- Festival reusability without code changes
- PWA installable and offline
- Security and compliance enforced
