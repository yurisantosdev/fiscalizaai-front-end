import { NotificacoesConsultaType } from '@/types/NotificacoesType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const getNotificacoes = async (data: NotificacoesConsultaType) => {
  return await api
    .post(`/notificacoes/findAll`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta das notificações, por favor tente novamente!'
      )
    })
}

export const letTodasNotificacoes = async (data: NotificacoesConsultaType) => {
  return await api
    .post(`/notificacoes/ler/todas`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível ler todas as notificações, por favor tente novamente!'
      )
    })
}
