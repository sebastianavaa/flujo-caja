import { CSSProperties } from "react";

/**
 * A label over a large tabular-number value — the product's core metric
 * block (cupo breakdown, billing sub-row, countdowns).
 */
export interface StatProps {
  label: string;
  value: string | number;
  /** Leading symbol, e.g. "$", rendered muted. */
  prefix?: string;
  /** Trailing unit, e.g. "/día", rendered small. */
  suffix?: string;
  tone?: "accent" | "green" | "yellow" | "orange" | "red";
  size?: "sm" | "md" | "lg";
  align?: "left" | "right" | "center";
  sublabel?: string;
  style?: CSSProperties;
}

export function Stat(props: StatProps): JSX.Element;
