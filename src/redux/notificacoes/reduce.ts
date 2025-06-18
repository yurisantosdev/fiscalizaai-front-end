import ActionsUserType from "./actionTypes";
import { NotificacoesSimplesConsultaType } from "@/types/NotificacoesType";

const initialState: NotificacoesSimplesConsultaType = {
  naoLidas: [],
  todas: []
};

const notificacoesReducer = (
  state: NotificacoesSimplesConsultaType = initialState,
  action: any
): NotificacoesSimplesConsultaType => {
  switch (action.type) {
    case ActionsUserType.SET:
      return {
        ...state,
        naoLidas: action.naoLidas,
        todas: action.todas,
      };

    default:
      return state;
  }
};

export default notificacoesReducer;
