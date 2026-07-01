"use client";

import { useState, useCallback } from "react";
import styles from "./CalculadoraTarjeta.module.css";

const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

function getBillingPeriod(): { year: number; month: number } {
  const today = new Date();
  if (today.getDate() > 23) {
    const next = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return { year: next.getFullYear(), month: next.getMonth() + 1 };
  }
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
}

const { year: REF_YEAR, month: REF_MONTH } = getBillingPeriod();

const COLORS = ["#bf5af2","#30d158","#ffd60a","#ff9f0a","#ff453a","#64d2ff","#2997ff"];

interface Cuota {
  id: number;
  name: string;
  total: number;
  numCuotas: number;
  startMonth: number;
  startYear: number;
  color: string;
}

interface CuotaStatus {
  status: "future" | "active" | "paid";
  num: number | null;
  remaining: number;
}

function fee(c: Cuota): number {
  return Math.round(c.total / c.numCuotas);
}

function statusFor(c: Cuota, year: number, month: number): CuotaStatus {
  const si = c.startYear * 12 + (c.startMonth - 1);
  const vi = year * 12 + (month - 1);
  const ei = si + c.numCuotas - 1;
  if (vi < si) return { status: "future", num: null, remaining: c.numCuotas };
  if (vi > ei) return { status: "paid", num: null, remaining: 0 };
  const num = vi - si + 1;
  return { status: "active", num, remaining: c.numCuotas - num + 1 };
}

function totalForMonth(cuotas: Cuota[], year: number, month: number): number {
  return cuotas.reduce((s, c) => {
    const { status } = statusFor(c, year, month);
    return status === "active" ? s + fee(c) : s;
  }, 0);
}

function totalCuotasRestantes(cuotas: Cuota[]): number {
  return cuotas.reduce((s, c) => {
    const { status, remaining } = statusFor(c, REF_YEAR, REF_MONTH);
    if (status === "active") return s + remaining * fee(c);
    if (status === "future") return s + c.total;
    return s;
  }, 0);
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("es-CL");
}

function getColor(val: number, limit: number): string {
  if (limit <= 0) return "var(--accent)";
  const r = val / limit;
  if (r <= 0.8) return "var(--green)";
  if (r <= 1) return "var(--yellow)";
  return "var(--red)";
}

function getStatus(val: number, limit: number): "ok" | "warn" | "over" {
  if (limit <= 0) return "ok";
  const r = val / limit;
  if (r <= 0.8) return "ok";
  if (r <= 1) return "warn";
  return "over";
}

const CUOTAS_INICIALES: Cuota[] = [
  { id: 1, name: "iPhone For Life", total: 1_617_000, numCuotas: 36, startMonth: 6, startYear: 2026, color: "#6c63ff" },
  { id: 2, name: "Osojimix",        total:   120_000, numCuotas:  3, startMonth: 6, startYear: 2026, color: "#ff6584" },
];

interface Props {
  cupoTotal:        number;
  limiteMensual:    number;
  initialCuotas:    Cuota[];
  initialCupo:      number;
  onCuotasChange:   (c: Cuota[]) => void;
  onCupoChange:     (v: number) => void;
  onLimiteChange:   (v: number) => void;
  hideAmounts:      boolean;
}

const H = "••••";

