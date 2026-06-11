/* @ds-bundle: {"format":3,"namespace":"FinanzasSebaAppleThemedDesignSystem_4b1b5f","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusChip","sourcePath":"components/feedback/StatusChip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SettingRow","sourcePath":"components/forms/SettingRow.jsx"},{"name":"ThemeToggle","sourcePath":"components/forms/ThemeToggle.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Stat","sourcePath":"components/layout/Stat.jsx"},{"name":"Tabs","sourcePath":"components/layout/Tabs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"e6756650aff5","components/buttons/IconButton.jsx":"ea9f61d5a465","components/feedback/Badge.jsx":"9c47b05be661","components/feedback/ProgressBar.jsx":"cf89118005c5","components/feedback/StatusChip.jsx":"a7f64dbf68ea","components/forms/Input.jsx":"cab54282d8a8","components/forms/SettingRow.jsx":"83f2b6c219c9","components/forms/ThemeToggle.jsx":"da2ec7eea4ef","components/layout/Card.jsx":"229cd8589459","components/layout/Stat.jsx":"7e861361d20e","components/layout/Tabs.jsx":"e72ca8b34e45","ui_kits/flujo-caja/CalculadoraTarjeta.jsx":"84534a18eb47","ui_kits/flujo-caja/Settings.jsx":"77089264f3c6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FinanzasSebaAppleThemedDesignSystem_4b1b5f = window.FinanzasSebaAppleThemedDesignSystem_4b1b5f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — Apple-styled action button.
 * Variants: primary (solid accent), secondary (tinted), ghost (text),
 * pill (rounded capsule, used for Save). Sizes: sm, md, lg.
 */
