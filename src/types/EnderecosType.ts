import { EstadosType } from "./EstadosType";
import { MunicipiosType } from "./MunicipiosType";

export type EnderecosType = {
  edcodigo?: string;
  edrua?: string;
  edestado?: string;
  edmunicipio?: string;
  ednumero?: string;
  edcomplemento?: string;
  edpontoreferencia?: string;
  edcep?: string;
  edbairro?: string;
  edlatitude?: string;
  edlongitude?: string;
  edproblema?: boolean;
  createdAt?: string;
  updatedAt?: string;
  municipio?: MunicipiosType,
  estado?: EstadosType,
};
