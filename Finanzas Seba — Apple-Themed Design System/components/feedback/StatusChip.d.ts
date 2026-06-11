import { CSSProperties } from "react";

/**
 * Traffic-light status chip for budget health (ok / warn / over).
 * Defaults to the Spanish labels ✓ OK · ⚠ ATENCIÓN · ✕ EXCEDE.
 */
export interface StatusChipProps {
  status?: "ok" | "warn" | "over";
  /** Override the default label text. */
  label?: string;
  style?: CSSProperties;
}

export function StatusChip(props: StatusChipProps): JSX.Element;
