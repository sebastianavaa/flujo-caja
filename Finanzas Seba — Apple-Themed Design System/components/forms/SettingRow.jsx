import React from "react";

/**
 * SettingRow — a label/sublabel on the left with a right-aligned value
 * input or control. Stacks inside a Card to form Apple-style settings lists.
 */
export function SettingRow({
  label,
  sublabel,
  value,
  onChange,
  prefix = "$",
  placeholder = "0",
  control,
  last = false,
  style = {},
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: "16px 20px",
      borderBottom: last ? "none" : "1px solid var(--border)",
      ...style,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-medium)", color: "var(--text)", marginBottom: 2 }}>{label}</div>
        {sublabel && <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>{sublabel}</div>}
      </div>
      {control ? control : (
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
          {prefix && <span style={{ fontSize: "var(--text-base)", color: "var(--muted)" }}>{prefix}</span>}
          <input
            type="number"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            style={{
              width: 130, textAlign: "right",
              background: "var(--surface2)", border: "none", borderRadius: "var(--radius-sm)",
              color: "var(--text)", fontFamily: "var(--font-text)", fontSize: "var(--text-md)",
              fontWeight: "var(--weight-semibold)", fontVariantNumeric: "tabular-nums",
              padding: "7px 10px", outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
