# Finanzas Seba — Apple-Themed Design System

> A design system for the **Flujo de Caja** personal finance dashboard, themed with apple.com's visual language. Light + dark modes. Spanish (es-CL).

---

## Sources

| Resource | Location |
|---|---|
| **Codebase** | Local mount: `Calculadora Flujo de Caja/` (Next.js 14, Tailwind, TypeScript) |
| **GitHub repo** | https://github.com/sebastianavaa/flujo-caja |
| **Apple.com theme reference** | https://www.apple.com — color, typography and interaction patterns |

The codebase is a personal financial tool built by Sebastián Nava (Plutto, 2026). Explore the GitHub repo for additional context, hooks, settings, and API integrations. The original globals.css in the codebase already declared a dark/light token structure; this design system replaces the lila/purple accent with **Apple web blue** and harmonises all surfaces with apple.com's official neutral palette.

---

## Product Context

**Flujo de Caja** is a personal credit-card cash-flow tracker for Chilean pesos (CLP, `es-CL` locale). It tracks monthly installment commitments (cuotas), projects a 12-month billing timeline, and forecasts personal savings. The app is a single user, authentication-gated (Google OAuth), desktop + mobile responsive.

**Core sections:**
1. **Tarjeta** — Credit card installment calculator with billing hero, timeline, and cuota list
2. **Forecast** — Personal savings projection over 1–5 years
3. **Config** — Settings (cupo, limits, income)

---

## Content Fundamentals

**Language:** Spanish (es-CL). Currency formatted as `$1.234.567` (period thousands separator, CLP).

**Tone:** Personal, direct, minimal. First person is avoided; copy is label-driven. No marketing language. Clarity over completeness.

**Casing:** Sentence case for labels and headings (`Cupo disponible`, not `CUPO DISPONIBLE`). Section eyebrows use `ALL CAPS` with wide tracking.

**Numbers:** Always `tabular-nums`. Use `k` abbreviation for thousands in tight spaces (`$1.2M`, `42k`). Negative values: `−$58.000` (minus sign, not hyphen).

**Status vocabulary:**
- ✓ OK · ⚠ ATENCIÓN · ✕ EXCEDE
- Activa · Futura · Pagada

**No emoji** in UI (except the 💳 login icon — a single expressive touch). No decorative icons beyond lucide-react.

**Date format:** `Jun 2029`, `23 de junio 2026` (Spanish month names, lowercase).

---

## Visual Foundations

### Colors
Themed from **apple.com** — the exact same neutral ramp and web-blue accent Apple uses on its marketing pages.

| Role | Dark | Light |
|---|---|---|
| Canvas (bg-main) | `#000000` | `#f5f5f7` |
| Card (bg-card) | `#1d1d1f` | `#ffffff` |
| Recessed (bg-element) | `#2a2a2c` | `#f5f5f7` |
| Text primary | `#f5f5f7` | `#1d1d1f` |
| Text secondary | `#86868b` | `#6e6e73` |
| Accent (web blue) | `#2997ff` | `#0071e3` |
| Semantic green | `#30d158` | `#248a3d` |
| Semantic yellow | `#ffd60a` | `#b25e00` |
| Semantic red | `#ff453a` | `#ff3b30` |

Apple's `#86868b` mid-gray is a signature color — appears as the secondary text standard across all apple.com pages.

### Typography
**SF Pro Display / SF Pro Text** (proprietary, served by the OS as `-apple-system`). Real SF Pro renders on all Apple devices; elsewhere falls back gracefully via `system-ui`.

- Display type: `font-weight 700`, `letter-spacing −0.03em`, `line-height 1.05`
- Body/UI: `font-weight 400–600`, `letter-spacing −0.01–0em`
- Large numerals: `font-weight 300`, `letter-spacing −0.04em` (the billing hero "featherweight" style)
- Eyebrows: `font-weight 600`, `letter-spacing 0.06em`, `text-transform uppercase`
- All monetary values: `font-variant-numeric: tabular-nums`