export default function CalculadoraTarjeta({ cupoTotal, limiteMensual, initialCuotas, initialCupo, onCuotasChange, onCupoChange, onLimiteChange, hideAmounts }: Props) {
  const m = (n: number) => hideAmounts ? H : `$${fmt(n)}`;
  const [cuotas, setCuotasState] = useState<Cuota[]>(initialCuotas);
  const [nextId, setNextId] = useState(() => Math.max(0, ...initialCuotas.map(c => c.id)) + 1);
  const [cupoDisponible, setCupoDisponibleState] = useState(initialCupo);
  const [limitInput, setLimitInputState] = useState(limiteMensual);
  const [savedFlash, setSavedFlash] = useState(false);

  function setCuotas(fn: (prev: Cuota[]) => Cuota[]) {
    setCuotasState(prev => { const next = fn(prev); onCuotasChange(next); flash(); return next; });
  }
  function setCupoDisponible(v: number) {
    setCupoDisponibleState(v);
    onCupoChange(v);
  }
  function setLimitInput(v: number) {
    setLimitInputState(v);
    onLimiteChange(v);
  }
  function flash() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }
  const [viewYear, setViewYear] = useState(REF_YEAR);
  const [viewMonth, setViewMonth] = useState(REF_MONTH);

  // Form state
  const [fName, setFName] = useState("");
  const [fTotal, setFTotal] = useState("");
  const [fCuotas, setFCuotas] = useState("");
  const [fMes, setFMes] = useState("");
  const [fAnio, setFAnio] = useState("");

  // Simulador / ¿cuándo puedo comprar X?
  const [simMonto, setSimMonto] = useState("");
  const [simCuotas, setSimCuotas] = useState("");
  const [xMonto, setXMonto] = useState("");
  const [xCuotas, setXCuotas] = useState("");

  // Usuario ingresa cupo disponible; utilizado se deriva internamente
  const cupoUtilizado = Math.max(0, cupoTotal - cupoDisponible);

  const comprometido = totalCuotasRestantes(cuotas);
  const contado = Math.max(0, cupoUtilizado - comprometido);

  // Cuotas desde el PRÓXIMO ciclo (para mostrar en display — julio ya va en el pago actual)
  const nextCycleDate = new Date(REF_YEAR, REF_MONTH, 1); // REF_MONTH 1-indexed → 0-indexed = mes siguiente
  const nextCycleY = nextCycleDate.getFullYear();
  const nextCycleM = nextCycleDate.getMonth() + 1;
  const comprometidoFuturo = cuotas.reduce((s, c) => {
    const { status, remaining } = statusFor(c, nextCycleY, nextCycleM);
    if (status === "active") return s + remaining * fee(c);
    if (status === "future") return s + c.total;
    return s;
  }, 0);
  const pagoCicloActual = Math.max(0, cupoUtilizado - comprometidoFuturo);
  const activasRef = cuotas.filter((c) => statusFor(c, REF_YEAR, REF_MONTH).status === "active");
  const maxRem = activasRef.reduce((m, c) => Math.max(m, statusFor(c, REF_YEAR, REF_MONTH).remaining), 0);

  const cuotasMes = totalForMonth(cuotas, viewYear, viewMonth);
  const isRef = viewYear === REF_YEAR && viewMonth === REF_MONTH;
  const contadoMes = isRef ? contado : 0;
  const totalMes = cuotasMes + contadoMes;
  const margen = limitInput - totalMes;
  const st = getStatus(totalMes, limitInput);
  const col = getColor(totalMes, limitInput);

  const pct = limitInput > 0 ? Math.min(Math.round((totalMes / limitInput) * 100), 150) : 0;

  const billingM = viewMonth === 12 ? 1 : viewMonth + 1;
  const billingY = viewMonth === 12 ? viewYear + 1 : viewYear;

  const chipLabels = { ok: "✓ OK", warn: "⚠ ATENCIÓN", over: "✕ EXCEDE" };
  const chipClass = { ok: styles.chipOk, warn: styles.chipWarn, over: styles.chipOver };

  const changeMonth = useCallback((delta: number) => {
    const d = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);
  }, [viewYear, viewMonth]);

  const deleteCuota = useCallback((id: number) => {
    setCuotas((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addCuota = useCallback(() => {
    const name = fName.trim();
    const total = parseInt(fTotal);
    const nq = parseInt(fCuotas);
    const mes = parseInt(fMes);
    const anio = parseInt(fAnio);
    if (!name || isNaN(total) || isNaN(nq) || isNaN(mes) || isNaN(anio)) {
      alert("Completa todos los campos.");
      return;
    }
    setCuotas((prev) => [
      ...prev,
      { id: nextId, name, total, numCuotas: nq, startMonth: mes, startYear: anio, color: COLORS[prev.length % COLORS.length] },
    ]);
    setNextId((n) => n + 1);
    setFName(""); setFTotal(""); setFCuotas(""); setFMes(""); setFAnio("");
  }, [fName, fTotal, fCuotas, fMes, fAnio, nextId]);

  const activasN = cuotas.filter((c) => statusFor(c, viewYear, viewMonth).status === "active").length;

  // Próximo cierre (día 23)
  const today = new Date();
  const nextClose = today.getDate() <= 23
    ? new Date(today.getFullYear(), today.getMonth(), 23)
    : new Date(today.getFullYear(), today.getMonth() + 1, 23);
  const daysUntilClose = Math.max(0, Math.ceil((nextClose.getTime() - today.getTime()) / 86400000));
  const dailyBudget = margen > 0 && daysUntilClose > 0 ? Math.floor(margen / daysUntilClose) : 0;

  // Fecha deuda cero
  const deudaCero = (() => {
    const nonPaid = cuotas.filter(c => statusFor(c, REF_YEAR, REF_MONTH).status !== "paid");
    if (nonPaid.length === 0) return null;
    let maxIdx = 0;
    nonPaid.forEach(c => {
      const idx = c.startYear * 12 + (c.startMonth - 1) + c.numCuotas - 1;
      if (idx > maxIdx) maxIdx = idx;
    });
    const year = Math.floor(maxIdx / 12);
    const month = maxIdx % 12 + 1;
    return { year, month, meses: maxIdx - (REF_YEAR * 12 + REF_MONTH - 1) };
  })();

  // Cuotas que terminan pronto (≤3 meses)
  const alertasLibera = cuotas
    .map(c => {
      const { status, remaining } = statusFor(c, REF_YEAR, REF_MONTH);
      return status === "active" && remaining <= 3 ? { c, remaining, freed: fee(c) } : null;
    })
    .filter((x): x is { c: Cuota; remaining: number; freed: number } => x !== null)
    .sort((a, b) => a.remaining - b.remaining);

  // Simulador cuotas
  const simFee = simMonto && simCuotas && parseInt(simCuotas) > 0
    ? Math.round(parseInt(simMonto) / parseInt(simCuotas)) : 0;
  const simNuevoMargen = simFee > 0 ? margen - simFee : null;
  const simSt = simFee > 0 ? getStatus(totalMes + simFee, limitInput) : null;

  // ¿Cuándo puedo comprar X?
  const xResult = (() => {
    const xM = parseInt(xMonto);
    const xC = parseInt(xCuotas);
    if (!xM || !xC || xC <= 0) return null;
    const xFee = Math.round(xM / xC);
    for (let i = 0; i < 36; i++) {
      const d = new Date(REF_YEAR, REF_MONTH - 1 + i, 1);
      const y = d.getFullYear();
      const mo = d.getMonth() + 1;
      const t = totalForMonth(cuotas, y, mo) + xFee + (i === 0 ? contado : 0);
      if (t <= limitInput) return { year: y, month: mo, mesesEspera: i, fee: xFee };
    }
    return null;
  })();

  return (
    <div>
      <div>
        {/* HEADER */}
        <header className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className={styles.labelTag}>Control financiero</div>
            <button
              className={`${styles.saveBtn} ${savedFlash ? styles.saveBtnDone : ""}`}
              onClick={() => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2000); }}
            >
              {savedFlash ? "Guardado ✓" : "Guardar"}
            </button>
          </div>
          <h1 className={styles.h1}>Facturación<br /><span style={{ color: "var(--accent)" }}>Tarjeta</span></h1>
          <p className={styles.subtitle}>Ciclo de facturación: día 23 de cada mes</p>
        </header>

        {/* INPUTS */}
        <div className={styles.inputsGrid}>
          <div className={`${styles.inputBox} ${styles.cupoBox}`}>
            <div className={styles.ibLabel}>Cupo disponible (banco)</div>
            <div className={styles.ibRow}>
              <span className={styles.ibPrefix}>$</span>
              <input
                className={styles.ibInput}
                type="number"
                value={cupoDisponible || ""}
                placeholder="0"
                onChange={(e) => setCupoDisponible(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className={styles.ibSub}>
              {comprometidoFuturo > 0 ? `${m(comprometidoFuturo)} cuotas futuras · ` : ""}{hideAmounts ? H : `$${fmt(pagoCicloActual)}`} a pagar
            </div>
          </div>
          <div className={`${styles.inputBox} ${styles.limitBox}`}>
            <div className={styles.ibLabel}>Límite mensual deseado</div>
            <div className={styles.ibRow}>
              <span className={styles.ibPrefix}>$</span>
              <input
                className={`${styles.ibInput} ${styles.ibInputLimit}`}
                type="number"
                value={limitInput || ""}
                placeholder="0"
                onChange={(e) => setLimitInput(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className={styles.ibSub}>
              Margen libre = {m(Math.max(0, limitInput - totalForMonth(cuotas, REF_YEAR, REF_MONTH)))}
            </div>
          </div>
        </div>

        {/* CUPO DETAIL */}
        <div className={styles.cupoDetail}>
          <div className={styles.cdItem}>
            <div className={styles.cdL}>Cuotas futuras ({MONTHS_ES[nextCycleM - 1].slice(0, 3)}+)</div>
            <div className={styles.cdV}>{m(comprometidoFuturo)}</div>
          </div>
          <div className={styles.cdItem}>
            <div className={styles.cdL}>Pago ciclo actual</div>
            <div className={styles.cdV} style={{ color: "var(--accent)" }}>{hideAmounts ? H : (pagoCicloActual > 0 ? `$${fmt(pagoCicloActual)}` : "$0")}</div>
          </div>
          <div className={styles.cdItem}>
            <div className={styles.cdL}>Meses con cuotas</div>
            <div className={styles.cdV}>{maxRem > 0 ? `${maxRem} meses` : "—"}</div>
          </div>
        </div>

        {/* BILLING HERO */}
        <div className={`${styles.billingHero} ${styles[`hero${st.charAt(0).toUpperCase() + st.slice(1)}`]}`}>
          <div className={styles.billingLabel}>
            Pago estimado este ciclo
            <span className={`${styles.statusChip} ${chipClass[st]}`}>{chipLabels[st]}</span>
          </div>
          <div className={styles.billingAmount}>
            {hideAmounts ? <span style={{ color: col, letterSpacing: 4 }}>••••</span> : <><span className={styles.currency}>$</span><span style={{ color: col }}>{fmt(totalMes)}</span></>}
          </div>
          <div className={styles.limitBarWrap}>
            <div className={styles.limitBarLabels}>
              <span>$0</span>
              <span>Límite ${fmt(limitInput)}</span>
            </div>
            <div className={styles.limitBarTrack}>
              <div
                className={styles.limitBarFill}
                style={{ width: `${Math.min(pct, 100)}%`, background: col }}
              />
              <div className={styles.limitBarMarker} style={{ left: pct > 100 ? "calc(100% - 1px)" : "100%" }} />
            </div>
          </div>
          <div className={styles.billingDate}>
            <span className={styles.dot} />
            <span>Facturación el 23 de {MONTHS_ES[billingM - 1].toLowerCase()} {billingY}</span>
          </div>

          {/* Countdown cierre */}
          <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Cierre en</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: daysUntilClose <= 5 ? "var(--yellow)" : "var(--text)" }}>{daysUntilClose} días</div>
            </div>
            {dailyBudget > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Presupuesto diario libre</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--green)" }}>${fmt(dailyBudget)}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)" }}>/día</span></div>
              </div>
            )}
            {deudaCero && (
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Deuda 0</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>{MONTHS_ES[deudaCero.month - 1].slice(0, 3)} {deudaCero.year}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>en {deudaCero.meses} meses</div>
              </div>
            )}
          </div>

          <div className={styles.billingSubRow}>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>En cuotas</div>
              <div className={styles.bsV}>{m(cuotasMes)}</div>
            </div>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>Contado</div>
              <div className={styles.bsV}>{isRef ? m(contadoMes) : "—"}</div>
            </div>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>Margen libre</div>
              <div className={styles.bsV} style={{ color: margen >= 0 ? "var(--green)" : "var(--red)" }}>
                {hideAmounts ? H : (margen >= 0 ? `$${fmt(margen)}` : `-$${fmt(-margen)}`)}
              </div>
            </div>
          </div>
        </div>

        {/* ALERTAS — cuotas que terminan pronto */}
        {alertasLibera.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className={styles.sectionTitle}>Se libera pronto</div>
            {alertasLibera.map(({ c, remaining, freed }) => (
              <div key={c.id} style={{
                background: "var(--surface)", borderRadius: 12, padding: "12px 16px",
                marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                border: "1px solid rgba(52,211,153,0.18)",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {remaining === 1 ? "Última cuota este mes" : `Termina en ${remaining} meses`}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>libera</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--green)" }}>+{m(freed)}/mes</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TIMELINE */}
        <div className={styles.sectionTitle}>Proyección 12 meses</div>
        <div className={styles.timelineWrap}>
          <div className={styles.timeline}>
            {Array.from({ length: 12 }, (_, i) => {
              const d = new Date(REF_YEAR, REF_MONTH - 1 + i, 1);
              const y = d.getFullYear();
              const m = d.getMonth() + 1;
              const t = totalForMonth(cuotas, y, m) + (i === 0 ? contado : 0);
              const activasNTl = cuotas.filter((c) => statusFor(c, y, m).status === "active").length;
              const isCur = y === viewYear && m === viewMonth;
              const st2 = getStatus(t, limitInput);
              const col2 = getColor(t, limitInput);
              const pct2 = limitInput > 0 ? Math.min(Math.round((t / limitInput) * 100), 100) : 0;
              const icon = st2 === "over" ? "🔴" : st2 === "warn" ? "🟡" : "";
              return (
                <div
                  key={`${y}-${m}`}
                  className={[
                    styles.tlMonth,
                    isCur ? styles.tlCurrent : "",
                    st2 === "over" ? styles.tlOver : "",
                    st2 === "warn" ? styles.tlWarn : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => { setViewYear(y); setViewMonth(m); }}
                >
                  <div className={styles.tlMName}>{icon ? `${icon} ` : ""}{MONTHS_ES[m - 1].slice(0, 3)} {y}</div>
                  <div className={styles.tlMAmount} style={{ color: col2 }}>{hideAmounts ? H : `$${fmt(t)}`}</div>
                  <div className={styles.tlMBar}>
                    <div className={styles.tlMBarFill} style={{ width: `${pct2}%`, background: col2 }} />
                  </div>
                  <div className={styles.tlMCuotas}>{activasNTl} cuota{activasNTl !== 1 ? "s" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MONTH NAV */}
        <div className={styles.monthNav}>
          <button className={styles.monthNavBtn} onClick={() => changeMonth(-1)}>←</button>
          <div className={styles.monthLabel}>{MONTHS_ES[viewMonth - 1]} {viewYear}</div>
          <button className={styles.monthNavBtn} onClick={() => changeMonth(1)}>→</button>
        </div>

        {/* CUOTA LIST */}
        <div className={styles.sectionTitle}>Detalle cuotas</div>
        <div>
          {cuotas.length === 0 ? (
            <div className={styles.emptyState}>Sin compras en cuotas.</div>
          ) : (
            cuotas.map((c) => {
              const { status, num, remaining } = statusFor(c, viewYear, viewMonth);
              const f = fee(c);
              const pct3 = status === "active" ? Math.round((num! / c.numCuotas) * 100) : status === "paid" ? 100 : 0;
              return (
                <div
                  key={c.id}
                  className={[
                    styles.cuotaCard,
                    status === "paid" ? styles.paid : "",
                    status === "active" ? styles.currentDue : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className={styles.cuotaInfo}>
                    <div className={styles.cuotaName}>{c.name}</div>
                    <div className={styles.cuotaMeta}>
                      {status === "active" && (
                        <>
                          <span className={`${styles.badge} ${styles.badgeActive}`}>Activa</span>
                          <span>Cuota {num} de {c.numCuotas} · quedan {remaining}</span>
                        </>
                      )}
                      {status === "future" && (
                        <>
                          <span className={`${styles.badge} ${styles.badgeFuture}`}>Futura</span>
                          <span>Inicia {MONTHS_ES[c.startMonth - 1]} {c.startYear}</span>
                        </>
                      )}
                      {status === "paid" && (
                        <>
                          <span className={`${styles.badge} ${styles.badgePaid}`}>Pagada</span>
                          <span>Completada</span>
                        </>
                      )}
                    </div>
                    <div className={styles.progressBarWrap}>
                      <div className={styles.progressBarFill} style={{ width: `${pct3}%`, background: c.color }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div className={styles.cuotaAmount}>
                      <div className={styles.cuotaFee} style={{ color: status === "active" ? c.color : "var(--muted)" }}>
                        {status === "active" ? m(f) : "—"}
                      </div>
                      <div className={styles.cuotaNum}>
                        {status !== "paid" ? `${m(f)}/mes` : `Total: ${m(c.total)}`}
                      </div>
                    </div>
                    <button className={styles.btnDelete} onClick={() => deleteCuota(c.id)}>✕</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* TOTALS */}
        {cuotas.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className={styles.totalsRow}>
              <span className={styles.tLabel}>Cuotas activas</span>
              <span className={styles.tVal} style={{ fontSize: 13 }}>{activasN} compra{activasN !== 1 ? "s" : ""}</span>
            </div>
            {isRef && contado > 0 && (
              <div className={styles.totalsRow}>
                <span className={styles.tLabel}>Gasto al contado / otros</span>
                <span className={styles.tVal} style={{ color: "var(--accent2)" }}>${fmt(contado)}</span>
              </div>
            )}
            <div className={styles.totalsRow}>
              <span className={styles.tLabel}>Límite mensual</span>
              <span className={styles.tVal} style={{ fontSize: 13, color: "var(--yellow)" }}>${fmt(limitInput)}</span>
            </div>
            <div className={`${styles.totalsRow} ${styles.grand}`}>
              <span className={styles.tLabel}>Total estimado · margen</span>
              <span className={styles.tVal} style={{ color: col }}>
                ${fmt(totalMes)}{" "}
                <span style={{ fontSize: 12, color: margen >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                  {margen >= 0 ? `$${fmt(margen)} disponible` : `-$${fmt(-margen)} excedido`}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* ADD FORM */}
        <div className={styles.addSection}>
          <div className={styles.sectionTitle} style={{ marginBottom: 16 }}>Agregar compra en cuotas</div>
          <div className={styles.formRow}>
            <div>
              <label className={styles.formLabel}>Descripción</label>
              <input className={styles.formField} type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Ej: MacBook Air" />
            </div>
            <div>
              <label className={styles.formLabel}>Monto total ($)</label>
              <input className={styles.formField} type="number" value={fTotal} onChange={(e) => setFTotal(e.target.value)} placeholder="500000" />
            </div>
          </div>
          <div className={`${styles.formRow} ${styles.formRowThree}`}>
            <div>
              <label className={styles.formLabel}>N° cuotas</label>
              <input className={styles.formField} type="number" value={fCuotas} onChange={(e) => setFCuotas(e.target.value)} placeholder="12" min="1" />
            </div>
            <div>
              <label className={styles.formLabel}>Mes inicio</label>
              <input className={styles.formField} type="number" value={fMes} onChange={(e) => setFMes(e.target.value)} placeholder="6" min="1" max="12" />
            </div>
            <div>
              <label className={styles.formLabel}>Año inicio</label>
              <input className={styles.formField} type="number" value={fAnio} onChange={(e) => setFAnio(e.target.value)} placeholder="2026" min="2024" />
            </div>
          </div>
          <button className={styles.btnAdd} onClick={addCuota}>+ Agregar compra</button>
        </div>

        {/* SIMULADOR ¿ME CONVIENE EN CUOTAS? */}
        <div className={styles.addSection} style={{ marginTop: 16 }}>
          <div className={styles.sectionTitle} style={{ marginBottom: 16 }}>¿Me conviene en cuotas?</div>
          <div className={styles.formRow}>
            <div>
              <label className={styles.formLabel}>Monto total ($)</label>
              <input className={styles.formField} type="number" value={simMonto} onChange={e => setSimMonto(e.target.value)} placeholder="Ej: 300000" />
            </div>
            <div>
              <label className={styles.formLabel}>N° cuotas</label>
              <input className={styles.formField} type="number" value={simCuotas} onChange={e => setSimCuotas(e.target.value)} placeholder="Ej: 6" min="1" />
            </div>
          </div>
          {simFee > 0 && (
            <div style={{ marginTop: 4, background: "var(--surface2)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--secondary)" }}>Cuota mensual</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>${fmt(simFee)}/mes</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "var(--secondary)" }}>Nuevo margen libre</span>
                <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: simNuevoMargen !== null && simNuevoMargen >= 0 ? "var(--green)" : "var(--red)" }}>
                  {simNuevoMargen !== null ? (simNuevoMargen >= 0 ? `$${fmt(simNuevoMargen)}` : `-$${fmt(-simNuevoMargen)}`) : "—"}
                </span>
              </div>
              {simSt === "ok"   && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--green)",  background: "rgba(52,211,153,0.12)",  padding: "3px 10px", borderRadius: 99 }}>✓ Dentro del límite</span>}
              {simSt === "warn" && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--yellow)", background: "rgba(251,191,36,0.12)",  padding: "3px 10px", borderRadius: 99 }}>⚠ Cerca del límite</span>}
              {simSt === "over" && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--red)",    background: "rgba(226,74,74,0.12)",   padding: "3px 10px", borderRadius: 99 }}>✕ Excede el límite</span>}
            </div>
          )}
        </div>

        {/* ¿CUÁNDO PUEDO COMPRAR X? */}
        <div className={styles.addSection} style={{ marginTop: 16 }}>
          <div className={styles.sectionTitle} style={{ marginBottom: 16 }}>¿Cuándo puedo comprarlo?</div>
          <div className={styles.formRow}>
            <div>
              <label className={styles.formLabel}>Precio ($)</label>
              <input className={styles.formField} type="number" value={xMonto} onChange={e => setXMonto(e.target.value)} placeholder="Ej: 500000" />
            </div>
            <div>
              <label className={styles.formLabel}>En cuántas cuotas</label>
              <input className={styles.formField} type="number" value={xCuotas} onChange={e => setXCuotas(e.target.value)} placeholder="Ej: 12" min="1" />
            </div>
          </div>
          {xResult && (
            <div style={{ marginTop: 4, background: "var(--surface2)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--secondary)" }}>Cuota mensual</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>${fmt(xResult.fee)}/mes</span>
              </div>
              {xResult.mesesEspera === 0
                ? <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>¡Podés comprarlo este mes!</div>
                : (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      Podés comprarlo en <span style={{ color: "var(--accent)" }}>{MONTHS_ES[xResult.month - 1]} {xResult.year}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>En {xResult.mesesEspera} mes{xResult.mesesEspera !== 1 ? "es" : ""} se libera suficiente margen</div>
                  </div>
                )
              }
            </div>
          )}
          {xMonto && xCuotas && !xResult && (
            <div style={{ marginTop: 4, background: "rgba(226,74,74,0.08)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: "var(--red)" }}>No hay margen suficiente en los próximos 3 años con el presupuesto actual.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
