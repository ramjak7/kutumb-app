# SYSTEM ARCHITECTURE

## Architecture Diagram

      +-------------------+         +-------------------+
      |   Public Pages    | <-----> |   Language Engine |
      +-------------------+         +-------------------+
               |                          |
               v                          v
      +-------------------+         +-------------------+
      |   Next.js Frontend| <-----> |   Service Layer   |
      +-------------------+         +-------------------+
               |                          |
               v                          v
      +-------------------+         +-------------------+
      | App Router (SSR)  | <-----> |   Repository Layer|
      +-------------------+         +-------------------+
               |                          |
               v                          v
      +-------------------+         +-------------------+
      | Supabase Backend  | <-----> |   DB Layer        |
      +-------------------+         +-------------------+
               |                          |
               v                          v
      +-------------------+         +-------------------+
      | Storage (PDFs)    | <-----> | Messaging Provider|
      +-------------------+         +-------------------+

## Frontend Structure
- Next.js App Router
- Tailwind CSS for UI
- Bilingual UI via translation dictionaries
- PWA manifest, offline fallback
- Responsive, mobile-first

## Backend Structure
- Supabase server routes (API)
- Service layer for business logic
- Repository layer for DB access
- PDF generation (server-side)
- Messaging abstraction (WhatsApp)

## DB Layer
- Supabase Postgres
- Tables: festivals, users, donations, expenses, receipts, content_blocks, translations, audit_logs
- Triggers for audit, immutability
- Row-level security (RLS)

## Auth Model
- Supabase Auth
- Role-based access (admin, public)
- Protected admin routes

## Audit Model
- Audit logs for all admin actions
- Before/after snapshots
- Hash validation
- Tamper detection

## Immutability Model
- Append-only ledgers
- No delete/update after verify
- Reversal entries for corrections
- Triggers to enforce immutability

## Receipt Pipeline
- Donation triggers receipt generation
- PDF created server-side
- QR code for verification
- Stored in Supabase storage
- Record saved in receipts table
- WhatsApp sending via provider

## Messaging Pipeline
- Abstracted provider in /lib/messaging
- WhatsApp sender interface
- Mock sender for dev
- Credentials externalized

## Language Engine Design
- Translation dictionaries (en.json, hi.json)
- Key-based lookup
- UI, forms, receipts, admin labels
- Content translation workflow

## PWA Structure
- Manifest, icons
- Offline fallback page
- Installable on desktop/mobile
