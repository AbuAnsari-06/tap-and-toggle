-- ==============================================================================
-- Tap & Toggle — Fix Row Level Security (RLS) for Public Lead Submissions
-- ==============================================================================

-- 1. Ensure public/anon and authenticated can read societies for dropdown selection
DROP POLICY IF EXISTS "anon_select_society" ON public.society;
CREATE POLICY "anon_select_society" ON public.society FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "auth_select_society" ON public.society;
CREATE POLICY "auth_select_society" ON public.society FOR SELECT TO authenticated USING (true);

-- 2. Allow public/anon and authenticated to check/insert/update customer records during booking
DROP POLICY IF EXISTS "anon_select_customer" ON public.customer;
CREATE POLICY "anon_select_customer" ON public.customer FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_customer" ON public.customer;
CREATE POLICY "anon_update_customer" ON public.customer FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "auth_select_customer" ON public.customer;
CREATE POLICY "auth_select_customer" ON public.customer FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_customer" ON public.customer;
CREATE POLICY "auth_update_customer" ON public.customer FOR UPDATE TO authenticated USING (true);

-- 3. Allow public/anon and authenticated to read their job status on the tracking page
DROP POLICY IF EXISTS "anon_select_job" ON public.job;
CREATE POLICY "anon_select_job" ON public.job FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "auth_select_job" ON public.job;
CREATE POLICY "auth_select_job" ON public.job FOR SELECT TO authenticated USING (true);

-- 4. Allow consent records
DROP POLICY IF EXISTS "anon_select_consent" ON public.consent_record;
CREATE POLICY "anon_select_consent" ON public.consent_record FOR SELECT TO anon USING (true);
