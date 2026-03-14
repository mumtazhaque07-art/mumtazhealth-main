# ROADMAP.md — Mumtaz Health

> Claude reads this every session. Update this file as work progresses.
> Priorities are listed top-down. Work the top item first.

---

## 🟡 CURRENT PRIORITY: Phase 1 Complete — Move to Deployment & Phase 2

Full strategic audit completed February 2026. See: `MumtazHealth_Strategic_Audit_2026.docx` in the Claude folder.
Phase 1 stabilisation work **complete as of 7 March 2026.**

**Objective:** Deploy to a real URL, then begin Phase 2 — revenue and core experience.

---

## 🐛 Known Bugs (from Audit)

| # | Bug Description | File | Priority | Status |
|---|----------------|------|----------|--------|
| 1 | Hardcoded production URL in auth | `src/pages/Auth.tsx` | 🔴 CRITICAL | ✅ Fixed |
| 2 | Navigation.tsx has NO nav links — users can't navigate | `src/components/Navigation.tsx` | 🔴 CRITICAL | ✅ Fixed |
| 3 | ContentLibrary.tsx imports 30+ images at bundle time — slow load | `src/pages/ContentLibrary.tsx` | 🔴 CRITICAL | ✅ Fixed (lazy loading confirmed) |
| 4 | Settings.tsx password change with no auth check | `src/components/AccountSettings.tsx` | 🟡 HIGH | ✅ Fixed (re-auth required) |
| 5 | MumtazWisdomGuide not connected to real AI | `src/components/MumtazWisdomGuide.tsx` | 🟡 HIGH | ⏳ Phase 2 |
| 6 | No PWA install prompt despite service worker existing | `public/sw.js` + `public/manifest.json` | 🟡 HIGH | ✅ Fixed |
| 7 | Supabase RLS policies not confirmed secure | Supabase dashboard | 🔴 CRITICAL | ✅ Confirmed (21/21 tables secured) |

---

## ✨ Features to Build (Phased Workplan)

### Phase 1 — Stabilise & Launch-Ready ✅ COMPLETE (7 March 2026)
| # | Feature | Description | Priority | Status |
|---|---------|-------------|----------|--------|
| 1 | Fix auth URL | Replace hardcoded URL with env var | 🔴 CRITICAL | ✅ Done |
| 2 | Navigation menu | Build full responsive nav with all page links | 🔴 CRITICAL | ✅ Done |
| 3 | Fix image loading | Lazy load yoga pose images in ContentLibrary | 🔴 CRITICAL | ✅ Done |
| 4 | Settings security | Re-auth before password change + sign-out confirmation | 🟡 HIGH | ✅ Done |
| 5 | PWA install prompt | Surface "Add to Home Screen" for mobile users | 🟡 HIGH | ✅ Done |
| 6 | Credibility landing page | Testimonials, press badges, credentials on Auth.tsx | 🟡 HIGH | ✅ Done |
| 7 | RLS security audit | Confirm all Supabase tables are secured | 🔴 CRITICAL | ✅ Done |
| 8 | Custom domain | Set up mumtazhealth.app — Vercel deployment from GitHub | 🔴 CRITICAL | ✅ Done |
| 9 | Google Sign In | Configure OAuth in Supabase + Google Cloud Console | 🟡 HIGH | ✅ Done |

### Phase 2 — Revenue & Core Experience (Weeks 4–12)
| # | Feature | Description | Priority | Status |
|---|---------|-------------|----------|--------|
| 1 | Connect AI to MumtazWisdomGuide | Supabase Edge Function → Claude API | 🔴 CRITICAL | Open |
| 2 | Stripe subscription integration | Free vs. premium tier payments | 🔴 CRITICAL | Open |
| 3 | Define pricing tiers | Mumtaz to decide free vs. paid features | 🟡 HIGH | Mumtaz action |
| 4 | Community forum (Phase 1) | Simple moderated forum or Circle integration | 🟡 HIGH | Open |
| 5 | Wellness data export | PDF/CSV export from Insights page | 🟡 HIGH | Open |
| 6 | Insights trend charts | Improve analytics visualisations | 🟡 HIGH | Open |
| 7 | Social sharing — milestone cards | Share wellness achievements externally | 🟠 MED | Open |
| 8 | Content CMS | Manage content from Supabase admin panel | 🟡 HIGH | Open |

