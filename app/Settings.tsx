"use client";

import { useState, useCallback } from "react";
import { AppSettings } from "./hooks/useSettings";
import styles from "./Settings.module.css";

interface Props {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("es-CL");
}

interface SettingRowProps {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}

function SettingRow({ label, sublabel, value, onChange, prefix = "$" }: SettingRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rowInfo}>
        <div className={styles.rowLabel}>{label}</div>
        <div className={styles.rowSub}>{sublabel}</div>
      </div>
      <div className={styles.rowInput}>
        <span className={styles.prefix}>{prefix}</span>
        <input
          type="number"
          value={value || ""}
          placeholder="0"
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className={styles.input}
        />
      </div>
    </div>
  );
}

export default function Settings({ settings, onUpdate }: Props) {
  const [savedFlash, setSavedFlash] = useState(false);

  const update = useCallback((patch: Partial<AppSettings>) => {
    onUpdate(patch);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }, [onUpdate]);

  const liquidoAnual = settings.liquidoMensual * 12;

  return (
    <div className={styles.wrap}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>Configuración</div>
        <button
          className={`${styles.saveBtn} ${savedFlash ? styles.saveBtnDone : ""}`}
          onClick={() => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 2000); }}
        >
          {savedFlash ? "Guardado ✓" : "Guardar"}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Tarjeta de crédito</div>
        <div className={styles.card}>
          <SettingRow
            label="Cupo total"
            sublabel="Límite de crédito de tu tarjeta"
            value={settings.cupoTotal}
            onChange={(v) => update({ cupoTotal: v })}
          />
          <SettingRow
            label="Límite mensual deseado"
            sublabel="Alerta cuando el gasto mensual supera este monto"
            value={settings.limiteMensual}
            onChange={(v) => update({ limiteMensual: v })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Ingresos</div>
        <div className={styles.card}>
          <SettingRow
            label="Ingreso mensual líquido"
            sublabel="Sueldo neto después de AFP e isapre"
            value={settings.liquidoMensual}
            onChange={(v) => update({ liquidoMensual: v })}
          />
        </div>
        <div className={styles.hint}>
          Ingreso anual proyectado: <strong>${fmt(liquidoAnual)}</strong>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Acerca de</div>
        <div className={styles.card}>
          <div className={styles.aboutRow}>
            <span className={styles.rowLabel}>Aplicación</span>
            <span className={styles.aboutVal}>Flujo de Caja</span>
          </div>
          <div className={styles.aboutRow}>
            <span className={styles.rowLabel}>Datos</span>
            <span className={styles.aboutVal}>Solo locales · no se envían a ningún servidor</span>
          </div>
          <div className={styles.aboutRow}>
            <span className={styles.rowLabel}>Acceso</span>
            <span className={styles.aboutVal}>nava.ljubetic@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
