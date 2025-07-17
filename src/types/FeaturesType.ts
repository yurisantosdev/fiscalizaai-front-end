import { FotosFeaturesSimplesType, FotosFeaturesType } from "./FotosFeaturesType";
import { UsuarioSimplesType } from "./UsuariosType";

export type FeaturesType = {
  ftcodigo?: string;
  fttitulo: string;
  ftdescricao: string;
  ftquando: string;
  ftusuario: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FeaturesCreateType = {
  fttitulo: string;
  ftdescricao: string;
  ftusuario: string;
  fotos: Array<FotosFeaturesType>;
};

export type FeaturesConsultaType = {
  ftcodigo: string;
  fttitulo: string;
  ftdescricao: string;
  ftquando: string;
  usuario: UsuarioSimplesType;
  fotosFeatures?: FotosFeaturesSimplesType,
  completa?: boolean;
  listagem?: boolean;
};