### Phase 3 — Growth & Differentiation (Months 3–6)
| # | Feature | Description | Priority | Status |
|---|---------|-------------|----------|--------|
| 1 | Mobile app (PWA or React Native) | iOS/Android presence | 🔴 CRITICAL | Open |
| 2 | Apple Health / Google Fit integration | Wearable data in wellness tracking | 🟡 HIGH | Open |
| 3 | Islamic wellness content depth | Deeper Quran/hadith integration with Mumtaz | 🔴 CRITICAL | Mumtaz action |
| 4 | Dosha-personalised meal planning | New Nutrition page | 🟡 HIGH | Open |
| 5 | Referral programme | Organic growth loop | 🟡 HIGH | Open |
| 6 | Push notification campaigns | Re-engagement + habit building | 🟡 HIGH | Open |
| 7 | Localisation — Arabic, Urdu | Serve Muslim women in native languages | 🔴 CRITICAL | Open |
| 8 | Telehealth booking extension | Expand Bookings page | 🟡 HIGH | Open |

### Phase 4 — Scale & Ecosystem (Months 6–12)
| # | Feature | Description | Priority | Status |
|---|---------|-------------|----------|--------|
| 1 | Corporate wellness B2B | Sell to employers as employee benefit | 🔴 CRITICAL | Mumtaz action |
| 2 | Practitioner network | Refer users to vetted Ayurvedic/Islamic wellness experts | 🟡 HIGH | Open |
| 3 | Anonymised research programme | Partner with universities/health orgs | 🟡 HIGH | Open |
| 4 | App Store (iOS) submission | Apple Developer Account + submission | 🔴 CRITICAL | Both |
| 5 | Google Play submission | Google Developer Account + submission | 🔴 CRITICAL | Both |
| 6 | In-app courses & programmes | Digital learning within the app | 🔴 CRITICAL | Both |
| 7 | Content partnerships | Mosques, yoga studios, Ayurvedic centres | 🟡 HIGH | Mumtaz action |

---

## 🚀 Deployment Goals

- [x] Custom domain: mumtazhealth.app
- [x] Hosting provider: Vercel
- [ ] App Store (iOS): Phase 4
- [ ] Google Play (Android): Phase 4

---

## 📊 Supabase / Backend Tasks

- [x] Fix hardcoded auth URL in Auth.tsx
- [x] Confirm all RLS policies are secure
- [x] Set up Supabase Storage buckets (profile photos, pose images)
- [x] Set email templates for auth (confirm, reset password)
- [x] Add VITE_APP_URL environment variable
- [ ] Connect MumtazWisdomGuide to AI via Edge Function

---

## 🎨 Design & Branding

- [ ] Brand colours: Review and confirm (current: teal/sage palette)
- [ ] Typography: Review and confirm
- [ ] Logo: Confirm final version for all platforms
- [ ] App icon: Design for iOS/Android

---

## 🏆 Strategic Notes (from February 2026 Audit)

**Positioning:** The app occupies a globally uncontested niche — Ayurvedic + Islamic women's wellness. 1 billion Muslim women globally have zero dedicated apps. This is the competitive moat.

**Top Competitors:** Flo (380M downloads), Clue (12M), Balance (menopause), Natural Cycles, Down Dog, Caria.

**Market Size:** $5.76B (2025) → $39.37B (2034) at 17-20% CAGR.

**Biggest Strengths:** MumtazWisdomGuide AI, Islamic spiritual tracking, Dosha integration, multi-life-stage architecture, rich database schema.

**Biggest Gaps:** No navigation menu, no payment system, no real AI connected, no community features, image loading performance.

---

## ✅ Completed Work

| Date | What Was Done |
|------|--------------|
| Feb 2026 | Project setup — CLAUDE.md and ROADMAP.md created |
| Feb 2026 | App running locally at http://localhost:8080 |
| Feb 2026 | Full codebase accessible in Claude folder |
| Feb 2026 | Full forensic strategic audit completed — see MumtazHealth_Strategic_Audit_2026.docx |
| Mar 2026 | React hooks bug fixed in MumtazWisdomGuide.tsx |
| Mar 2026 | Smooth page transitions added (PageTransition.tsx) |
| Mar 2026 | SupportPlan.tsx created (was missing, caused crash) |
| Mar 2026 | New user → onboarding redirect added to Index.tsx |
| Mar 2026 | Chatbot greeting fixed (inclusive language only) |
| 7 Mar 2026 | Credibility landing page — Auth.tsx redesigned with testimonials, OM Magazine badge, Google 5-star badge, credentials |
| 7 Mar 2026 | Settings security — re-auth required before password change, sign-out confirmation dialog added |
| 7 Mar 2026 | PWA fully set up — manifest.json created, sw.js upgraded, index.html updated, install banner confirmed working |
| 7 Mar 2026 | Database security audit — all 21 Supabase tables confirmed RLS-enabled |
| 7 Mar 2026 | Image lazy loading — confirmed already in place on all ContentLibrary images |
| 14 Mar 2026 | Google Sign-in enabled and configured in Supabase + Google Cloud |
| 14 Mar 2026 | Vercel deployment completed with custom domain (mumtazhealth.app) connected |

---

*Claude: Always update this file when tasks are completed or new ones are added.*
