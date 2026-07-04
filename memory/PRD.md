# CHAITAVA — Master Product Requirements Document
_"Science meets Spirituality — Everything is Connected"_

Version 2.0 · Last updated after user feedback session (Msg 226)

---

## 0. VISION & MISSION

**Mission:** Help humanity understand itself and the universe by connecting science, spirituality, philosophy, psychology, history, consciousness, and human experience through balanced, trustworthy guidance.

**Positioning:** A multidisciplinary AI companion + knowledge platform that presents every big question from Scientific + Historical + Spiritual + Philosophical perspectives — never claiming one is "the" truth.

**Non-negotiables:**
- Never present beliefs as scientific facts
- Respect every tradition equally
- Never diagnose mental health; always route serious cases to professional help
- Never claim to "cure" or "heal" — support the journey

---

## 1. CURRENT STATE (built so far)

- 39+ pages · 30+ API endpoints · Claude Sonnet 4.5 via Emergent LLM Key
- Deep content: Vedas, Chakras, Nakshatras, Gods, Avatars, Aghoris, Sadhus, Ashramas, Purusharthas, Varnas, Samskaras, Rituals of Pooja, Sacred Sites, Life Questions, Sacred Books, Meditations, AI Guru, AI Coach, Great Masters
- Design: Dark cosmic theme with starfield, Fraunces serif + Devanagari

---

## 2. NEW REQUIREMENTS (Msg 226 — Findings & Enhancement Feedback)

### 🟥 PHASE 1 — Foundation & Trust (P0)
Ship-blocking items for a public-quality release.

- **1.1 Favicon** — Chaitava-branded icon (Om symbol + gradient) across browser tabs & bookmarks.
- **1.2 Legal Disclaimer** — Footer text: "For educational and informational purposes only. Users should conduct their own research and consult qualified professionals for medical, financial, or legal decisions. Content combines scientific evidence with cultural and spiritual traditions — clearly distinguished throughout the platform."
- **1.3 About Us page** — mission, principles, team, contact.
- **1.4 Bug/Feedback Report** — floating "Report an issue" button + modal → saves to MongoDB `feedback` collection. Fields: type (bug/idea/content-correction), page URL, description, email (optional).
- **1.5 Navigation overhaul** — the current SiteNav is cramped. Redesign into grouped mega-menu: Explore / Practice / Wisdom / You / About.

### 🟨 PHASE 2 — Meditation & Practice Upgrade (P1)
Fix the largest UX gap: passive audio/video → interactive session.

- **2.1 Meditation Sessions Player**
  - Configurable duration (1/3/5/10/15/20/30/45/60 min)
  - Predefined background music playlist (mantras, bowls, binaural, ambient nature, silence)
  - Audio/video guided instructions (start with text-to-speech via browser Speech API; upgrade to real audio later)
  - Beep + visual alert on session complete
  - Optional interval bells (every 3 min for long sessions)
- **2.2 Fix Video Playback** on `/music` — validate YouTube embed IDs, add fallback error state, disable download to prevent piracy.

### 🟨 PHASE 3 — Progress, Paths & Personalization (P1)
Merge Paths + Challenges into a unified progress tracker; add gentle personalization.

- **3.1 Merged Paths + Challenges** at `/journey`
  - Track completed activities per user
  - Streak counter (daily meditation, journal entry, mantra japa)
  - Share personal experience/reflection publicly (moderated)
  - "Find a Guru/Mentor" recommended note with vetted references (Vedanta Society, Ramakrishna Mission, Isha Foundation, Art of Living, local temples)
- **3.2 Timeline enhancements** at `/timeline`
  - "Before the Big Bang" section — Vilenkin's quantum foam, Penrose's Conformal Cyclic Cosmology, string-theory landscape, brane cosmology
  - Multiverse concept — Level I-IV (Tegmark), Everett many-worlds, inflationary bubble universes
  - Reference evidence links — CMB observations (Planck), quantum vacuum, LIGO gravitational waves
  - Add images/animations at each cosmic epoch (Vision agent images or Lottie)

### 🟩 PHASE 4 — Authentication & Community (P1)
Enable community with logged-in users only, unlock personalization.

