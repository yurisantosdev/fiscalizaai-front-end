import { UsuarioType } from "@/types/UsuariosType";
import ActionsUserType from "./actionTypes";

export const loginUser = (user: UsuarioType) => ({
  type: ActionsUserType.LOGIN,
  ...user
})

export const logoutUser = () => ({
  type: ActionsUserType.LOGOUT
})