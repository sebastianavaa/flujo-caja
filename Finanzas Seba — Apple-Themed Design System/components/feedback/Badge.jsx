import React from "react";

/**
 * Badge — small pill label for status/category. Tones map to the
 * Flujo de Caja states: active, paid, future, role, neutral.
 */
export function Badge({ children, tone = "neutral", style = {}, ...rest }) {
  const tones = {
    active:  { background: "var(--accent-soft)",       color: "var(--accent)" },
    paid:    { background: "rgba(48,209,88,0.14)",     color: "var(--green)" },
    future:  { background: "rgba(255,214,10,0.12)",    color: "var(--yellow)" },
    danger:  { background: "rgba(255,69,58,0.14)",     color: "var(--red)" },
    role:    { background: "var(--badge-bg)",          color: "var(--badge-text)" },
    neutral: { background: "var(--surface2)",          color: "var(--secondary)" },
  };
  const t = tones[tone] || tones.neutral;
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
        letterSpacing: "var(--tracking-snug)",
        whiteSpace: "nowrap",
        ...t,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
