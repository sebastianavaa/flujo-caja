import { CSSProperties } from "react";

/**
 * Thin rounded progress track. Auto-colours by budget tone, or pass an
 * explicit colour (e.g. a cuota's swatch). Optional limit marker.
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  /** Auto colour by budget state. */
  tone?: "ok" | "warn" | "over" | "accent";
  /** Explicit fill colour (overrides tone). */
  color?: string;
  height?: number;
  /** Show the vertical limit marker (billing-hero style). */
  showMarker?: boolean;
  style?: CSSProperties;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
