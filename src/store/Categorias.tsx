import { CategoriasProblemasType } from '@/types/CategoriasProblemasType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const getCategorias = async () => {
  return await api
    .post(`/categorias/problemas/findAll`)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta das categorias, por favor tente novamente!'
      )
    })
}

export const getCategoriasAtivas = async () => {
  return await api
    .post(`/categorias/problemas/findAllAtivas`)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta das categorias, por favor tente novamente!'
      )
    })
}

export const salvarCategoria = async (data: CategoriasProblemasType) => {
  return await api
    .post(`/categorias/problemas/create`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível criar a categoria, por favor tente novamente!'
      )
    })
}

export const atualizarCategoria = async (data: CategoriasProblemasType) => {
  return await api
    .post(`/categorias/problemas/update`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível atualizar a categoria, por favor tente novamente!'
      )
    })
}

export const desativarAtivarCategoria = async (data: CategoriasProblemasType) => {
  return await api
    .post(`/categorias/problemas/desativar/ativar`, data)
    .then(response => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível desativar a categoria, por favor tente novamente!'
      )
    })
}