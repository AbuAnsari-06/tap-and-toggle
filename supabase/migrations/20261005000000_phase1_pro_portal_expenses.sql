-- ==============================================================================
-- Tap & Toggle — Phase 1: Registered Pro Portal, Expenses & Issue Escalation
-- Reference: BLUEPRINT.md & Production Architecture
-- ==============================================================================

-- ==============================================================================
-- 1. EXTEND TABLE: pro (Add Secure PIN, Bank Details, and Operational Flags)
-- ==============================================================================
ALTER TABLE public.pro
    ADD COLUMN IF NOT EXISTS pin_hash TEXT,
    ADD COLUMN IF NOT EXISTS pin_updated_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS bank_upi_id TEXT,
    ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
    ADD COLUMN IF NOT EXISTS aadhaar_verified BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS active_job_count INT NOT NULL DEFAULT 0;

-- Set default demo PIN hash for seed pros (Default PIN: "1234")
-- SHA-256 hash of "1234" with standard salt for instant testability
UPDATE public.pro 
SET pin_hash = COALESCE(pin_hash, '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4')
WHERE pin_hash IS NULL;

-- ==============================================================================
-- 2. TABLE: job_expense (Itemized Spare Parts & Hardware Shop Receipt Tracker)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.job_expense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.job(id) ON DELETE CASCADE,
    pro_id UUID REFERENCES public.pro(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    receipt_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_job_expense_job_id ON public.job_expense(job_id);
CREATE INDEX IF NOT EXISTS idx_job_expense_pro_id ON public.job_expense(pro_id);

-- ==============================================================================
-- 3. TABLE: job_issue (Incomplete, Blocked, or Disputed Job Escalations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.job_issue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.job(id) ON DELETE CASCADE,
    pro_id UUID REFERENCES public.pro(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN (
        'resident_unavailable',
        'wrong_parts_required',
        'concealed_wall_damage',
        'customer_refused_estimate',
        'safety_hazard',
        'scope_expanded',
        'other'
    )),
    severity TEXT NOT NULL DEFAULT 'blocking' CHECK (severity IN ('blocking', 'warning', 'resolved')),
    description TEXT NOT NULL,
    photo_url TEXT,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ,
    resolution_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_job_issue_job_id ON public.job_issue(job_id);
CREATE INDEX IF NOT EXISTS idx_job_issue_pro_id ON public.job_issue(pro_id);
CREATE INDEX IF NOT EXISTS idx_job_issue_category ON public.job_issue(category);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.job_expense ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_issue ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "service_role_all_job_expense" ON public.job_expense FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_job_issue" ON public.job_issue FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated operator & admin full access
CREATE POLICY "auth_all_job_expense" ON public.job_expense FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_job_issue" ON public.job_issue FOR ALL TO authenticated USING (true) WITH CHECK (true);
