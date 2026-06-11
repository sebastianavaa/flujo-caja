import { ReactNode, CSSProperties, ChangeEvent } from "react";

/**
 * A settings list row: label + sublabel on the left, a right-aligned value
 * input (or any custom control). Stack inside a Card for Apple-style lists.
 */
export interface SettingRowProps {
  label: string;
  sublabel?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  placeholder?: string;
  /** Replace the default number input with any control (e.g. a Switch). */
  control?: ReactNode;
  /** Drop the bottom divider on the last row. */
  last?: boolean;
  style?: CSSProperties;
}

export function SettingRow(props: SettingRowProps): JSX.Element;
