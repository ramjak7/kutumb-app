# I18N LANGUAGE DESIGN

## Translation File Format
- JSON dictionaries: /locales/en.json, /locales/hi.json
- Key-value pairs, strict naming

## Key Naming Rules
- Use dot notation: module.section.label
- No hardcoded UI text
- All UI, forms, receipts, admin labels use keys

## Hindi + English Handling
- Language toggle switches UI, forms, receipts, admin
- Dictionaries loaded at runtime

## Receipt Bilingual Rendering
- Receipts include both languages
- PDF layout supports bilingual fields

## Admin Content Translation Workflow
- Content manager allows editing translations
- All content blocks have translation keys
- Admins can update translations via dashboard
