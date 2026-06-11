Thin rounded progress track used for limit bars, cuota progress and timeline mini-bars.

```jsx
<ProgressBar value={totalMes} max={limite} tone="warn" showMarker />
<ProgressBar value={3} max={12} color="#2997ff" height={2} />
```

Auto-colours from `tone` (`ok | warn | over | accent`) or set an explicit `color` (e.g. a cuota swatch). `showMarker` adds the vertical limit tick. Default height 4px; use 2px for dense rows.
