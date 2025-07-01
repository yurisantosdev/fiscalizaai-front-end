import ActionsEnderecoType from "./actionTypes";
import { TrocarEnderecoUsuarioType } from "@/types/UsuariosType";

export const setEndereco = (endereco: TrocarEnderecoUsuarioType) => ({
  type: ActionsEnderecoType.SET,
  ...endereco
})

export const resetEndereco = () => ({
  type: ActionsEnderecoType.RESET,
})