function Button({
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
    sm: {
      fontSize: "var(--text-xs)",
      padding: "6px 14px",
      radius: "var(--radius-sm)"
    },
    md: {
      fontSize: "var(--text-base)",
      padding: "11px 20px",
      radius: "var(--radius-md)"
    },
    lg: {
      fontSize: "var(--text-md)",
      padding: "14px 26px",
      radius: "var(--radius-md)"
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--accent-soft)",
      color: "var(--accent)",
      border: "1px solid var(--accent-soft-border)"
    },
    ghost: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid transparent"
    },
    neutral: {
      background: "var(--surface2)",
      color: "var(--text)",
      border: "1px solid var(--border)"
    }
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
    ...style
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const dyn = {};
  if (!disabled) {
    if (variant === "primary") {
      if (press) dyn.background = "var(--accent-pressed)";else if (hover) dyn.background = "var(--accent-hover)";
    } else {
      if (press) dyn.opacity = 0.7;
    }
    if (press) dyn.transform = "scale(0.97)";
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...dyn
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square, icon-only control. Used for logout, month nav,
 * delete (✕), and toolbar actions. Pass a lucide icon (or any node) as children.
 */
function IconButton({
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
  const dims = {
    sm: 28,
    md: 32,
    lg: 36
  };
  const d = dims[size] || dims.md;
  const variants = {
    ghost: {
      background: "transparent",
      color: "var(--muted)"
    },
    surface: {
      background: "var(--surface)",
      color: "var(--secondary)"
    },
    soft: {
      background: "var(--surface2)",
      color: "var(--secondary)"
    }
  };
  const v = variants[variant] || variants.ghost;
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover && !disabled ? danger ? {
    background: "rgba(255,69,58,0.15)",
    color: "var(--red)"
  } : {
    background: "var(--surface2)",
    color: "var(--text)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small pill label for status/category. Tones map to the
 * Flujo de Caja states: active, paid, future, role, neutral.
 */
function Badge({
  children,
  tone = "neutral",
  style = {},
  ...rest
}) {
  const tones = {
    active: {
      background: "var(--accent-soft)",
      color: "var(--accent)"
    },
    paid: {
      background: "rgba(48,209,88,0.14)",
      color: "var(--green)"
    },
    future: {
      background: "rgba(255,214,10,0.12)",
      color: "var(--yellow)"
    },
    danger: {
      background: "rgba(255,69,58,0.14)",
      color: "var(--red)"
    },
    role: {
      background: "var(--badge-bg)",
      color: "var(--badge-text)"
    },
    neutral: {
      background: "var(--surface2)",
      color: "var(--secondary)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProgressBar — thin rounded track + fill. Used for limit bars, cuota
 * progress, and timeline mini-bars. `tone` auto-colours by budget state,
 * or pass an explicit `color`.
 */
function ProgressBar({
  value = 0,
  max = 100,
  tone,
  color,
  height = 4,
  showMarker = false,
  style = {},
  ...rest
}) {
  const pct = max > 0 ? Math.min(value / max * 100, 100) : 0;
  const overPct = max > 0 ? value / max * 100 : 0;
  const toneColor = {
    ok: "var(--green)",
    warn: "var(--yellow)",
    over: "var(--red)",
    accent: "var(--accent)"
  };
  const fillColor = color || (tone ? toneColor[tone] : "var(--accent)");
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      height,
      background: "var(--surface2)",
      borderRadius: "var(--radius-pill)",
      overflow: showMarker ? "visible" : "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: fillColor,
      borderRadius: "var(--radius-pill)",
      transition: "width var(--dur-slow) var(--ease-apple), background var(--dur-base)"
    }
  }), showMarker && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -2,
      left: overPct > 100 ? "calc(100% - 1px)" : "100%",
      width: 2,
      height: height + 4,
      background: "var(--border-strong)",
      borderRadius: 1
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatusChip — traffic-light chip for budget status: ok / warn / over.
 * Mirrors the billing hero chip (✓ OK · ⚠ ATENCIÓN · ✕ EXCEDE).
 */
function StatusChip({
  status = "ok",
  label,
  style = {},
  ...rest
}) {
  const map = {
    ok: {
      bg: "rgba(48,209,88,0.15)",
      color: "var(--green)",
      text: "✓ OK"
    },
    warn: {
      bg: "rgba(255,214,10,0.14)",
      color: "var(--yellow)",
      text: "⚠ ATENCIÓN"
    },
    over: {
      bg: "rgba(255,69,58,0.14)",
      color: "var(--red)",
      text: "✕ EXCEDE"
    }
  };
  const s = map[status] || map.ok;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), label || s.text);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — text/number field. Two looks:
 *  - "hero": large, weight-300, transparent (the big money inputs with a $ prefix)
 *  - "field": filled surface field (form rows, settings)
 * Pass `prefix` (e.g. "$") and `label` to build a full input box.
 */
function Input({
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
  const inputEl = /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
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
      ...style
    }
  }, rest));
  if (variant === "field") {
    return /*#__PURE__*/React.createElement("div", {
      style: boxStyle
    }, label && /*#__PURE__*/React.createElement("label", {
      style: {
        display: "block",
        fontSize: "var(--text-2xs)",
        fontWeight: "var(--weight-medium)",
        color: "var(--muted)",
        letterSpacing: "var(--tracking-eyebrow)",
        marginBottom: 6
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "var(--surface2)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px"
      }
    }, prefix && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--muted)",
        fontSize: "var(--text-base)",
        flexShrink: 0
      }
    }, prefix), inputEl));
  }

  // hero
  return /*#__PURE__*/React.createElement("div", {
    style: boxStyle
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--weight-medium)",
      color: "var(--secondary)",
      letterSpacing: "var(--tracking-wide)",
      marginBottom: 10
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-regular)",
      color: "var(--muted)",
      flexShrink: 0
    }
  }, prefix), inputEl), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xs)",
      color: "var(--muted)",
      marginTop: 8
    }
  }, sublabel));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SettingRow.jsx
