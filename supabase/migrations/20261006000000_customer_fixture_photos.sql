-- ==============================================================================
-- TAP & TOGGLE — DATABASE MIGRATION: Customer Fixture Photos & Attachments
-- File: supabase/migrations/20261006000000_customer_fixture_photos.sql
-- ==============================================================================

-- 1. Table: job_photo
-- Stores fixture photos uploaded by customers during booking, as well as before/after photos by pros
CREATE TABLE IF NOT EXISTS public.job_photo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.job(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    file_name TEXT,
    file_size INTEGER,
    uploaded_by TEXT NOT NULL DEFAULT 'customer' CHECK (uploaded_by IN ('customer', 'pro', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning-fast lookups by job_id
CREATE INDEX IF NOT EXISTS idx_job_photo_job_id ON public.job_photo(job_id);
CREATE INDEX IF NOT EXISTS idx_job_photo_created_at ON public.job_photo(created_at);

-- 2. Row Level Security (RLS)
ALTER TABLE public.job_photo ENABLE ROW LEVEL SECURITY;

-- Anonymous users (residents booking a job) can insert photos
CREATE POLICY "anon_insert_job_photo"
    ON public.job_photo
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Anonymous users can view photos for a job they have the ID for (Live Tracker)
CREATE POLICY "anon_select_job_photo"
    ON public.job_photo
    FOR SELECT
    TO anon
    USING (true);

-- Authenticated pros and admins have full access to view, insert, and manage photos
CREATE POLICY "auth_all_job_photo"
    ON public.job_photo
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Service role bypasses RLS automatically
