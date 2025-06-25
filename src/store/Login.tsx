import { LoginType } from '../types/LoginType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const loginFuncion = async (data: LoginType) => {
  return await api
    .post(`/auth`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível realizar o login, por favor tente novamente!')
    })
}
