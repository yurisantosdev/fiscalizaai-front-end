import ActionsRelatoSelecionadoType from "./actionTypes";
import { ProblemaLocalizacaoType } from "@/types/ProblemasType";

const initialState: ProblemaLocalizacaoType = {
  decodigo: "",
  decategoria: "",
  dedescricao: "",
  delocalizacao: "",
  dedata: "",
  deusuario: "",
  destatus: "",
  localizacao: {
    edcodigo: undefined,
    edrua: "",
    edestado: "",
    edmunicipio: "",
    ednumero: "",
    edcomplemento: undefined,
    edpontoreferencia: undefined,
    edcep: "",
    edbairro: "",
    edlatitude: undefined,
    edlongitude: undefined,
    edproblema: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    municipio: undefined,
    estado: undefined
  },
  categoria: {
    cacodigo: undefined,
    cacategoria: "",
    cadescricao: "",
    createdAt: undefined,
    updatedAt: undefined
  },
  FotosProblemas: []
};

const relatoSelecionadoReducer = (
  state: ProblemaLocalizacaoType = initialState,
  action: any
): ProblemaLocalizacaoType => {
  switch (action.type) {
    case ActionsRelatoSelecionadoType.RELATOSELECIONADO:
      return {
        ...state,
        decodigo: action.decodigo,
        decategoria: action.decategoria,
        dedescricao: action.dedescricao,
        dedata: action.dedata,
        delocalizacao: action.delocalizacao,
        destatus: action.destatus,
        deusuario: action.deusuario,
        localizacao: action.localizacao,
        categoria: action.categoria,
        FotosProblemas: action.FotosProblemas
      };

    default:
      return state;
  }
};

export default relatoSelecionadoReducer;
