"use client";

import { useState } from "react";

// ── PALETA ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "var(--bg)",
  surface:  "var(--surface)",
  surface2: "var(--surface2)",
  surface3: "var(--badge-bg)",
  border:   "var(--border)",
  accent:   "var(--accent)",
  text:     "var(--text)",
  secondary:"var(--secondary)",
  muted:    "var(--muted)",
  green:    "var(--green)",
  yellow:   "var(--yellow)",
  orange:   "var(--orange)",
  red:      "var(--red)",
};

// ── DATOS ────────────────────────────────────────────────────────────────────
const USD_CLP = 900;
const UF_HOY  = 40_290.47;
const IPC     = 0.035;
const EDAD    = 28;

const CAE         = 110_000;
const TELEFONO    =  15_000;
const IPHONE      =  50 * USD_CLP;
const GYM         =  35_000;
const HOGAR       = 250_000;
const MICRO       = 13 * 1_600;
const UBER        = Math.round(9 * 15 * USD_CLP);
const TOTAL_FIJOS = CAE + TELEFONO + IPHONE + GYM + HOGAR;

type Sc = "low" | "mid" | "high";

const ALIM:  Record<Sc, number> = { low: 100_000, mid: 150_000, high: 200_000 };
const OTROS: Record<Sc, number> = { low: 120_000, mid: 180_000, high: 260_000 };

function gastoTotal(liquido: number, sc: Sc) { return ALIM[sc] + MICRO + UBER + TOTAL_FIJOS + OTROS[sc]; }
function ahorroMes(liquido: number, sc: Sc)  { return liquido - gastoTotal(liquido, sc); }

function crec(a: number): number { return a <= 6 ? 0.05 : a <= 16 ? 0.03 : 0.015; }
function proySueldo(base: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => {
    let s = base;
    for (let a = 0; a < i; a++) s *= (1 + IPC + crec(a));
    return Math.round(s);
  });
}

function cuotaUF(precioUF: number, pieP: number, tasaA: number): number {
  const c = precioUF * (1 - pieP / 100);
  const i = tasaA / 100 / 12;
  const n = 360;
  return c * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

const F  = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
const FK = (n: number) => Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 1e3) + "k";

