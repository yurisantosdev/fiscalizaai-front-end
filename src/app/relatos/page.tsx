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
import { gerRelatosGeral, getMeusRelatos } from '@/store/Problemas'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { CLickLabel } from '@/services/clickLabel'
import { FunnelSimple } from '@phosphor-icons/react'
import ModalProximaEtapaRelato from './_components/ModalProximaEtapaRelato'
import ModalConcluirRelato from './_components/ModalConcluirRelato'

export default function Relatos() {
  AuthUser()

  const dispatch = useDispatch()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [relatos, setRelatos] = useState<Array<ProblemaLocalizacaoType>>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')
  const [problemaSelecionado, setProblemaSelecionado] =
    useState<ProblemaLocalizacaoType>()

  const statusOptions = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' }
  ]

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))

      const response = await gerRelatosGeral()

      if (response != undefined) {
        setRelatos(response.problemas)
      }

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [])

  useEffect(() => {
    const handleRelatoAtualizado = async () => {
      if (user.uscodigo) {
        dispatch(setLoading(true))

        const response = await gerRelatosGeral()

        if (response != undefined) {
          setRelatos(response.problemas)
        }

        dispatch(setLoading(false))
      }
    }

    window.addEventListener('relatoAtualizado', handleRelatoAtualizado)

    return () => {
      window.removeEventListener('relatoAtualizado', handleRelatoAtualizado)
    }
  }, [user.uscodigo])

  const relatosFiltrados = relatos.filter((relato) =>
    filtroStatus === 'TODOS'
      ? relato.destatus === 'PENDENTE' || relato.destatus === 'EM_ANDAMENTO'
      : relato.destatus === filtroStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODOS':
        return 'bg-gray-100 text-gray-700'
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'EM_ANDAMENTO':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div>
      <BaseLayout title="Relatos">
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FunnelSimple size={20} />
                <span className="font-medium">Filtrar por status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Lista de Relatos */}
          <div className="space-y-4">
            {relatosFiltrados.length > 0 ? (
              relatosFiltrados.map(
                (relato: ProblemaLocalizacaoType, index: number) => (
                  <CardRelato
                    key={index}
                    mostrarFotos={false}
                    problema={relato}
                    onClickProximaEtapaRelato={() => {
                      CLickLabel('modalProximaEtapaRelato')
                      setProblemaSelecionado(relato)
                    }}
                    onClickConcluirRelato={() => {
                      CLickLabel('modalConcluirRelato')
                      setProblemaSelecionado(relato)
                    }}
                  />
                )
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum relato encontrado</p>
              </div>
            )}
          </div>
        </div>
      </BaseLayout>

      {problemaSelecionado && (
        <ModalProximaEtapaRelato decodigo={problemaSelecionado.decodigo} />
      )}

      {problemaSelecionado && (
        <ModalConcluirRelato decodigo={problemaSelecionado.decodigo} />
      )}
    </div>
  )
}
