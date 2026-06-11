Text/number input in two looks: `hero` (large weight-300 money figure with a `$` prefix) and `field` (filled surface field for forms and settings).

```jsx
<Input variant="hero" type="number" prefix="$" label="Cupo disponible (banco)"
       value={cupo} onChange={e => setCupo(+e.target.value)} sublabel="$120.000 contado" />
<Input variant="field" label="Descripción" placeholder="Ej: MacBook Air" />
```

All money figures use `tabular-nums`. Use `align="right"` for settings rows. `prefix` renders the currency symbol; `label`/`sublabel` build the full input box.
