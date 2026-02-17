-- Migration: Add whatsapp_number to users table
ALTER TABLE users ADD COLUMN whatsapp_number text;
