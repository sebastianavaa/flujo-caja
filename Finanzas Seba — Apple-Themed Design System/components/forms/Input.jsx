import React from "react";

/**
 * Input — text/number field. Two looks:
 *  - "hero": large, weight-300, transparent (the big money inputs with a $ prefix)
 *  - "field": filled surface field (form rows, settings)
 * Pass `prefix` (e.g. "$") and `label` to build a full input box.
 */
export function Input({
  variant = "field",
  type = "text",
  value,
  onChange,
  placeholder,
  prefix,
  label,
  sublabel,
  align = "left",
  style = {},
  boxStyle = {},
  ...rest
}) {
  const isHero = variant === "hero";

  const inputEl = (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        flex: 1,
        minWidth: 0,
        width: "100%",
        background: "transparent",
        border: "none",
        outline: "none",
        color: "var(--text)",
        fontFamily: "var(--font-text)",
        fontVariantNumeric: "tabular-nums",
        textAlign: align,
        fontSize: isHero ? "var(--text-xl)" : "var(--text-base)",
        fontWeight: isHero ? "var(--weight-regular)" : "var(--weight-regular)",
        letterSpacing: isHero ? "-0.5px" : "0",
        ...style,
      }}
      {...rest}
    />
  );

  if (variant === "field") {
    return (
      <div style={boxStyle}>
        {label && (
          <label style={{
            display: "block", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)",
            color: "var(--muted)", letterSpacing: "var(--tracking-eyebrow)", marginBottom: 6,
          }}>{label}</label>
        )}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: "var(--surface2)", borderRadius: "var(--radius-sm)", padding: "10px 12px",
        }}>
          {prefix && <span style={{ color: "var(--muted)", fontSize: "var(--text-base)", flexShrink: 0 }}>{prefix}</span>}
          {inputEl}
        </div>
      </div>
    );
  }

  // hero
  return (
    <div style={boxStyle}>
      {label && (
        <div style={{
          fontSize: "var(--text-2xs)", fontWeight: "var(--weight-medium)",
          color: "var(--secondary)", letterSpacing: "var(--tracking-wide)", marginBottom: 10,
        }}>{label}</div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        {prefix && (
          <span style={{
            fontSize: "var(--text-lg)", fontWeight: "var(--weight-regular)",
            color: "var(--muted)", flexShrink: 0,
          }}>{prefix}</span>
        )}
        {inputEl}
      </div>
      {sublabel && (
        <div style={{ fontSize: "var(--text-2xs)", color: "var(--muted)", marginTop: 8 }}>{sublabel}</div>
      )}
    </div>
  );
}
