import { UsuarioConsultaType } from "@/types/UsuariosType";
import ActionsUserType from "./actionTypes";

const initialState: UsuarioConsultaType = {
  token: null,
  usemail: '',
  usnome: '',
  uscodigo: '',
  usendereco: "",
  usmaster: false,
  createdAt: '',
  endereco: {
    edcodigo: "",
    edbairro: "",
    edcep: "",
    edcomplemento: "",
    edestado: "",
    edlatitude: "",
    edlongitude: "",
    edmunicipio: "",
    ednumero: "",
    edpontoreferencia: "",
    edproblema: "",
    edrua: "",
    municipio: {
      mccodigo: "",
      mcmunicipio: "",
      mcestado: "",
      mclatitude: 0,
      mclongitude: 0,
    },
    estado: {
      escodigo: "",
      esestado: "",
      essigla: "",
      createdAt: "",
      updatedAt: ""
    }
  },
  localizacaoCasaUsuario: {
    latitude: 0,
    longitude: 0,
  }
};

const userReducer = (
  state: UsuarioConsultaType = initialState,
  action: any
): UsuarioConsultaType => {
  switch (action.type) {
    case ActionsUserType.LOGIN:
      return {
        ...state,
        token: action.token,
        uscodigo: action.uscodigo,
        usemail: action.usemail,
        usnome: action.usnome,
        usendereco: action.usendereco,
        usmaster: action.usmaster,
        createdAt: action.createdAt,
        endereco: action.endereco,
        localizacaoCasaUsuario: action.localizacaoCasaUsuario
      };

    case ActionsUserType.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;
