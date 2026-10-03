-- ==============================================================================
-- Tap & Toggle — Phase P0 Database Schema & Security
-- Reference: BLUEPRINT.md (Section 7, Section 18, Section 19.2) & Rules.md
-- ==============================================================================

-- 1. Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE: society (Neighborhood & Housing Societies)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.society (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    area TEXT NOT NULL DEFAULT 'NIBM',
    contact TEXT,
    has_mou BOOLEAN NOT NULL DEFAULT FALSE,
    corpus_share_pct NUMERIC(5, 2) DEFAULT 0.00,
    pre_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- TABLE: customer (Apartment Residents)
-- Rule: customer.phone is the UNIQUE dedupe key across all lead touchpoints
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    flat_no TEXT,
    society_id UUID REFERENCES public.society(id) ON DELETE SET NULL,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- High-speed deduplication index on customer phone
CREATE INDEX IF NOT EXISTS idx_customer_phone ON public.customer(phone);

-- ==============================================================================
-- TABLE: job (Service Booking / Leads)
-- Uses Blueprint Section 7 state machine; default is 'New'
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.job (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    service TEXT NOT NULL CHECK (service IN ('plumbing', 'electrical')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (
        status IN (
            'New', 'Contacted', 'Estimated', 'Approved', 'Scheduled',
            'Assigned', 'On the way', 'Arrived', 'In Progress', 'Done',
            'Paid', 'Warranty', 'Closed', 'Rescheduled', 'Cancelled',
            'No-show', 'Partial'
        )
    ),
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    requested_slot TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_job_customer_id ON public.job(customer_id);
CREATE INDEX IF NOT EXISTS idx_job_status ON public.job(status);

-- ==============================================================================
-- TABLE: consent_record (DPDP Act 2023 Proof of Consent)
-- Mandatory audit trail for every lead submission
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consent_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customer(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL DEFAULT 'service_request_contact',
    text_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_consent_customer_id ON public.consent_record(customer_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Rule: RLS enabled on all tables. Anon may only INSERT leads, never SELECT/UPDATE/DELETE.
-- ==============================================================================

ALTER TABLE public.society ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_record ENABLE ROW LEVEL SECURITY;

-- 1. Anonymous Lead Creation Policies (INSERT only)
CREATE POLICY "anon_insert_customer"
    ON public.customer
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_insert_job"
    ON public.job
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_insert_consent_record"
    ON public.consent_record
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- (Note: No SELECT, UPDATE, or DELETE policies exist for the anon role on any table.
-- Postgres RLS defaults to denying all unpermitted operations for anon.)

-- 2. Service Role & Authenticated Access (Full access for backend operations)
CREATE POLICY "service_role_all_society" ON public.society FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_customer" ON public.customer FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_job" ON public.job FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_consent" ON public.consent_record FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- SEED DATA: Launch Societies (NIBM Focus)
-- ==============================================================================
INSERT INTO public.society (name, area, pre_approved)
VALUES
    ('NIBMgaon', 'NIBM', false),
    ('Nyati', 'NIBM', false),
    ('Sus', 'Sus', false),
    ('NIBM Phase 1', 'NIBM', false),
    ('NIBM Phase 2', 'NIBM', false)
ON CONFLICT DO NOTHING;
