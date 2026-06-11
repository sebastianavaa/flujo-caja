import { ReactNode, CSSProperties } from "react";

/**
 * Small pill label for status or category. Tones map to Flujo de Caja
 * states: active (blue), paid (green), future (yellow), danger, role, neutral.
 */
export interface BadgeProps {
  children: ReactNode;
  tone?: "active" | "paid" | "future" | "danger" | "role" | "neutral";
  style?: CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
