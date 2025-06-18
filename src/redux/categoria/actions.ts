import { CategoriasProblemasType } from "@/types/CategoriasProblemasType";
import ActionsCategoriaType from "./actionTypes";

export const setCategoria = (categoria: CategoriasProblemasType) => ({
  type: ActionsCategoriaType.SET,
  ...categoria
})

export const resetCategoria = () => ({
  type: ActionsCategoriaType.RESET,
})