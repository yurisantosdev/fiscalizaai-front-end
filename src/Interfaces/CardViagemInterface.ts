import { ComponentProps } from "react";

export interface CardViagemInterface extends ComponentProps<'div'> {
  title: string,
  description: string,
  image: string,
  destino: string,
  inicio: string,
  fim: string,
  diasFaltantes: string,
}
