import { CSSProperties } from "react";

/**
 * Segmented pill tab group — the Tarjeta · Forecast · Config switcher.
 * Controlled via value + onChange.
 */
export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (id: string) => void;
  style?: CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
