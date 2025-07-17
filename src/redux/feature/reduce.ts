import ActionsFeaturesType from "./actionTypes";
import { FeaturesConsultaType } from "@/types/FeaturesType";

const initialState: FeaturesConsultaType = {
  ftcodigo: '',
  ftdescricao: '',
  ftquando: '',
  fttitulo: '',
  usuario: {
    uscodigo: "",
    usemail: "",
    usnome: ""
  },
  completa: false,
  fotosFeatures: {
    ffcodigo: "",
    fffoto: "",
    fffeature: "",
    ffdescricao: ""
  },
  listagem: false
};

const featureReducer = (
  state: FeaturesConsultaType = initialState,
  action: any
): FeaturesConsultaType => {
  switch (action.type) {
    case ActionsFeaturesType.SET:
      return {
        ...state,
        ...action,
      };

    default:
      return state;
  }
};

export default featureReducer;
