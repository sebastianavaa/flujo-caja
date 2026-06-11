Segmented Sun/Moon switch that flips `data-theme` between apple.com's light and dark — the signature control of this system.

```jsx
import { Sun, Moon } from "lucide";
<ThemeToggle theme={theme} onChange={setTheme}
  sunIcon={<Sun size={14} />} moonIcon={<Moon size={14} />} />
```

Self-manages by default (sets `data-theme` on `<html>`), or drive it via `theme` + `onChange`. Pass lucide `Sun`/`Moon` for the authentic icons, or rely on the built-in ☀/☾ glyphs.
