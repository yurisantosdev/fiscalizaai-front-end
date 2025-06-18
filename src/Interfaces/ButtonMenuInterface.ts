import { ComponentProps, ReactNode } from "react";

export interface ButtonMenuInterface extends ComponentProps<'button'> {
  title: string;
  icon: ReactNode;
  selecionado: boolean;
}
