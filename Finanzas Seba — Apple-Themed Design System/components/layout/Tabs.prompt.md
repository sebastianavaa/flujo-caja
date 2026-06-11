Segmented pill tab group — the product's Tarjeta · Forecast · Config switcher.

```jsx
<Tabs value={section} onChange={setSection} items={[
  { id: "tarjeta", label: "Tarjeta" },
  { id: "forecast", label: "Forecast" },
  { id: "settings", label: "Config" },
]} />
```

Controlled via `value` + `onChange`. The active tab sits on a `--surface2` pill inside a `--surface` track.
