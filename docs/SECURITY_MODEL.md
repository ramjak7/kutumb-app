# SECURITY MODEL

## Role Model
- Public, Donor, Admin

## Access Control
- Role-based access enforced via Supabase RLS
- Admin routes protected

## Admin Route Protection
- Server-side checks
- No secrets in client code

## Secrets Handling
- Credentials externalized (env, Supabase)

## Input Validation
- Zod schemas for all forms
- Strict TypeScript

## Abuse Prevention
- Rate limiting on sensitive actions
- Audit logs for all admin actions

## Backup Strategy
- Regular DB backups
- Storage backups for PDFs
- Retention policy (2 years)
