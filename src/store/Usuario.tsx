import {
  CriarUsuario,
  EsqueciSenhaType,
  RedefinirSenhaType
} from '@/types/UsuariosType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const criarUsuario = async (data: CriarUsuario) => {
  return await api
    .post(`/usuarios/create`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar seu cadastro, por favor tente novamente!'
      )
    })
}

export const solicitarRecuperacaoSenha = async (data: EsqueciSenhaType) => {
  return await api
    .post(`/usuarios/solicitar/recuperacao/senha`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a solicitação da recuperação de senha, por favor tente novamente!'
      )
    })
}

export const redefinirSenha = async (data: RedefinirSenhaType) => {
  return await api
    .post(`/usuarios/solicitar/redefinir/senha`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível redefinir a senha, por favor tente novamente!')
    })
}
