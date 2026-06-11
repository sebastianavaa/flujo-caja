"use client";

import { useState } from "react";
import { CreditCard, BarChart2, Settings2, LogOut, Sun, Moon, Eye, EyeOff } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useSettings } from "@/app/hooks/useSettings";
import CalculadoraTarjeta from "./CalculadoraTarjeta";
import ForecastAhorro from "./ForecastAhorro";
import Settings from "./Settings";
import styles from "./Dashboard.module.css";

type Section = "tarjeta" | "forecast" | "settings";

export default function Dashboard() {
  const [section, setSection] = useState<Section>("tarjeta");
  const [hideAmounts, setHideAmounts] = useState(false);
  const { settings, update, loaded } = useSettings();

  if (!loaded) return null;

  return (
    <div className={styles.root}>
      {/* TOP NAV — sticky */}
      <div className={styles.navOuter}>
        <nav className={styles.nav}>
          <div className={styles.navBrand}>
            <span className={styles.brandDot} />
            <span className={styles.brandName}>Finanzas Seba</span>
          </div>

          <div className={styles.navTabs}>
            <button
              className={`${styles.navTab} ${section === "tarjeta" ? styles.navTabActive : ""}`}
              onClick={() => setSection("tarjeta")}
            >
              Tarjeta
            </button>
            <button
              className={`${styles.navTab} ${section === "forecast" ? styles.navTabActive : ""}`}
              onClick={() => setSection("forecast")}
            >
              Forecast
            </button>
            <button
              className={`${styles.navTab} ${section === "settings" ? styles.navTabActive : ""}`}
              onClick={() => setSection("settings")}
            >
              Config
            </button>
          </div>

          <div className={styles.navRight}>
            <button
              className={`${styles.themeBtn} ${styles.eyeBtn}`}
              onClick={() => setHideAmounts(h => !h)}
              title={hideAmounts ? "Mostrar montos" : "Ocultar montos"}
            >
              {hideAmounts ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <div className={styles.themeToggle}>
              <button
                className={`${styles.themeBtn} ${settings.theme === "light" ? styles.themeBtnActive : ""}`}
                onClick={() => update({ theme: "light" })}
                title="Tema claro"
              >
                <Sun size={14} />
              </button>
              <button
                className={`${styles.themeBtn} ${settings.theme === "dark" ? styles.themeBtnActive : ""}`}
                onClick={() => update({ theme: "dark" })}
                title="Tema oscuro"
              >
                <Moon size={14} />
              </button>
            </div>
            <form action={logout}>
              <button type="submit" className={styles.logoutBtn} title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </form>
          </div>
        </nav>
      </div>

      <div className={styles.wrap}>
        {/* CONTENT */}
        <main className={styles.content}>
          {section === "tarjeta" && (
            <CalculadoraTarjeta
              cupoTotal={settings.cupoTotal}
              limiteMensual={settings.limiteMensual}
              initialCuotas={settings.cuotas}
              initialCupo={settings.cupoDisponible}
              onCuotasChange={(c) => update({ cuotas: c })}
              onCupoChange={(v) => update({ cupoDisponible: v })}
              onLimiteChange={(v) => update({ limiteMensual: v })}
              hideAmounts={hideAmounts}
            />
          )}
          {section === "forecast" && (
            <div className={styles.forecastWrap}>
              <header className={styles.forecastHeader}>
                <div className={styles.forecastTag}>Seba Nava · 2026</div>
                <h1 className={styles.forecastTitle}>Forecast personal</h1>
                <p className={styles.forecastSub}>Peñalolén · sin arriendo · 3x/sem Vitacura</p>
              </header>
              <ForecastAhorro
                liquidoMensual={settings.liquidoMensual}
                gastosReales={settings.gastosReales}
                caeDeuda={settings.caeDeuda}
                onGastosChange={(k, v) => update({ gastosReales: { ...settings.gastosReales, [k]: v } })}
                onCaeDeudaChange={(v) => update({ caeDeuda: v })}
                hideAmounts={hideAmounts}
              />
            </div>
          )}
          {section === "settings" && (
            <Settings settings={settings} onUpdate={update} />
          )}
        </main>
      </div>

      {/* BOTTOM TAB BAR — solo mobile */}
      <nav className={styles.bottomNav}>
        <button
          className={`${styles.bottomTab} ${section === "tarjeta" ? styles.bottomTabActive : ""}`}
          onClick={() => setSection("tarjeta")}
        >
          <CreditCard size={20} strokeWidth={section === "tarjeta" ? 2.5 : 1.8} />
          <span>Tarjeta</span>
        </button>
        <button
          className={`${styles.bottomTab} ${section === "forecast" ? styles.bottomTabActive : ""}`}
          onClick={() => setSection("forecast")}
        >
          <BarChart2 size={20} strokeWidth={section === "forecast" ? 2.5 : 1.8} />
          <span>Forecast</span>
        </button>
        <button
          className={`${styles.bottomTab} ${section === "settings" ? styles.bottomTabActive : ""}`}
          onClick={() => setSection("settings")}
        >
          <Settings2 size={20} strokeWidth={section === "settings" ? 2.5 : 1.8} />
          <span>Config</span>
        </button>
        <form action={logout} style={{ display: "contents" }}>
          <button type="submit" className={styles.bottomTab}>
            <LogOut size={20} strokeWidth={1.8} />
            <span>Salir</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
