---
name: finanzas-seba-design
description: Use this skill to generate well-branded interfaces and assets for Finanzas Seba / Flujo de Caja — a personal credit-card cash-flow tracker themed with apple.com's visual language. Contains essential design guidelines, Apple-blue color tokens, SF Pro typography, light/dark themes, and UI kit components for prototyping the dashboard.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (mocks, throwaway prototypes, slides, etc), copy assets out and create static HTML files for the user to view. Key conventions:
- Load `styles.css` for all tokens (CSS custom properties)
- Set `data-theme="dark"` (default) or `data-theme="light"` on `<html>`
- Use `-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui` for all type
- Accent: `#2997ff` (dark) / `#0071e3` (light). Never use purple or lila.
- Semantic: `var(--green)` `var(--yellow)` `var(--red)` — iOS system colors
- All money figures: `font-variant-numeric: tabular-nums`, `es-CL` locale
- Icons: Lucide only (no custom SVG, no emoji icons)
- No gradients, no textures. Cards are flat with 1px hairline borders.
- Radii: 16px cards, 10px buttons, 8px fields, 99px pills/badges
- Transitions: `0.15s cubic-bezier(0.4,0,0.2,1)`

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
