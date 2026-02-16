# DATABASE DESIGN

## ER Diagram

festivals---<donations
         \         \
          \         >---receipts
           \       /
            >---expenses
users---<donations
     \         \
      \         >---receipts
       \       /
        >---expenses

content_blocks---<festivals
translations---<festivals

## Tables & Columns
- festivals: id, name, theme_colors, logos, banners, program_data, committee_data, receipt_footer, created_at
- users: id, email, role, name, festival_id, created_at
- donations: id, festival_id, user_id, amount, donor_details, verified, hash, created_at
- expenses: id, festival_id, user_id, amount, expense_details, verified, hash, created_at
- receipts: id, donation_id, festival_id, pdf_url, receipt_number, qr_code, hash, created_at
- content_blocks: id, festival_id, key, content, created_at
- translations: id, festival_id, key, en, hi, created_at
- audit_logs: id, user_id, action, table, record_id, before, after, hash, timestamp

## Constraints
- Foreign keys, unique indexes, not null
- No update/delete triggers on donations/expenses
- Append-only ledgers

## Indexes
- festival_id, created_at, hash

## Hash Fields
- donations, expenses, receipts, audit_logs

## Audit Triggers
- On insert/update: log before/after, hash

## Immutability Triggers
- Prevent update/delete on financial tables

## RLS Policies
- Role-based access, festival scoping

## Retention Strategy
- 2-year retention enforced via DB policies
