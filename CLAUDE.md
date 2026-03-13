# CLAUDE.md — Mumtaz Health Project

> This file gives Claude instant, persistent context about the Mumtaz Health project.
> Read this first. Every session. No exceptions.

---

## 🌿 What This App Is

**Mumtaz Health** is a holistic women's wellness web app built by Mumtaz — an Ayurvedic Practitioner, International Yoga Teacher Trainer, and specialist in transformational healing with 30+ years of lived and professional expertise. This is not a generic wellness app. It is deeply personal, trauma-informed, non-judgmental, and designed to evolve with each woman through every phase of her life.

**The guiding philosophy:** Every woman's journey is unique. No pressure. No comparison. Just gentle, expert guidance.

---

## 👤 Who We Are Building For

**The founder:** Mumtaz (mumtazhaque07@gmail.com) — the app represents her life's work and expertise. She is not a developer. All technical decisions should be communicated in plain, clear language.

**The users:** Women navigating:
- Regular menstrual cycles / hormonal shifts
- Perimenopause / Menopause / Post-menopause
- Pregnancy / Postpartum / Post-birth recovery
- Chronic conditions (arthritis, PCOS, endometriosis, pelvic floor issues, cancer support)
- Mental wellbeing and emotional health
- Ayurvedic body types (Dosha-based guidance)

---

## 🏗️ Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Shadcn/ui (Radix UI primitives) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| State / Data | TanStack React Query |
| Forms | React Hook Form + Zod validation |
| Charts | Recharts |
| Routing | React Router DOM v6 |
| Package manager | npm (also has bun.lockb) |
| Build tool | Vite 5.x |

**Supabase Project:** `dhtmqelsqgmuyeohcnqf.supabase.co`
**Env file:** `.env` at project root (contains Supabase URL + publishable key)

---

## 📁 Project Structure

```
mumtazhealth-main/
├── public/                    # Static assets (favicon, icon, sw.js)
├── src/
│   ├── assets/                # Images (yoga poses, founder portrait, brand)
│   │   └── poses/             # 25+ yoga pose images (JPEG)
│   ├── components/            # 60+ reusable components
│   │   ├── ui/                # Shadcn/ui base components (DO NOT edit directly)
│   │   ├── journey/           # Pregnancy/postpartum journey components
│   │   └── SupportPlan/       # Support plan modal + recommendations
│   ├── constants/             # App messaging constants
│   ├── contexts/              # LoadingContext
│   ├── hooks/                 # Custom hooks (loading, mobile, pregnancy safe mode)
│   ├── integrations/supabase/ # Auto-generated Supabase client + types
│   ├── lib/                   # utils.ts, validation.ts
│   ├── pages/                 # 15 top-level pages (see below)
│   └── utils/                 # Push notifications utility
├── supabase/                  # Supabase migrations / config
├── .env                       # Environment variables (Supabase credentials)
├── CLAUDE.md                  # ← You are here
├── ROADMAP.md                 # Bugs, features, and priorities
├── package.json
└── vite.config.ts
```

---

## 📄 Pages (15 Total)

| Route | File | Description |
|-------|------|-------------|
| `/` | `Index.tsx` | Landing page + authenticated dashboard |
| `/auth` | `Auth.tsx` | Login / Sign up |
| `/reset-password` | `ResetPassword.tsx` | Password reset flow |
| `/onboarding` | `Onboarding.tsx` | User onboarding (dosha, life stage, goals) |
| `/tracker` | `Tracker.tsx` | Daily wellness check-in |
| `/condition-tracker` | `ConditionTracker.tsx` | Chronic condition symptom tracking |
| `/hormonal-transition` | `HormonalTransitionTracker.tsx` | Hormonal phase tracking |
| `/my-daily-practice` | `MyDailyPractice.tsx` | Daily Ayurvedic / yoga practices |
| `/content` or `/content-library` | `ContentLibrary.tsx` | Yoga, nutrition, Ayurveda content |
| `/insights` | `Insights.tsx` | Analytics and wellness trends |
| `/summary` | `MonthlySummary.tsx` | Monthly wellness summary |
| `/bookings` | `Bookings.tsx` | Session / appointment booking |
| `/settings` | `Settings.tsx` | User account settings |
| `/admin` | `Admin.tsx` | Admin panel (Mumtaz only) |
| `*` | `NotFound.tsx` | 404 page |

---

## 🗄️ Key Database Tables (Supabase)

- `profiles` — username, user metadata
- `user_wellness_profiles` — life_stage, primary_dosha, secondary_dosha, onboarding_completed, pregnancy_status, spiritual_preference, primary_focus[], life_phases[]
- `wellness_entries` — daily check-ins (entry_date, emotional_score, emotional_state, pain_level, cycle_phase, daily_practices)
- *(Additional tables TBC — check `src/integrations/supabase/types.ts` for full schema)*

---

## 🔑 Key Components to Know

| Component | Purpose |
|-----------|---------|
| `Navigation.tsx` | Main app navigation bar |
| `HomeNavigation.tsx` | Home page nav |
| `MumtazWisdomGuide.tsx` | AI/wisdom guide overlay (global) |
| `QuickCheckIn.tsx` | Fast daily wellness check-in widget |
| `PoseOfTheDay.tsx` | Daily yoga pose feature |
| `DoshaAssessment.tsx` | Ayurvedic body type quiz |
| `OnboardingTour.tsx` | First-time user tour |
| `ErrorBoundary.tsx` | Global error catching |
| `RouteErrorBoundary.tsx` | Per-route error catching |
| `WelcomeEntryDialog.tsx` | New user entry modal |