try { (() => {
/**
 * SettingRow — a label/sublabel on the left with a right-aligned value
 * input or control. Stacks inside a Card to form Apple-style settings lists.
 */
function SettingRow({
  label,
  sublabel,
  value,
  onChange,
  prefix = "$",
  placeholder = "0",
  control,
  last = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "16px 20px",
      borderBottom: last ? "none" : "1px solid var(--border)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text)",
      marginBottom: 2
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--muted)"
    }
  }, sublabel)), control ? control : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4,
      flexShrink: 0
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--muted)"
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    style: {
      width: 130,
      textAlign: "right",
      background: "var(--surface2)",
      border: "none",
      borderRadius: "var(--radius-sm)",
      color: "var(--text)",
      fontFamily: "var(--font-text)",
      fontSize: "var(--text-md)",
      fontWeight: "var(--weight-semibold)",
      fontVariantNumeric: "tabular-nums",
      padding: "7px 10px",
      outline: "none"
    }
  })));
}
Object.assign(__ds_scope, { SettingRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SettingRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/ThemeToggle.jsx
try { (() => {
/**
 * ThemeToggle — segmented Sun/Moon control that flips data-theme on a
 * target element (defaults to document.documentElement). Mirrors the
 * apple.com light/dark switch. Pass lucide <Sun/> <Moon/> as icons or
 * rely on the built-in glyphs.
 */
function ThemeToggle({
  theme,
  onChange,
  target,
  sunIcon,
  moonIcon,
  segmented = true,
  style = {}
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
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => set(mode),
      title: mode === "light" ? "Tema claro" : "Tema oscuro",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        width: segmented ? 30 : "auto",
        height: 28,
        padding: segmented ? 0 : "0 12px",
        border: "none",
        borderRadius: "var(--radius-xs)",
        cursor: "pointer",
        background: active ? "var(--surface3)" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
        fontFamily: "var(--font-text)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        transition: "var(--transition-base)"
      }
    }, icon || glyph);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 2,
      background: "var(--surface)",
      borderRadius: "var(--radius-sm)",
      padding: 2,
      ...style
    }
  }, btn("light", "☀", sunIcon), btn("dark", "☾", moonIcon));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the base surface. Soft-rounded, var(--surface) background.
 * `interactive` adds a hover lift; `pad={false}` for flush list cards
 * (SettingRow / cuota lists). `tone` adds a coloured hairline outline.
 */
function Card({
  children,
  pad = true,
  radius = "xl",
  interactive = false,
  tone,
  style = {},
  onClick,
  ...rest
}) {
  const radii = {
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)"
  };
  const outline = {
    accent: "1px solid var(--accent-soft-border)",
    green: "1px solid rgba(48,209,88,0.22)",
    yellow: "1px solid rgba(255,214,10,0.22)",
    red: "1px solid rgba(255,69,58,0.24)"
  };
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: hover ? "var(--surface2)" : "var(--surface)",
      borderRadius: radii[radius] || radii.xl,
      padding: pad ? "var(--pad-card)" : 0,
      overflow: "hidden",
      outline: tone ? outline[tone] : "none",
      outlineOffset: tone ? "-1px" : 0,
      cursor: interactive || onClick ? "pointer" : "default",
      transition: "background var(--dur-fast) var(--ease-apple)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Stat.jsx
try { (() => {
/**
 * Stat — a label over a large tabular-number value. The most repeated
 * pattern in the product (cupo breakdown, billing sub-row, countdowns).
 */
function Stat({
  label,
  value,
  prefix,
  suffix,
  tone,
  size = "md",
  align = "left",
  sublabel,
  style = {}
}) {
  const sizes = {
    sm: "var(--text-md)",
    md: "var(--text-heading)",
    lg: "var(--text-xl)"
  };
  const toneColor = {
    accent: "var(--accent)",
    green: "var(--green)",
    yellow: "var(--yellow)",
    orange: "var(--orange)",
    red: "var(--red)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: "var(--weight-medium)",
      color: "var(--muted)",
      marginBottom: 3,
      letterSpacing: "var(--tracking-wide)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: sizes[size] || sizes.md,
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-tight)",
      fontVariantNumeric: "tabular-nums",
      color: tone ? toneColor[tone] : "var(--text)",
      lineHeight: 1.1
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--secondary)",
      fontWeight: "var(--weight-regular)"
    }
  }, prefix), value, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.6em",
      fontWeight: "var(--weight-regular)",
      color: "var(--muted)"
    }
  }, suffix)), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xs)",
      color: "var(--muted)",
      marginTop: 2
    }
  }, sublabel));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Stat.jsx", error: String((e && e.message) || e) }); }

