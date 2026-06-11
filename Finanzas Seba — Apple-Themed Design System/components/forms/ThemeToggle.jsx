import React from "react";

/**
 * ThemeToggle — segmented Sun/Moon control that flips data-theme on a
 * target element (defaults to document.documentElement). Mirrors the
 * apple.com light/dark switch. Pass lucide <Sun/> <Moon/> as icons or
 * rely on the built-in glyphs.
 */
export function ThemeToggle({
  theme,
  onChange,
  target,
  sunIcon,
  moonIcon,
  segmented = true,
  style = {},
}) {
  const [internal, setInternal] = React.useState(theme || "dark");
  const current = theme ?? internal;

  function set(next) {
    if (theme === undefined) setInternal(next);
    onChange?.(next);
    const el = target || (typeof document !== "undefined" ? document.documentElement : null);
    if (el) el.setAttribute("data-theme", next);
  }

  const btn = (mode, glyph, icon) => {
    const active = current === mode;
    return (
      <button
        type="button"
        onClick={() => set(mode)}
        title={mode === "light" ? "Tema claro" : "Tema oscuro"}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
          width: segmented ? 30 : "auto", height: 28, padding: segmented ? 0 : "0 12px",
          border: "none", borderRadius: "var(--radius-xs)", cursor: "pointer",
          background: active ? "var(--surface3)" : "transparent",
          color: active ? "var(--text)" : "var(--muted)",
          fontFamily: "var(--font-text)", fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)",
          boxShadow: active ? "var(--shadow-sm)" : "none",
          transition: "var(--transition-base)",
        }}
      >
        {icon || glyph}
      </button>
    );
  };

  return (
    <div style={{
      display: "inline-flex", gap: 2, background: "var(--surface)",
      borderRadius: "var(--radius-sm)", padding: 2, ...style,
    }}>
      {btn("light", "☀", sunIcon)}
      {btn("dark", "☾", moonIcon)}
    </div>
  );
}
