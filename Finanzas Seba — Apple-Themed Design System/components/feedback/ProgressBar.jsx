import React from "react";

/**
 * ProgressBar — thin rounded track + fill. Used for limit bars, cuota
 * progress, and timeline mini-bars. `tone` auto-colours by budget state,
 * or pass an explicit `color`.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  tone,
  color,
  height = 4,
  showMarker = false,
  style = {},
  ...rest
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const overPct = max > 0 ? (value / max) * 100 : 0;

  const toneColor = {
    ok: "var(--green)", warn: "var(--yellow)", over: "var(--red)", accent: "var(--accent)",
  };
  const fillColor = color || (tone ? toneColor[tone] : "var(--accent)");

  return (
    <div
      style={{
        position: "relative",
        height,
        background: "var(--surface2)",
        borderRadius: "var(--radius-pill)",
        overflow: showMarker ? "visible" : "hidden",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: fillColor,
          borderRadius: "var(--radius-pill)",
          transition: "width var(--dur-slow) var(--ease-apple), background var(--dur-base)",
        }}
      />
      {showMarker && (
        <div
          style={{
            position: "absolute",
            top: -2,
            left: overPct > 100 ? "calc(100% - 1px)" : "100%",
            width: 2,
            height: height + 4,
            background: "var(--border-strong)",
            borderRadius: 1,
          }}
        />
      )}
    </div>
  );
}
