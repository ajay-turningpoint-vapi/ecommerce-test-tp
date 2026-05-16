
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add extra columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ingredients text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS how_to_use text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_time text DEFAULT '30 mins';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount integer DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pieces text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS serves text;

-- Add extra columns to product_variants
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS size text;
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS mrp numeric(10,2);
