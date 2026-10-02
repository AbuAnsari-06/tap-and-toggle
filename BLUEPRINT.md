# Tap & Toggle — Master Blueprint & Business Strategy

> **NIBM's own, gate-cleared, insured plumbers & electricians — one tap away. Free upfront estimate, one accountable bill, 7-day warranty.**

This is the **reference document** for building Tap & Toggle. Every decision made during planning is captured here. Development should proceed **against this document**; if a decision changes, update this file first (see [Decision Log](#20-decision-log)).

**Status:** Model locked · Ready for P0 build
**Last updated:** 2026-09-23

---

## Table of contents
1. [Vision & one-liner](#1-vision--one-liner)
2. [Scope](#2-scope)
3. [Business model](#3-business-model)
4. [Brand](#4-brand)
5. [Competitor landscape & differentiation](#5-competitor-landscape--differentiation)
6. [Actors & roles](#6-actors--roles)
7. [Core operational loop](#7-core-operational-loop)
8. [Payments](#8-payments)
9. [Parts & billing](#9-parts--billing)
10. [Communication: WhatsApp strategy](#10-communication-whatsapp-strategy)
11. [Customer access (WhatsApp + PWA)](#11-customer-access-whatsapp--pwa)
12. [Pro PWA](#12-pro-pwa)
13. [GPS / location policy](#13-gps--location-policy)
14. [Gate-entry workflow](#14-gate-entry-workflow)
15. [Pro ratings & quality](#15-pro-ratings--quality)
16. [Housing society go-to-market](#16-housing-society-go-to-market)
17. [Disintermediation (leak) defense](#17-disintermediation-leak-defense)
18. [Legal, compliance, liability & insurance](#18-legal-compliance-liability--insurance)
19. [Product: components, tech stack & data model](#19-product-components-tech-stack--data-model)
20. [Decision Log](#20-decision-log)
21. [Phased roadmap](#21-phased-roadmap)
22. [Pre-launch action checklist](#22-pre-launch-action-checklist)
23. [Rate card (to validate)](#23-rate-card-to-validate)
24. [Open questions / unit economics](#24-open-questions--unit-economics)

---

## 1. Vision & one-liner
A **hyperlocal, WhatsApp-first home-services booking business** for apartment residents. Inspired by the operating model of Qinbo (Bengaluru), but built as an **original brand** with our own name, copy, imagery and pricing — **none of their content is reused.**

**Why it wins locally:** the tech is trivial; the moat is **(a) a vetted pro bench, (b) housing-society trust & gate access, (c) fast accountable service with warranty.** All three compound within a tight geography.

---

## 2. Scope
- **Area (launch):** NIBMgaon / Nyati / Sus / NIBM Phase 1–2 (Pune).
- **Services (launch):** **Plumbing** and **Electrical** only. Expand (appliance, cleaning, etc.) only after the loop works.
- **Deliberate constraint:** tight geography + tight service list = deliverable quality + reputation before scale.

---

## 3. Business model
**Managed dispatch. We are the merchant of record.** (Not an open Uber-style broadcast marketplace.)

- We keep a small **vetted "bench"** of plumbers & electricians.
- A lead comes in → **we** triage, quote a **free estimate** → customer approves → **we assign** the best-fit pro (nearby, free, good track record).
- Customer pays **Tap & Toggle** one consolidated bill; we pay the pro their rate/day-wage; **we keep the margin**.
- We own quality, warranty, and the customer relationship end-to-end.

**Why not open broadcast (Uber-style) yet:** needs liquidity (many pros + many jobs) or requests sit unanswered; you can't guarantee who shows up → warranty/trust breaks; pros cherry-pick. Assignment is faster to launch and protects the brand. Revisit broadcast/automation only at high volume.

**Pricing to pro:** start with **fixed margin** (we set the customer price, pay the pro their rate, keep the difference). Optionally move to day-wage + per-job bonus as the managed model matures.

---

## 4. Brand
| Element | Value |
|---|---|
| **Name** | **Tap & Toggle** (tap = plumbing, toggle = electrical switch) |
| **Tagline** | *"Your building's plumber & electrician — one tap away."* |
| **Promise** | Verified local pros · Free estimate before work · Pay after it's fixed · 7-day warranty |
| **Trust badges** | Same-day in NIBM · Upfront pricing · Warranty on work · Vetted & insured · No advance for estimate |
| **Voice** | Warm, neighbourly, no jargon |
| **Colors** | Deep teal (water) + amber (electric) — distinct from Qinbo |
| **Positioning** | "NIBM's own, gate-cleared, warranty-backed" — the *organised* version of the corner handyman, the *accountable* alternative to Urban Company |

> **Note:** never reuse Qinbo's name, logo, text, photos, or reviews — that's their protected brand.

---

## 5. Competitor landscape & differentiation
| Competitor | Their strength | Why we win |
|---|---|---|
| **Urban Company** | Brand, supply, app | Impersonal, tech-hopping, no gate-cleared vetting, surge pricing, no local accountability. We are same vetted face + warranty + gate-cleared. |
| **NoBrokerHood / MyGate** ⚠️ | Already inside societies (gate + services tab) | We are service-**depth** (vetted pros, warranty, emergency priority, human dispatch). Partner with the gate app, don't fight it. |
| **Corner electrician/plumber shop** | Walk-in trust, cheap | No price clarity, no warranty, vanishes, no evenings/emergencies. We're the organised version. |
| **Society's informal handyman** | Known to watchman | No guarantee/backup/records. |
| **Sulekha / Justdial / FB & society WhatsApp groups** | Discovery | A phonebook, not a service — quality roulette, no warranty. |
| **NoBroker Home Services** | City-wide | Not hyperlocal, no gate integration, no personal accountability. |

**Wedge:** we combine **society-gate relationship + warranty accountability + same vetted faces** in a 3 km radius — un-copyable by UC, unavailable from the corner shop.

---

## 6. Actors & roles
| Actor | Interface | Role |
|---|---|---|
| **Customer** (resident) | WhatsApp (P0) + optional PWA (P3) | Requests job, approves estimate, pays, rates, approves gate entry |
| **Pro** (plumber/electrician) | **Pro PWA** (P2) + WhatsApp-bot fallback | Executes jobs, status/ETA, photos, parts capture |
| **Dispatcher / Owner** (you) | **Admin panel** | Triage, estimate, assign, dispatch, settle, quality |
| **Society committee / gate** | Off-app + pre-approved vendor list | Grants access, drives demand, B2B common-area work |

**RBAC:** owner / helper / pro (build in P1).

---

## 7. Core operational loop
```
[Customer] --form / PWA / WhatsApp--> (Lead)
   [You] triage + free estimate  --> Customer approves
   [You] assign to Pro (calendar) --> Pro PWA: On the way (geotag)
        -> smart nudge: customer approves gate entry (Tier A) / pre-approved (Tier B)
        -> Arrived (geofence) -> Work + before/after photos + parts photo
        -> Done + customer OTP  -> consolidated bill (Razorpay) -> Payment captured (webhook)
        -> 7-day warranty logged -> rating ask -> (warranty-expiry reminder later)
```

**Job state machine (design P0/P1, drives both admin calendar and Pro PWA):**
`New → Contacted → Estimated → Approved → Scheduled → Assigned → On the way → Arrived → In Progress → Done → Paid → Warranty → Closed`
plus side-states: `Rescheduled · Cancelled · No-show · Partial`.

---

## 8. Payments
**Decision: Razorpay from the first rupee that moves (P1), UPI-first. Chosen for auto-verified payments, anti-fraud, and hands-off reconciliation.**

- Customer side **UPI-only initially**; enable cards/wallets later with **zero rework**.
- Recommended Razorpay products:
  - **Payment Links / UPI QR** (~0.99%) → doorstep pay-after-job; webhook flips `Job.status = Paid`.
  - **Smart Collect** (1% or ₹10, whichever lower) → virtual UPI-ID per job → **auto-reconciliation**, triggers invoice + warranty clock.
- Pro payouts: direct bank/UPI transfer at launch; **RazorpayX Payouts** is overkill early.
- **Prerequisite:** start **Razorpay merchant onboarding now** (PAN + proprietorship, current bank account, GST helps). ~few days to activate.
- Rates are **public (May-2026)** — **verify current** at razorpay.com/pricing. Confirm **GST + TDS-on-payments** with a CA.

**Schema note:** `Payment` stores `razorpay_payment_id`, `razorpay_order_id`, `status`, `amount_breakup (service/parts/handling/gst)`. The `payment.captured` **webhook is the single source of truth** for "paid."

---

## 9. Parts & billing
- **Pros source parts themselves.** We take no parts markup — only an optional flat **₹20–50 "handling/arrangement fee"** (stated openly, never hidden in a part's price).
- **One consolidated bill to the customer: service + parts-at-actuals + handling.** Everything flows through us as merchant of record — this keeps the relationship ours and prevents a second direct-payment "leak."
- **Warranty split (state plainly):** we warrant **workmanship (7 days)**; **parts carry the pro/manufacturer warranty.**
- Job photos of the part + the bill feed the transparent actuals line.

---

## 10. Communication: WhatsApp strategy
Three tiers — pick the right one to avoid number bans:

| Tier | Use for |
|---|---|
| **Personal WhatsApp** | ❌ never for business (bannable) |
| **WhatsApp Business App** (free) | ✅ **launch tier** — a dedicated business number; manual replies to opt-in booking requests (safe, user-initiated) |
| **WhatsApp Cloud API** (paid) | When we need **automated** messages (auto-estimate, ETA, rating ask, warranty reminders), multi-agent, green tick, or >~100 conversations/day → **P3** |

**Ban risk:** replying to people who contacted us is safe. Bans come from **unsolicited bulk broadcasts** and **unofficial "bulk sender" tools** — avoid those entirely.
**API pricing note:** Meta bills **per template** by category (marketing / utility / service); utility nudges (ETA, warranty) are cheap. Verify current India rates at migration time.
**Number:** placeholder until the dedicated WhatsApp Business number is acquired.
**Privacy (Option B chosen):** the public site uses a request form; we message the customer first. Number is not plastered across the site.

---

## 11. Customer access (WhatsApp + PWA)
- **Two front-ends to the same backend:** WhatsApp (low friction) + optional PWA (installable via QR/link).
- **Sequencing:** **WhatsApp-first (P0–P2)**; **customer PWA is low priority (P3+)** — installed only for repeat customers who want web push + rebook/history.
- **Dedup rule:** the **phone number is the single customer key** — whether a lead comes via WhatsApp or PWA it attaches to **one** Customer record.

---

## 12. Pro PWA
The **operational backbone** (a pro lives in this all day). Build at **P2**.

- **Assigned jobs feed** — Accept / decline-within-window.
- **Day view / calendar** — same data as admin dispatch calendar.
- **One-tap Directions** — Google Maps deep-link + society/gate info.
- **Status push:** `On the way (auto-ETA to customer) → Arrived (geotag) → Working → Done`.
- **Photo proof:** mandatory **before/after** + **parts/bill** photos.
- **Completion OTP/signature** from customer (non-repudiable acceptance).
- **In-job chat with dispatcher** — single source of truth (not scattered WhatsApp).
- **Availability / leave toggle** — feeds capacity.
- **Earnings view** — payout transparency.
- **WhatsApp-bot fallback** for the critical taps (accept/on-the-way/done) for pros who won't install.
- **UX:** dead-simple, big buttons, Marathi/Hindi-friendly, minimal typing (mostly photos/taps).

**Value unlocked:** trust & proof (warranty/liability evidence) · less manual relay · accurate parts billing · objective quality data · quietly fights leakage (pro's jobs/tools/comms live in our system).

---

## 13. GPS / location policy
**Decision: job-scoped, transparent location — NOT continuous 24/7 surveillance.**

- Reality: a **PWA cannot reliably do background/live GPS** (esp. iOS); it also can't cleanly detect "GPS off."
- What we build instead:
  - Location captured **only from `On the way` to `Done`** (with a visible indicator to the pro → consent/fairness).
  - **Event geotags** + **arrival geofence** (auto-confirms arrival; powers auto-ETA — a feature *for* the pro, not just us).
  - **Staleness flag:** "no update during an active job beyond window → ⚑ alert." Same practical outcome as detecting GPS-off, but reliable.
- **Continuous live-map** = deferred to an **optional native Android companion app** (opt-in consent) later.
- Rationale for not going always-on: pro churn (battery/trust), DPDP proportionality/consent risk.

---

## 14. Gate-entry workflow
**The killer convenience** (removes the gate friction random handymen cause). **No public APIs exist for MyGate/NoBrokerHood** — so we orchestrate the human steps, not the app.

- **Tier A — smart "pro incoming" nudge (any society):** when pro taps `On the way`, fire a WhatsApp/PWA message with **pro photo + name + vehicle + service + ETA** and a "please approve in MyGate / share with watchman" prompt + a ✅ "I've approved" button back into our flow.
- **Tier B — pre-approved vendor list (partner societies — the real win):** register vetted pros on the gate's "household staff / pre-approved vendor" list during society onboarding → **no per-visit approval**; the nudge becomes "no action needed."
- **Edge-cases:** no gate app → "share with watchman"; lead-time → nudge fires at `On the way`; late/no-show → staleness-flag nudge both sides.
- Phase: **P2** (with `On the way`/`Arrived`/ETA).

---

## 15. Pro ratings & quality
- After each done job → auto WhatsApp "Rate your pro ⭐1–5 + optional note."
- **Pro Health score** = avg rating − no-show penalty − warranty-revisit penalty.
- Track per pro: jobs, on-time %, arrival geotags, no-shows, revisits, repeat bookings.
- Operate the bench: top scorers get first pick; low scorers watched; 2 bad jobs / a no-show → benched.
- Start manual in admin panel; automate collection at scale. Phase: **P3**.

---

## 16. Housing society go-to-market
Committees buy **zero-risk, zero-effort, some benefit** — sell to that.

| Their worry | Our answer |
|---|---|
| Who is this outsider? | Vetted, ID-checked pros on a **pre-approved gate list** |
| If something breaks, I'm blamed | Single accountable point + 7-day warranty + (later) insurance |
| Emergency at night? | Priority-response promise |
| What's in it for us? | **Corpus contribution** per job + free common-area repairs |
| Cost/effort? | Zero — we run it; we even print lift posters (with consent) |

**Playbook:** 1) land one **anchor society** via a friendly resident/committee member → 2) run a **free weekend "Repair Camp"** → 3) hand the gate a **pre-approved vendor list** → 4) **QR posters in lifts/lobby** → 5) formalise a light **MoU** (recommended partner, corpus cut, N free community jobs/quarter) → 6) upsell **B2B common-area work** (pumps, generator, clubhouse).
**Objection:** "we have an exclusive FM vendor" → become their subcontractor, or wedge into **resident in-flat jobs** (which FM contracts usually exclude).

---

## 17. Disintermediation (leak) defense
We **make staying worth more than leaving**, not policing. Strongest first:
- **A. Managed/employed model** — we pay the pro; no direct money relationship between pro & resident.
- **B. Gate is the moat** — freelancing pros can't walk into the societies we've cleared.
- **C. Warranty & accountability only exist on our ticket.**
- **D. We are the merchant of record** — customer pays us, one bill.
- **E. Out-convenience direct** — one-tap rebook, known price, backup pros.
- **F. Signed non-solicit clause** in the pro agreement.
> Treat leakage as a small *tax*, made tolerable by A + B + C.

---

## 18. Legal, compliance, liability & insurance
⚠️ **A disclaimer alone will not protect us.** Because we market "we vet & warranty the pros," we assume a duty of care — an absolute "not responsible for the pro" is largely unenforceable and contradicts the brand. Use a **layered shield**:

| Layer | Detail |
|---|---|
| **DPDP Act 2023** | Explicit **opt-in consent** to be contacted + stated purpose **before** collecting name/phone/flat; privacy policy + retention; home job-photos labelled "work proof only." **Launch blocker.** |
| **Fair Terms** | Realistic **limitation of liability** (cap at job value for indirect loss) + complaint SOP. Not an absolute disclaimer. |
| **Pro agreement** | **Indemnity** for theft/damage/misconduct + **non-solicit**; collect ID, address, deposit/guarantor. |
| **Documented verification** | Aadhaar/police verification per pro → also feeds the gate list; proves reasonable care. |
| **Insurance** | See timing below. |
| **Tax** | **GST** as merchant of record (incl. handling-fee margin); possible **TDS on pro payments** — confirm with a CA. |

**Insurance timing (locked):** **DEFER** the full platform policy (Public & Products Liability + Professional Indemnity + theft/fidelity) **until the scale gate** — first society MoU demanding proof of cover, multiple jobs/day, or higher-risk electrical work. But **not uninsured from job #1**, so from launch require:
1. **Each pro carries basic personal-accident cover** (~₹1–2k/yr, documented at onboarding) — transfers the worst injury/death risk cheaply.
2. Optional **one-tap ₹15–20 per-assignment job insurance** once volume grows but before the annual policy pencils.
3. **Pro indemnity agreement + verification docs** from day one (free; "reasonable care" evidence).

**Market as "carefully vetted & insured"** once the platform policy is active — a society-pitch closing weapon.

---

## 19. Product: components, tech stack & data model

### 19.1 Tech stack
| Layer | Choice |
|---|---|
| Web (site + admin + PWAs) | **Next.js (React) + Tailwind**; PWA via `next-pwa` |
| DB / Auth / storage / realtime | **Supabase** (Postgres + RLS + photo storage + realtime calendar) |
| Notifications | **WhatsApp Business App** (P0) → **Meta Cloud API** (P3); web push for PWA |
| Payments | **Razorpay** (Payment Links/UPI QR + Smart Collect; `payment.captured` webhook) |
| Maps / location | Google Maps deep-links; **native Android companion** (later, live tracking) |
| Hosting | **Vercel** |

### 19.2 Entity / data model (design P0/P1 knowing the whole thing)
```
Customer   id, phone(UNIQUE key), name, flat_no, society_id, whatsapp_opt_in, created_at
Society    id, name, area, contact, hasMoU?, corpus_share_pct, pre_approved?
Job        id, customer_id, service(plumb|elec), description, photo_req, status(state machine),
           requested_slot, scheduled_start, scheduled_end, pro_id?, estimate_amount,
           final_amount, parts_amount, handling_fee, created_at
Pro        id, name, phone, service, photo, vetting_docs_ref, gate_list_status,
           base_rate, day_wage_model?, active, health_score, personal_accident_doc?
StatusEvent job_id, status, actor, ts, note            -- full audit trail
GeoPing    job_id, ts, lat, lng, kind(onway|arrived|done)   -- job-scoped only
Photo      job_id, kind(before|after|part|bill), url, ts
Part       job_id, description, actual_cost, handling_fee, photo_ref
Payment    job_id, razorpay_order_id, razorpay_payment_id, method, amount,
           amount_breakup(service/parts/handling/gst), status, invoice_no,
           settled_to_pro_amount, settled_at
Warranty   job_id, period_days(7), expires_at, revisit_jobs[]
Rating     job_id, pro_id, stars(1-5), note, ts
GateEntry  job_id, tier(A|B), nudge_sent_at, approved_at, approved_by, method
Notification job_id, channel(wa|push), template, kind(utility|marketing), ts, status
ConsentRecord customer_id, purpose, ts, text_version   -- DPDP proof
```
**Key rules:** `Customer.phone` = dedupe key; `Job.status` drives both admin calendar and Pro PWA; `payment.captured` webhook is the only way `Job.status` becomes `Paid`.

---

## 20. Decision Log
| # | Topic | Decision |
|---|---|---|
| 1 | Name | **Tap & Toggle** |
| 2 | Area | **NIBM / Nyati / Sus / Phase 1–2** |
| 3 | Services | **Plumbing + Electrical** only at launch |
| 4 | Model | **Managed dispatch**; we are merchant of record |
| 5 | Number privacy | **Option B** — request form, we message first |
| 6 | Comms | WhatsApp Business App now → Cloud API at P3 |
| 7 | Customer interface | WhatsApp-first; PWA low priority (P3+) |
| 8 | Pro interface | **Pro PWA** (P2) + WhatsApp-bot fallback |
| 9 | Location | Job-window + arrival geofence + staleness flag; live-map via optional native Android |
| 10 | Gate | Two-tier nudge + pre-approved vendor list |
| 11 | Parts | Pro-sourced; consolidated bill at actuals + ₹20–50 handling |
| 12 | Payments | **Razorpay from launch**, UPI-first, webhook as source of truth |
| 13 | Liability | Layered shield (fair Terms + pro indemnity + verification + SOP); **not** an absolute disclaimer |
| 14 | Insurance | Pro personal-accident from job #1; full platform policy deferred to scale/MoU gate |
| 15 | Customer dedupe | Phone number = single customer key |
| 16 | Phasing | P0 → P1 → P2 → P3 (thin vertical slice) |
| 17 | Scope expansion | **Phase P0 + P1** built together as complete commercial launch suite before live deployment |

---

## 21. Phased roadmap
| Phase | Ships | Proves |
|---|---|---|
| **P0** | Public site (brand + rate card w/ images + **DPDP-compliant request form**) → writes `Job` row to Supabase; WhatsApp number **placeholder** | Are we getting leads? |
| **P1** | **Admin panel**: job queue + state machine, customer & pro directories, assign (dispatch via WhatsApp bot); RBAC; **Razorpay live** (first payments) | Can we fulfil without chaos? |
| **P2** | **Pro PWA** (execution, photos, parts, OTP, on-the-way/arrived, gate nudge) + **color-coded scheduling calendar** + consolidated **UPI/GST invoice** + pro settlement ledger + staleness flag | Can we get tidy & profitable? |
| **P3** | Ratings/scorecard, **Cloud-API notifications** (auto-ETA, rating, warranty reminders), analytics/unit-economics, per-society corpus tracking, optional customer PWA, **full platform insurance** | Can we grow past one area? |

**Guiding principle:** ship a thin slice that runs the *whole loop* manually; automate the biggest pain points next. Don't build the entire blueprint at once.

---

## 22. Pre-launch action checklist
1. **Onboard pro bench** — 2–3 plumbers + 2–3 electricians; collect **ID + verification docs + each pro's personal-accident cover + signed indemnity/non-solicit**. *(True #1 dependency.)*
2. **Open Razorpay merchant account** — start KYC now.
3. **DPDP consent + privacy policy** (form-level launch blocker) + **fair Terms** + **CA check (GST/TDS)**.
4. **Lock the rate card** with the new pros.
5. **Brand assets** — logo (deep-teal + amber), dedicated **WhatsApp Business number** (placeholder till then), lift-poster QR.
6. *(Post-scale trigger)* **Full platform liability insurance.**

---

## 23. Rate card (to validate)
> Hybrid display: fixed prices for **standard visitable jobs**; **"free estimate · visit ₹199 (waived if you book)"** for variable jobs. **Numbers below are Pune placeholders — confirm with the bench.**

**🔧 Plumbing** — leaking tap ₹150 · tap replacement ₹250 · wash-basin/fitting ₹250 · blocked drain ₹400 · geyser/RO piping ₹—(estimate) · flush cistern ₹200 · motor/pump ₹—(estimate).
**💡 Electrical** — switch/socket ₹120 · board fault ₹250 · MCB trip ₹150 · fan fitting ₹200 · light/point ₹150 · wiring repair ₹—(estimate) · inverter point ₹—(estimate).
**Every job:** visit/inspection charge adjusted into the final bill (stops tire-kickers, pays the trip). Parts at actuals + ₹20–50 handling.

---

## 24. Open questions / unit economics
- **Jobs/day per pro to break even** — build a simple unit-economics calculator (jobs/pro/day, margin/job, CAC per society, LTV).
- **Capacity/liquidity** — when to onboard the next pro; when to enter the next area.
- **Complaints/refunds/damage** SOP + insurance product selection (at scale gate).
- **Long-term:** do we want a customer app at all, or is WhatsApp + optional PWA enough forever?
- **Legal review:** have a lawyer sanity-check the Terms + pro agreement before first society MoU.

---

*End of master blueprint. Update this document whenever a locked decision changes.*
