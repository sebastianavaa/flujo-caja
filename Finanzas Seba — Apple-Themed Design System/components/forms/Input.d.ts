import { CSSProperties, ChangeEvent } from "react";

/**
 * Text/number input. `hero` = the large weight-300 money input with a $
 * prefix; `field` = a filled surface field for forms and settings.
 *
 * @startingPoint section="Forms" subtitle="Money inputs & form fields" viewport="700x180"
 */
export interface InputProps {
  variant?: "hero" | "field";
  type?: "text" | "number";
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Leading symbol, e.g. "$". */
  prefix?: string;
  /** Field label rendered above. */
  label?: string;
  /** Helper line below (hero variant). */
  sublabel?: string;
  align?: "left" | "right";
  /** Style applied to the <input> element. */
  style?: CSSProperties;
  /** Style applied to the wrapping box. */
  boxStyle?: CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