- **4.1 Google OAuth** via Emergent's built-in auth (no keys needed from user).
- **4.2 User Profile** — display name, avatar, tradition (optional), joined date, streak, saved items, journal entries.
- **4.3 Community login-gated**
  - Only logged-in users can post
  - Auto-flag hate/spam via Claude moderation
  - Upvotes, comments, replies
  - "Anonymous" posting option retained
- **4.4 Prevent right-click on videos + disable "Save as"** (already flagged in feedback #4).

### 🟪 PHASE 5 — AI Mind Guide (P0 → strategic differentiator)
Rebrand AI Coach → **AI Mind Guide** with responsible mental-health scope.

- **5.1 Mind Guide sessions** for: stress, anxiety, loneliness, overthinking, low motivation, grief, burnout, relationship difficulties, life purpose, self-esteem.
- **5.2 Safety layer** — regex + LLM triage for crisis keywords ("I want to die", "hurt myself", "can't go on") → automatic empathetic response + crisis-line links (988 US, iCall 9152987821 India, Samaritans UK, etc.).
- **5.3 Evidence-based techniques** — never diagnoses; suggests breathing, journaling, mindfulness, sleep habits, exercise, professional referral.
- **5.4 The Wisdom Compass** response format for every answer:
  - 🧠 Scientific perspective
  - 📜 Historical context
  - 🕉️ Spiritual teachings
  - 📚 Books & articles
  - 🧘 Practical exercise
  - ✍️ Reflection question
  - 🎯 One small daily action
- **5.5 System Prompt** (per user's spec — see /app/memory/chaitava_ai_system_prompt.md)

### 🟦 PHASE 6 — Healing Journey (P2)
Never claims to heal; supports the process.

- **6.1 Daily Reflection** — one AI-generated prompt per day, saved to user's journal
- **6.2 Gratitude Practice** — 3 things per day, streak tracked
- **6.3 Guided Breathing** — Box (4-4-4-4), 4-7-8, Alternate Nostril, Bhramari, Kapalbhati
- **6.4 Grounding Exercises** — 5-4-3-2-1 sensory, body scan, safe-place visualization
- **6.5 Mood Tracking** — 1-10 scale + emoji + optional note; heatmap over 30/90/365 days
- **6.6 Self-compassion** — Kristin Neff exercises + Metta bhavana
- **6.7 Habit builder** — meditation, reading, walk, hydration, sleep-time; streak + celebration

### 🟫 PHASE 7 — Energy & Consciousness section (P2)
Renamed from "Awakening"; standardized structure for every topic.

Topics: **Aura · Chakras · Prana · Qi/Chi · Kundalini · Reiki · Mudras · Mantras · Sound Healing · Sacred Geometry · Nadis · Marma points · Panch Prana · Ojas & Tejas**

Standard sub-sections per topic:
1. Overview
2. Traditional teachings
3. Historical background
4. Practices
5. Modern interpretations
6. Scientific evidence (peer-reviewed only — with links)
7. Open questions
8. Related concepts (graph)

### 🟧 PHASE 8 — AI Aura Guide (P2)
Reflective — never diagnostic.

Reflective question flow:
- How is your energy today (1-10)?
- Do you feel mentally clear or overwhelmed?
- How have you been sleeping?
- Which emotions have been most present this week?
- Have you been meditating?

Output → suggested activities (mindfulness, breathwork, nature walk, journal, gentle movement, relaxation) — never claims to "read" the aura.

### 🟨 PHASE 9 — Guided Learning Paths (P2)
Replaces current `/paths` with 4 flagship tracks:

- **Inner Peace** (7 days): stress management → breath awareness → meditation → gratitude → resilience → self-compassion → integration
- **Consciousness** (21 days): philosophy of mind → meditation traditions → neuroscience → comparative perspectives → altered states → witnessing → non-dual insight
- **Energy Traditions** (21 days): chakras → prana → qi → reiki → nadis → kundalini → mantras
- **Mental Wellness** (14 days): emotions → habits → sleep → resilience → cognitive reframing → connection → professional help

Each day: reading + practice + reflection + optional teacher

### 🟪 PHASE 10 — Community Moderation & Growth (P3)
- Reports abuse flow
- Follow other users
- Weekly digest emails (require auth)

### 🟩 PHASE 11 — Multi-language (P3)
Hindi · Telugu · Sanskrit · Tamil · Kannada
- UI toggle first
- Full content on-demand via Claude translation + MongoDB cache

### 🟪 PHASE 12 — Design refresh (P3)
- Warmer temple palette (saffron, maroon, gold on cream) OR keep dark
- Devanagari watermarks on hero sections
- Better card typography hierarchy
- Fix cramped nav (see 1.5)

### 🟨 PHASE 13 — E-commerce (P3)
- Stripe checkout on `/explore/shop`
- Curated mala/puja kit vendors

---

## 3. MIND-MAP

```
                                    CHAITAVA
                                        │
      ┌─────────────────────────────────┼─────────────────────────────────┐
      │                                 │                                 │
   FOUNDATION                       KNOWLEDGE                          COMPANION
      │                                 │                                 │
   ├─Favicon                         ├─Vedas ✅                        ├─AI Guru ✅
   ├─Disclaimer                      ├─Chakras ✅                      ├─AI Coach ✅
   ├─About Us                        ├─Gods & Avatars ✅               ├─Great Masters ✅
   ├─Feedback report                 ├─Aghoris/Sadhus ✅               ├─🆕 AI Mind Guide
   └─Nav overhaul                    ├─Ashramas ✅                     ├─🆕 AI Aura Guide
                                     ├─Purusharthas ✅                 └─🆕 Wisdom Compass
                                     ├─Varnas ✅
                                     ├─Samskaras ✅
                                     ├─Rituals/Pooja ✅
                                     ├─Timeline (needs pre-Big-Bang)
                                     └─🆕 Energy & Consciousness
                                        ├─Aura
                                        ├─Chakras
                                        ├─Prana
                                        ├─Qi/Chi
                                        ├─Kundalini
                                        ├─Reiki
                                        ├─Mudras
                                        ├─Mantras
                                        ├─Sound Healing
                                        └─Sacred Geometry
      
      ┌────────────┬────────────┬──────────┬──────────┐
      │            │            │          │          │
    PRACTICE    JOURNEY      HEALING    COMMUNITY   COMMERCE
      │            │            │          │          │
   ├─Meditate ✅ ├─🆕 Journey  ├─🆕 Daily ├─🆕 Auth  ├─🆕 Stripe
   │  🆕 Timer   │  (paths+    │  reflect │  gated   │
   │  🆕 Music   │  challenges │ ├─🆕 Grat.│  posts   │
   │  🆕 Beep    │  merged)    │ ├─🆕 Bth  │  ├─Mod.  │
   ├─Practices ✅├─Streaks     │ ├─🆕 Grnd │  ├─Report│
   ├─Yajna ✅   ├─Shared      │ ├─🆕 Mood │  └─Digest│
   ├─Journal ✅ │  reflections│ └─🆕 Habit│
   └─Daily ✅   └─Guru guide  │  builder │
                              │          │
                            SAFETY LAYER
                              │
                            ├─Crisis regex
                            ├─Escalation lines
                            └─Never diagnose
```

---

## 4. DATABASE SCHEMA (extensions)

New collections:
- `users` — { id, email, name, avatar, tradition, streak, joined_at }
- `feedback` — { id, type, page, description, email, created_at }
- `journal_entries` — { id, user_id, date, prompt, reflection, mood, gratitude[], created_at }
- `habits` — { id, user_id, habit_name, dates[], streak }
- `progress` — { id, user_id, path_id, day_completed, reflection }
- `mind_guide_sessions` — { id, user_id, topic, history[], created_at }

---

## 5. AI SYSTEM PROMPT
Full system prompt saved at: `/app/memory/chaitava_ai_system_prompt.md`
Applied to: `/api/guru`, `/api/coach` (renamed Mind Guide), `/api/master`, and future `/api/wisdom-compass`.

---

## 6. RECOMMENDED BUILD ORDER (my suggestion)

**Sprint 1 (fast, no keys):** 1 · 2 · 5 (foundation trust + AI upgrade + safety)
**Sprint 2:** 3 (timeline + progress)
**Sprint 3:** 4 (auth) → unlocks 6, 10
**Sprint 4:** 6 (healing journey)
**Sprint 5:** 7, 8, 9 (energy content + guided paths)
**Sprint 6:** 12, 11 (design polish + i18n)
**Sprint 7:** 13 (Stripe — needs your keys)
