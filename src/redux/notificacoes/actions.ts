import ActionsNotificacoesType from "./actionTypes";
import { NotificacoesSimplesConsultaType } from "@/types/NotificacoesType";

export const setNotificacoes = (notificacoes: NotificacoesSimplesConsultaType) => ({
  type: ActionsNotificacoesType.SET,
  ...notificacoes
})
