import { ReactNode, CSSProperties } from "react";

/**
 * Square icon-only control. Pass a lucide icon as children. Use `danger`
 * for destructive actions (delete) — hover turns red.
 */
export interface IconButtonProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "surface" | "soft";
  /** Hover state turns red — for delete / destructive actions. */
  danger?: boolean;
  disabled?: boolean;
  /** Accessible label + tooltip. */
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
