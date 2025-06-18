import { CategoriasProblemasType } from "@/types/CategoriasProblemasType";
import ActionsCategoriaType from "./actionTypes";

const initialState: CategoriasProblemasType = {
  cacategoria: '',
  cadescricao: '',
  cacodigo: '',
  caativa: false
};

const categoriaReducer = (
  state: CategoriasProblemasType = initialState,
  action: any
): CategoriasProblemasType => {
  switch (action.type) {
    case ActionsCategoriaType.SET:
      return {
        ...state,
        cacategoria: action.cacategoria,
        cadescricao: action.cadescricao,
        cacodigo: action.cacodigo,
        caativa: action.caativa
      };

    case ActionsCategoriaType.RESET:
      return initialState;

    default:
      return state;
  }
};

export default categoriaReducer;
