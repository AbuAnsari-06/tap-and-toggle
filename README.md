# 🛠️ Tap & Toggle — Hyperlocal Home Services Platform

> **"Your building's plumber & electrician — one tap away."**  
> An original, WhatsApp-first home services platform for apartment societies in NIBM, Pune.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=flat&logo=supabase)](https://supabase.com/)
[![DPDP Act 2023 Compliant](https://img.shields.io/badge/DPDP_Act_2023-Protected-teal)](/privacy)

---

## 📖 Overview & Business Model

**Tap & Toggle** is a managed dispatch home-services platform connecting gated apartment communities with a curated bench of vetted plumbers (*"Tap"*) and electricians (*"Toggle"*).

* **Zero-Friction / Passwordless:** Residents do not need to create accounts or remember passwords. Identity is anchored securely to `customer.phone` with unique Magic Tracking Links (`/track/[jobId]`).
* **Managed Dispatch Model:** We own quality, customer communication, upfront pricing estimates, and the 7-day workmanship warranty end-to-end.
* **DPDP Act 2023 Compliant:** Enforced consent logging, work-proof-only photo handling, and explicit privacy protection.
* **Doorstep Direct Payments:** Pay after work is done via 1-tap UPI deep links or doorstep QR collection.

---

## 🌟 Core Features & User Flows

### 1. 🏠 Customer Experience (Zero-Friction & WhatsApp-First)
- **Interactive Rate Card:** Transparent pricing for plumbing & electrical repairs with parts procurement policies.
- **DPDP Compliant Booking Form:** Real-time phone deduplication, housing society dropdown, urgent hazard priority flag, and mandatory consent assertion.
- **Magic Live Service Tracker (`/track/[jobId]`):**
  - Real-time 10-second auto-polling for status updates.
  - Visual 5-stage lifecycle stepper: `Logged` $\rightarrow$ `Estimate Ready` $\rightarrow$ `Pro Dispatched` $\rightarrow$ `Repair Active` $\rightarrow$ `Done & Protected`.
  - 1-Click Estimate Approval (web + WhatsApp).
  - Assigned technician profile card with gate-clearance tips (*MyGate / NoBrokerHood*).
  - 1-Tap UPI Payment launch on mobile (`upi://pay`).
  - Verifiable **7-Day Digital Workmanship Warranty Certificate** with 1-click WhatsApp revisit claim and printable certificate view.

### 2. ⚡ Operator Dispatch Portal (`/admin`)
- **Operations Dashboard:** Live Kanban-style table filtering for Emergency, New, In-Field, and Completed requests.
- **17-Stage State Machine:** Standardized job lifecycle tracking from lead capture to warranty settlement.
- **Technician Assignment:** Filter and dispatch vetted pros from the bench based on specialty and health rating.
- **Financial Calculator:** Automatic itemized tally of Labor + Parts + Handling fees.
- **1-Click WhatsApp Communications Hub:**
  - 📋 Send Upfront Estimate Quote to Resident.
  - 👨‍🔧 Send Pro ETA & Gate Entry Protocol to Resident.
  - 🔧 Send Parts Procurement & Delay Update.
  - 🛡️ Send Paid Receipt & 7-Day Warranty Certificate.
  - 🛠️ Send Full Dispatch Briefing & Google Maps Pin to Technician.
- **Doorstep UPI Payment Collector:** Instant dynamic UPI QR generator and invoice creator.

### 3. 🛡️ Security, Privacy & Law
- **Row-Level Security (RLS):** Fully enabled across all tables in Supabase Postgres.
- **DPDP Act 2023 Audit Trail:** Every lead records consent text version and UTC timestamp in `consent_record`.
- **Operator Authentication:** Server-side HMAC-SHA256 encrypted cookie sessions (`admin_session`).

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (Custom Deep Teal & Warm Amber design system) |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Icons** | Lucide React |
| **Deployment** | Vercel (Edge Network) |

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AbuAnsari-06/tap-and-toggle.git
cd tap-and-toggle
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Operator Portal Access
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=your-32-char-random-secret-key-string
```

### 3. Apply Database Migrations
Run the SQL migration scripts in your Supabase SQL Editor:
1. `supabase/migrations/20261001000000_p0_init.sql` (Tables, initial RLS, launch societies)
2. `supabase/migrations/20261003000000_p1_ops.sql` (Pro bench, financials, payments)
3. `supabase/migrations/20261004000000_fix_rls_lead_submission.sql` (Public RLS lead policies)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## 🔐 Operator Portal Credentials (Demo / Testing)

| Route | Default Password | Role |
|---|---|---|
| `/admin/login` | Defined in `ADMIN_PASSWORD` (e.g. `admin123`) | Dispatch Operator / Admin |

---

## 🏛️ Database Schema

```
society (Housing Societies in NIBM)
   │
   ├──< customer (Apartment Residents - Unique phone dedupe key)
   │       │
   │       ├──< job (Service Tickets & State Machine)
   │       │       │
   │       │       ├──< pro (Vetted Technicians Bench)
   │       │       └──< payment (Doorstep Settlements & Invoices)
   │       │
   │       └──< consent_record (DPDP Act 2023 Proof of Consent)
```

---

## 📜 License & Originality
Built as an original product for hyperlocal apartment communities in Pune. All branding, copy, UI components, and architecture are custom-designed for **Tap & Toggle**.
