// ── Finanzas Seba · UI Kit · Settings Section ──────────────────────────────
// Export: window.UISettings

function UISettings({ settings, onUpdate }) {
  const [flash, setFlash] = React.useState(false);

  function update(patch) {
    onUpdate(patch);
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  }

  const fmt = (n) => Math.round(n).toLocaleString("es-CL");
  const liq = settings.liquidoMensual * 12;

  const cardStyle = { background: "var(--surface)", borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: 8 };
  const rowStyle = (last) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    padding: "16px 20px", borderBottom: last ? "none" : "1px solid var(--border)",
  });
  const labelStyle = { fontSize: "var(--text-base)", fontWeight: 500, color: "var(--text)", marginBottom: 2 };
  const subStyle = { fontSize: "var(--text-xs)", color: "var(--muted)" };
  const secTitle = { fontSize: "var(--text-2xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, marginTop: 0 };

  function Row({ label, sublabel, value, onChange, last }) {
    return (
      <div style={rowStyle(last)}>
        <div><div style={labelStyle}>{label}</div>{sublabel && <div style={subStyle}>{sublabel}</div>}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>$</span>
          <input type="number" value={value || ""} placeholder="0"
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            style={{ width: 130, textAlign: "right", background: "var(--surface2)", border: "none", borderRadius: "var(--radius-sm)", color: "var(--text)", fontFamily: "var(--font-text)", fontSize: "var(--text-md)", fontWeight: 600, fontVariantNumeric: "tabular-nums", padding: "7px 10px", outline: "none" }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Configuración</div>
        <button onClick={() => { setFlash(true); setTimeout(() => setFlash(false), 2000); }}
          style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-text)", color: flash ? "var(--green)" : "var(--accent)", background: flash ? "rgba(48,209,88,0.12)" : "var(--accent-soft)", border: `1px solid ${flash ? "rgba(48,209,88,0.2)" : "var(--accent-soft-border)"}`, padding: "5px 14px", borderRadius: "var(--radius-pill)", cursor: "pointer" }}>
          {flash ? "Guardado ✓" : "Guardar"}
        </button>
      </div>

      <div style={secTitle}>Tarjeta de crédito</div>
      <div style={cardStyle}>
        <Row label="Cupo total" sublabel="Límite de crédito de tu tarjeta" value={settings.cupoTotal} onChange={(v) => update({ cupoTotal: v })} />
        <Row label="Límite mensual deseado" sublabel="Alerta cuando el gasto mensual supera este monto" value={settings.limiteMensual} onChange={(v) => update({ limiteMensual: v })} last />
      </div>

      <div style={{ ...secTitle, marginTop: 24 }}>Ingresos</div>
      <div style={cardStyle}>
        <Row label="Ingreso mensual líquido" sublabel="Sueldo neto después de AFP e isapre" value={settings.liquidoMensual} onChange={(v) => update({ liquidoMensual: v })} last />
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, paddingLeft: 4 }}>Ingreso anual proyectado: <strong style={{ color: "var(--secondary)" }}>${fmt(liq)}</strong></div>

      <div style={{ ...secTitle, marginTop: 24 }}>Acerca de</div>
      <div style={cardStyle}>
        {[
          ["Aplicación", "Flujo de Caja"],
          ["Datos", "Solo locales · no se envían a ningún servidor"],
          ["Acceso", "nava.ljubetic@gmail.com"],
        ].map(([k, v], i, arr) => (
          <div key={k} style={rowStyle(i === arr.length - 1)}>
            <div style={labelStyle}>{k}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "right" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { UISettings });
