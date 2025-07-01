import ActionsCategoriaType from "./actionTypes";
import { TrocarEnderecoUsuarioType } from "@/types/UsuariosType";

const initialState: TrocarEnderecoUsuarioType = {
  uscodigo: "",
  edcodigo: "",
  edbairro: "",
  edcep: "",
  edcomplemento: "",
  edestado: "",
  edmunicipio: "",
  ednumero: "",
  edpontoreferencia: "",
  edproblema: false,
  edrua: "",
};

const enderecoReducer = (
  state: TrocarEnderecoUsuarioType = initialState,
  action: any
): TrocarEnderecoUsuarioType => {
  switch (action.type) {
    case ActionsCategoriaType.SET:
      return {
        ...state,
        uscodigo: action.uscodigo,
        edcodigo: action.edcodigo,
        edbairro: action.edbairro,
        edcep: action.edcep,
        edcomplemento: action.edcomplemento,
        edestado: action.edestado,
        edmunicipio: action.edmunicipio,
        ednumero: action.ednumero,
        edpontoreferencia: action.edpontoreferencia,
        edproblema: action.edproblema,
        edrua: action.edrua,
      };

    case ActionsCategoriaType.RESET:
      return initialState;

    default:
      return state;
  }
};

export default enderecoReducer;
