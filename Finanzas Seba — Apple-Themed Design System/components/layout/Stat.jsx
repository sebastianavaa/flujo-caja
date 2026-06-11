import React from "react";

/**
 * Stat — a label over a large tabular-number value. The most repeated
 * pattern in the product (cupo breakdown, billing sub-row, countdowns).
 */
export function Stat({
  label,
  value,
  prefix,
  suffix,
  tone,
  size = "md",
  align = "left",
  sublabel,
  style = {},
}) {
  const sizes = {
    sm: "var(--text-md)",
    md: "var(--text-heading)",
    lg: "var(--text-xl)",
  };
  const toneColor = {
    accent: "var(--accent)", green: "var(--green)", yellow: "var(--yellow)",
    orange: "var(--orange)", red: "var(--red)",
  };
  return (
    <div style={{ textAlign: align, ...style }}>
      <div style={{
        fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)",
        color: "var(--muted)", marginBottom: 3, letterSpacing: "var(--tracking-wide)",
      }}>{label}</div>
      <div style={{
        fontSize: sizes[size] || sizes.md,
        fontWeight: "var(--weight-bold)",
        letterSpacing: "var(--tracking-tight)",
        fontVariantNumeric: "tabular-nums",
        color: tone ? toneColor[tone] : "var(--text)",
        lineHeight: 1.1,
      }}>
        {prefix && <span style={{ color: "var(--secondary)", fontWeight: "var(--weight-regular)" }}>{prefix}</span>}
        {value}
        {suffix && <span style={{ fontSize: "0.6em", fontWeight: "var(--weight-regular)", color: "var(--muted)" }}>{suffix}</span>}
      </div>
      {sublabel && <div style={{ fontSize: "var(--text-2xs)", color: "var(--muted)", marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}
