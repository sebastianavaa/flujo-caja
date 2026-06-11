"use client";

import { useState, useEffect } from "react";

export interface AppSettings {
  cupoTotal:      number;
  limiteMensual:  number;
  liquidoMensual: number;
  theme:          "dark" | "light";
}

const DEFAULTS: AppSettings = {
  cupoTotal:      4_000_000,
  limiteMensual:    850_000,
  liquidoMensual: 2_650_000,
  theme:          "dark",
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
