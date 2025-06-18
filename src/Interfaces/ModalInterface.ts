import { ComponentProps, ReactNode } from "react";

export interface ModalInterface extends ComponentProps<'div'> {
  htmlFor: string;
  name: string;
  children: ReactNode;
  loading: boolean;
}