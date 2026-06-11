import React from "react";

/**
 * Tabs — segmented pill tab group (the Tarjeta · Forecast · Config nav).
 * Controlled via `value` + `onChange`. `items` = [{ id, label }].
 */
export function Tabs({ items = [], value, onChange, style = {} }) {
  return (
    <div style={{
      display: "inline-flex", gap: 2, background: "var(--surface)",
      borderRadius: "var(--radius-md)", padding: 3, ...style,
    }}>
      {items.map((it) => {
        const active = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange?.(it.id)}
            style={{
              padding: "6px 16px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: active ? "var(--surface2)" : "transparent",
              color: active ? "var(--text)" : "var(--secondary)",
              fontFamily: "var(--font-text)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              letterSpacing: "var(--tracking-snug)",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "var(--transition-base)",
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
