import React from "react";

/**
 * IconButton — square, icon-only control. Used for logout, month nav,
 * delete (✕), and toolbar actions. Pass a lucide icon (or any node) as children.
 */
export function IconButton({
  children,
  size = "md",
  variant = "ghost",
  danger = false,
  disabled = false,
  label,
  onClick,
  type = "button",
  style = {},
  ...rest
}) {
  const dims = { sm: 28, md: 32, lg: 36 };
  const d = dims[size] || dims.md;

  const variants = {
    ghost:   { background: "transparent",    color: "var(--muted)" },
    surface: { background: "var(--surface)",  color: "var(--secondary)" },
    soft:    { background: "var(--surface2)", color: "var(--secondary)" },
  };
  const v = variants[variant] || variants.ghost;

  const [hover, setHover] = React.useState(false);

  const hoverStyle = hover && !disabled
    ? danger
      ? { background: "rgba(255,69,58,0.15)", color: "var(--red)" }
      : { background: "var(--surface2)", color: "var(--text)" }
    : {};

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        flexShrink: 0,
        border: "none",
        borderRadius: "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "var(--transition-base)",
        ...v,
        ...hoverStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
