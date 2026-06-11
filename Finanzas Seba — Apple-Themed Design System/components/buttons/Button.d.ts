import { ReactNode, CSSProperties } from "react";

/**
 * Apple-styled action button. Solid accent (primary), tinted (secondary),
 * text-only (ghost) or neutral surface. Use `pill` for the capsule Save button.
 *
 * @startingPoint section="Buttons" subtitle="Primary / secondary / ghost actions" viewport="700x200"
 */
export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "neutral";
  size?: "sm" | "md" | "lg";
  /** Render as a rounded capsule (Apple Save-button style). */
  pill?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
