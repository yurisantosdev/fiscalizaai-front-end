import { ReactNode, ComponentProps } from "react";

export interface MapaInterface extends ComponentProps<'div'> {
  position: any;
  dragedFunction?: any;
  children?: ReactNode;
  locAtual: boolean;
  onLocationRequest?: () => void;
}