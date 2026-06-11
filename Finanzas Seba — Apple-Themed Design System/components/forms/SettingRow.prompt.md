A settings list row — label + sublabel on the left, a right-aligned value input (or any control) on the right. Stack several inside a `Card` for an Apple-style grouped list.

```jsx
<Card pad={false}>
  <SettingRow label="Cupo total" sublabel="Límite de crédito de tu tarjeta"
              value={cupo} onChange={e => set(+e.target.value)} />
  <SettingRow label="Tema" control={<ThemeToggle .../>} last />
</Card>
```

Default control is a right-aligned `$` number input. Pass `control` to drop in a Switch, ThemeToggle, or read-only value. Set `last` on the final row to remove the divider.
