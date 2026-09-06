# Master Design System Prompt

> A reusable design language extracted from the SkipTray design philosophy.
> Paste this into any new app's design/build prompt to carry the same visual
> system across projects. Where a section says "adapt to domain," swap the
> specific labels/context but keep the underlying logic.

---

## 1. Core Design Philosophy

Build a **modern, clean, highly tactile card-based interface** with a
"premium yet friendly" aesthetic. Prioritize scannability and speed of
comprehension — assume the user is glancing quickly, not reading carefully.
Use subtle depth, generous rounded corners, and high-contrast elements so
every screen is instantly parseable at a glance.

---

## 2. Typography

Use Tailwind's default **sans-serif** stack. Build hierarchy through
**font weight and letter spacing**, not just size.

- **Numbers, statuses, primary headings** — heavy weights: `font-black`,
  `font-extrabold`, `font-bold`.
- **Large headings** — tight spacing: `tracking-tight`, `leading-tight`.
- **Metadata / small utility text** (e.g. "Total Active", "ID: X") —
  uppercase, wide tracking, small size: `uppercase`, `tracking-wider` /
  `tracking-widest`, `text-[10px]`–`text-[11px]`.
- **Technical/identifier data** (IDs, codes, OTPs) — `font-mono` for
  character clarity, used selectively.

---

## 3. Color Palette

Base palette: Tailwind **Slate** (neutrals) + **Indigo** (brand/primary
accent). Semantic colors are mapped to real-world statuses.

### Base & Backgrounds
- Main app background: light cool off-white — `bg-[#f8fafc]` / `slate-50`.
- Cards/surfaces: clean white (`bg-white`) with subtle slate borders
  (`border-slate-100`, `border-slate-200`).

### Primary Brand Accent
- **Indigo** (`indigo-600`, `indigo-700`, `indigo-50`) for primary CTAs,
  active states, and brand highlights.

### High-Contrast Dark Surfaces
- Important command/control areas (dashboards, key headers) invert to
  **dark slate** (`bg-slate-900`, `bg-slate-800/60`) with white text —
  a "command center" feel that draws attention to critical metrics/tools.

### Semantic Status Colors
*(Adapt labels to the app's domain — keep the color logic.)*

| State | Colors |
|---|---|
| Default / neutral | Slate — `bg-slate-100`, `text-slate-700` |
| In-progress / acknowledged | Blue — `bg-blue-50`, `text-blue-700` |
| Active / working | Orange — `bg-orange-50`, `text-orange-700`, `bg-orange-500` (actions) |
| Success / complete | Emerald — `bg-emerald-50`, `text-emerald-700`, `bg-emerald-600` (actions) |
| Warning / overdue | Amber — `bg-amber-50`, `ring-amber-100`, `text-amber-900` |
| Error / rejected | Rose — `bg-rose-50`, `text-rose-600` |

---

## 4. Shapes, Borders & Depth

Avoid sharp corners entirely — lean into large "squircle" radii:

- Main containers / prominent buttons: `rounded-[2rem]` or `rounded-2xl`.
- Standard buttons, tags, inputs: `rounded-xl`.
- Status badges, avatars: `rounded-full`.

Depth & glassmorphism:
- Standard cards: light shadow at rest (`shadow-sm`), slight elevation on
  hover (`hover:shadow-md`).
- Dark command surfaces & toasts: translucent/glass effects
  (`bg-slate-800/60`, `border-slate-700/60`) for a modern, layered feel.

---

## 5. Iconography

- **Lucide React** as the exclusive icon library.
- Icons must always be purposeful, never decorative.
- Pair icons with nearly every action button (e.g. `<IconCheck /> Approve`)
  so users can operate the UI via visual muscle memory, minimizing reliance
  on reading text — especially important for fast-paced environments.

---

## 6. Micro-interactions & Feedback

- **Buttons**: smooth color transitions (`transition-colors`,
  `hover:bg-indigo-700`) plus tactile press feedback (`active:scale-95`)
  on key interactive elements (scanners, primary CTAs).
- **Attention animations**: subtle, purposeful only — e.g. `animate-pulse`
  on urgent/overdue indicators.
- **Toasts/notifications**: quick, light entrance animation —
  `animate-in fade-in slide-in-from-top-1`.
- **Audio feedback**: where the domain involves physical-world actions
  (scans, confirmations), consider audio cues to bridge digital UI and
  real-world operation.

---

## 7. Guiding Principle

Every design decision should optimize for a **fast-paced, glance-and-act
environment**: high information density, low cognitive load, and
unmistakable status signaling at a glance.

---

## How to Use This Prompt

When starting a new app, prepend this file's content to your build prompt
and add one line specifying the domain, e.g.:

> "Apply the Master Design System above to a [warehouse inventory / hospital
> triage / delivery fleet] dashboard. Map the semantic status colors to:
> [state 1] → [color], [state 2] → [color], ..."
