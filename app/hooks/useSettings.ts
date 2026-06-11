"use client";

import { useState, useEffect } from "react";

export interface StoredCuota {
  id: number;
  name: string;
  total: number;
  numCuotas: number;
  startMonth: number;
  startYear: number;
  color: string;
}

export interface AppSettings {
  cupoTotal:      number;
  limiteMensual:  number;
  liquidoMensual: number;
  theme:          "dark" | "light";
  cuotas:         StoredCuota[];
  cupoDisponible: number;
}

const CUOTAS_DEFAULT: StoredCuota[] = [
  { id: 1, name: "iPhone For Life", total: 1_617_000, numCuotas: 36, startMonth: 6, startYear: 2026, color: "#a380f5" },
  { id: 2, name: "Osojimix",        total:   120_000, numCuotas:  3, startMonth: 6, startYear: 2026, color: "#f472b6" },
];

const DEFAULTS: AppSettings = {
  cupoTotal:      4_000_000,
  limiteMensual:    850_000,
  liquidoMensual: 2_650_000,
  theme:          "dark",
  cuotas:         CUOTAS_DEFAULT,
  cupoDisponible: 0,
};

const KEY = "flujo-caja-settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = { ...DEFAULTS, ...JSON.parse(raw) };
        setSettings(saved);
        applyTheme(saved.theme);
      } else {
        applyTheme(DEFAULTS.theme);
      }
    } catch {}
    setLoaded(true);
  }, []);

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      if (patch.theme) applyTheme(patch.theme);
      return next;
    });
  }

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

  return { settings, update, loaded };
}
