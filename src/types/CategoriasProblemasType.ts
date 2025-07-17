import { SelectValuesType } from "./GeneralTypes";

export type CategoriasProblemasType = {
  cacodigo?: string;
  cacategoria: string;
  cadescricao: string;
  caativa?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CardCategoriaType = {
  functionEditar: () => void,
  functionAtivarDesativar: () => void,
  categoria: SelectValuesType
};
