import {
  AprovarReprovarProblemaType,
  AtualizarStatusRelatoType,
  CancelarProblemaType,
  ConsultaProblemasLocalizacaoUsuarioType,
  ExportarRelatorioType,
  FindProblemaType,
  ProblemasCriateType
} from '@/types/ProblemasType'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export const registrarProblema = async (data: ProblemasCriateType) => {
  return await api
    .post(`/problemas/create`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível registrar seu problema, por favor tente novamente!'
      )
    })
}

export const getProblemasLocalizacaoUsuario = async (
  data: ConsultaProblemasLocalizacaoUsuarioType
) => {
  return await api
    .post(`/problemas/find/localizacao/usuario`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta dos problemas sem sua localização, por favor tente novamente!'
      )
    })
}

export const getMeusRelatos = async (
  data: ConsultaProblemasLocalizacaoUsuarioType
) => {
  return await api
    .post(`/problemas/find/all/usuario`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta de seus relatos, por favor tente novamente!'
      )
    })
}

export const getRelatosAnalisar = async () => {
  return await api
    .post(`/problemas/find/analisar`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta de seus relatos para analisar, por favor tente novamente!'
      )
    })
}

export const getRelatosRevisar = async (
  data: ConsultaProblemasLocalizacaoUsuarioType
) => {
  return await api
    .post(`/problemas/revisar`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta de seus relatos para analisar, por favor tente novamente!'
      )
    })
}

export const gerRelatosGeral = async () => {
  return await api
    .post(`/problemas/geral`)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível realizar a consulta dos relatos para analisar, por favor tente novamente!'
      )
    })
}

export const aprovarReprovarProblema = async (
  data: AprovarReprovarProblemaType
) => {
  return await api
    .post(`/problemas/analisar`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível revisar o problema, por favor tente novamente!')
    })
}

export const ajustarProblema = async (data: ProblemasCriateType) => {
  return await api
    .post(`/problemas/ajustar`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível ajustar seu relato, por favor tente novamente!')
    })
}

export const cancelarProblema = async (data: CancelarProblemaType) => {
  return await api
    .post(`/problemas/cancelar`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível cancelar o relato, por favor tente novamente!')
    })
}

export const atualizarStatusRelato = async (
  data: AtualizarStatusRelatoType
) => {
  return await api
    .post(`/problemas/atualizar/status`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast(
        'Não foi possível alterar o status do relato, por favor tente novamente!'
      )
    })
}

export const findProblema = async (data: FindProblemaType) => {
  return await api
    .post(`/problemas/find`, data)
    .then((response) => {
      return response.data
    })
    .catch(() => {
      toast('Não foi possível consultar o relato, por favor tente novamente!')
    })
}

export const exportarExcel = async (data: ExportarRelatorioType) => {
  return await api
    .post(`/problemas/excel`, data, {
      responseType: 'blob'
    })
    .then((response) => {
      return response
    })
    .catch(() => {
      toast(
        'Não foi possível exportar em excel o relatório, por favor tente novamente!'
      )
    })
}
