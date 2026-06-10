import { useState } from "react";

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const USD_CLP = 900;
const UF_HOY  = 40_290.47; // oficial 13 mayo 2026
const IPC     = 0.035;
const EDAD    = 28;

const LIQUIDO    = 2_650_000;
const CAE        = 110_000;
const TELEFONO   =  15_000;
const IPHONE     =  50 * USD_CLP; // $45k
const GYM        =  35_000;
const HOGAR      = 250_000; // $150k cuentas + $100k comida casa (tía + abuela)
const HOGAR_CUENTAS = 150_000;
const HOGAR_COMIDA  = 100_000;
const MICRO      = 13 * 1_600;    // $20.800
const UBER       = Math.round(9 * 15 * USD_CLP); // ~$121.500
const TOTAL_FIJOS = CAE + TELEFONO + IPHONE + GYM + HOGAR; // $455k

const ALIM  = { low: 100_000, mid: 150_000, high: 200_000 };
const OTROS = { low: 120_000, mid: 180_000, high: 260_000 };

function gastoTotal(sc) {
  return ALIM[sc] + MICRO + UBER + TOTAL_FIJOS + OTROS[sc];
}
function ahorroMes(sc) { return LIQUIDO - gastoTotal(sc); }

// ── PROYECCIÓN CARRERA ────────────────────────────────────────────────────────
function crec(a) { return a <= 6 ? 0.05 : a <= 16 ? 0.03 : 0.015; }
function proySueldo(base, n) {
  return Array.from({ length: n }, (_, i) => {
    let s = base;
    for (let a = 0; a < i; a++) s *= (1 + IPC + crec(a));
    return Math.round(s);
  });
}

// ── HIPOTECA ─────────────────────────────────────────────────────────────────
function cuotaUF(precioUF, pieP, tasaA) {
  const c = precioUF * (1 - pieP / 100);
  const i = tasaA / 100 / 12;
  const n = 360;
  return c * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

// ── UTILS ─────────────────────────────────────────────────────────────────────
const F  = n => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
const FK = n => Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 1e3) + "k";

