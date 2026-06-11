import React from "react";

/**
 * Card — the base surface. Soft-rounded, var(--surface) background.
 * `interactive` adds a hover lift; `pad={false}` for flush list cards
 * (SettingRow / cuota lists). `tone` adds a coloured hairline outline.
 */
export function Card({
  children,
  pad = true,
  radius = "xl",
  interactive = false,
  tone,
  style = {},
  onClick,
  ...rest
}) {
  const radii = { lg: "var(--radius-lg)", xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)" };
  const outline = {
    accent: "1px solid var(--accent-soft-border)",
    green:  "1px solid rgba(48,209,88,0.22)",
    yellow: "1px solid rgba(255,214,10,0.22)",
    red:    "1px solid rgba(255,69,58,0.24)",
  };
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: hover ? "var(--surface2)" : "var(--surface)",
        borderRadius: radii[radius] || radii.xl,
        padding: pad ? "var(--pad-card)" : 0,
        overflow: "hidden",
        outline: tone ? outline[tone] : "none",
        outlineOffset: tone ? "-1px" : 0,
        cursor: interactive || onClick ? "pointer" : "default",
        transition: "background var(--dur-fast) var(--ease-apple)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
