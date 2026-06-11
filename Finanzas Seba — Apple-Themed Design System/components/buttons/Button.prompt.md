Apple-styled action button — solid accent, tinted, ghost or neutral surface; use it for any primary or secondary action.

```jsx
<Button variant="primary" onClick={save}>Agregar compra</Button>
<Button variant="secondary" pill size="sm">Guardar</Button>
<Button variant="ghost">Cancelar</Button>
```

Variants: `primary` (solid Apple blue), `secondary` (tinted fill + border), `ghost` (text only), `neutral` (surface). Sizes `sm | md | lg`. `pill` gives the rounded-capsule Save look; `fullWidth` stretches it (used for the "+ Agregar compra" button). Hover brightens the accent, press deepens it and nudges scale.
