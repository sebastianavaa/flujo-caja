import React from "react";

/**
 * Button — Apple-styled action button.
 * Variants: primary (solid accent), secondary (tinted), ghost (text),
 * pill (rounded capsule, used for Save). Sizes: sm, md, lg.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  pill = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: "var(--text-xs)",  padding: "6px 14px",  radius: "var(--radius-sm)" },
    md: { fontSize: "var(--text-base)",padding: "11px 20px", radius: "var(--radius-md)" },
    lg: { fontSize: "var(--text-md)",  padding: "14px 26px", radius: "var(--radius-md)" },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--accent-soft)",
      color: "var(--accent)",
      border: "1px solid var(--accent-soft-border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid transparent",
    },
    neutral: {
      background: "var(--surface2)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
  };
  const v = variants[variant] || variants.primary;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-text)",
    fontWeight: "var(--weight-semibold)",
    fontSize: s.fontSize,
    letterSpacing: "var(--tracking-snug)",
    padding: s.padding,
    borderRadius: pill ? "var(--radius-pill)" : s.radius,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? "100%" : "auto",
    transition: "var(--transition-base)",
    WebkitFontSmoothing: "antialiased",
    ...v,
    ...style,
  };

  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const dyn = {};
  if (!disabled) {
    if (variant === "primary") {
      if (press) dyn.background = "var(--accent-pressed)";
      else if (hover) dyn.background = "var(--accent-hover)";
    } else {
      if (press) dyn.opacity = 0.7;
    }
    if (press) dyn.transform = "scale(0.97)";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{ ...base, ...dyn }}
      {...rest}
    >
      {children}
    </button>
  );
}
