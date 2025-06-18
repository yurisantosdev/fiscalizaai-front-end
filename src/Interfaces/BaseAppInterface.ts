import { ComponentProps, ReactNode } from "react";

export interface BaseAppInterface extends ComponentProps<'div'> {
  children?: ReactNode;
  loading: boolean,
  styleBase?: boolean,
  adicionarItens?: boolean,
  menu?: boolean,
  extraComponentTitle?: ReactNode,
}
