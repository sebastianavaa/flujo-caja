"use client";

import { useState, useCallback } from "react";
import styles from "./CalculadoraTarjeta.module.css";

const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const REF_YEAR = 2026;
const REF_MONTH = 6;
const CUPO_TOTAL = 4_000_000;

const COLORS = ["#6c63ff","#ff6584","#4ade80","#fbbf24","#06b6d4","#f472b6","#a78bfa"];

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

export default function CalculadoraTarjeta() {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [nextId, setNextId] = useState(1);
  const [cupoRaw, setCupoRaw] = useState(0);
  const [cupoInvertido, setCupoInvertido] = useState(false);
  const [limitInput, setLimitInput] = useState(0);
  const [viewYear, setViewYear] = useState(REF_YEAR);
  const [viewMonth, setViewMonth] = useState(REF_MONTH);

  // Form state
  const [fName, setFName] = useState("");
  const [fTotal, setFTotal] = useState("");
  const [fCuotas, setFCuotas] = useState("");
  const [fMes, setFMes] = useState("");
  const [fAnio, setFAnio] = useState("");

  // Cupo utilizado real: en modo invertido, el usuario ingresa lo que le queda
  const cupoInput = cupoInvertido ? Math.max(0, CUPO_TOTAL - cupoRaw) : cupoRaw;

  const comprometido = totalCuotasRestantes(cuotas);
  const contado = Math.max(0, cupoInput - comprometido);
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

  const toggleCupoMode = () => {
    // Preserve the equivalent value when switching modes
    if (!cupoInvertido) {
      // switching to invertido: new raw = CUPO_TOTAL - cupoInput
      setCupoRaw(Math.max(0, CUPO_TOTAL - cupoRaw));
    } else {
      // switching back to normal: new raw = CUPO_TOTAL - cupoRaw (= cupoInput)
      setCupoRaw(cupoInput);
    }
    setCupoInvertido((v) => !v);
  };

  return (
    <div>
      <div>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.labelTag}>💳 Control financiero</div>
          <h1 className={styles.h1}>Facturación<br /><span style={{ color: "var(--accent)" }}>Tarjeta</span></h1>
          <p className={styles.subtitle}>Ciclo de facturación: día 23 de cada mes</p>
        </header>

        {/* INPUTS */}
        <div className={styles.inputsGrid}>
          <div className={`${styles.inputBox} ${styles.cupoBox}`}>
            <div className={styles.ibLabelRow}>
              <div className={styles.ibLabel}>
                {cupoInvertido ? "Cupo disponible (banco)" : "Cupo utilizado (banco)"}
              </div>
              <button className={styles.toggleModeBtn} onClick={toggleCupoMode} title="Cambiar modo de ingreso">
                ⇄
              </button>
            </div>
            <div className={styles.ibRow}>
              <span className={styles.ibPrefix}>$</span>
              <input
                className={styles.ibInput}
                type="number"
                value={cupoRaw || ""}
                placeholder="0"
                onChange={(e) => setCupoRaw(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className={styles.ibSub}>
              {cupoInvertido
                ? `Utilizado: $${fmt(cupoInput)} de $${fmt(CUPO_TOTAL)}`
                : `${comprometido > 0 ? `$${fmt(comprometido)} en cuotas · ` : ""}$${fmt(contado)} contado`}
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
              Margen libre = ${fmt(Math.max(0, limitInput - totalForMonth(cuotas, REF_YEAR, REF_MONTH) - contado))}
            </div>
          </div>
        </div>

        {/* CUPO DETAIL */}
        <div className={styles.cupoDetail}>
          <div className={styles.cdItem}>
            <div className={styles.cdL}>Cuotas comprometidas</div>
            <div className={styles.cdV}>${fmt(comprometido)}</div>
          </div>
          <div className={styles.cdItem}>
            <div className={styles.cdL}>Libre (contado)</div>
            <div className={styles.cdV} style={{ color: "var(--green)" }}>{contado > 0 ? `$${fmt(contado)}` : "$0"}</div>
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
            <span className={styles.currency}>$</span>
            <span style={{ color: col }}>{fmt(totalMes)}</span>
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
          <div className={styles.billingSubRow}>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>En cuotas</div>
              <div className={styles.bsV}>${fmt(cuotasMes)}</div>
            </div>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>Contado</div>
              <div className={styles.bsV}>{isRef ? `$${fmt(contadoMes)}` : "—"}</div>
            </div>
            <div className={styles.bsItem}>
              <div className={styles.bsL}>Margen libre</div>
              <div className={styles.bsV} style={{ color: margen >= 0 ? "var(--green)" : "var(--red)" }}>
                {margen >= 0 ? `$${fmt(margen)}` : `-$${fmt(-margen)}`}
              </div>
            </div>
          </div>
        </div>

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
                  <div className={styles.tlMAmount} style={{ color: col2 }}>${fmt(t)}</div>
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
                        {status === "active" ? `$${fmt(f)}` : "—"}
                      </div>
                      <div className={styles.cuotaNum}>
                        {status !== "paid" ? `$${fmt(f)}/mes` : `Total: $${fmt(c.total)}`}
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
              <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Ej: MacBook Air" />
            </div>
            <div>
              <label className={styles.formLabel}>Monto total ($)</label>
              <input type="number" value={fTotal} onChange={(e) => setFTotal(e.target.value)} placeholder="Ej: 500000" />
            </div>
          </div>
          <div className={`${styles.formRow} ${styles.formRowThree}`}>
            <div>
              <label className={styles.formLabel}>N° cuotas</label>
              <input type="number" value={fCuotas} onChange={(e) => setFCuotas(e.target.value)} placeholder="12" min="1" />
            </div>
            <div>
              <label className={styles.formLabel}>Mes inicio</label>
              <input type="number" value={fMes} onChange={(e) => setFMes(e.target.value)} placeholder="6" min="1" max="12" />
            </div>
            <div>
              <label className={styles.formLabel}>Año inicio</label>
              <input type="number" value={fAnio} onChange={(e) => setFAnio(e.target.value)} placeholder="2026" min="2024" />
            </div>
          </div>
          <button className={styles.btnAdd} onClick={addCuota}>+ Agregar compra</button>
        </div>
      </div>
    </div>
  );
}
