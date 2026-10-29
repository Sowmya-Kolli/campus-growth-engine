# Campus Growth Engine — NxtWave Growth Intern Challenge

> **Campaign Goal:** Acquire 500 unique final-year engineering student registrations for the free 60-minute workshop: *"Build Your First AI Project in 60 Minutes"*.
> **Design Fidelity:** Exact recreation of the Google Stitch designs with full functional logic, persistent storage, and real referral attribution.

---

## 🌟 The Complete Growth Mechanism

Rather than a static registration page or disconnected analytics, **Campus Growth Engine** creates an end-to-end viral loop:

```
[1. Project Matcher]
Student selects branch, interest & coding experience
       │
       ▼
[2. Personalized Blueprint Recommendation]
Generates portfolio-grade AI blueprint with 3 milestones
       │
       ▼
[3. Frictionless Registration]
Duplicate email prevention + persistent database storage
       │
       ▼
[4. Registration Success & Squad Multiplier]
Ticket confirmation + unique referral link + 1-click share
       │
       ▼
[5. Real-Time Campaign Console]
Track RSVPs, 7-day velocity, viral K-factor, CAC & automated next actions
```

---

## 📱 Three Completed Screens (Pixel-Accurate to Stitch)

### Screen 1: Project Matcher & Registration Dock (`/`)
*Reference: `design-references/01-project-matcher/`*
- **Interactive 3-Step Matcher**:
  - Academic Branch (CSE, IT, AI/ML, ECE, Other)
  - Project Target (Smart Chatbot, Resume & Career Tools, Study Assistant, Data Dashboard)
  - Coding Experience (Beginner, Basic C/Java, Intermediate)
- **Live Matched Blueprint Preview**:
  - Feasibility badge (98%), dynamic title, tech stack tags, and 3-phase live workshop sprint architecture.
  - "Why this is high-impact for your portfolio" badge.
- **Registration Form**:
  - Validated fields: Name, College Email, College/University, Branch, and Referral Code.
  - Automatic attribution from URL query parameters (e.g. `?ref=CAMPUS-AI-829` or student referral codes).
  - Server-side email normalization (`toLowerCase().trim()`) and duplicate detection with friendly conflict notice.

### Screen 2: Registration Confirmation & Referral Engine (`/blueprint`)
*Reference: `design-references/02-registration-success/`*
- **Confirmed Registration Ticket Banner**:
  - Ticket ID (e.g. `#NX-94218`), workshop schedule, and recipient confirmation email.
  - "Add to Google Calendar" link and downloadable `.ICS` calendar invite.
- **Personalized Blueprint & 60-Min Milestones**:
  - Step-by-step breakdown (00-20 Mins, 20-45 Mins, 45-60 Mins).
  - Target tech stack chips (Python 3.11, Gemini 1.5 Flash, Streamlit Cloud).
  - "Download Blueprint PDF" (one-click browser print view).
- **Study Squad Multiplier**:
  - Personalized student share preview card with student initials, name, and college.
  - Unique referral link with one-click copy button and toast feedback.
  - One-click share to WhatsApp, LinkedIn, Telegram, and Web Share API.
  - Live peer progress tracker (`X / 3 Friends Invited`) showing actual registered referrals.

### Screen 3: Organizer Dashboard & Campaign Operations (`/dashboard`)
*Reference: `design-references/03-organizer-dashboard/`*
- **5 KPI Metric Cards**:
  1. *Unique Regs*: Real-time count towards 500 target with percentage bar.
  2. *Regs Today*: Velocity comparison (+18% vs yesterday).
  3. *Remaining to Goal*: Count needed and days left.
  4. *Budget Spent*: ₹1,240 of ₹2,000 budget, ₹CAC per unique registration.
  5. *Referral Rate*: 28.6% viral link share rate with 1.4x K-factor.
- **Automated Campaign Recommendation Panel**:
  - Rule-based dynamic intelligence (e.g. Channel Saturation & Ambassador Activation) with one-click blitz trigger.
- **Visual Analytics**:
  - 7-Day Registration Velocity SVG chart comparing direct vs referral growth.
  - Acquisition source breakdown bars (WhatsApp, Ambassadors, Social, Direct).
  - Ambassador leaderboard ranking top advocates with college, shares, and verified registrations.
  - Department penetration distribution (CSE, AI/ML, IT, ECE, Other).
- **Live Registration Feed & Search**:
  - Searchable audit log of student registrations.
  - **Export CSV**: One-click download of all verified student records.
- **Demo Mode Toggle**:
  - Top scrim toggle to switch between *Demo Baseline* (prototype simulation) and *Live Genuine Only* mode (strictly genuine registrations).

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with the exact Stitch design token system (Plus Jakarta Sans, exact colors: `#006948`, `#86f2e4`, `#006a61`, `#faf8ff`)
- **Backend & Database:**
  - **Dual-mode persistent storage**:
    - **Local JSON persistence (`data/registrations.json`)**: Works 100% out-of-the-box with zero setup, persisting all submissions and referrals across restarts.
    - **Supabase Integration**: Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` to sync with a PostgreSQL database. Schema provided in `supabase/schema.sql`.
- **API Endpoints**:
  - `POST /api/register` — Validates input, prevents duplicate emails, attributes referral source, generates referral codes.
  - `GET /api/stats` — Returns aggregated analytics, velocity, and rule-based recommendations.
  - `GET /api/registration/[id]` — Retrieves student confirmation and referral count.
  - `GET /api/export-csv` — Downloads all registrations as a formatted CSV file.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Routes:
- `/` — Student Project Matcher & Registration Form
- `/blueprint` — Student Confirmation & Referral Hub
- `/dashboard` — Organizer Campaign Console

---

## 📦 Deployment

The project is ready for one-click deployment to **Vercel**:
1. Push this repository to GitHub.
2. Import project in Vercel.
3. Build command: `npm run build`
4. Output directory: `.next`
