'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import Mapa from '@/components/Mapa/Mapa'
import {
  getProblemasLocalizacaoUsuario,
  getRelatosRevisar
} from '@/store/Problemas'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import MarkerMapa from '@/components/Mapa/Marker'
import { ProblemaLocalizacaoType } from '@/types/ProblemasType'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import {
  Plus,
  Calendar,
  ArrowClockwise,
  WarningCircle,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  Warning
} from '@phosphor-icons/react'
import BaseLayout from '@/templates/BaseLayout'
import ModalConfirmacaoCancelarProblema from '@/components/ModalConfirmacaoCancelarProblema'
import ModalAjustarRelato from '@/components/ModalAjustarRelato'
import toast from 'react-hot-toast'

export default function HomePage() {
  AuthUser()
  const router = useRouter()
  const [position, setPosition] = useState<[number, number]>([
    -27.1048361, -52.6142228
  ])
  const [mapKey, setMapKey] = useState<number>(0)
  const dispatch = useDispatch()
  const [problemas, setProblemas] = useState<Array<any>>([])
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [problemaSelecionadoCancelar, setProblemaSelecionadoCancelar] =
    useState<ProblemaLocalizacaoType>()
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')
  const [relatosCorrigirUsuario, setRelatosCorrigirUsuario] =
    useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const total = problemas.length
  const pendentes = problemas.filter((p) => p.destatus === 'PENDENTE').length
  const emAndamento = problemas.filter(
    (p) => p.destatus === 'EM_ANDAMENTO'
  ).length
  const resolvidos = problemas.filter((p) => p.destatus === 'RESOLVIDO').length

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
    }
  ]

  useEffect(() => {
    const handleRelatoAtualizado = async () => {
      if (user.uscodigo) {
        obterDadosLocalizacao()

        dispatch(setLoading(true))
        setIsRefreshing(true)

        const responseProblemasLocalizacao =
          await getProblemasLocalizacaoUsuario({
            uscodigo: user.uscodigo
          })

        if (responseProblemasLocalizacao != undefined) {
          setProblemas(responseProblemasLocalizacao.problemas)
        }

        const responseProblemasCorrigirUsuario = await getRelatosRevisar({
          uscodigo: user.uscodigo
        })

        if (responseProblemasCorrigirUsuario != undefined) {
          setRelatosCorrigirUsuario(
            responseProblemasCorrigirUsuario.problemas.length > 0
          )
        }

        dispatch(setLoading(false))
        setIsRefreshing(false)
      }
    }
    handleRelatoAtualizado()
    window.addEventListener('relatoAtualizado', handleRelatoAtualizado)
    return () => {
      window.removeEventListener('relatoAtualizado', handleRelatoAtualizado)
    }
  }, [user.uscodigo])

  const problemasFiltrados =
    filtroStatus === 'TODOS'
      ? problemas
      : problemas.filter((p) => p.destatus === filtroStatus)

  const nome = user.usnome?.split(' ')[0] || 'Usuário'

  const handleRefresh = () => {
    setIsRefreshing(true)
    obterDadosLocalizacao()
    window.dispatchEvent(new Event('relatoAtualizado'))
  }

  const handleLocationRequest = () => {
    obterDadosLocalizacao()
  }

  function obterDadosLocalizacao() {
    if (!navigator.geolocation) {
      dispatch(setLoading(false))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          setMapKey((prev) => prev + 1)
        } catch (error: any) {
          if (error.code === 1) {
            toast.error('Permissão negada para acessar sua localização.')
          } else if (error.code === 2) {
            toast.error(
              'Localização indisponível no momento. Verifique seu GPS ou conexão.'
            )
          } else if (error.code === 3) {
            toast.error(
              'Tempo limite para obter a localização. Tente novamente.'
            )
          } else {
            console.log(error)
            toast.error('Erro desconhecido ao obter localização.')
          }

          dispatch(setLoading(false))
        }
      },
      (error) => {
        if (error.code === 1) {
          toast.error('Permissão negada para acessar sua localização.')
        } else if (error.code === 2) {
          toast.error(
            'Localização indisponível no momento. Verifique seu GPS ou conexão.'
          )
        } else if (error.code === 3) {
          toast.error('Tempo limite para obter a localização. Tente novamente.')
        } else {
          toast.error('Erro desconhecido ao obter localização.')
        }

        dispatch(setLoading(false))
      }
    )
  }

  return (
    <span>
      <BaseLayout>
        {/* Banner boas vindas ao usuário */}
        <div className="transition-all animate-slide-up mt-4 mb-2 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Olá, {nome}!
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            Obrigado por contribuir para uma cidade melhor. Fique à vontade para
            registrar novos problemas ou acompanhar o que acontece na sua
            região.
          </p>
        </div>

        {/* Banner atenção para revisar relatos */}
        {relatosCorrigirUsuario && (
          <div className="transition-all animate-slide-up bg-gradient-to-r from-red-700 to-red-600 p-3 rounded-xl md:w-[80%] w-full m-auto mt-5">
            <div className="flex justify-center items-center gap-2 mb-5">
              <h1 className="text-lg text-white text-center font-bold">
                Atenção
              </h1>
              <Warning size={20} className="text-white" />
            </div>

            <p className="text-md text-center text-white font-light">
              Temos alguns relatos que precisam da sua atenção! Faltaram
              detalhes importantes para conseguirmos avançar. Clique no botão
              abaixo e nos ajude a complementar essas informações.
            </p>

            <div className="md:w-[30%] w-[60%] m-auto mt-8">
              <Button
                title="Revisar Relatos"
                iconLeft={<MagnifyingGlass size={20} />}
                onClick={() => {
                  dispatch(setLoading(true))
                  router.push('/revisarRelatos')
                }}
                className="bg-white w-full text-red-700 font-bold text-sm rounded-lg shadow hover:bg-red-900 active:bg-red-800 hover:text-white transition-all duration-300 mt-4 md:mt-0"
              />
            </div>
          </div>
        )}

        {/* Banner de chamada para ação */}
        <div className="w-full mb-6 flex flex-col mt-6 items-center justify-center transition-all animate-slide-up">
          <div className="bg-gradient-to-r from-orange-1000 to-orange-600 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between w-full max-w-3xl animate-slide-up">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-white mb-1 md:text-start text-center">
                Notou algum problema na sua cidade?
              </h2>
              <p className="text-white text-sm md:text-start text-center">
                Ajude a melhorar sua comunidade registrando um novo relato!
              </p>
            </div>
            <Button
              title="Registrar Novo Relato"
              iconLeft={<Plus size={20} />}
              onClick={() => router.push('/registrarProblema')}
              className="bg-white text-orange-1000 active:bg-orange-700 font-bold rounded-lg shadow hover:bg-orange-1000 hover:bg-gradient-to-r hover:to-orange-600 hover:from-orange-1000 hover:text-white transition-all duration-700 mt-4 md:mt-0 text-sm"
            />
          </div>
        </div>

        {/* Cards de resumo rápido */}
        <div className="flex justify-center my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all animate-slide-up">
              <span className="text-4xl font-bold text-gray-800">{total}</span>
              <span className="text-sm text-gray-500 truncate">
                Total de relatos
              </span>
            </div>
            <div className="bg-yellow-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all animate-slide-up">
              <span className="text-4xl font-bold text-yellow-800">
                {pendentes}
              </span>
              <span className="text-sm text-yellow-800 truncate">
                Pendentes
              </span>
            </div>
            <div className="bg-orange-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all animate-slide-up">
              <span className="text-4xl font-bold text-orange-800">
                {emAndamento}
              </span>
              <span className="text-sm text-orange-800 truncate">
                Em andamento
              </span>
            </div>
            <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all animate-slide-up">
              <span className="text-4xl font-bold text-green-800">
                {resolvidos}
              </span>
              <span className="text-sm text-green-800 truncate">
                Resolvidos
              </span>
            </div>
          </div>
        </div>

        {/* Filtros rápidos para o mapa */}
        <div className="transition-all animate-slide-up flex flex-wrap gap-2 mb-4 items-center justify-center">
          {statusOptions.map((status, idx) => (
            <button
              key={idx}
              onClick={() => setFiltroStatus(status.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md border cursor-pointer border-gray-200 ${
                status.color
              } ${
                filtroStatus === status.value
                  ? 'ring-2 ring-orange-1000 ring-offset-2'
                  : ''
              }`}>
              {status.icon}
              {status.label}
            </button>
          ))}
        </div>

        <div className="transition-all animate-slide-up flex justify-center items-center mb-3">
          <button
            onClick={handleRefresh}
            className="ml-2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border text-black  border-gray-300 shadow hover:bg-gray-100 transition-all duration-300 cursor-pointer"
            title="Atualizar Mapa">
            <ArrowClockwise
              size={20}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            Atualizar
          </button>
        </div>

        {/* Mapa Interativo */}
        <div className="transition-all animate-slide-up p-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 md:text-start text-center">
                Situações na sua área e suas contribuições
              </h2>
              <p className="text-gray-600 md:text-start text-center">
                Visualize relatos reportados e contribua para melhorar sua
                comunidade
              </p>
            </div>
            <div className="flex items-center gap-2 md:justify-start justify-center bg-gradient-to-r to-orange-1000 from-orange-600 p-2 rounded-3xl">
              <div className="text-sm text-white">
                {problemasFiltrados.length} relatos exibidos
              </div>
            </div>
          </div>
          <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-lg relative">
            <Mapa
              fraseLocalizacaoMapa="Localização atual"
              className="w-full h-full"
              locAtual={false}
              position={position}
              onLocationRequest={handleLocationRequest}>
              <MarkerMapa
                position={position}
                childrenPop={
                  <div>
                    <p className="text-black text-sm">Localização Atual</p>
                  </div>
                }
              />

              {problemasFiltrados.map(
                (problema: ProblemaLocalizacaoType, index: number) => {
                  return (
                    <div key={index}>
                      <MarkerMapa
                        status={problema.destatus}
                        childrenPop={
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  problema.destatus === 'PENDENTE'
                                    ? 'bg-yellow-500'
                                    : problema.destatus === 'EM_ANALISE'
                                    ? 'bg-blue-500'
                                    : problema.destatus === 'EM_ANDAMENTO'
                                    ? 'bg-orange-500'
                                    : problema.destatus === 'RESOLVIDO'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`}></div>
                              <span className="font-bold text-gray-800">
                                {problema.categoria.cacategoria}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {problema.categoria.cadescricao}
                            </p>
                            <div className="text-xs text-gray-500 mb-2">
                              <p>{problema.localizacao?.edrua},</p>
                              <p>{problema.localizacao?.edbairro}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-gray-500">
                                {problema.dedata
                                  ? new Date(
                                      problema.dedata
                                    ).toLocaleDateString('pt-BR')
                                  : ''}
                              </span>
                            </div>
                          </div>
                        }
                        position={[
                          problema.localizacao?.edlatitude ?? 0,
                          problema.localizacao?.edlongitude ?? 0
                        ]}
                      />
                    </div>
                  )
                }
              )}
            </Mapa>
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
    </span>
  )
}
