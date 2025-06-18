import { ComponentProps } from "react";

export interface CardNotificacaoInterface extends ComponentProps<'div'> {
  lida: boolean;
  mensagem: string;
  quando: string;
}