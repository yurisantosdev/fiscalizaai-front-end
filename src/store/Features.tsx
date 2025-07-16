import { api } from '../services/api'
import toast from 'react-hot-toast'

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
