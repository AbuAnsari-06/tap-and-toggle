# Project rules: Tap & Toggle

## Source of truth
- Read BLUEPRINT.md before planning any task.
- If a request conflicts with BLUEPRINT.md, stop and ask me. Don't decide silently.
- If a decision changes, update the Decision Log in BLUEPRINT.md first.

## Current scope
- We are building Phase P0 + Phase P1 (blueprint section 21 and Decision #17).
- Do not create P2/P3 features, tables, routes or placeholder code.
- If something is ambiguous or undefined in the blueprint, list it as a
  question in your plan. Do not invent an answer.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres) with RLS enabled on every table
- Deploy target: Vercel

## Non-negotiables
- Never commit secrets. Use .env.local and keep it in .gitignore.
- The service-role key is never used in client code.
- The request form cannot submit without the DPDP consent checkbox ticked.
  Store consent text version + timestamp in ConsentRecord.
- Customer.phone is the unique dedupe key.
- Do not use the word "insured" in any user-facing copy (insurance is deferred).
- Rate card prices live in one config file and are marked as placeholders.
- WhatsApp number is a single config constant (placeholder for now).

## Brand
- Deep teal + amber. Warm, neighbourly, no jargon.

## Working style
- Show a plan first and wait for my approval.
- Keep each task small: one feature, one commit.
- After finishing, tell me what you did NOT do and any assumptions you made.