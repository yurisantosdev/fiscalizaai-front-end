'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import {
  ConsultaProblemasLocalizacaoUsuarioType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { getMeusRelatos } from '@/store/Problemas'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'
import { CLickLabel } from '@/services/clickLabel'
import ModalConfirmacaoCancelarProblema from '@/components/ModalConfirmacaoCancelarProblema'
import { FunnelSimple } from '@phosphor-icons/react'
import ModalAjustarRelato from '@/components/ModalAjustarRelato'

export default function MeusRelatos() {
  AuthUser()

  const dispatch = useDispatch()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [meusRelatos, setMeusRelatos] = useState<
    Array<ProblemaLocalizacaoType>
  >([])
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')
  const [problemaSelecionadoCancelar, setProblemaSelecionadoCancelar] =
    useState<ProblemaLocalizacaoType>()

  const statusOptions = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'EM_ANALISE', label: 'Em Análise' },
    { value: 'RESOLVIDO', label: 'Resolvido' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CORRIGIR', label: 'Corrigir' }
  ]

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))
      const obj: ConsultaProblemasLocalizacaoUsuarioType = {
        uscodigo: user.uscodigo
      }

      const response = await getMeusRelatos(obj)

      if (response != undefined) {
        setMeusRelatos(response.problemas)
      }

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [])

  useEffect(() => {
    const handleRelatoAtualizado = async () => {
      if (user.uscodigo) {
        dispatch(setLoading(true))
        const obj: ConsultaProblemasLocalizacaoUsuarioType = {
          uscodigo: user.uscodigo
        }

        const response = await getMeusRelatos(obj)

        if (response != undefined) {
          setMeusRelatos(response.problemas)
        }

        dispatch(setLoading(false))
      }
    }

    window.addEventListener('relatoAtualizado', handleRelatoAtualizado)

    return () => {
      window.removeEventListener('relatoAtualizado', handleRelatoAtualizado)
    }
  }, [user.uscodigo])

  const relatosFiltrados = meusRelatos.filter((relato) =>
    filtroStatus === 'TODOS' ? true : relato.destatus === filtroStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODOS':
        return 'bg-blue-100 text-blue-800'
      case 'EM_ANALISE':
        return 'bg-blue-100 text-blue-800'
      case 'RESOLVIDO':
        return 'bg-green-100 text-green-800'
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'EM_ANDAMENTO':
        return 'bg-orange-100 text-orange-800'
      case 'CORRIGIR':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <BaseLayout title="Meus Relatos">
        <div className="space-y-4">
          <div className="md:flex md:items-center gap-4 mb-4">
            <div className="flex items-center justify-center md:mb-0 mb-2 gap-2 text-gray-700">
              <FunnelSimple size={20} />
              <span className="font-medium">Filtrar por status:</span>
            </div>

            <div className="md:flex md:flex-wrap grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFiltroStatus(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                    filtroStatus === status.value
                      ? getStatusColor(status.value)
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {relatosFiltrados.length > 0 ? (
              relatosFiltrados.map(
                (relato: ProblemaLocalizacaoType, index: number) => {
                  return (
                    <CardRelato
                      key={index}
                      problema={relato}
                      onClickAjustarRelato={() => {
                        dispatch(selecionarRelato(relato))
                        setProblemaSelecionadoCancelar(relato)
                        CLickLabel('modalAjusteRelato')
                      }}
                      onClickCancelarRelato={() => {
                        CLickLabel('modalConfirmacaoCancelarProblema')
                        setProblemaSelecionadoCancelar(relato)
                      }}
                    />
                  )
                }
              )
            ) : (
              <p className="text-center text-sm text-gray-600">Nenhum relato</p>
            )}
          </div>
        </div>
      </BaseLayout>

      {problemaSelecionadoCancelar && (
        <ModalConfirmacaoCancelarProblema
          decodigo={problemaSelecionadoCancelar.decodigo}
        />
      )}

      {problemaSelecionadoCancelar && (
        <ModalAjustarRelato problema={problemaSelecionadoCancelar} />
      )}
    </div>
  )
}
