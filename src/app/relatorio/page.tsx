'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import BaseLayout from '@/templates/BaseLayout'
import { api } from '@/services/api'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
  ChartLine,
  FunnelSimple,
  WarningCircle,
  CheckCircle,
  Clock,
  SealQuestion,
  MagnifyingGlass,
  CheckSquare,
  Calendar
} from '@phosphor-icons/react'
import { getCategorias } from '@/store/Categorias'
import { SelectValuesType } from '@/types/GeneralTypes'
import CardRelato from '@/components/CardRelato'
import { ProblemaLocalizacaoType } from '@/types/ProblemasType'
import { useDispatch } from 'react-redux'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import { Button } from '@/components/Button'
import { setLoading } from '@/redux/loading/actions'

export default function Relatorio() {
  AuthUser()
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.userReducer)
  const [categorias, setCategorias] = useState<SelectValuesType[]>([])
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([])
  const [problemas, setProblemas] = useState<ProblemaLocalizacaoType[]>([])
  const [dataInicial, setDataInicial] = useState<string>('')
  const [dataFinal, setDataFinal] = useState<string>('')
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS')
  const loading = useSelector((state: any) => state.loadingReducer.loading)

  const statusOptions = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'EM_ANALISE', label: 'Em Análise' },
    { value: 'RESOLVIDO', label: 'Resolvido' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'CORRIGIR', label: 'Corrigir' }
  ]

  useEffect(() => {
    if (!user.usmaster) {
      router.push('/home')
    }
  }, [user, router])

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    dispatch(setLoading(true))
    const response = await getCategorias()
    if (response != undefined) {
      setCategorias(response.categorias)
    }
    dispatch(setLoading(false))
  }

  const handleCategoriaChange = (categoria: string) => {
    setCategoriasSelecionadas((prev) => {
      if (prev.includes(categoria)) {
        setProblemas([])
        return prev.filter((c) => c !== categoria)
      }
      setProblemas([])
      return [...prev, categoria]
    })
  }

  const selecionarTodasCategorias = () => {
    if (categoriasSelecionadas.length === categorias.length) {
      setCategoriasSelecionadas([])
    } else {
      setCategoriasSelecionadas(categorias.map((categoria) => categoria.value))
    }
    setProblemas([])
  }

  const gerarRelatorio = async () => {
    if (categoriasSelecionadas.length === 0) {
      toast('Selecione pelo menos uma categoria')
      return
    }

    dispatch(setLoading(true))

    try {
      const response = await api.post('/problemas/relatorio', {
        categorias: categoriasSelecionadas,
        dataInicial,
        dataFinal
      })
      if (response.data && response.data.problemas) {
        setProblemas(response.data.problemas)
      }
    } catch (error) {
      toast.error('Erro ao gerar relatório')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODOS':
        return 'bg-gray-100 text-gray-700'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVIDO':
        return (
          <CheckCircle size={24} weight="fill" className="text-green-800" />
        )
      case 'CORRIGIR':
        return <SealQuestion size={24} weight="fill" className="text-red-800" />
      case 'PENDENTE':
        return (
          <WarningCircle size={24} weight="fill" className="text-yellow-800" />
        )
      case 'EM_ANDAMENTO':
        return <Clock size={24} weight="fill" className="text-orange-800" />
      case 'EM_ANALISE':
        return (
          <MagnifyingGlass size={24} weight="fill" className="text-blue-800" />
        )
      default:
        return <Clock size={24} weight="fill" className="text-gray-700" />
    }
  }

  const definirPeriodo = (periodo: string) => {
    const hoje = new Date()
    let inicio: Date
    let fim: Date = new Date()

    switch (periodo) {
      case 'hoje':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
        break
      case 'semana':
        inicio = new Date(hoje)
        inicio.setDate(hoje.getDate() - 7)
        break
      case '15dias':
        inicio = new Date(hoje)
        inicio.setDate(hoje.getDate() - 15)
        break
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
        break
      case 'mesAnterior':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
        fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0)
        break
      default:
        return
    }

    setDataInicial(inicio.toISOString().split('T')[0])
    setDataFinal(fim.toISOString().split('T')[0])
    setPeriodoSelecionado(periodo)
    setProblemas([])
  }

  const handleDataChange = (tipo: 'inicial' | 'final', valor: string) => {
    if (tipo === 'inicial') {
      setDataInicial(valor)
    } else {
      setDataFinal(valor)
    }
    setPeriodoSelecionado('')
    setProblemas([])
  }

  const problemasFiltrados = problemas.filter((problema) =>
    filtroStatus === 'TODOS' ? true : problema.destatus === filtroStatus
  )

  if (!user.usmaster) {
    return null
  }

  return (
    <BaseLayout title="Relatório">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FunnelSimple size={20} />
              <span className="font-medium">Filtrar por:</span>
            </div>
            <Button
              onClick={selecionarTodasCategorias}
              iconLeft={<CheckSquare size={20} />}
              className={`${
                categoriasSelecionadas.length === categorias.length
                  ? 'bg-blue-1000 text-white hover:bg-blue-1000'
                  : 'bg-gray-200 text-black hover:bg-blue-1000 hover:text-white'
              }`}
              title={
                categoriasSelecionadas.length === categorias.length
                  ? 'Desmarcar'
                  : 'Marcar'
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {categorias && categorias.length > 0 ? (
              categorias.map((categoria: SelectValuesType) => (
                <button
                  key={categoria.value}
                  onClick={() => handleCategoriaChange(categoria.value)}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                    categoriasSelecionadas.includes(categoria.value)
                      ? 'bg-blue-1000 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {categoria.label}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Carregando categorias...</p>
            )}
          </div>

          <div className="mt-6 mb-4">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Calendar size={20} />
              <span className="font-medium">Filtrar por período:</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => definirPeriodo('hoje')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                  periodoSelecionado === 'hoje'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Hoje
              </button>
              <button
                onClick={() => definirPeriodo('semana')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                  periodoSelecionado === 'semana'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Últimos 7 dias
              </button>
              <button
                onClick={() => definirPeriodo('15dias')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                  periodoSelecionado === '15dias'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Últimos 15 dias
              </button>
              <button
                onClick={() => definirPeriodo('mes')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                  periodoSelecionado === 'mes'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Este mês
              </button>
              <button
                onClick={() => definirPeriodo('mesAnterior')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                  periodoSelecionado === 'mesAnterior'
                    ? 'bg-blue-1000 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Mês anterior
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => handleDataChange('inicial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1000 focus:border-transparent text-black cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => handleDataChange('final', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1000 focus:border-transparent text-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={gerarRelatorio}
              disabled={loading || categoriasSelecionadas.length === 0}
              iconLeft={<ChartLine size={20} />}
              className="bg-blue-1000 hover:bg-blue-1000 px-8 py-2"
              title={loading ? 'Gerando...' : 'Gerar Relatório'}
            />
          </div>
        </div>

        {problemas.length > 0 ? (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="md:flex md:items-center md:gap-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-gray-700 md:mb-0 mb-2">
                  <FunnelSimple size={20} />
                  <span className="font-medium">Filtrar por status:</span>
                </div>

                <div className="md:flex md:flex-wrap gap-2 grid grid-cols-2">
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

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">Indicadores</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-700 mb-2">
                    Total de Relatos
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-1000">
                      {problemasFiltrados.length}
                    </span>
                    <ChartLine
                      size={28}
                      className="text-blue-1000"
                      weight="fill"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-700 mb-2">
                    Por Status
                  </h3>
                  <div className="h-[150px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {[
                      'EM_ANALISE',
                      'PENDENTE',
                      'EM_ANDAMENTO',
                      'RESOLVIDO',
                      'CORRIGIR'
                    ].map((status) => (
                      <div
                        key={status}
                        className="flex items-center justify-between bg-white p-1.5 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(status)}
                          <span className="text-sm font-medium text-gray-600">
                            {status === 'EM_ANALISE' && 'Em Análise'}
                            {status === 'PENDENTE' && 'Pendente'}
                            {status === 'EM_ANDAMENTO' && 'Em Andamento'}
                            {status === 'RESOLVIDO' && 'Resolvido'}
                            {status === 'CORRIGIR' && 'Corrigir'}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                            status
                          )}`}>
                          {
                            problemasFiltrados.filter(
                              (problema) => problema.destatus === status
                            ).length
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-gray-700 mb-2">
                    Por Categoria
                  </h3>
                  <div className="h-[150px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                    {categoriasSelecionadas.map((categoriaId) => {
                      const categoria = categorias.find(
                        (c) => c.value === categoriaId
                      )
                      return (
                        <div
                          key={categoriaId}
                          className="flex items-center justify-between bg-white p-1.5 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">
                            {categoria?.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-blue-1000/10 text-blue-1000">
                            {
                              problemasFiltrados.filter(
                                (problema) =>
                                  problema.decategoria === categoriaId
                              ).length
                            }
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {problemasFiltrados.length > 0 ? (
                problemasFiltrados.map(
                  (problema: ProblemaLocalizacaoType, index: number) => (
                    <CardRelato
                      ordem={index + 1}
                      buttonsAjustarCancelar={false}
                      key={problema.decodigo}
                      problema={problema}
                      onClickAjustarRelato={() => {
                        dispatch(selecionarRelato(problema))
                        CLickLabel('modalAjusteRelato')
                      }}
                      onClickCancelarRelato={() => {
                        CLickLabel('modalConfirmacaoCancelarProblema')
                      }}
                    />
                  )
                )
              ) : (
                <div>
                  <p className="text-center text-black">
                    Não há relatos com este status.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            {loading
              ? 'Gerando relatório...'
              : 'Selecione as categorias e clique em "Gerar Relatório"'}
          </div>
        )}
      </div>
    </BaseLayout>
  )
}
