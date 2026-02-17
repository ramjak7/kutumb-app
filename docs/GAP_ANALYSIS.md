# Kutumb App: Gap Analysis vs Documentation

_Last reviewed: 2026-02-17_

This document summarizes the implementation gaps between the current codebase and the requirements/designs in the `/docs` folder. Each gap is mapped to the relevant documentation and code evidence.

---


## 1. Export Reports & Receipt Download (CSV/PDF)
**Docs:** FEATURE_MATRIX.md, PROJECT_SCOPE.md, RECEIPT_SYSTEM_DESIGN.md
- **Gap:** No implementation found for exporting ledgers or reports as CSV/PDF. No UI, API, or service for export.
- **Gap:** No feature for downloading individual donor receipts as PDF from the admin or donor UI.
- **Evidence:** No references to export/download functions in code. No export button in admin UI. No download link for receipts.

## 2. Content Manager (DB-driven Content)
**Docs:** FEATURE_MATRIX.md, I18N_LANGUAGE_DESIGN.md
- **Gap:** The admin content manager UI is a placeholder. Content blocks and translations are not persisted to the DB; only local state is updated.
- **Evidence:** `src/app/admin/content/page.tsx` and `translation.tsx` have TODOs for DB integration.

## 3. Festival Reuse Engine (Configurable, No Code Changes)
**Docs:** PROJECT_SCOPE.md, FEATURE_MATRIX.md
- **Gap:** While festival config is in the DB and `app.config.ts`, there is no explicit engine or workflow for creating a new festival instance without code changes. Some pages (e.g., program, donation) use hardcoded or static data with TODOs for DB fetch.
- **Evidence:** `program/page.tsx`, `donate/page.tsx` have TODOs for dynamic DB data.

## 4. Receipt Regeneration, Void, Reissue
**Docs:** RECEIPT_SYSTEM_DESIGN.md
- **Gap:** No UI or API for regenerating, voiding, or reissuing receipts. No audit log entry for these actions.
- **Evidence:** Only receipt generation and storage are implemented. No code for regeneration/void/reissue.

## 5. Full Bilingual UI Coverage
**Docs:** I18N_LANGUAGE_DESIGN.md, PROJECT_SCOPE.md
- **Gap:** Many UI strings are translated, but several TODOs remain for adding translation keys. Some static text is still hardcoded in English.
- **Evidence:** `donate/page.tsx`, `contact/page.tsx`, and others have comments like `/* TODO: Add translation key for this message */`.

## 6. PWA Service Worker & Offline Support
**Docs:** SYSTEM_ARCHITECTURE.md, FEATURE_MATRIX.md
- **Gap:** PWA manifest and icons exist. Service worker config is present in `next.config.js` (using `@ducanh2912/next-pwa`), but PWA is disabled in production. No explicit offline fallback logic is verified.
- **Evidence:** `next.config.js` disables PWA in production. `offline/page.tsx` exists but may not be wired up.

## 7. Data Retention Enforcement (2 Years)
**Docs:** DATABASE_DESIGN.md, PROJECT_SCOPE.md
- **Gap:** Retention policy is defined in DB triggers/policies, but no code or scheduled job is found to enforce deletion of old data. No UI for retention management.
- **Evidence:** Only `dataRetentionYears` in `app.config.ts` and DB SQL mention retention.

## 8. Security, RLS, and Compliance Coverage
**Docs:** SECURITY_MODEL.md, AUDIT_AND_IMMUTABILITY_RULES.md
- **Gap:** RLS and role checks are present in DB and code. Input validation is not fully enforced (e.g., Zod validation is a TODO in API routes). No evidence of rate limiting or abuse prevention in code.
- **Evidence:** `api/receipts/generate/route.ts` has `// TODO: Validate input with Zod`. No rate limiting middleware found.

## 9. Responsive, Mobile, and Offline Support
**Docs:** SYSTEM_ARCHITECTURE.md, PROJECT_SCOPE.md
- **Gap:** Tailwind and responsive classes are used, but no explicit mobile testing or offline-first testing is documented. PWA is not enabled in production.
- **Evidence:** UI uses responsive classes, but PWA is disabled and no e2e/mobile test scripts are found.

## 10. Initial Data Seeding (Festival, Committee, Admin)
**Docs:** PROJECT_SCOPE.md, DATABASE_DESIGN.md
- **Gap:** No feature or documented process for sending or seeding initial festival, committee, and admin data into Supabase.
- **Evidence:** No scripts, admin UI, or onboarding workflow for initial data setup found in the codebase.

---

## Summary Table
| Area                        | Gap/Uncertainty                                                                 |
|-----------------------------|--------------------------------------------------------------------------------|
| Export Reports              | No CSV/PDF export implemented                                                   |
| Content Manager             | No DB persistence for content/translation blocks                                |
| Festival Reuse Engine       | No explicit workflow for new festival setup without code changes                |
| Receipt Regeneration/Void   | No UI/API for regeneration, void, or reissue                                    |
| Full Bilingual Coverage     | Some UI text still hardcoded or missing translation keys                        |
| PWA Service Worker          | PWA disabled in production; offline fallback not fully wired up                 |
| Data Retention Enforcement  | No code/scheduler for 2-year retention; only DB policy/config                   |
| Security/Compliance         | Input validation incomplete; no rate limiting/abuse prevention in code          |
| Responsive/Offline Support  | Responsive UI present, but no explicit mobile/offline test or PWA in prod       |

---

## Recommendations
- Implement export (CSV/PDF) for ledgers and reports.
- Complete DB integration for content manager and translations.
- Remove static data and ensure all festival content is DB-driven.
- Add UI/API for receipt regeneration, void, and reissue with audit logging.
- Audit all UI for missing translation keys and hardcoded text.
- Enable and test PWA in production, including offline fallback.
- Add scheduled job or Supabase function for data retention enforcement.
- Enforce input validation (e.g., Zod) and add rate limiting middleware.
- Add mobile/offline e2e tests and document PWA support.

---

This analysis should be updated as features are implemented or requirements change.
