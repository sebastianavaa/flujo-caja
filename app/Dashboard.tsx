"use client";

import { useState } from "react";
import CalculadoraTarjeta from "./CalculadoraTarjeta";
import ForecastAhorro from "./ForecastAhorro";
import styles from "./Dashboard.module.css";

type Section = "tarjeta" | "forecast";

export default function Dashboard() {
  const [section, setSection] = useState<Section>("tarjeta");

  return (
    <div className={styles.root}>
      <div className={styles.noise} />

      <div className={styles.wrap}>
        {/* TOP NAV */}
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
              💳 Tarjeta
            </button>
            <button
              className={`${styles.navTab} ${section === "forecast" ? styles.navTabActive : ""}`}
              onClick={() => setSection("forecast")}
            >
              📊 Forecast
            </button>
          </div>
        </nav>

        {/* CONTENT */}
        <main className={styles.content}>
          {section === "tarjeta" && <CalculadoraTarjeta />}
          {section === "forecast" && (
            <div className={styles.forecastWrap}>
              <header className={styles.forecastHeader}>
                <div className={styles.forecastTag}>Seba Nava · Plutto · Mayo 2026</div>
                <h1 className={styles.forecastTitle}>Forecast personal</h1>
                <div className={styles.forecastBadges}>
                  <span className={styles.badgeRole}>Implementation Engineer</span>
                  <span className={styles.badgeOk}>✓ ACEPTADO</span>
                </div>
                <p className={styles.forecastSub}>Peñalolén · sin arriendo · 3x/sem Vitacura · $2.650.000 líquido</p>
              </header>
              <ForecastAhorro />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
