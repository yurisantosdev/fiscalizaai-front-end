import {
  FeedbacksUsuariosType,
  FeedbackUsuarioLerType
} from '@/types/FeedbacksUsuariosType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const salvarFeedback = async (data: FeedbacksUsuariosType) => {
  return await api
    .post(`/feedback/create`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível registrar seu feedback, por favor tente novamente!'
      )
    })
}

export const findAllFeedbacks = async () => {
  return await api
    .get(`/feedback/findAll`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível consultar os feedbacks, por favor tente novamente!'
      )
    })
}

export const lerFeedback = async (data: FeedbackUsuarioLerType) => {
  return await api
    .post(`/feedback/ler`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível ler seu feedback, por favor tente novamente!')
    })
}
