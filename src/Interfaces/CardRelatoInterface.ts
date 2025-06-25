import { ProblemaLocalizacaoType } from "@/types/ProblemasType";
import { ComponentProps, ReactNode } from "react";

export interface CardRelatoInterface extends ComponentProps<'div'> {
  problema: ProblemaLocalizacaoType;
  onCLickAprovar?: () => void;
  onCLickReprovar?: () => void;
  aprovarReprovarButtons?: boolean;
  inputMotivo?: ReactNode;
  resumido?: boolean;
  ordem?: number;
  onClickAjustarRelato?: () => void;
  onClickCancelarRelato?: () => void;
  buttonsAjustarCancelar?: boolean;
  mostrarFotos?: boolean;
  onClickProximaEtapaRelato?: () => void;
  onClickConcluirRelato?: () => void;
  botoesProximaEtapaConcluir?: boolean;
  historicoRelato?: boolean;
}