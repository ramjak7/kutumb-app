# RECEIPT SYSTEM DESIGN

## Receipt Numbering Scheme
- Sequential per festival
- Format: FESTIVALCODE-YYYY-NNNN

## PDF Layout
- Festival branding (logo, colors)
- Donor details
- Donation amount
- Receipt number
- Bilingual text (Hindi/English)
- QR code for verification
- Footer (festival-configurable)

## Fields
- Donor name, amount, date, festival, receipt number, QR, bilingual labels

## QR Verification
- QR code links to verification endpoint
- Includes hash for tamper detection

## Storage
- PDF stored in Supabase storage bucket
- URL saved in receipts table

## Regeneration Rules
- Receipts can be regenerated (new PDF, same number)
- Audit log entry for regeneration

## Void/Reissue Rules
- Receipts can be voided (reversal entry)
- Reissue creates new receipt, logs action
