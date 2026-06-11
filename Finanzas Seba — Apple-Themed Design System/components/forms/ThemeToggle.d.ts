import { ReactNode, CSSProperties } from "react";

/**
 * Segmented light/dark switch (apple.com style). Flips data-theme on the
 * target element — by default the document root. Controlled via `theme`
 * or self-managed.
 */
export interface ThemeToggleProps {
  /** Controlled value. Omit to self-manage. */
  theme?: "light" | "dark";
  onChange?: (theme: "light" | "dark") => void;
  /** Element to set data-theme on. Defaults to document.documentElement. */
  target?: HTMLElement | null;
  /** lucide <Sun/> for the light button. */
  sunIcon?: ReactNode;
  /** lucide <Moon/> for the dark button. */
  moonIcon?: ReactNode;
  segmented?: boolean;
  style?: CSSProperties;
}

export function ThemeToggle(props: ThemeToggleProps): JSX.Element;
