# TECH STACK

## Framework
- Next.js (latest): Modern SSR/SSG, PWA support, App Router, TypeScript integration
- Rejected: React (standalone), Angular, Vue (lack of SSR/PWA maturity)

## DB
- Supabase (Postgres): Managed, scalable, RLS, triggers, storage
- Rejected: Firebase (no SQL, weak audit), MongoDB (no triggers), custom DB

## Auth
- Supabase Auth: Secure, role-based, easy integration
- Rejected: Auth0 (cost, complexity), custom JWT

## Storage
- Supabase Storage: Native integration, secure, scalable
- Rejected: AWS S3 (external complexity)

## PDF Generation
- Server-side libraries (e.g., pdf-lib, @react-pdf/renderer): TypeScript support, flexible
- Rejected: Client-side PDF (security, branding)

## Messaging Integration
- WhatsApp via provider abstraction: Extensible, mockable
- Rejected: Direct Twilio/Meta API (credentials risk)

## Validation Library
- Zod: Type-safe, schema-driven, integrates with TypeScript
- Rejected: Yup (less strict), custom validation

## Hosting
- Vercel/Netlify: Next.js optimized, PWA support, secure
- Rejected: Custom VPS (maintenance overhead)

## Security Controls
- RLS, triggers, audit logs, hash fields, role-based access, input validation
- Rejected: Custom RBAC (reinventing wheel)
