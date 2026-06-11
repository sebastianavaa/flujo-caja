Square, icon-only control for toolbar actions — logout, month navigation, delete. Pass a lucide icon as children.

```jsx
<IconButton label="Cerrar sesión"><LogOut size={15} /></IconButton>
<IconButton danger label="Eliminar">✕</IconButton>
<IconButton variant="surface"><ChevronLeft size={16} /></IconButton>
```

Sizes `sm (28) | md (32) | lg (36)`. Variants `ghost | surface | soft`. `danger` makes hover turn red for destructive actions. Always pass `label` for accessibility + tooltip.
