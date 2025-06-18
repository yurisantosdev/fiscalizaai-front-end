import { ComponentProps, ReactNode } from "react";

export interface ItemAdicionarInterface extends ComponentProps<'li'> {
  icone: ReactNode;
  nome: string;
  link?: string;
  label?: string;
}
