# Tap & Toggle — Step-by-Step Architecture & Task Flow

> **Scope Note:** Strictly building **Phase P0** per [Rules.md](file:///d:/Abu%20Horairah%20Ansari/Internship_Projects/Tap%20&%20Toggle/Rules.md) and [BLUEPRINT.md Section 21](file:///d:/Abu%20Horairah%20Ansari/Internship_Projects/Tap%20&%20Toggle/BLUEPRINT.md#L332-L341). Future phases (P1–P3) are referenced only for architecture context.

---

## Architecture Flow (Phase P0: Lead Capture & Conversion)

```
[ Resident Visits Landing Page ]
          │
          ├── 1. Explores Brand & Value Prop (Teal/Amber, NIBM hyperlocal, 7-day warranty)
          ├── 2. Reviews Interactive Rate Card (Centralized config: Plumbing & Electrical)
          └── 3. Fills DPDP-Compliant Booking Request Form
                    │
                    ├── Validates inputs (Phone dedupe key, Name, Flat/Society, Service, Issue)
                    ├── Validates DPDP Consent Checkbox (Enforced; cannot submit without check)
                    │
                    ▼ [ Next.js Server Action / API ]
                    │
                    ├── Supabase Client (Secure Server-Side with RLS)
                    │     ├── 1. Upsert Customer (keyed on phone number)
                    │     ├── 2. Insert ConsentRecord (customer_id, purpose, text_version, ts)
                    │     └── 3. Insert Job (status: 'New', service, description, requested_slot)
                    │
                    ▼
          [ UI Shows Friendly Confirmation & Next Steps via WhatsApp ]
```

---

## Phase P0 Step-by-Step Task Breakdown

### Step 1: Project & Tooling Setup (Task 1 Focus)
- [x] Initialize Next.js 14+ (App Router) with TypeScript & Tailwind CSS in project root.
- [x] Configure Tailwind theme with brand tokens (Deep teal `#0f766e` / `#134e4a`, Amber `#f59e0b` / `#d97706`, and neutral greys).
- [x] Create base layout (`src/app/layout.tsx`) with a simple header ("Tap & Toggle") and footer.
- [x] Create `src/config/site.ts` exporting brand constants: name, tagline, WHATSAPP_NUMBER (placeholder), and trust badges (excluding "insured").
- [x] Configure `.gitignore` and `.env.local.example`.

### Step 2: Supabase Schema & Security (Task 2 Complete)
- [x] Define database migration SQL (`supabase/migrations/20261001000000_p0_init.sql`):
  - `society` (`id`, `name`, `area`, `pre_approved`, `created_at`)
  - `customer` (`id`, `phone` UNIQUE, `name`, `flat_no`, `society_id`, `whatsapp_opt_in`, `created_at`)
  - `job` (`id`, `customer_id`, `service`, `description`, `status` [default 'New'], `requested_slot`, `created_at`)
  - `consent_record` (`id`, `customer_id`, `purpose`, `text_version`, `created_at`)
- [x] Enable RLS on all 4 tables with strict policies (anon INSERT allowed for leads; SELECT, UPDATE, DELETE denied).
- [x] Add seed data for launch societies (NIBMgaon, Nyati, Sus, NIBM Phase 1, NIBM Phase 2).
- [x] Setup typed Supabase clients (`src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`).
- [x] Document RLS validation test suite.

### Step 3: Landing Page Core Sections (Task 3 Complete)
- [x] **Hero Section**: Tagline ("Your building's plumber & electrician — one tap away."), promise, primary CTA button ("Request a visit" scrolling to `#booking-form`), secondary WhatsApp CTA, and NIBM hyperlocal badge.
- [x] **Trust Badges Section**: Render 5 core promises from `SITE_CONFIG` with custom SVG icons (excluding "insured").
- [x] **4-Step "How It Works" Section**:
  1. *Request* (Share your issue & preferred slot)
  2. *Free Estimate* (Clear upfront price, no surprise fees)
  3. *Pro Arrives* (Vetted, gate-cleared local technician)
  4. *Pay After It's Fixed* (One bill, 7-day workmanship warranty)
- [x] **Services Cards (Plumbing & Electrical)**: Visual breakdown of common repairs with Lucide icons.
- [x] Mobile-first responsive layout, warm neighbourly tone, and strict omission of "insured".

### Step 4: Rate Card Configuration & Component (Task 4 Complete)
- [x] Create `src/config/rates.ts` with typed rate items and header comment: "PLACEHOLDER PRICES. Validate with the pro bench before launch."
- [x] Populate Plumbing items (leaking tap ₹150, tap replacement ₹250, wash basin ₹250, blocked drain ₹400, flush cistern ₹200, geyser/RO & motor as estimates).
- [x] Populate Electrical items (switch/socket ₹120, board fault ₹250, MCB trip ₹150, fan fitting ₹200, light/point ₹150, wiring repair & inverter point as estimates).
- [x] Build `src/components/landing/RateCard.tsx` with clear Plumbing/Electrical split, fixed pricing vs "Free estimate · visit ₹199 (waived if you book)" tags, and the transparent parts policy note.

### Step 5: DPDP-Compliant Booking Request Form (Task 5 Complete)
- [x] Build form component (`src/components/landing/BookingForm.tsx`) with ID `booking-form`.
- [x] Input fields:
  - Name (text)
  - Phone (Indian 10-digit, regex validation)
  - Flat number (text)
  - Society (dropdown populated from Supabase `society` with seeded fallback)
  - Service (radio toggle: Plumbing / Electrical)
  - Short description (textarea)
  - Optional photo file input
- [x] Implement mandatory UNTICKED DPDP consent checkbox with plain-language purpose text (versioned). Block submission if unchecked.
- [x] Build Server Action (`src/app/actions/submitLead.ts`):
  - Server-side assertion of DPDP consent.
  - Upsert `Customer` by `phone`.
  - Insert `ConsentRecord` (customer_id, purpose, text_version, created_at).
  - Insert `Job` with status `'New'`.
- [x] Add UX enhancements: double-tap prevention, loading state, error alerts, and friendly success confirmation card.

### Step 6: Legal Pages — Privacy & Terms (Task 6 Complete)
- [x] Create `/privacy` (`src/app/privacy/page.tsx`):
  - Prominent "DRAFT: pending lawyer review" banner.
  - Plain-language DPDP Act 2023 compliance breakdown (data collected: name, phone, flat, society, job description, photos).
  - Explicit statement: home job photos are used for "work proof only".
  - Data retention, simple deletion request procedure, and contact email/WhatsApp placeholder.
- [x] Create `/terms` (`src/app/terms/page.tsx`):
  - Prominent "DRAFT: pending lawyer review" banner.
  - Managed dispatch model & service scope (NIBM area plumbing & electrical).
  - Free upfront estimates & pay-after-completion billing.
  - 7-day workmanship warranty (distinguished from pro/manufacturer parts warranties).
  - Realistic limitation of liability capped at job value for indirect loss.
  - Customer complaint resolution SOP.
  - Strict omission of insurance claims.
- [x] Footer and booking form consent checkbox linked directly to `/privacy` and `/terms`.

### Step 7: Vercel Deployment & Live Verification Protocol (Phase 0 Finale)
- [ ] Deploy Application to Vercel with Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Run automated & browser subagent test suite on the live URL at a mobile viewport (390px):
  - [ ] **Check A (Lead Creation):** Submit valid form -> confirm `job` row appears with status `'New'`.
  - [ ] **Check B (DPDP Consent Block):** Submit without consent -> confirm rejection on both client and server.
  - [ ] **Check C (Deduplication):** Submit same phone number twice -> confirm only 1 `customer` row exists.
  - [ ] **Check D (RLS Denial):** Perform `SELECT` on `job` table with `anon` key -> confirm zero rows returned / access denied.
  - [ ] **Check E (Mobile UX):** Verify responsive rendering, touch targets, and visual polish.
- [ ] Report Pass/Fail status for each check without applying fixes before confirmation.

---

## Phase P1: Operations & Fulfillment Engine (Active Scope)

> **Scope Note:** Scope formally updated per Decision #17 in [BLUEPRINT.md](file:///d:/Abu%20Horairah%20Ansari/Internship_Projects/Tap%20&%20Toggle/BLUEPRINT.md) and [Rules.md](file:///d:/Abu%20Horairah%20Ansari/Internship_Projects/Tap%20&%20Toggle/Rules.md). Building complete commercial suite (P0 + P1) prior to deployment.

### Step 8: Phase 1 Database Schema Migration
- [x] Create `supabase/migrations/20261003000000_p1_ops.sql`:
  - `pro` table (`id`, `name`, `phone`, `service`, `photo`, `active`, `base_rate`, `gate_list_status`, `health_score`, `created_at`)
  - Update `job` table with `pro_id` foreign key, `estimate_amount`, `final_amount`, `parts_amount`, `handling_fee`, `is_emergency`, `scheduled_start`, `scheduled_end`
  - `payment` table (`id`, `job_id`, `amount`, `method`, `status`, `razorpay_order_id`, `razorpay_payment_id`, `upi_ref_no`, `notes`, `created_at`)
  - Enable RLS on `pro` and `payment` tables (Service role / authenticated admin access only)
  - Seed initial vetted pro bench (2 plumbers, 2 electricians)
- [x] Update TypeScript database interfaces (`src/types/database.ts`) for `Pro`, `Payment`, and augmented `Job`.
- [x] Wire `is_emergency` hazard toggle and live tracking button into `BookingForm.tsx` & `submitLead.ts`.

### Step 9: Admin Authentication & Layout
- [x] Set up Supabase Auth login screen (`src/app/admin/login/page.tsx`) with dev/demo bypass fallback
- [x] Create protected Admin layout (`src/app/admin/layout.tsx`) with role verification, topbar brand, and navigation tabs
- [x] Add Admin topbar & navigation (Jobs Board, Pro Bench, Customers, Public Site shortcut, Sign Out)
- [x] Create initial Admin Overview dashboard (`src/app/admin/page.tsx`) with triage counters and search/filter bar

### Step 10: Job Triage Board & State Machine
- [x] Create interactive Job Board (`src/app/admin/page.tsx`) with ticket cards stream and modal manager
- [x] Implement lifecycle status selector across all state machine phases (`New → Contacted → Estimated → Approved → Scheduled → Assigned → On the way → Arrived → In Progress → Done → Paid → Warranty → Closed`)
- [x] Add urgency badge and priority filter for active leak / electrical hazard tickets
- [x] Implement financial calculator for estimate, parts actuals, handling fee, and total customer bill
- [x] Create backend server actions in `src/app/actions/adminJobs.ts` with Supabase integration & resilient bench fallback

### Step 11: Pro Bench Directory & Assignment
- [x] Build Pro Management screen (`src/app/admin/pros/page.tsx`) with duty toggle and pro onboarding modal
- [x] Assign Pro dropdown integrated inside Job details modal filtering by service category
- [x] 1-Click WhatsApp Dispatch Message Generator (`src/lib/dispatch/whatsappDispatch.ts`) with deep linking, Google Maps, resident details, and gate clearance instructions
- [x] Created Pro backend server actions in `src/app/actions/adminPros.ts` with live query & seed fallback

### Step 12: Customer Live Tracking (High-Value Value-Add)
- [x] Build lightweight customer status page (`src/app/track/[jobId]/page.tsx`)
- [x] Displays live 5-stage progress bar (`Request Logged → Estimate Ready → Pro Dispatched → Repair Active → Done & Protected`)
- [x] Includes emergency hazard banner, assigned technician profile card, transparent parts billing, and 7-day warranty seal
- [x] Link to tracker directly from Booking Form confirmation and WhatsApp direct assistance action
- [x] Created secure public tracking server action in `src/app/actions/trackJob.ts` with seed fallback

### Step 13: Direct UPI Doorstep Payments & Settlement (Razorpay Day-1 Substitute)
- [x] Build Doorstep Payment Modal (`src/components/admin/DoorstepPaymentModal.tsx`) on completed jobs:
  - Calculates total bill: Labor + Parts actuals + Handling fee (₹20–50)
  - Displays dynamic UPI QR code pre-filled with amount and merchant UPI ID (supports GPay, PhonePe, Paytm, BHIM)
  - Provides 1-click WhatsApp payment request link to send directly to customer
- [x] Admin "Mark as Paid (UPI / Cash)" confirmation action in `src/app/actions/paymentActions.ts`:
  - Records payment transaction in `payment` table
  - Transitions `Job.status = 'Paid'` and activates 7-day warranty
- [x] Architecture preserves plug-and-play Razorpay webhook handler at `src/app/api/webhooks/razorpay/route.ts` for zero-rework automated transition once merchant KYC is approved

### Step 14: Combined P0 + P1 QA & Vercel Deployment
- [x] Verify complete build (`next build`) across customer and admin routes (10/10 routes passing with 0 errors)
- [x] Initialize local git repository, stage 43 files with strict secrets isolation, and commit on `main` branch
- [x] Configure GitHub remote origin: `https://github.com/AbuAnsari-06/tap-and-toggle.git`
- [x] Push codebase to GitHub repository: `https://github.com/AbuAnsari-06/tap-and-toggle` (Pushed main branch with 43 files)
- [ ] Provide Supabase Project URL, anon key, and service_role key to Vercel and local `.env.local`
- [ ] Import repository to Vercel and configure environment variables
- [ ] End-to-end live testing with browser subagent on production URL
