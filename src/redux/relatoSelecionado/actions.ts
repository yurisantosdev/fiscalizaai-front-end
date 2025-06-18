import ActionsRelatoSelecionadoType from "./actionTypes";
import { ProblemaLocalizacaoType } from "@/types/ProblemasType";

export const selecionarRelato = (relato: ProblemaLocalizacaoType) => ({
  type: ActionsRelatoSelecionadoType.RELATOSELECIONADO,
  ...relato
})