### Backgrounds
- Dark: true black `#000` canvas (pure OLED black — Apple's dark mode choice)
- Light: soft `#f5f5f7` page, `#fff` cards
- No gradients, no textures, no imagery
- Sticky nav uses `backdrop-filter: saturate(180%) blur(20px)` glass effect on both themes

### Spacing & Layout
- 8px base unit with dense half-steps (4, 6, 10, 12, 14, 20, 22…)
- Content column: `max-width: 700px`, centered with 20px gutter
- Cards: `16px` radius (xl), hero billing card `24px 22px` padding
- Form grids: 2-column for inputs, 3-column for compact fields

### Radii
xs 6 · sm 8 · md 10 · lg 12 · xl 16 · 2xl 20 · pill 99px

### Borders
Single `1px` hairlines. Dark: `rgba(255,255,255,0.10)`. Light: `rgba(0,0,0,0.10)`. Accent outline on active/selected cards: `rgba(41,151,255,0.24)`.

### Cards
- Background: `var(--surface)` (the card layer above the page)
- No drop shadow in dark mode (flat, Apple iOS style)
- Subtle `box-shadow` in light mode only
- Adjacent cards separated by 1px `var(--border)` hairline within grouped containers

### Animation
- Duration: `0.15s` for micro-interactions (hover, press), `0.4s` for bar fills
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (Apple standard)
- Progress bars animate `width` on update
- A pulsing `opacity` keyframe on the billing dot `●`
- Section transitions: `fadeIn` (opacity + translateY 6px → 0)

### Hover / Press
- Solid accent buttons: hover lightens (`#47a3ff`), press deepens (`#0077ed`) + `scale(0.97)`
- Surface buttons/cards: hover shifts to `var(--surface2)`
- Destructive actions (delete): hover turns `rgba(255,69,58,0.15)` background with red icon

### Iconography
**Lucide React** (loaded via CDN `lucide@0.460.0`). Stroke-based, `strokeWidth 1.8` default, `2.5` on active state. Key icons used:
- `credit-card` — Tarjeta nav tab
- `bar-chart-2` — Forecast nav tab
- `settings-2` — Config nav tab
- `log-out` — Logout
- `sun` / `moon` — Theme toggle
- `chevron-left` / `chevron-right` — Month navigation

No custom SVG icons. No emoji icons. No icon fonts. Lucide is the sole icon system.

### Imagery
None. The product is data-first. No photos, illustrations, or decorative graphics.

---

## Iconography

Icons are exclusively **Lucide** — a consistent stroke-based set that matches Apple's SF Symbols aesthetic (without the licensing restriction). Load via CDN:

```html
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.js"></script>
```

Then call `lucide.createIcons()` after DOM insertion. In React use `lucide-react`:
```jsx
import { CreditCard, Sun, Moon } from "lucide-react";
```

Stroke weight: `1.8` resting, `2.5` active. Size: 14–20px depending on context.

---

## File Index

```
styles.css                      Global entry (imports only)
tokens/
  colors.css                    Apple dark + light palettes + semantic colors
  typography.css                SF Pro stack, type scale, tracking
  spacing.css                   8px rhythm, radii, layout widths
  effects.css                   Shadows, blur, easing, transitions
components/
  buttons/
    Button.jsx / .d.ts          Primary, secondary, ghost, neutral + sizes + pill
    IconButton.jsx / .d.ts      Square icon control (logout, nav arrows, delete)
    buttons.card.html           @dsCard thumbnail
  feedback/
    Badge.jsx / .d.ts           Status pills (active/paid/future/role/danger)
    StatusChip.jsx / .d.ts      Traffic-light chip (ok/warn/over)
    ProgressBar.jsx / .d.ts     Limit bar + cuota progress track
    feedback.card.html          @dsCard thumbnail
  forms/
    Input.jsx / .d.ts           Hero money input + field input
    SettingRow.jsx / .d.ts      Settings list row (label + number input)
    ThemeToggle.jsx / .d.ts     Sun/Moon segmented switch
    forms.card.html             @dsCard thumbnail
  layout/
    Card.jsx / .d.ts            Base surface card (pad, tone, interactive)
    Tabs.jsx / .d.ts            Segmented nav tabs
    Stat.jsx / .d.ts            Label + big tabular-number metric block
    layout.card.html            @dsCard thumbnail
guidelines/
  brand-mark.card.html          Brand dot + wordmark, dark & light
  colors-accent.card.html       Apple blue accent ramp
  colors-surfaces-dark.card.html  Dark theme surfaces
  colors-surfaces-light.card.html Light theme surfaces
  colors-semantic.card.html     iOS system colors
  colors-text.card.html         Text hierarchy + hairlines
  type-display.card.html        SF Pro Display specimen
  type-body.card.html           Body + UI type scale
  type-numerals.card.html       Tabular-numeric money figures
  spacing-scale.card.html       8px spacing rhythm
  spacing-radii.card.html       Corner radius scale
  spacing-elevation.card.html   Shadows + frosted glass
ui_kits/
  flujo-caja/
    index.html                  Full interactive app (login → dashboard)
    CalculadoraTarjeta.jsx      Credit card installment calculator
    Settings.jsx                Configuration screen
```
