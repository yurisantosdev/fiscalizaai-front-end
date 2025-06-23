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
import { gerRelatosGeral } from '@/store/Problemas'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { CLickLabel } from '@/services/clickLabel'
import { FunnelSimple, WarningCircle, Clock } from '@phosphor-icons/react'
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
    {
      value: 'TODOS',
      label: 'Todos',
      color: 'bg-gray-100 text-gray-700',
      icon: <WarningCircle size={20} />
    },
    {
      value: 'PENDENTE',
      label: 'Pendentes',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <WarningCircle size={20} />
    },
    {
      value: 'EM_ANDAMENTO',
      label: 'Em Andamento',
      color: 'bg-orange-100 text-orange-800',
      icon: <Clock size={20} />
    }
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

  const total = relatos.filter(
    (r) => r.destatus === 'PENDENTE' || r.destatus === 'EM_ANDAMENTO'
  ).length
  const pendentes = relatos.filter((r) => r.destatus === 'PENDENTE').length
  const emAndamento = relatos.filter(
    (r) => r.destatus === 'EM_ANDAMENTO'
  ).length

  return (
    <div>
      <BaseLayout title="Relatos">
        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="flex justify-center my-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <span className="text-2xl font-bold text-gray-800">
                  {total}
                </span>
                <span className="text-sm text-gray-500">Total de relatos</span>
              </div>
              <div className="bg-yellow-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <span className="text-2xl font-bold text-yellow-800">
                  {pendentes}
                </span>
                <span className="text-sm text-yellow-800">Pendentes</span>
              </div>
              <div className="bg-orange-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <span className="text-2xl font-bold text-orange-800">
                  {emAndamento}
                </span>
                <span className="text-sm text-orange-800">Em andamento</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
            {statusOptions.map((status, idx) => (
              <button
                key={idx}
                onClick={() => setFiltroStatus(status.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md border cursor-pointer border-gray-200 ${
                  status.color
                } ${
                  filtroStatus === status.value
                    ? 'ring-2 ring-blue-700 ring-offset-2'
                    : ''
                }`}>
                {status.icon}
                {status.label}
              </button>
            ))}
          </div>

          {/* Lista de Relatos */}
          <div className="space-y-4">
            {relatosFiltrados.length > 0 ? (
              relatosFiltrados.map(
                (relato: ProblemaLocalizacaoType, index: number) => (
                  <div key={index}>
                    <CardRelato
                      mostrarFotos={false}
                      problema={relato}
                      botoesProximaEtapaConcluir
                      onClickProximaEtapaRelato={() => {
                        CLickLabel('modalProximaEtapaRelato')
                        setProblemaSelecionado(relato)
                      }}
                      onClickConcluirRelato={() => {
                        CLickLabel('modalConcluirRelato')
                        setProblemaSelecionado(relato)
                      }}
                    />
                  </div>
                )
              )
            ) : (
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <p className="text-gray-700 text-lg">
                  Nenhum relato encontrado para o filtro selecionado.
                </p>
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
