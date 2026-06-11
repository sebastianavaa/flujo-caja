import { ReactNode, CSSProperties } from "react";

/**
 * Base surface card — soft-rounded, var(--surface) background. The
 * foundation of every panel in the product.
 *
 * @startingPoint section="Layout" subtitle="The base surface card" viewport="700x220"
 */
export interface CardProps {
  children: ReactNode;
  /** Inner padding. Set false for flush list cards (SettingRow, cuota rows). */
  pad?: boolean;
  radius?: "lg" | "xl" | "2xl";
  /** Hover lift to var(--surface2). */
  interactive?: boolean;
  /** Coloured hairline outline. */
  tone?: "accent" | "green" | "yellow" | "red";
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