function BarH({ v, max, color = "#34d399" }) {
  return (
    <div style={{ height: 7, background: "#0a0f1a", borderRadius: 99, overflow: "hidden", marginTop: 7 }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.abs(v) / max * 100)}%`, background: color, borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
}

const PLAZOS = [12, 18, 24, 30, 36, 48];

export default function App() {
  const [sc, setSc]           = useState("mid");
  const [tab, setTab]         = useState("resumen");
  const [precioUF, setPrecioUF] = useState(5_250);
  const [pie, setPie]         = useState(20);
  const [tasa, setTasa]       = useState(4.25);
  const [ahorroAct, setAhorroAct] = useState(18_000_000);

  // ── Cálculos resumen ──
  const gasto  = gastoTotal(sc);
  const ahorroM = ahorroMes(sc);
  const tasaPct = Math.round(ahorroM / LIQUIDO * 100);

  // ── Cálculos depto ──
  const precioCLP = Math.round(precioUF * UF_HOY);
  const pieNec    = Math.round(precioCLP * pie / 100);
  const falta     = Math.max(0, pieNec - ahorroAct);
  const cuota     = cuotaUF(precioUF, pie, tasa);
  const divHoy    = Math.round(cuota * UF_HOY);
  const meses     = falta <= 0 ? 0 : Math.ceil(falta / ahorroM);
  const pctPie    = Math.min(100, Math.round(ahorroAct / pieNec * 100));
  const acCol     = tasa === 4 ? "#34d399" : tasa === 4.25 ? "#fbbf24" : "#f87171";

  // ── Proyección 30 años ──
  const PROJ_AÑOS = [0, 4, 9, 14, 19, 24, 29];
  const sueldoPlu = proySueldo(ahorroM, 30);
  const projDiv   = Array.from({ length: 30 }, (_, i) => Math.round(cuota * UF_HOY * Math.pow(1 + IPC, i)));

  const fechaM = m => {
    const d = new Date(2026, 4);
    d.setMonth(d.getMonth() + m);
    return d.toLocaleDateString("es-CL", { month: "short", year: "numeric" });
  };

  // ── Patrimonio ──
  const pat = (() => {
    const sueldos = proySueldo(LIQUIDO, 60);
    let acc = ahorroAct;
    return sueldos.map((s, i) => {
      const a = Math.max(0, s - gastoTotal("mid") * Math.pow(1 + IPC, i / 12));
      acc += a;
      return Math.round(acc);
    });
  })();

  const scColors = { low: "#34d399", mid: "#fbbf24", high: "#f87171" };
  const scLabels = { low: "Austero", mid: "Normal", high: "Holgado" };

  const GASTOS_LIST = [
    { emoji: "🛒", label: "Alimentación (alm. 3x + cenas + fds)", v: ALIM[sc] },
    { emoji: "🚌", label: "Micro Vitacura (3x/sem)", v: MICRO },
    { emoji: "🚕", label: "Uber nocturno (~9 viajes × $15 USD)", v: UBER, color: "#fb923c" },
    { emoji: "📦", label: "Ocio, ropa, fotografía, buffer", v: OTROS[sc] },
    { emoji: "🎓", label: "CAE", v: CAE, color: "#fbbf24", tag: "DEUDA" },
    { emoji: "📱", label: "Telefonía", v: TELEFONO },
    { emoji: "📱", label: "iPhone For Life (50 USD)", v: IPHONE, color: "#e879f9", tag: "CUOTA" },
    { emoji: "💪", label: "Gym", v: GYM },
    { emoji: "🏠", label: "Hogar — cuentas ($150k) + comida casa ($100k)", v: HOGAR },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060c18", color: "#e2e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "36px 16px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#1e3a5f", fontFamily: "monospace", marginBottom: 8, textTransform: "uppercase" }}>Seba Nava · Plutto · Mayo 2026</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, color: "#f1f5f9", letterSpacing: -1 }}>Forecast personal</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ background: "#818cf818", color: "#818cf8", border: "1px solid #818cf833", borderRadius: 99, padding: "3px 12px", fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>Implementation Engineer</span>
          <span style={{ background: "#34d39918", color: "#34d399", border: "1px solid #34d39933", borderRadius: 99, padding: "3px 12px", fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>✓ ACEPTADO</span>
        </div>
        <p style={{ color: "#334155", fontSize: 12, marginTop: 8, fontFamily: "monospace" }}>Peñalolén · sin arriendo · 3x/sem Vitacura · $2.650.000 líquido</p>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0a1018", padding: 4, borderRadius: 12, border: "1px solid #1e293b", flexWrap: "wrap" }}>
        {[["resumen", "📊 Resumen"], ["gastos", "💸 Gastos"], ["depto", "🏠 Depto"], ["patrimonio", "📈 Patrimonio"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: tab === k ? "#818cf8" : "transparent", color: tab === k ? "#060c18" : "#475569", transition: "all .2s" }}>{l}</button>
        ))}
      </div>

      {/* ══ TAB RESUMEN ══ */}
      {tab === "resumen" && (
        <div style={{ width: "100%", maxWidth: 650, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* escenario */}
          <div style={{ display: "flex", gap: 5, background: "#0a1018", padding: 4, borderRadius: 12, border: "1px solid #1e293b" }}>
            {["low", "mid", "high"].map(s => (
              <button key={s} onClick={() => setSc(s)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: sc === s ? scColors[s] : "transparent", color: sc === s ? "#060c18" : "#475569", transition: "all .2s" }}>{scLabels[s]}</button>
            ))}
          </div>

          {/* ahorro hero */}
          <div style={{ background: "linear-gradient(160deg,#0f1825,#0a1018)", borderRadius: 20, padding: "24px 22px", border: "1px solid #818cf828" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Ingreso mensual</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#818cf8", fontFamily: "monospace", lineHeight: 1 }}>{F(LIQUIDO)}</div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginTop: 4 }}>AFP + isapre ya descontados</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Gasto mensual</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#f87171", fontFamily: "monospace", lineHeight: 1 }}>-{FK(gasto)}</div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginTop: 4 }}>{100 - tasaPct}% del ingreso</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 16 }}>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>Ahorro mensual</div>
              <div style={{ fontSize: 46, fontWeight: 800, color: ahorroM >= 0 ? "#34d399" : "#f87171", fontFamily: "monospace", lineHeight: 1 }}>{F(ahorroM)}</div>
              <BarH v={ahorroM} max={2_000_000} color="#34d399" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{tasaPct}% del ingreso</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#34d399", fontFamily: "monospace" }}>{FK(ahorroM * 12)} al año</span>
              </div>
            </div>
          </div>

          {/* métricas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Ahorro año 1", v: FK(ahorroM * 12), color: "#34d399" },
              { label: "Patrimonio en 2 años", v: FK(pat[23] || 0), color: "#818cf8" },
              { label: "Fijos inamovibles", v: FK(TOTAL_FIJOS), color: "#fbbf24" },
              { label: "Uber nocturno/mes", v: FK(UBER), color: "#fb923c" },
            ].map((m, i) => (
              <div key={i} style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color, fontFamily: "monospace" }}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* supuestos */}
          <div style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Supuestos</div>
            {["Carta de oferta Plutto · $2.650.000 líquido · sin beneficio de almuerzo",
              "Paga almuerzo 3 días/sem en Vitacura + cenas + fds",
              "Uber nocturno ~9 viajes/mes × $15 USD · vuelta a Peñalolén",
              "AFP + isapre ya descontados · sin arriendo en Peñalolén",
              "Fijos: CAE $110k · tel $15k · iPhone $45k · gym $35k · hogar $250k (cuentas $150k + comida casa $100k)"
            ].map((n, i) => (
              <div key={i} style={{ fontSize: 11, color: "#334155", fontFamily: "monospace", marginBottom: 4 }}>· {n}</div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB GASTOS ══ */}
      {tab === "gastos" && (
        <div style={{ width: "100%", maxWidth: 650, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 5, background: "#0a1018", padding: 4, borderRadius: 12, border: "1px solid #1e293b" }}>
            {["low", "mid", "high"].map(s => (
              <button key={s} onClick={() => setSc(s)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: sc === s ? scColors[s] : "transparent", color: sc === s ? "#060c18" : "#475569", transition: "all .2s" }}>{scLabels[s]}</button>
            ))}
          </div>

          <div style={{ background: "linear-gradient(160deg,#0f1825,#0a1018)", borderRadius: 20, padding: "22px 20px", border: "1px solid #818cf828" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Desglose completo</div>
            {GASTOS_LIST.map((g, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: g.color || "#64748b" }}>
                  {g.emoji} {g.label}
                  {g.tag && <span style={{ fontSize: 9, marginLeft: 6, fontFamily: "monospace", opacity: 0.5 }}>{g.tag}</span>}
                </span>
                <span style={{ fontSize: 13, fontWeight: g.color ? 700 : 500, fontFamily: "monospace", color: g.color || "#64748b" }}>{F(g.v)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12, marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Total gasto</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#f87171", fontFamily: "monospace" }}>-{F(gasto)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Ahorro</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#34d399", fontFamily: "monospace" }}>{F(ahorroM)}</span>
              </div>
            </div>
          </div>

          {/* distribución */}
          <div style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Distribución del ingreso</div>
            {[
              { label: "💚 Ahorro", v: ahorroM, color: "#34d399" },
              { label: "🏠 Hogar + fijos", v: TOTAL_FIJOS, color: "#fbbf24" },
              { label: "🚕 Uber nocturno", v: UBER, color: "#fb923c" },
              { label: "🛒 Alimentación", v: ALIM[sc], color: "#38bdf8" },
              { label: "🚌 Micro", v: MICRO, color: "#818cf8" },
              { label: "📦 Ocio + otros", v: OTROS[sc], color: "#a3e635" },
            ].map((r, i) => {
              const p = Math.round(r.v / LIQUIDO * 100);
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: r.color }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: r.color, fontWeight: 700 }}>{p}% · {FK(r.v)}</span>
                  </div>
                  <div style={{ height: 5, background: "#060c16", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: r.color, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TAB DEPTO ══ */}
      {tab === "depto" && (
        <div style={{ width: "100%", maxWidth: 650, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* header UF */}
          <div style={{ background: "#0a1018", border: "1px solid #818cf822", borderRadius: 16, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>Simulador hipotecario · Sistema francés · 30 años</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Seba, 28 años — sueldo crece con IPC + carrera</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace" }}>UF HOY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#818cf8", fontFamily: "monospace" }}>${UF_HOY.toLocaleString("es-CL")}</div>
            </div>
          </div>

          {/* controles */}
          <div style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* precio */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>🏢 Precio depto</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#818cf8", fontFamily: "monospace" }}>UF {precioUF.toLocaleString()} · {F(precioCLP)}</span>
              </div>
              <input type="range" min={5000} max={10000} step={100} value={precioUF} onChange={e => setPrecioUF(+e.target.value)} style={{ width: "100%", accentColor: "#818cf8" }} />
              <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", marginTop: 6, background: "#060c16", borderRadius: 8, padding: "4px 10px", display: "inline-block" }}>
                📍 {precioUF <= 5500 ? "Providencia / La Reina mid" : precioUF <= 7000 ? "Las Condes / Providencia premium" : precioUF <= 8500 ? "Vitacura entry / Las Condes top" : "Vitacura / Las Condes premium"}
              </div>
            </div>

            {/* ahorro actual */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>💰 Ahorro actual</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#34d399", fontFamily: "monospace" }}>{F(ahorroAct)}</span>
              </div>
              <input type="range" min={0} max={80000000} step={500000} value={ahorroAct} onChange={e => setAhorroAct(+e.target.value)} style={{ width: "100%", accentColor: "#34d399" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#334155", fontFamily: "monospace", marginTop: 2 }}>
                <span>$0</span><span>$20M</span><span>$40M</span><span>$60M</span><span>$80M</span>
              </div>
            </div>

            {/* pie */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>🏦 Pie</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#a3e635", fontFamily: "monospace" }}>{pie}% · {F(pieNec)}</span>
              </div>
              <input type="range" min={10} max={40} step={5} value={pie} onChange={e => setPie(+e.target.value)} style={{ width: "100%", accentColor: "#a3e635" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#334155", fontFamily: "monospace", marginTop: 2 }}>
                {[10, 15, 20, 25, 30, 35, 40].map(v => <span key={v}>{v}%</span>)}
              </div>
            </div>

            {/* tasa */}
            <div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>📈 Tasa hipotecaria (UF + %)</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[[4, "#34d399", "Itaú/Estado"], [4.25, "#fbbf24", "Promedio"], [4.5, "#f87171", "Conservador"]].map(([t, c, lbl]) => (
                  <button key={t} onClick={() => setTasa(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: `1px solid ${tasa === t ? c + "66" : "#1e293b"}`, background: tasa === t ? c + "18" : "transparent", color: tasa === t ? c : "#475569", cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: 700, transition: "all .2s" }}>
                    {t}%<div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{lbl}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* resumen hipoteca */}
          <div style={{ background: "#060c16", border: `1px solid ${acCol}22`, borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Crédito · 30 años · UF+{tasa}%</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { l: "Precio", v: `UF ${precioUF.toLocaleString()}`, s: F(precioCLP), c: "#e2e8f0" },
                { l: `Pie ${pie}%`, v: F(pieNec), s: `UF ${Math.round(precioUF * pie / 100).toLocaleString()}`, c: "#a3e635" },
                { l: "Crédito banco", v: F(Math.round(precioCLP * (1 - pie / 100))), s: `UF ${Math.round(precioUF * (1 - pie / 100)).toLocaleString()}`, c: "#94a3b8" },
                { l: "Te falta para el pie", v: falta <= 0 ? "¡Ya tienes el pie!" : F(falta), s: falta <= 0 ? "🎉" : "por ahorrar", c: falta <= 0 ? "#34d399" : "#f87171" },
              ].map((r, i) => (
                <div key={i} style={{ background: "#0a1018", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 3 }}>{r.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: r.c, fontFamily: "monospace" }}>{r.v}</div>
                  <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", marginTop: 1 }}>{r.s}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0a1018", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Dividendo inicial</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: acCol, fontFamily: "monospace", lineHeight: 1 }}>{F(divHoy)}</div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", marginTop: 4 }}>UF {cuota.toFixed(2)}/mes · sube ~3,5%/año con IPC</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {[10, 20, 30].map(a => (
                  <div key={a} style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace" }}>Año {a}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>{F(projDiv[a - 1] || 0)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* progreso pie */}
          <div style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Progreso hacia el pie</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a3e635", fontFamily: "monospace" }}>{pctPie}%</span>
            </div>
            <div style={{ height: 10, background: "#060c16", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${pctPie}%`, background: "linear-gradient(90deg,#a3e63588,#a3e635)", borderRadius: 99, boxShadow: "0 0 10px #a3e63555" }} />
            </div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{F(ahorroAct)} de {F(pieNec)} necesarios</div>
          </div>

          {/* ── CUÁNTO AHORRAR MENSUAL ── */}
          <div style={{ background: "linear-gradient(160deg,#0f1825,#0a1018)", border: "1px solid #34d39922", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Ahorro mínimo mensual por plazo</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>
              Partiendo de <span style={{ color: "#34d399", fontWeight: 700 }}>{F(ahorroAct)}</span> · falta <span style={{ color: "#fbbf24", fontWeight: 700 }}>{F(falta)}</span> para el pie
            </div>

            {falta <= 0 ? (
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399", fontFamily: "monospace" }}>¡Ya tienes el pie completo! 🎉</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PLAZOS.map(m => {
                  const nec   = Math.ceil(falta / m);
                  const diff  = ahorroM - nec;
                  const color = diff >= 0 ? "#34d399" : diff >= -150_000 ? "#fbbf24" : "#f87171";
                  const pct   = Math.min(100, Math.round(ahorroM / nec * 100));
                  return (
                    <div key={m} style={{ background: "#0a1018", borderRadius: 12, padding: "12px 14px", border: `1px solid ${color}18` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{m} meses</span>
                          <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginLeft: 8 }}>{Math.round(m / 12 * 10) / 10} años · {fechaM(m)}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "monospace", lineHeight: 1 }}>{F(nec)}</div>
                          <div style={{ fontSize: 9, color: "#475569", fontFamily: "monospace" }}>/mes necesario</div>
                        </div>
                      </div>
                      <div style={{ height: 5, background: "#060c16", borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width .4s", boxShadow: `0 0 6px ${color}44` }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
                        Tu ahorro actual ({FK(ahorroM)}) cubre el {pct}% ·{" "}
                        <span style={{ color, fontWeight: 700 }}>
                          {diff >= 0 ? `te sobran ${FK(diff)}/mes` : `necesitas ${FK(Math.abs(diff))} más/mes`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* proyección 30 años */}
          <div style={{ background: "#060c16", border: "1px solid #1e293b", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Dividendo vs sueldo proyectado · 30 años</div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Sueldo: IPC + <span style={{ color: "#34d399" }}>5% real</span> (28–35) → <span style={{ color: "#fbbf24" }}>3%</span> (35–45) → <span style={{ color: "#94a3b8" }}>1,5%</span> (45+)</div>
            {PROJ_AÑOS.map(año => {
              const div  = projDiv[año] || 0;
              const sue  = sueldoPlu[año] || ahorroM;
              const p    = Math.round(div / (sue + div) * 100);
              const col  = p > 35 ? "#f87171" : p > 25 ? "#fbbf24" : "#34d399";
              return (
                <div key={año} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>Año {año + 1} · {EDAD + año} años</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: col, fontWeight: 700 }}>{p}% · div {FK(div)} · sueldo {FK(sue)}</span>
                  </div>
                  <div style={{ height: 5, background: "#0a1018", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: `linear-gradient(90deg,${col}88,${col})`, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ TAB PATRIMONIO ══ */}
      {tab === "patrimonio" && (
        <div style={{ width: "100%", maxWidth: 650, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#0a1018", border: "1px solid #818cf822", borderRadius: 16, padding: "14px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Proyección patrimonial · 5 años</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Sueldo crece IPC + <span style={{ color: "#34d399" }}>5% real/año</span> · ahorro acumula mes a mes</div>
          </div>

          {/* hitos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Hoy", v: ahorroAct, edad: EDAD },
              { label: "Año 1", v: pat[11] || 0, edad: EDAD + 1 },
              { label: "Año 2", v: pat[23] || 0, edad: EDAD + 2 },
              { label: "Año 3", v: pat[35] || 0, edad: EDAD + 3 },
              { label: "Año 4", v: pat[47] || 0, edad: EDAD + 4 },
              { label: "Año 5", v: pat[59] || 0, edad: EDAD + 5 },
            ].map((h, i) => (
              <div key={i} style={{ background: "linear-gradient(160deg,#0f1825,#0a1018)", borderRadius: 14, padding: "14px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginBottom: 2 }}>{h.label} · {h.edad} años</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#818cf8", fontFamily: "monospace", lineHeight: 1.1 }}>{FK(h.v)}</div>
                <div style={{ height: 3, background: "#0a0f1a", borderRadius: 99, overflow: "hidden", marginTop: 6 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, h.v / (pat[59] || 1) * 100)}%`, background: "#818cf8", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          {/* sueldo proyectado */}
          <div style={{ background: "#0a1018", border: "1px solid #1e293b", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Sueldo proyectado año a año</div>
            {[0, 1, 2, 3, 4].map(año => {
              const s   = proySueldo(LIQUIDO, (año + 1) * 12).slice(-1)[0];
              const pct = Math.min(100, Math.round(s / 4_500_000 * 100));
              const inc = Math.round((s - LIQUIDO) / LIQUIDO * 100);
              return (
                <div key={año} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>Año {año + 1} · {EDAD + año} años</span>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#818cf8", fontWeight: 700 }}>
                      {F(s)} {año > 0 && <span style={{ color: "#34d399", fontSize: 10 }}>(+{inc}%)</span>}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "#060c16", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#818cf888,#818cf8)", borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* meta depto */}
          <div style={{ background: "#071510", border: "1px solid #14532d", borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Meta depto · Providencia / La Reina · UF 5.250</div>
            {[
              { label: "Pie necesario (20%)", v: F(Math.round(5250 * UF_HOY * 0.2)), color: "#a3e635" },
              { label: "Tienes hoy", v: F(18_000_000), color: "#34d399" },
              { label: "Falta", v: F(Math.max(0, Math.round(5250 * UF_HOY * 0.2) - 18_000_000)), color: "#fbbf24" },
              { label: "Meses ahorrando normal", v: `~${Math.ceil(Math.max(0, Math.round(5250 * UF_HOY * 0.2) - 18_000_000) / ahorroMes("mid"))} meses`, color: "#818cf8" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>{r.label}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: r.color, fontFamily: "monospace" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