// ── COMPONENTES BASE ──────────────────────────────────────────────────────────
function Bar({ v, max, color = C.green }: { v: number; max: number; color?: string }) {
  return (
    <div style={{ height: 4, background: C.surface2, borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.abs(v) / max * 100)}%`, background: color, borderRadius: 99, transition: "width .5s ease" }} />
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.surface, borderRadius: 16, padding: "20px", ...style }}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 500, color: C.muted, marginBottom: 4, letterSpacing: "0.03em" }}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 10, marginTop: 28 }}>{children}</div>;
}

const PLAZOS = [12, 18, 24, 30, 36, 48];

const MONTHS_ES_F = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface ForecastProps {
  liquidoMensual: number;
  gastosReales: Record<string, number>;
  caeDeuda: number;
  onGastosChange: (key: string, value: number) => void;
  onCaeDeudaChange: (v: number) => void;
}

export default function ForecastAhorro({ liquidoMensual, gastosReales, caeDeuda, onGastosChange, onCaeDeudaChange }: ForecastProps) {
  const [sc, setSc]               = useState<Sc>("mid");
  const [tab, setTab]             = useState("resumen");
  const [realKey, setRealKey]     = useState(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
  const [precioUF, setPrecioUF]   = useState(5_250);
  const [pie, setPie]             = useState(20);
  const [tasa, setTasa]           = useState(4.25);
  const [ahorroAct, setAhorroAct] = useState(18_000_000);

  const gasto   = gastoTotal(liquidoMensual, sc);
  const ahorroM = ahorroMes(liquidoMensual, sc);
  const tasaPct = Math.round(ahorroM / liquidoMensual * 100);

  const precioCLP = Math.round(precioUF * UF_HOY);
  const pieNec    = Math.round(precioCLP * pie / 100);
  const falta     = Math.max(0, pieNec - ahorroAct);
  const cuota     = cuotaUF(precioUF, pie, tasa);
  const divHoy    = Math.round(cuota * UF_HOY);
  const pctPie    = Math.min(100, Math.round(ahorroAct / pieNec * 100));
  const acCol     = tasa === 4 ? C.green : tasa === 4.25 ? C.yellow : C.red;

  const PROJ_AÑOS = [0, 4, 9, 14, 19, 24, 29];
  const sueldoPlu = proySueldo(ahorroM, 30);
  const projDiv   = Array.from({ length: 30 }, (_, i) => Math.round(cuota * UF_HOY * Math.pow(1 + IPC, i)));

  const fechaM = (m: number) => {
    const d = new Date(2026, 4);
    d.setMonth(d.getMonth() + m);
    return d.toLocaleDateString("es-CL", { month: "short", year: "numeric" });
  };

  const pat = (() => {
    const sueldos = proySueldo(liquidoMensual, 60);
    let acc = ahorroAct;
    return sueldos.map((s, i) => {
      const a = Math.max(0, s - gastoTotal(liquidoMensual, "mid") * Math.pow(1 + IPC, i / 12));
      acc += a;
      return Math.round(acc);
    });
  })();

  const scColors = { low: C.green, mid: C.yellow, high: C.red };
  const scLabels = { low: "Austero", mid: "Normal", high: "Holgado" };

  const GASTOS_LIST = [
    { label: "Alimentación", v: ALIM[sc] },
    { label: "Micro Vitacura", v: MICRO },
    { label: "Uber nocturno", v: UBER, color: C.orange },
    { label: "Ocio / fotografía / ropa", v: OTROS[sc] },
    { label: "CAE", v: CAE, color: C.yellow, tag: "Deuda" },
    { label: "Telefonía", v: TELEFONO },
    { label: "iPhone For Life", v: IPHONE, tag: "Cuota" },
    { label: "Gym", v: GYM },
    { label: "Hogar (cuentas + comida)", v: HOGAR },
  ];

  const ScSelector = () => (
    <div style={{ display: "flex", gap: 2, background: C.surface, borderRadius: 10, padding: 3, marginBottom: 20 }}>
      {(["low","mid","high"] as Sc[]).map(s => (
        <button key={s} onClick={() => setSc(s)} style={{
          flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
          fontFamily: "inherit", fontSize: 13, fontWeight: 500,
          background: sc === s ? C.surface2 : "transparent",
          color: sc === s ? C.text : C.secondary,
          transition: "all .15s",
        }}>{scLabels[s]}</button>
      ))}
    </div>
  );

  return (
    <div style={{ color: C.text, fontFamily: "inherit" }}>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 2, background: C.surface, borderRadius: 10, padding: 3, marginBottom: 28 }}>
        {[["resumen","Resumen"],["gastos","Gastos"],["real","Real"],["depto","Depto"],["patrimonio","Patrimonio"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontSize: 12, fontWeight: 500,
            background: tab === k ? C.surface2 : "transparent",
            color: tab === k ? C.text : C.secondary,
            transition: "all .15s",
          }}>{l}</button>
        ))}
      </div>

      {/* ── RESUMEN ── */}
      {tab === "resumen" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ScSelector />

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <Label>Ingreso mensual</Label>
                <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.04em", color: C.text, fontVariantNumeric: "tabular-nums" }}>{F(liquidoMensual)}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>AFP + isapre descontados</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Label>Gasto mensual</Label>
                <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.04em", color: C.red, fontVariantNumeric: "tabular-nums" }}>-{F(gasto)}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{100 - tasaPct}% del ingreso</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <Label>Ahorro mensual</Label>
              <div style={{ fontSize: 48, fontWeight: 300, letterSpacing: "-0.05em", color: ahorroM >= 0 ? C.green : C.red, fontVariantNumeric: "tabular-nums" }}>{F(ahorroM)}</div>
              <Bar v={ahorroM} max={2_000_000} color={C.green} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: C.muted }}>{tasaPct}% del ingreso</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{FK(ahorroM * 12)} al año</span>
              </div>
            </div>
          </Card>

          {/* Comparativa de los 3 escenarios */}
          <Card>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Total por escenario</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: C.border, borderRadius: 12, overflow: "hidden" }}>
              {(["low","mid","high"] as Sc[]).map(s => {
                const g = gastoTotal(liquidoMensual, s);
                const a = ahorroMes(liquidoMensual, s);
                const isActive = sc === s;
                return (
                  <button key={s} onClick={() => setSc(s)} style={{
                    background: isActive ? C.surface2 : C.surface,
                    border: "none", cursor: "pointer", padding: "14px 12px",
                    textAlign: "center", fontFamily: "inherit",
                    outline: isActive ? `2px solid ${scColors[s]}44` : "none",
                    outlineOffset: -2, transition: "all .15s",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: scColors[s], letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{scLabels[s]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.red, fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>-{FK(g)}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{F(g)}</div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>ahorro</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: a >= 0 ? C.green : C.red, fontVariantNumeric: "tabular-nums" }}>{FK(a)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Ahorro año 1", v: FK(ahorroM * 12), color: C.green },
              { label: "Patrimonio 2 años", v: FK(pat[23] || 0), color: C.accent },
              { label: "Fijos inamovibles", v: FK(TOTAL_FIJOS), color: C.yellow },
              { label: "Uber nocturno / mes", v: FK(UBER), color: C.orange },
            ].map((m, i) => (
              <Card key={i}>
                <Label>{m.label}</Label>
                <div style={{ fontSize: 24, fontWeight: 600, color: m.color, letterSpacing: "-0.03em" }}>{m.v}</div>
              </Card>
            ))}
          </div>

          <Card>
            <Label>Supuestos</Label>
            {["Carta de oferta Plutto · $2.650.000 líquido",
              "Almuerzo 3 días/sem en Vitacura + cenas + fds",
              "Uber nocturno ~9 viajes/mes × $15 USD",
              "AFP + isapre ya descontados · sin arriendo",
              "Fijos: CAE $110k · tel $15k · iPhone $45k · gym $35k · hogar $250k",
            ].map((n, i) => (
              <div key={i} style={{ fontSize: 12, color: C.muted, marginBottom: 4, paddingLeft: 12, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: C.muted }}>·</span>{n}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── GASTOS ── */}
      {tab === "gastos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ScSelector />
          <Card>
            <SectionTitle>Desglose</SectionTitle>
            {GASTOS_LIST.map((g, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < GASTOS_LIST.length-1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 14, color: g.color || C.secondary }}>
                  {g.label}
                  {g.tag && <span style={{ fontSize: 10, marginLeft: 8, color: C.muted, background: C.surface2, borderRadius: 6, padding: "1px 6px" }}>{g.tag}</span>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: g.color || C.secondary, fontVariantNumeric: "tabular-nums" }}>{F(g.v)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, marginTop: 4, borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, color: C.secondary, fontWeight: 500 }}>Total gastos</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.red, fontVariantNumeric: "tabular-nums" }}>-{F(gasto)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>Ahorro neto</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.green, fontVariantNumeric: "tabular-nums" }}>{F(ahorroM)}</span>
            </div>
          </Card>

          {/* CAE TRACKER */}
          <Card>
            <SectionTitle>CAE Tracker</SectionTitle>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.secondary }}>Deuda restante</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: caeDeuda > 0 ? C.yellow : C.green }}>{caeDeuda > 0 ? `$${Math.round(caeDeuda / 1000)}k` : "¡Pagado!"}</span>
              </div>
              <input type="range" min={0} max={10000000} step={100000} value={caeDeuda} onChange={e => onCaeDeudaChange(+e.target.value)} style={{ width: "100%", accentColor: C.yellow }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 3 }}>
                <span>$0</span><span>$2.5M</span><span>$5M</span><span>$7.5M</span><span>$10M</span>
              </div>
            </div>
            {caeDeuda > 0 && (() => {
              const cuotaCAE = CAE;
              const mesesRestantes = Math.ceil(caeDeuda / cuotaCAE);
              const d = new Date(new Date().getFullYear(), new Date().getMonth() + mesesRestantes, 1);
              const ahorroLibera = cuotaCAE;
              const totalPagar = mesesRestantes * cuotaCAE;
              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { l: "Cuota mensual", v: `$${Math.round(cuotaCAE/1000)}k`, c: C.yellow },
                    { l: "Meses restantes", v: `${mesesRestantes} meses`, c: C.text },
                    { l: "Termina en", v: `${MONTHS_ES_F[d.getMonth()].slice(0,3)} ${d.getFullYear()}`, c: C.accent },
                    { l: "Total restante a pagar", v: `$${Math.round(totalPagar/1000)}k`, c: C.secondary },
                  ].map((r, i) => (
                    <div key={i} style={{ background: C.surface2, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{r.l}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: r.c }}>{r.v}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
            {caeDeuda === 0 && <div style={{ fontSize: 14, color: C.green, fontWeight: 600 }}>CAE pagado — liberaste ${Math.round(CAE/1000)}k/mes</div>}
          </Card>

          <Card>
            <SectionTitle>Distribución</SectionTitle>
            {[
              { label: "Ahorro", v: ahorroM, color: C.green },
              { label: "Hogar + fijos", v: TOTAL_FIJOS, color: C.yellow },
              { label: "Uber nocturno", v: UBER, color: C.orange },
              { label: "Alimentación", v: ALIM[sc], color: C.accent },
              { label: "Micro", v: MICRO, color: C.secondary },
              { label: "Ocio + otros", v: OTROS[sc], color: "#a3e635" },
            ].map((r, i) => {
              const p = Math.round(r.v / liquidoMensual * 100);
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: r.color }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{p}%</span>
                  </div>
                  <div style={{ height: 4, background: C.surface2, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: r.color, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── REAL ── */}
      {tab === "real" && (() => {
        const recentMonths = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          return { key, label: `${MONTHS_ES_F[d.getMonth()].slice(0, 3)} ${d.getFullYear()}` };
        });
        const realVal = gastosReales[realKey] ?? 0;
        const selectedMonth = recentMonths.find(m => m.key === realKey);
        const ahorroReal = realVal > 0 ? liquidoMensual - realVal : null;

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 12 }}>Seleccionar mes</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {recentMonths.map(m => (
                  <button key={m.key} onClick={() => setRealKey(m.key)} style={{
                    padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 12, fontWeight: 500,
                    background: realKey === m.key ? C.accent : C.surface2,
                    color: realKey === m.key ? "#fff" : C.secondary,
                    transition: "all .15s",
                  }}>{m.label}</button>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                Gasto real · {selectedMonth?.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 20, color: C.muted }}>$</span>
                <input
                  type="number"
                  value={realVal || ""}
                  placeholder="0"
                  onChange={e => onGastosChange(realKey, parseInt(e.target.value) || 0)}
                  style={{
                    flex: 1, background: C.surface2, border: "none", borderRadius: 8,
                    color: C.text, fontFamily: "inherit", fontSize: 22, fontWeight: 600,
                    padding: "10px 12px", outline: "none", fontVariantNumeric: "tabular-nums",
                  }}
                />
              </div>
              {ahorroReal !== null && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: C.secondary }}>Ahorro real</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ahorroReal >= 0 ? C.green : C.red, fontVariantNumeric: "tabular-nums" }}>
                    {ahorroReal >= 0 ? `$${(ahorroReal/1000).toFixed(0)}k` : `-$${(Math.abs(ahorroReal)/1000).toFixed(0)}k`}
                  </span>
                </div>
              )}
            </Card>

            {realVal > 0 && (
              <Card>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                  Real vs Forecast
                </div>
                {(["low","mid","high"] as Sc[]).map(s => {
                  const fcast = gastoTotal(liquidoMensual, s);
                  const diff = realVal - fcast;
                  const pct = Math.round((realVal / fcast) * 100);
                  const color = diff <= 0 ? C.green : diff <= fcast * 0.1 ? C.yellow : C.red;
                  return (
                    <div key={s} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: { low: C.green, mid: C.yellow, high: C.red }[s] }}>
                          {{ low: "Austero", mid: "Normal", high: "Holgado" }[s]}
                          <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>${(fcast/1000).toFixed(0)}k estimado</span>
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color }}>
                          {diff <= 0 ? `${Math.abs(diff/1000).toFixed(0)}k bajo` : `${(diff/1000).toFixed(0)}k sobre`}
                        </span>
                      </div>
                      <div style={{ height: 4, background: C.surface2, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{pct}% del forecast</div>
                    </div>
                  );
                })}
                {ahorroReal !== null && (
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: C.secondary }}>Ahorro real este mes</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: ahorroReal >= 0 ? C.green : C.red, fontVariantNumeric: "tabular-nums" }}>
                      {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(ahorroReal)}
                    </span>
                  </div>
                )}
              </Card>
            )}

            {Object.keys(gastosReales).length > 0 && (
              <Card>
                <SectionTitle>Historial</SectionTitle>
                {Object.entries(gastosReales)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 6)
                  .map(([k, v]) => {
                    const [y, m] = k.split("-");
                    const ahorro = liquidoMensual - v;
                    return (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 13, color: C.secondary }}>{MONTHS_ES_F[parseInt(m) - 1].slice(0,3)} {y}</span>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>${(v/1000).toFixed(0)}k gastado</div>
                          <div style={{ fontSize: 11, color: ahorro >= 0 ? C.green : C.red }}>
                            {ahorro >= 0 ? `+$${(ahorro/1000).toFixed(0)}k ahorrado` : `-$${(Math.abs(ahorro)/1000).toFixed(0)}k déficit`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Card>
            )}
          </div>
        );
      })()}

      {/* ── DEPTO ── */}
      {tab === "depto" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Simulador hipotecario</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Sistema francés · 30 años · Seba, 28 años</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: C.muted }}>UF hoy</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.accent }}>${UF_HOY.toLocaleString("es-CL")}</div>
              </div>
            </div>
          </Card>

          <Card>
            {/* precio */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.secondary }}>Precio depto</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>UF {precioUF.toLocaleString()} · {F(precioCLP)}</span>
              </div>
              <input type="range" min={5000} max={10000} step={100} value={precioUF} onChange={e => setPrecioUF(+e.target.value)} style={{ width: "100%", accentColor: C.accent }} />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                {precioUF <= 5500 ? "📍 Providencia / La Reina mid" : precioUF <= 7000 ? "📍 Las Condes / Providencia premium" : precioUF <= 8500 ? "📍 Vitacura entry / Las Condes top" : "📍 Vitacura premium"}
              </div>
            </div>

            {/* ahorro actual */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.secondary }}>Ahorro actual</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{F(ahorroAct)}</span>
              </div>
              <input type="range" min={0} max={80000000} step={500000} value={ahorroAct} onChange={e => setAhorroAct(+e.target.value)} style={{ width: "100%", accentColor: C.green }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted, marginTop: 3 }}>
                <span>$0</span><span>$20M</span><span>$40M</span><span>$60M</span><span>$80M</span>
              </div>
            </div>

            {/* pie */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.secondary }}>Pie</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{pie}% · {F(pieNec)}</span>
              </div>
              <input type="range" min={10} max={40} step={5} value={pie} onChange={e => setPie(+e.target.value)} style={{ width: "100%", accentColor: C.text }} />
            </div>

            {/* tasa */}
            <div>
              <Label>Tasa hipotecaria (UF + %)</Label>
              <div style={{ display: "flex", gap: 8 }}>
                {([[4,C.green,"Itaú/Estado"],[4.25,C.yellow,"Promedio"],[4.5,C.red,"Conservador"]] as [number,string,string][]).map(([t,c,lbl]) => (
                  <button key={t} onClick={() => setTasa(t)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                    background: tasa === t ? C.surface2 : "transparent",
                    color: tasa === t ? c : C.muted, cursor: "pointer",
                    fontFamily: "inherit", fontSize: 13, fontWeight: 600, transition: "all .15s",
                    outline: tasa === t ? `1px solid ${c}44` : "none",
                  }}>
                    {t}%<div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, fontWeight: 400 }}>{lbl}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* resumen hipoteca */}
          <Card>
            <SectionTitle>Crédito · 30 años · UF+{tasa}%</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { l: "Precio", v: `UF ${precioUF.toLocaleString()}`, s: F(precioCLP), c: C.text },
                { l: `Pie ${pie}%`, v: F(pieNec), s: `UF ${Math.round(precioUF * pie / 100).toLocaleString()}`, c: C.green },
                { l: "Crédito banco", v: F(Math.round(precioCLP * (1 - pie / 100))), s: `UF ${Math.round(precioUF * (1 - pie / 100)).toLocaleString()}`, c: C.secondary },
                { l: "Falta para el pie", v: falta <= 0 ? "¡Ya tienes el pie!" : F(falta), s: falta <= 0 ? "🎉" : "por ahorrar", c: falta <= 0 ? C.green : C.red },
              ].map((r, i) => (
                <div key={i} style={{ background: C.surface2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{r.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: r.c }}>{r.v}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.s}</div>
                </div>
              ))}
            </div>
            <div style={{ background: C.surface2, borderRadius: 12, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Label>Dividendo inicial</Label>
                <div style={{ fontSize: 36, fontWeight: 300, color: acCol, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>{F(divHoy)}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>UF {cuota.toFixed(2)}/mes · sube ~3,5%/año</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {[10,20,30].map(a => (
                  <div key={a} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: C.muted }}>Año {a}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.secondary, fontVariantNumeric: "tabular-nums" }}>{F(projDiv[a-1] || 0)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* progreso pie */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: C.secondary }}>Progreso hacia el pie</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{pctPie}%</span>
            </div>
            <div style={{ height: 6, background: C.surface2, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${pctPie}%`, background: C.green, borderRadius: 99, transition: "width .4s" }} />
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>{F(ahorroAct)} de {F(pieNec)}</div>
          </Card>

          {/* plazos */}
          <Card>
            <SectionTitle>Ahorro mínimo por plazo</SectionTitle>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>
              Desde <span style={{ color: C.green, fontWeight: 600 }}>{F(ahorroAct)}</span> · falta <span style={{ color: C.yellow, fontWeight: 600 }}>{F(falta)}</span>
            </div>
            {falta <= 0 ? (
              <div style={{ fontSize: 16, fontWeight: 600, color: C.green }}>¡Ya tienes el pie completo! 🎉</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PLAZOS.map(m => {
                  const nec  = Math.ceil(falta / m);
                  const diff = ahorroM - nec;
                  const color = diff >= 0 ? C.green : diff >= -150_000 ? C.yellow : C.red;
                  const pct  = Math.min(100, Math.round(ahorroM / nec * 100));
                  return (
                    <div key={m} style={{ background: C.surface2, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{m} meses</span>
                          <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{Math.round(m / 12 * 10) / 10} años · {fechaM(m)}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 18, fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}>{F(nec)}</div>
                          <div style={{ fontSize: 10, color: C.muted }}>/mes necesario</div>
                        </div>
                      </div>
                      <div style={{ height: 3, background: C.surface3, borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {FK(ahorroM)} cubre el {pct}% ·{" "}
                        <span style={{ color, fontWeight: 600 }}>
                          {diff >= 0 ? `sobran ${FK(diff)}/mes` : `necesitas ${FK(Math.abs(diff))} más/mes`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* proyección dividendo vs sueldo */}
          <Card>
            <SectionTitle>Dividendo vs sueldo · 30 años</SectionTitle>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Crecimiento: 5% real (28–35) → 3% (35–45) → 1,5% (45+)</div>
            {PROJ_AÑOS.map(año => {
              const div = projDiv[año] || 0;
              const sue = sueldoPlu[año] || ahorroM;
              const p   = Math.round(div / (sue + div) * 100);
              const c   = p > 35 ? C.red : p > 25 ? C.yellow : C.green;
              return (
                <div key={año} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>Año {año + 1} · {EDAD + año} años</span>
                    <span style={{ fontSize: 12, color: c, fontWeight: 600 }}>{p}% · {FK(div)} / {FK(sue)}</span>
                  </div>
                  <div style={{ height: 3, background: C.surface2, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p}%`, background: c, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── PATRIMONIO ── */}
      {tab === "patrimonio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Proyección patrimonial · 5 años</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Sueldo crece IPC + 5% real · ahorro acumula mes a mes</div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Hoy", v: ahorroAct, edad: EDAD },
              { label: "Año 1", v: pat[11] || 0, edad: EDAD + 1 },
              { label: "Año 2", v: pat[23] || 0, edad: EDAD + 2 },
              { label: "Año 3", v: pat[35] || 0, edad: EDAD + 3 },
              { label: "Año 4", v: pat[47] || 0, edad: EDAD + 4 },
              { label: "Año 5", v: pat[59] || 0, edad: EDAD + 5 },
            ].map((h, i) => (
              <Card key={i} style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{h.label} · {h.edad}a</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.accent, letterSpacing: "-0.02em" }}>{FK(h.v)}</div>
                <div style={{ height: 2, background: C.surface2, borderRadius: 99, overflow: "hidden", marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, h.v / (pat[59] || 1) * 100)}%`, background: C.accent, borderRadius: 99 }} />
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <SectionTitle>Sueldo proyectado</SectionTitle>
            {[0,1,2,3,4].map(año => {
              const s   = proySueldo(liquidoMensual, (año + 1) * 12).slice(-1)[0];
              const pct = Math.min(100, Math.round(s / 4_500_000 * 100));
              const inc = Math.round((s - liquidoMensual) / liquidoMensual * 100);
              return (
                <div key={año} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: C.secondary }}>Año {año + 1} · {EDAD + año} años</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>
                      {F(s)}{año > 0 && <span style={{ color: C.green, fontSize: 11, marginLeft: 6 }}>+{inc}%</span>}
                    </span>
                  </div>
                  <div style={{ height: 3, background: C.surface2, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 99, opacity: 0.6 }} />
                  </div>
                </div>
              );
            })}
          </Card>

          <Card>
            <SectionTitle>Meta depto · UF 5.250 · Providencia</SectionTitle>
            {[
              { label: "Pie necesario (20%)", v: F(Math.round(5250 * UF_HOY * 0.2)), color: C.text },
              { label: "Tienes hoy", v: F(18_000_000), color: C.green },
              { label: "Falta", v: F(Math.max(0, Math.round(5250 * UF_HOY * 0.2) - 18_000_000)), color: C.yellow },
              { label: "Meses ahorrando (escenario normal)", v: `~${Math.ceil(Math.max(0, Math.round(5250 * UF_HOY * 0.2) - 18_000_000) / ahorroMes(liquidoMensual, "mid"))} meses`, color: C.accent },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 13, color: C.secondary }}>{r.label}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: r.color, fontVariantNumeric: "tabular-nums" }}>{r.v}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
