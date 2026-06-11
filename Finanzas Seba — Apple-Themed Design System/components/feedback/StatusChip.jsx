import React from "react";

/**
 * StatusChip — traffic-light chip for budget status: ok / warn / over.
 * Mirrors the billing hero chip (✓ OK · ⚠ ATENCIÓN · ✕ EXCEDE).
 */
export function StatusChip({ status = "ok", label, style = {}, ...rest }) {
  const map = {
    ok:   { bg: "rgba(48,209,88,0.15)",  color: "var(--green)",  text: "✓ OK" },
    warn: { bg: "rgba(255,214,10,0.14)", color: "var(--yellow)", text: "⚠ ATENCIÓN" },
    over: { bg: "rgba(255,69,58,0.14)",  color: "var(--red)",    text: "✕ EXCEDE" },
  };
  const s = map[status] || map.ok;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-text)",
        fontSize: "var(--text-3xs)",
        fontWeight: "var(--weight-semibold)",
        padding: "2px 8px",
        borderRadius: "var(--radius-pill)",
        letterSpacing: "var(--tracking-wide)",
        background: s.bg,
        color: s.color,
        ...style,
      }}
      {...rest}
    >
      {label || s.text}
    </span>
  );
}
