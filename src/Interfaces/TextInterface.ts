import { ComponentProps } from "react";

export interface TextInterface extends ComponentProps<'p'> {
  message?: any;
}