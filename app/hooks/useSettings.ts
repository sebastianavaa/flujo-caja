"use client";

import { useState, useEffect, useRef } from "react";

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
  gastosReales:   Record<string, number>; // "YYYY-MM" → gasto real total
  caeDeuda:       number;                 // deuda CAE restante
}

const CUOTAS_DEFAULT: StoredCuota[] = [
  { id: 1, name: "iPhone For Life", total: 1_617_000, numCuotas: 36, startMonth: 6, startYear: 2026, color: "#2997ff" },
  { id: 2, name: "Osojimix",        total:   120_000, numCuotas:  3, startMonth: 6, startYear: 2026, color: "#30d158" },
];

const DEFAULTS: AppSettings = {
  cupoTotal:      4_000_000,
  limiteMensual:    850_000,
  liquidoMensual: 2_650_000,
  theme:          "dark",
  cuotas:         CUOTAS_DEFAULT,
  cupoDisponible: 0,
  gastosReales:   {},
  caeDeuda:       0,
};

const LS_KEY = "flujo-caja-settings";

function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

async function fetchFromRedis(): Promise<AppSettings | null> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function saveToRedis(data: AppSettings) {
  try {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {}
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function load() {
      // 1. Show localStorage immediately (no flicker)
      let initial = DEFAULTS;
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          initial = { ...DEFAULTS, ...JSON.parse(raw) };
          setSettings(initial);
          applyTheme(initial.theme);
        } else {
          applyTheme(DEFAULTS.theme);
        }
      } catch {}

      // 2. Hydrate from Redis (source of truth)
      const remote = await fetchFromRedis();
      if (remote) {
        const merged = { ...DEFAULTS, ...remote };
        setSettings(merged);
        applyTheme(merged.theme);
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
      }

      setLoaded(true);
    }
    load();
  }, []);

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };

      // Guardar en localStorage de inmediato
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      if (patch.theme) applyTheme(patch.theme);

      // Debounce para Redis: espera 800ms sin cambios antes de escribir
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => saveToRedis(next), 800);

      return next;
    });
  }

  return { settings, update, loaded };
}