---

## 🚀 Running the App Locally

```bash
# Navigate to project
cd ~/Desktop/Claude/mumtazhealth-main

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# App runs at:
http://localhost:8080
```

---

## ⚠️ Important Rules for Claude

1. **Mumtaz is not a developer** — always explain technical changes in plain English alongside any code
2. **Preserve the brand voice** — warm, non-judgmental, empowering, gentle. Never add clinical or cold language
3. **The ui/ folder is Shadcn components** — avoid editing these directly unless absolutely necessary
4. **Always check ROADMAP.md** at the start of each session for current priorities
5. **Test changes mentally** before implementing — this app serves vulnerable users
6. **Supabase types are auto-generated** — if schema changes, regenerate types
7. **The app is mobile-first** — always consider mobile layout for any UI changes
8. **Commits go to GitHub** — `git add`, `git commit`, `git push` when changes are done and approved
9. **GitHub repo:** `https://github.com/mumtazhaque07-art/mumtazhealth`

---

## 📋 Current Session Context (Updated: 7 March 2026 — IWD Eve)

### ✅ All Work Completed To Date

#### Previous Sessions (before 7 March 2026)
- **React hooks bug fixed** — `MumtazWisdomGuide.tsx` hooks order crash resolved
- **Smooth page transitions** — `PageTransition.tsx` created with fade-in, applied to all routes in `App.tsx`
- **SupportPlan.tsx created** — Was missing, causing Tracker page crash. Fixed.
- **New Google users → onboarding** — `Index.tsx` auto-redirects new users with no onboarding completed
- **Chatbot greeting fixed** — `mumtaz-wisdom-guide` Edge Function uses inclusive greetings only
- **Navigation fully built** — Full responsive nav with all pages linked
- **Auth URL hardcoding fixed** — No longer breaks on custom domain

#### 7 March 2026 Session (Today)
- **Credibility landing page** — `Auth.tsx` completely redesigned as split-layout landing page. Left panel: OM Yoga Magazine press badge, Google 5-star review badge (School of Mumtaz Yoga), rotating testimonials (4 real student quotes, auto-rotates every 6s), credentials strip (1,000+ Hours / Yoga Alliance / Since 2011 / OM Magazine)
- **Settings security hardened** — `AccountSettings.tsx`: password change now requires re-authentication with current password first; "Sign Out All Devices" now has two-step confirmation dialog
- **PWA install prompt live** — Created `public/manifest.json`, upgraded `public/sw.js` (install/activate/fetch handlers), updated `index.html` with PWA meta tags. "Add Mumtaz Health to your home screen" banner confirmed working.
- **Database security confirmed** — Supabase RLS audit: all 21 tables have Row Level Security enabled. Zero issues found.
- **Image lazy loading** — Confirmed all ContentLibrary images already had `loading="lazy"`. No changes needed.
- **Google sign-in removed** — Hidden from Auth.tsx after discovering OAuth provider not configured in Supabase. Needs setup before restoring (instructions below).

### ⏳ Pending — To Do Next Session

#### 🔴 Immediate (Phase 1 completion)
- **Push today's changes to GitHub** — Run `git add . && git commit -m "Phase 1: credibility landing, PWA, settings security, RLS confirmed" && git push origin main` in Terminal on your Mac
- **Set up Google Sign In** — Step-by-step instructions below
- **Custom domain** — Register mumtazhealth.com, deploy via Vercel from GitHub
- **Test with 5 real women** — Share the app and gather feedback

#### 🟡 Phase 2 (Revenue & Core Experience)
- **Stripe subscription integration** — Free vs premium tier payments
- **Define pricing tiers** — Mumtaz to decide which features are free vs paid
- **Connect AI Wisdom Guide to real Claude API** — Edge function deployed, needs wiring
- **Content CMS** — Manage content from Supabase admin panel
- **Community forum** — Circle integration or similar
- **Insights trend charts** — Improve analytics visualisations

#### Podcast
- **Episode 1 launches tomorrow (IWD 8 March)** — Script ready
- **Run Instagram growth strategy** — See `Claude/Podcast/Instagram_GrowthStrategy_IWD2026.html`
- **Episodes 2-4** — Plans ready in `WellbeingJourney_Episode_Plan.docx`

### 🔧 Google Sign In — Setup Required (Your Action)
The button code is ready but hidden. Two steps to activate:

**Step 1 — Google Cloud Console:**
1. Go to: https://console.cloud.google.com
2. Create or select a project → "APIs & Services" → "Credentials"
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Application type: Web Application
5. Add Authorised redirect URI: `https://lwcrkrrigwdvdjxefvfu.supabase.co/auth/v1/callback`
6. Save → Copy the **Client ID** and **Client Secret**

**Step 2 — Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/lwcrkrrigwdvdjxefvfu/auth/providers
2. Find "Google" → Toggle it ON
3. Paste in your Client ID and Client Secret → Save

Then in `src/pages/Auth.tsx`, find `{/* Google sign-in hidden until OAuth is configured in Supabase */}` and uncomment the button block.

---

*Last updated: 7 March 2026 — Session: Credibility landing page + PWA + settings security + RLS audit*
