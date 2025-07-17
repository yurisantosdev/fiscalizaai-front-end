import { FeaturesCreateType } from '@/types/FeaturesType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const createFeature = async (data: FeaturesCreateType) => {
  return await api
    .post(`/features/create`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a registrar a feature, por favor tente novamente!'
      )
    })
}

export const findAllFeatures = async () => {
  return await api
    .get(`/features/findAll`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta das features, por favor tente novamente!'
      )
    })
}

export const findFeature = async (ftcodigo: string) => {
  return await api
    .get(`/features/find/${ftcodigo}`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta da feature, por favor tente novamente!'
      )
    })
}

export const deleteFeature = async (ftcodigo: string) => {
  return await api
    .delete(`/features/delete/${ftcodigo}`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível deletar a feature, por favor tente novamente!')
    })
}