// components/layout/Tabs.jsx
try { (() => {
/**
 * Tabs — segmented pill tab group (the Tarjeta · Forecast · Config nav).
 * Controlled via `value` + `onChange`. `items` = [{ id, label }].
 */
function Tabs({
  items = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 2,
      background: "var(--surface)",
      borderRadius: "var(--radius-md)",
      padding: 3,
      ...style
    }
  }, items.map(it => {
    const active = value === it.id;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      type: "button",
      onClick: () => onChange?.(it.id),
      style: {
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
        transition: "var(--transition-base)"
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flujo-caja/CalculadoraTarjeta.jsx
try { (() => {
// ── Finanzas Seba · UI Kit · Calculadora Tarjeta ────────────────────────────
// Export: window.UICalculadora

const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const REF_YEAR = 2026,
  REF_MONTH = 6;
const COLORS = ["#2997ff", "#ff6584", "#30d158", "#ffd60a", "#06b6d4", "#f472b6", "#a78bfa"];
const INIT_CUOTAS = [{
  id: 1,
  name: "iPhone For Life",
  total: 1_617_000,
  numCuotas: 36,
  startMonth: 6,
  startYear: 2026,
  color: "#2997ff"
}, {
  id: 2,
  name: "Osojimix",
  total: 120_000,
  numCuotas: 3,
  startMonth: 6,
  startYear: 2026,
  color: "#ff6584"
}];
function fee(c) {
  return Math.round(c.total / c.numCuotas);
}
function statusFor(c, year, month) {
  const si = c.startYear * 12 + (c.startMonth - 1);
  const vi = year * 12 + (month - 1);
  const ei = si + c.numCuotas - 1;
  if (vi < si) return {
    status: "future",
    num: null,
    remaining: c.numCuotas
  };
  if (vi > ei) return {
    status: "paid",
    num: null,
    remaining: 0
  };
  const num = vi - si + 1;
  return {
    status: "active",
    num,
    remaining: c.numCuotas - num + 1
  };
}
function totalForMonth(cuotas, year, month) {
  return cuotas.reduce((s, c) => statusFor(c, year, month).status === "active" ? s + fee(c) : s, 0);
}
function fmt(n) {
  return Math.round(n).toLocaleString("es-CL");
}
function getColor(val, lim) {
  if (lim <= 0) return "var(--accent)";
  const r = val / lim;
  return r <= 0.8 ? "var(--green)" : r <= 1 ? "var(--yellow)" : "var(--red)";
}
function getSt(val, lim) {
  if (lim <= 0) return "ok";
  const r = val / lim;
  return r <= 0.8 ? "ok" : r <= 1 ? "warn" : "over";
}
function UICalculadora({
  cupoTotal,
  limiteMensual,
  initialCuotas,
  initialCupo,
  onCuotasChange,
  onCupoChange,
  onLimiteChange
}) {
  const [cuotas, setCuotasRaw] = React.useState(initialCuotas || INIT_CUOTAS);
  const [cupoDisp, setCupoDispRaw] = React.useState(initialCupo || 1_500_000);
  const [limite, setLimiteRaw] = React.useState(limiteMensual || 600_000);
  const [viewY, setViewY] = React.useState(REF_YEAR);
  const [viewM, setViewM] = React.useState(REF_MONTH);
  const [flash, setFlash] = React.useState(false);
  const [fName, setFName] = React.useState("");
  const [fTotal, setFTotal] = React.useState("");
  const [fCuotas, setFCuotas] = React.useState("");
  const [fMes, setFMes] = React.useState("");
  const [fAnio, setFAnio] = React.useState("");
  const [nextId, setNextId] = React.useState(3);
  const setCuotas = fn => {
    const n = typeof fn === "function" ? fn(cuotas) : fn;
    setCuotasRaw(n);
    onCuotasChange?.(n);
    flashSave();
  };
  const setCupoDisp = v => {
    setCupoDispRaw(v);
    onCupoChange?.(v);
  };
  const setLimite = v => {
    setLimiteRaw(v);
    onLimiteChange?.(v);
  };
  const flashSave = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  };
  const comprometido = cuotas.reduce((s, c) => {
    const {
      status,
      remaining
    } = statusFor(c, REF_YEAR, REF_MONTH);
    if (status === "active") return s + remaining * fee(c);
    if (status === "future") return s + c.total;
    return s;
  }, 0);
  const cupoUtil = Math.max(0, cupoTotal - cupoDisp);
  const contado = Math.max(0, cupoUtil - comprometido);
  const activasRef = cuotas.filter(c => statusFor(c, REF_YEAR, REF_MONTH).status === "active");
  const maxRem = activasRef.reduce((m, c) => Math.max(m, statusFor(c, REF_YEAR, REF_MONTH).remaining), 0);
  const cuotasMes = totalForMonth(cuotas, viewY, viewM);
  const isRef = viewY === REF_YEAR && viewM === REF_MONTH;
  const contadoMes = isRef ? contado : 0;
  const totalMes = cuotasMes + contadoMes;
  const margen = limite - totalMes;
  const st = getSt(totalMes, limite);
  const col = getColor(totalMes, limite);
  const pct = limite > 0 ? Math.min(Math.round(totalMes / limite * 100), 150) : 0;
  const billingM = viewM === 12 ? 1 : viewM + 1,
    billingY = viewM === 12 ? viewY + 1 : viewY;
  const chipMap = {
    ok: {
      bg: "rgba(48,209,88,0.15)",
      color: "var(--green)",
      txt: "✓ OK"
    },
    warn: {
      bg: "rgba(255,214,10,0.14)",
      color: "var(--yellow)",
      txt: "⚠ ATENCIÓN"
    },
    over: {
      bg: "rgba(255,69,58,0.14)",
      color: "var(--red)",
      txt: "✕ EXCEDE"
    }
  };
  const chip = chipMap[st];
  const today = new Date();
  const nextClose = today.getDate() <= 23 ? new Date(today.getFullYear(), today.getMonth(), 23) : new Date(today.getFullYear(), today.getMonth() + 1, 23);
  const daysLeft = Math.max(0, Math.ceil((nextClose.getTime() - today.getTime()) / 86400000));
  const dailyBudget = margen > 0 && daysLeft > 0 ? Math.floor(margen / daysLeft) : 0;
  const deudaCero = (() => {
    const np = cuotas.filter(c => statusFor(c, REF_YEAR, REF_MONTH).status !== "paid");
    if (!np.length) return null;
    let mx = 0;
    np.forEach(c => {
      const idx = c.startYear * 12 + (c.startMonth - 1) + c.numCuotas - 1;
      if (idx > mx) mx = idx;
    });
    return {
      year: Math.floor(mx / 12),
      month: mx % 12 + 1,
      meses: mx - (REF_YEAR * 12 + REF_MONTH - 1)
    };
  })();
  const addCuota = () => {
    const n = fName.trim(),
      tot = parseInt(fTotal),
      nq = parseInt(fCuotas),
      mes = parseInt(fMes),
      anio = parseInt(fAnio);
    if (!n || isNaN(tot) || isNaN(nq) || isNaN(mes) || isNaN(anio)) return alert("Completa todos los campos.");
    setCuotas(prev => [...prev, {
      id: nextId,
      name: n,
      total: tot,
      numCuotas: nq,
      startMonth: mes,
      startYear: anio,
      color: COLORS[prev.length % COLORS.length]
    }]);
    setNextId(x => x + 1);
    setFName("");
    setFTotal("");
    setFCuotas("");
    setFMes("");
    setFAnio("");
  };
  const secTitle = {
    fontSize: "var(--text-2xs)",
    fontWeight: 600,
    color: "var(--muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 28
  };
  const ibStyle = {
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: "-0.5px",
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontFamily: "var(--font-text)",
    fontVariantNumeric: "tabular-nums",
    outline: "none",
    flex: 1,
    minWidth: 0
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.04em",
      color: "var(--accent)"
    }
  }, "CONTROL FINANCIERO"), /*#__PURE__*/React.createElement("button", {
    onClick: flashSave,
    style: {
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "inherit",
      color: flash ? "var(--green)" : "var(--accent)",
      background: flash ? "rgba(48,209,88,0.12)" : "var(--accent-soft)",
      border: `1px solid ${flash ? "rgba(48,209,88,0.2)" : "var(--accent-soft-border)"}`,
      padding: "5px 14px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer"
    }
  }, flash ? "Guardado ✓" : "Guardar")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "clamp(28px,6vw,40px)",
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      margin: "8px 0 0"
    }
  }, "Facturaci\xF3n", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "Tarjeta")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--muted)",
      marginTop: 6
    }
  }, "Ciclo de facturaci\xF3n: d\xEDa 23 de cada mes")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1,
      background: "var(--border)",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      marginBottom: 1
    }
  }, [{
    label: "Cupo disponible (banco)",
    val: cupoDisp,
    set: setCupoDisp,
    sub: `$${fmt(comprometido)} en cuotas · $${fmt(contado)} contado`
  }, {
    label: "Límite mensual deseado",
    val: limite,
    set: setLimite,
    sub: `Margen libre = $${fmt(Math.max(0, limite - totalForMonth(cuotas, REF_YEAR, REF_MONTH)))}`
  }].map(({
    label,
    val,
    set,
    sub
  }, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "var(--surface)",
      padding: "20px 22px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: "var(--secondary)",
      letterSpacing: "0.02em",
      marginBottom: 10
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 300,
      color: "var(--muted)"
    }
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: val || "",
    placeholder: "0",
    onChange: e => set(parseInt(e.target.value) || 0),
    style: ibStyle
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)",
      marginTop: 8
    }
  }, sub)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 1,
      background: "var(--border)",
      borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
      overflow: "hidden",
      marginBottom: 24
    }
  }, [{
    l: "Cuotas comprometidas",
    v: `$${fmt(comprometido)}`
  }, {
    l: "Libre (contado)",
    v: contado > 0 ? `$${fmt(contado)}` : "$0",
    c: "var(--green)"
  }, {
    l: "Meses con cuotas",
    v: maxRem > 0 ? `${maxRem} meses` : "—"
  }].map(({
    l,
    v,
    c
  }, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "var(--surface)",
      padding: "14px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: "var(--muted)",
      marginBottom: 4,
      letterSpacing: "0.01em"
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
      color: c || "var(--text)"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface)",
      borderRadius: "var(--radius-xl)",
      padding: "24px 22px",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: "var(--secondary)",
      letterSpacing: "0.02em",
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, "Pago estimado este ciclo", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: "var(--radius-pill)",
      background: chip.bg,
      color: chip.color
    }
  }, chip.txt)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(36px,8vw,54px)",
      fontWeight: 300,
      letterSpacing: "-0.04em",
      lineHeight: 1,
      marginBottom: 20,
      fontVariantNumeric: "tabular-nums"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.42em",
      fontWeight: 400,
      color: "var(--secondary)",
      verticalAlign: "super",
      marginRight: 2
    }
  }, "$"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: col
    }
  }, fmt(totalMes))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      color: "var(--muted)",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "$0"), /*#__PURE__*/React.createElement("span", null, "L\xEDmite $", fmt(limite))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "var(--surface2)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.min(pct, 100)}%`,
      background: col,
      borderRadius: "var(--radius-pill)",
      transition: "width 0.4s ease"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      background: "var(--accent)",
      borderRadius: "50%",
      display: "inline-block"
    }
  }), "Facturaci\xF3n el 23 de ", MONTHS_ES[billingM - 1].toLowerCase(), " ", billingY), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      paddingTop: 14,
      borderTop: "1px solid var(--border)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)",
      marginBottom: 2
    }
  }, "Cierre en"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: daysLeft <= 5 ? "var(--yellow)" : "var(--text)"
    }
  }, daysLeft, " d\xEDas")), dailyBudget > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)",
      marginBottom: 2
    }
  }, "Presupuesto diario libre"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "var(--green)"
    }
  }, "$", fmt(dailyBudget), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 400,
      color: "var(--muted)"
    }
  }, "/d\xEDa"))), deudaCero && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)",
      marginBottom: 2
    }
  }, "Deuda 0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--accent)"
    }
  }, MONTHS_ES[deudaCero.month - 1].slice(0, 3), " ", deudaCero.year), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--muted)"
    }
  }, "en ", deudaCero.meses, " meses"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 18,
      borderTop: "1px solid var(--border)",
      display: "flex",
      gap: 28,
      flexWrap: "wrap"
    }
  }, [["En cuotas", `$${fmt(cuotasMes)}`], ["Contado", isRef ? `$${fmt(contadoMes)}` : "—"], ["Margen libre", margen >= 0 ? `$${fmt(margen)}` : `-$${fmt(-margen)}`, margen >= 0 ? "var(--green)" : "var(--red)"]].map(([l, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: "var(--muted)",
      marginBottom: 3
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
      color: c || "var(--text)"
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: secTitle
  }, "Proyecci\xF3n 12 meses"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto",
      marginBottom: 28,
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      minWidth: "max-content"
    }
  }, Array.from({
    length: 12
  }, (_, i) => {
    const d = new Date(REF_YEAR, REF_MONTH - 1 + i, 1);
    const y = d.getFullYear(),
      m = d.getMonth() + 1;
    const t = totalForMonth(cuotas, y, m) + (i === 0 ? contado : 0);
    const isCur = y === viewY && m === viewM;
    const st2 = getSt(t, limite);
    const col2 = getColor(t, limite);
    const pct2 = limite > 0 ? Math.min(Math.round(t / limite * 100), 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: `${y}-${m}`,
      onClick: () => {
        setViewY(y);
        setViewM(m);
      },
      style: {
        background: isCur ? "var(--surface2)" : "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: "12px 14px",
        minWidth: 100,
        cursor: "pointer",
        flexShrink: 0,
        outline: isCur ? "1px solid var(--accent)" : st2 === "over" ? "1px solid rgba(255,69,58,0.4)" : st2 === "warn" ? "1px solid rgba(255,214,10,0.35)" : "none",
        outlineOffset: "-1px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 500,
        color: "var(--muted)",
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: "0.04em"
      }
    }, MONTHS_ES[m - 1].slice(0, 3), " ", y), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        fontVariantNumeric: "tabular-nums",
        color: col2
      }
    }, "$", fmt(t)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 2,
        background: "var(--surface2)",
        borderRadius: "var(--radius-pill)",
        overflow: "hidden",
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct2}%`,
        background: col2,
        borderRadius: "var(--radius-pill)"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "var(--muted)",
        marginTop: 4
      }
    }, cuotas.filter(c => statusFor(c, y, m).status === "active").length, " cuotas"));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 12
    }
  }, ["←", "→"].map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: a,
    onClick: () => {
      const d = new Date(viewY, viewM - 1 + (i ? 1 : -1), 1);
      setViewY(d.getFullYear());
      setViewM(d.getMonth() + 1);
    },
    style: {
      background: "var(--surface)",
      border: "none",
      color: "var(--secondary)",
      width: 32,
      height: 32,
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      fontSize: 14,
      fontFamily: "inherit",
      transition: "background 0.15s"
    }
  }, a)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      flex: 1,
      textAlign: "center"
    }
  }, MONTHS_ES[viewM - 1], " ", viewY)), /*#__PURE__*/React.createElement("div", {
    style: secTitle
  }, "Detalle cuotas"), cuotas.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 24,
      color: "var(--muted)",
      fontSize: 13
    }
  }, "Sin compras en cuotas.") : cuotas.map(c => {
    const {
      status,
      num,
      remaining
    } = statusFor(c, viewY, viewM);
    const f = fee(c);
    const pct3 = status === "active" ? Math.round(num / c.numCuotas * 100) : status === "paid" ? 100 : 0;
    const badgeMap = {
      active: {
        bg: "rgba(41,151,255,0.15)",
        c: "var(--accent)",
        t: "Activa"
      },
      future: {
        bg: "rgba(255,214,10,0.1)",
        c: "var(--yellow)",
        t: "Futura"
      },
      paid: {
        bg: "rgba(48,209,88,0.12)",
        c: "var(--green)",
        t: "Pagada"
      }
    };
    const badge = badgeMap[status];
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
        marginBottom: 6,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        alignItems: "center",
        opacity: status === "paid" ? 0.35 : 1,
        outline: status === "active" ? "1px solid var(--accent-soft-border)" : "none",
        outlineOffset: "-1px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 3,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        letterSpacing: "-0.01em"
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--muted)",
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        padding: "1px 7px",
        borderRadius: "var(--radius-pill)",
        background: badge.bg,
        color: badge.c
      }
    }, badge.t), status === "active" && /*#__PURE__*/React.createElement("span", null, "Cuota ", num, " de ", c.numCuotas, " \xB7 quedan ", remaining), status === "future" && /*#__PURE__*/React.createElement("span", null, "Inicia ", MONTHS_ES[c.startMonth - 1], " ", c.startYear), status === "paid" && /*#__PURE__*/React.createElement("span", null, "Completada")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        height: 2,
        background: "var(--surface2)",
        borderRadius: "var(--radius-pill)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${pct3}%`,
        background: c.color,
        borderRadius: "var(--radius-pill)",
        opacity: 0.7,
        transition: "width 0.4s ease"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        fontVariantNumeric: "tabular-nums",
        color: status === "active" ? c.color : "var(--muted)"
      }
    }, status === "active" ? `$${fmt(f)}` : "—"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--muted)",
        marginTop: 2
      }
    }, status !== "paid" ? `$${fmt(f)}/mes` : `Total: $${fmt(c.total)}`)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setCuotas(prev => prev.filter(x => x.id !== c.id)),
      style: {
        background: "none",
        border: "none",
        color: "var(--muted)",
        cursor: "pointer",
        width: 24,
        height: 24,
        borderRadius: "var(--radius-xs)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        flexShrink: 0
      }
    }, "\u2715")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface)",
      borderRadius: "var(--radius-xl)",
      padding: 20,
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...secTitle,
      marginTop: 0,
      marginBottom: 16
    }
  }, "Agregar compra en cuotas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginBottom: 12
    }
  }, [["Descripción", "text", fName, setFName, "Ej: MacBook Air"], ["Monto total ($)", "number", fTotal, setFTotal, "500000"]].map(([l, t, v, s, p]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: 11,
      fontWeight: 500,
      color: "var(--muted)",
      letterSpacing: "0.03em",
      marginBottom: 6
    }
  }, l), /*#__PURE__*/React.createElement("input", {
    type: t,
    value: v,
    placeholder: p,
    onChange: e => s(e.target.value),
    style: {
      width: "100%",
      background: "var(--surface2)",
      border: "none",
      borderRadius: "var(--radius-sm)",
      color: "var(--text)",
      fontFamily: "var(--font-text)",
      fontSize: 14,
      padding: "10px 12px",
      outline: "none",
      boxSizing: "border-box"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 12,
      marginBottom: 12
    }
  }, [["N° cuotas", "number", fCuotas, setFCuotas, "12"], ["Mes inicio", "number", fMes, setFMes, "6"], ["Año inicio", "number", fAnio, setFAnio, "2026"]].map(([l, t, v, s, p]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: 11,
      fontWeight: 500,
      color: "var(--muted)",
      letterSpacing: "0.03em",
      marginBottom: 6
    }
  }, l), /*#__PURE__*/React.createElement("input", {
    type: t,
    value: v,
    placeholder: p,
    onChange: e => s(e.target.value),
    style: {
      width: "100%",
      background: "var(--surface2)",
      border: "none",
      borderRadius: "var(--radius-sm)",
      color: "var(--text)",
      fontFamily: "var(--font-text)",
      fontSize: 14,
      padding: "10px 12px",
      outline: "none",
      boxSizing: "border-box"
    }
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: addCuota,
    style: {
      width: "100%",
      background: "var(--accent)",
      color: "#fff",
      border: "none",
      borderRadius: "var(--radius-md)",
      padding: 13,
      fontFamily: "var(--font-text)",
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      cursor: "pointer"
    }
  }, "+ Agregar compra")));
}
Object.assign(window, {
  UICalculadora,
  MONTHS_ES,
  INIT_CUOTAS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flujo-caja/CalculadoraTarjeta.jsx", error: String((e && e.message) || e) }); }

// ui_kits/flujo-caja/Settings.jsx
try { (() => {
// ── Finanzas Seba · UI Kit · Settings Section ──────────────────────────────
// Export: window.UISettings

function UISettings({
  settings,
  onUpdate
}) {
  const [flash, setFlash] = React.useState(false);
  function update(patch) {
    onUpdate(patch);
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  }
  const fmt = n => Math.round(n).toLocaleString("es-CL");
  const liq = settings.liquidoMensual * 12;
  const cardStyle = {
    background: "var(--surface)",
    borderRadius: "var(--radius-xl)",
    overflow: "hidden",
    marginBottom: 8
  };
  const rowStyle = last => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 20px",
    borderBottom: last ? "none" : "1px solid var(--border)"
  });
  const labelStyle = {
    fontSize: "var(--text-base)",
    fontWeight: 500,
    color: "var(--text)",
    marginBottom: 2
  };
  const subStyle = {
    fontSize: "var(--text-xs)",
    color: "var(--muted)"
  };
  const secTitle = {
    fontSize: "var(--text-2xs)",
    fontWeight: 600,
    color: "var(--muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 0
  };
  function Row({
    label,
    sublabel,
    value,
    onChange,
    last
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: rowStyle(last)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: labelStyle
    }, label), sublabel && /*#__PURE__*/React.createElement("div", {
      style: subStyle
    }, sublabel)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: "var(--muted)"
      }
    }, "$"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: value || "",
      placeholder: "0",
      onChange: e => onChange(parseInt(e.target.value) || 0),
      style: {
        width: 130,
        textAlign: "right",
        background: "var(--surface2)",
        border: "none",
        borderRadius: "var(--radius-sm)",
        color: "var(--text)",
        fontFamily: "var(--font-text)",
        fontSize: "var(--text-md)",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        padding: "7px 10px",
        outline: "none"
      }
    })));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.02em"
    }
  }, "Configuraci\xF3n"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 2000);
    },
    style: {
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "var(--font-text)",
      color: flash ? "var(--green)" : "var(--accent)",
      background: flash ? "rgba(48,209,88,0.12)" : "var(--accent-soft)",
      border: `1px solid ${flash ? "rgba(48,209,88,0.2)" : "var(--accent-soft-border)"}`,
      padding: "5px 14px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer"
    }
  }, flash ? "Guardado ✓" : "Guardar")), /*#__PURE__*/React.createElement("div", {
    style: secTitle
  }, "Tarjeta de cr\xE9dito"), /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Cupo total",
    sublabel: "L\xEDmite de cr\xE9dito de tu tarjeta",
    value: settings.cupoTotal,
    onChange: v => update({
      cupoTotal: v
    })
  }), /*#__PURE__*/React.createElement(Row, {
    label: "L\xEDmite mensual deseado",
    sublabel: "Alerta cuando el gasto mensual supera este monto",
    value: settings.limiteMensual,
    onChange: v => update({
      limiteMensual: v
    }),
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...secTitle,
      marginTop: 24
    }
  }, "Ingresos"), /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Ingreso mensual l\xEDquido",
    sublabel: "Sueldo neto despu\xE9s de AFP e isapre",
    value: settings.liquidoMensual,
    onChange: v => update({
      liquidoMensual: v
    }),
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--muted)",
      marginTop: 8,
      paddingLeft: 4
    }
  }, "Ingreso anual proyectado: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--secondary)"
    }
  }, "$", fmt(liq))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...secTitle,
      marginTop: 24
    }
  }, "Acerca de"), /*#__PURE__*/React.createElement("div", {
    style: cardStyle
  }, [["Aplicación", "Flujo de Caja"], ["Datos", "Solo locales · no se envían a ningún servidor"], ["Acceso", "nava.ljubetic@gmail.com"]].map(([k, v], i, arr) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: rowStyle(i === arr.length - 1)
  }, /*#__PURE__*/React.createElement("div", {
    style: labelStyle
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--muted)",
      textAlign: "right"
    }
  }, v)))));
}
Object.assign(window, {
  UISettings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/flujo-caja/Settings.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SettingRow = __ds_scope.SettingRow;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
