The base surface — soft-rounded `var(--surface)` card behind every panel in the product.

```jsx
<Card>{/* padded content */}</Card>
<Card pad={false}>{/* flush list of SettingRow / cuota rows */}</Card>
<Card tone="green" interactive>{/* outlined, hover-lift */}</Card>
```

`pad={false}` removes padding for grouped lists. `radius`: `lg (12) | xl (16) | 2xl (20)`. `interactive` adds the hover lift to `--surface2`. `tone` draws a coloured hairline outline (accent / green / yellow / red).
