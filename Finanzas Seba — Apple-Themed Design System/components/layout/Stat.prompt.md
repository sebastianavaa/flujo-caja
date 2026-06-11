A label over a large tabular-number value — the most repeated block in the product (cupo breakdown, billing sub-row, countdowns).

```jsx
<Stat label="Cuotas comprometidas" value="1.234.560" prefix="$" />
<Stat label="Presupuesto diario libre" value="42.000" prefix="$" suffix="/día" tone="green" />
<Stat label="Cierre en" value="6 días" tone="yellow" align="right" />
```

All values use `tabular-nums`. `tone` colours the figure (accent / green / yellow / orange / red). `size`: `sm | md | lg`. `prefix` renders muted; `suffix` renders small.
