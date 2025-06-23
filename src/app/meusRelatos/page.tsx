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
import {
  FunnelSimple,
  WarningCircle,
  CheckCircle,
  Clock,
  SealQuestion,
  MagnifyingGlass
} from '@phosphor-icons/react'
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

  // Cálculos para os cards de resumo
  const total = meusRelatos.length
  const pendentes = meusRelatos.filter((p) => p.destatus === 'PENDENTE').length
  const emAndamento = meusRelatos.filter(
    (p) => p.destatus === 'EM_ANDAMENTO'
  ).length
  const resolvidos = meusRelatos.filter(
    (p) => p.destatus === 'RESOLVIDO'
  ).length

  const statusOptions = [
    {
      value: 'TODOS',
      label: 'Todos',
      color: 'bg-gray-100 text-gray-800',
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
    },
    {
      value: 'RESOLVIDO',
      label: 'Resolvidos',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={20} />
    },
    {
      value: 'CORRIGIR',
      label: 'Corrigir',
      color: 'bg-red-100 text-red-800',
      icon: <SealQuestion size={20} />
    },
    {
      value: 'EM_ANALISE',
      label: 'Em Análise',
      color: 'bg-blue-100 text-blue-800',
      icon: <MagnifyingGlass size={20} />
    }
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

  const relatosFiltrados =
    filtroStatus === 'TODOS'
      ? meusRelatos
      : meusRelatos.filter((p) => p.destatus === filtroStatus)

  return (
    <div className="min-h-screen bg-gray-1500">
      <BaseLayout title="Meus Relatos">
        {/* Cards de resumo rápido */}
        <div className="flex justify-center my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
              <span className="text-2xl font-bold text-gray-800">{total}</span>
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
            <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
              <span className="text-2xl font-bold text-green-800">
                {resolvidos}
              </span>
              <span className="text-sm text-green-800">Resolvidos</span>
            </div>
          </div>
        </div>

        {/* Painel de filtros */}
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

        {/* Grid de cards dos relatos */}
        <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto px-2 md:px-6 py-6">
          {relatosFiltrados.length > 0 ? (
            relatosFiltrados.map(
              (relato: ProblemaLocalizacaoType, index: number) => (
                <div key={index} className="animate-slide-up">
                  <CardRelato
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
                </div>
              )
            )
          ) : (
            <p className="text-center text-sm text-gray-600 col-span-full">
              Nenhum relato
            </p>
          )}
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
      <style jsx global>{`
        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.4, 2, 0.6, 1);
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
