-- ==============================================================================
-- Tap & Toggle — Phase P1 Operations & Fulfillment Engine Database Migration
-- Reference: BLUEPRINT.md (Section 7, Section 8, Section 19.2) & Rules.md
-- ==============================================================================

-- ==============================================================================
-- 1. TABLE: pro (Vetted Plumbers & Electricians Bench)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    service TEXT NOT NULL CHECK (service IN ('plumbing', 'electrical')),
    photo TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    base_rate NUMERIC(10, 2) DEFAULT 0.00,
    vetting_docs_ref TEXT,
    gate_list_status TEXT DEFAULT 'approved',
    health_score NUMERIC(3, 1) DEFAULT 5.0,
    personal_accident_doc TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pro_service ON public.pro(service);
CREATE INDEX IF NOT EXISTS idx_pro_active ON public.pro(active);

-- ==============================================================================
-- 2. ALTER TABLE: job (Add Pro assignment, financials & emergency flag)
-- ==============================================================================
ALTER TABLE public.job
    ADD COLUMN IF NOT EXISTS pro_id UUID REFERENCES public.pro(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS estimate_amount NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS final_amount NUMERIC(10, 2),
    ADD COLUMN IF NOT EXISTS parts_amount NUMERIC(10, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS handling_fee NUMERIC(10, 2) DEFAULT 0.00;

CREATE INDEX IF NOT EXISTS idx_job_pro_id ON public.job(pro_id);
CREATE INDEX IF NOT EXISTS idx_job_is_emergency ON public.job(is_emergency);

-- ==============================================================================
-- 3. TABLE: payment (Doorstep Direct UPI, Cash & Razorpay Settlements)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.job(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('UPI', 'Cash', 'Razorpay', 'Card', 'NetBanking')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'completed', 'failed', 'refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    upi_ref_no TEXT,
    invoice_no TEXT,
    notes TEXT,
    settled_to_pro_amount NUMERIC(10, 2) DEFAULT 0.00,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_job_id ON public.payment(job_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON public.payment(status);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES FOR P1 TABLES
-- ==============================================================================
ALTER TABLE public.pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment ENABLE ROW LEVEL SECURITY;

-- Service role full access (Backend Server Actions & Admin API)
CREATE POLICY "service_role_all_pro" ON public.pro FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_payment" ON public.payment FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated admin users full access
CREATE POLICY "auth_all_pro" ON public.pro FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_payment" ON public.payment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_job" ON public.job FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_customer" ON public.customer FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_society" ON public.society FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. SEED DATA: Initial Vetted Pro Bench (2 Plumbers, 2 Electricians)
-- ==============================================================================
INSERT INTO public.pro (name, phone, service, active, base_rate, gate_list_status, health_score)
VALUES
    ('Ramesh Shinde', '+919822011111', 'plumbing', true, 350.00, 'approved', 4.9),
    ('Suresh Patil', '+919822022222', 'plumbing', true, 350.00, 'approved', 4.8),
    ('Amit Deshmukh', '+919822033333', 'electrical', true, 300.00, 'approved', 5.0),
    ('Vikas More', '+919822044444', 'electrical', true, 300.00, 'approved', 4.7)
ON CONFLICT (phone) DO UPDATE 
SET active = EXCLUDED.active,
    base_rate = EXCLUDED.base_rate,
    health_score = EXCLUDED.health_score;
