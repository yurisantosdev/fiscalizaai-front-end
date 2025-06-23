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
  Calendar,
  ChartPie,
  ChartBar
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

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
    { value: 'TODOS', label: 'Todos', color: 'bg-gray-100 text-gray-700' },
    {
      value: 'EM_ANALISE',
      label: 'Em Análise',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      value: 'RESOLVIDO',
      label: 'Resolvido',
      color: 'bg-green-100 text-green-800'
    },
    {
      value: 'PENDENTE',
      label: 'Pendente',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      value: 'EM_ANDAMENTO',
      label: 'Em Andamento',
      color: 'bg-orange-100 text-orange-800'
    },
    { value: 'CORRIGIR', label: 'Corrigir', color: 'bg-red-100 text-red-800' }
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

  // Dados para os gráficos
  const statusData = {
    labels: ['Em Análise', 'Pendente', 'Em Andamento', 'Resolvido', 'Corrigir'],
    datasets: [
      {
        data: [
          problemasFiltrados.filter((p) => p.destatus === 'EM_ANALISE').length,
          problemasFiltrados.filter((p) => p.destatus === 'PENDENTE').length,
          problemasFiltrados.filter((p) => p.destatus === 'EM_ANDAMENTO')
            .length,
          problemasFiltrados.filter((p) => p.destatus === 'RESOLVIDO').length,
          problemasFiltrados.filter((p) => p.destatus === 'CORRIGIR').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Azul
          'rgba(234, 179, 8, 0.7)', // Amarelo
          'rgba(249, 115, 22, 0.7)', // Laranja
          'rgba(34, 197, 94, 0.7)', // Verde
          'rgba(239, 68, 68, 0.7)' // Vermelho
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(249, 115, 22)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3
      }
    ]
  }

  const categoriasData = {
    labels: categoriasSelecionadas.map((catId) => {
      const label = categorias.find((c) => c.value === catId)?.label || ''
      return label.length > 12 ? label.substring(0, 12) + '...' : label
    }),
    datasets: [
      {
        label: 'Problemas por Categoria',
        data: categoriasSelecionadas.map(
          (catId) =>
            problemasFiltrados.filter((p) => p.decategoria === catId).length
        ),
        backgroundColor: 'rgba(12, 76, 163, 0.7)',
        borderColor: 'rgb(12, 76, 163)',
        borderWidth: 2,
        borderRadius: 6,
        maxBarThickness: 50,
        hoverBackgroundColor: 'rgba(12, 76, 163, 0.85)'
      }
    ]
  }

  if (!user.usmaster) {
    return null
  }

  return (
    <BaseLayout title="Relatório">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <FunnelSimple size={24} />
              <h2 className="text-xl font-bold">Filtros</h2>
            </div>
            <Button
              onClick={selecionarTodasCategorias}
              iconLeft={<CheckSquare size={20} />}
              className={`${
                categoriasSelecionadas.length === categorias.length
                  ? 'bg-blue-1000 text-white hover:bg-blue-900'
                  : 'bg-gray-200 text-black hover:bg-blue-1000 hover:text-white'
              } transition-all duration-300 cursor-pointer`}
              title={
                categoriasSelecionadas.length === categorias.length
                  ? 'Desmarcar Todas'
                  : 'Marcar Todas'
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {categorias && categorias.length > 0 ? (
              categorias.map((categoria: SelectValuesType) => (
                <button
                  key={categoria.value}
                  onClick={() => handleCategoriaChange(categoria.value)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    categoriasSelecionadas.includes(categoria.value)
                      ? 'bg-blue-1000 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {categoria.label}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Carregando categorias...</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Calendar size={24} />
              <h3 className="text-lg font-semibold">Período</h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { id: 'hoje', label: 'Hoje' },
                { id: 'semana', label: 'Últimos 7 dias' },
                { id: '15dias', label: 'Últimos 15 dias' },
                { id: 'mes', label: 'Este mês' },
                { id: 'mesAnterior', label: 'Mês anterior' }
              ].map((periodo) => (
                <button
                  key={periodo.id}
                  onClick={() => definirPeriodo(periodo.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                    periodoSelecionado === periodo.id
                      ? 'bg-blue-1000 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
                  }`}>
                  {periodo.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => handleDataChange('inicial', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1000 focus:border-transparent text-black transition-all duration-300 cursor-pointer hover:border-blue-1000"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => handleDataChange('final', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1000 focus:border-transparent text-black transition-all duration-300 cursor-pointer hover:border-blue-1000"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={gerarRelatorio}
              disabled={loading || categoriasSelecionadas.length === 0}
              iconLeft={<ChartLine size={24} />}
              className="bg-blue-1000 hover:bg-blue-900 px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              title={loading ? 'Gerando...' : 'Gerar Relatório'}
            />
          </div>
        </div>

        {problemas.length > 0 ? (
          <>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">
                {statusOptions.map((status, idx) => (
                  <button
                    key={status.value}
                    onClick={() => setFiltroStatus(status.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md border cursor-pointer border-gray-200 ${
                      status.color
                    } ${
                      filtroStatus === status.value
                        ? 'ring-2 ring-blue-700 ring-offset-2'
                        : ''
                    }`}>
                    {getStatusIcon(status.value)}
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ChartLine size={24} />
                  Indicadores
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <ChartPie size={24} className="text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Distribuição por Status
                    </h3>
                  </div>
                  <div className="relative h-[250px] w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Pie
                        data={statusData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: {
                            padding: {
                              left: 15,
                              right: 15,
                              top: 5,
                              bottom: 5
                            }
                          },
                          plugins: {
                            legend: {
                              position: 'right',
                              align: 'center',
                              labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                padding: 15,
                                font: {
                                  size: 11,
                                  family: 'Inter, system-ui, sans-serif',
                                  weight: 500
                                },
                                usePointStyle: true
                              }
                            },
                            tooltip: {
                              enabled: true,
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleFont: {
                                size: 13,
                                family: 'Inter, system-ui, sans-serif',
                                weight: 600
                              },
                              bodyFont: {
                                size: 12,
                                family: 'Inter, system-ui, sans-serif'
                              },
                              padding: 12,
                              cornerRadius: 8,
                              displayColors: true,
                              callbacks: {
                                label: (context) => {
                                  const value = context.raw as number
                                  const sum = (
                                    context.dataset.data as number[]
                                  ).reduce((a, b) => a + b, 0)
                                  const percentage = (
                                    (value / sum) *
                                    100
                                  ).toFixed(1)
                                  return ` ${value} (${percentage}%)`
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <ChartBar size={24} className="text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Problemas por Categoria
                    </h3>
                  </div>
                  <div className="relative h-[250px] w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bar
                        data={categoriasData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: {
                            padding: {
                              left: 15,
                              right: 15,
                              top: 15,
                              bottom: 5
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              enabled: true,
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleFont: {
                                size: 13,
                                family: 'Inter, system-ui, sans-serif',
                                weight: 600
                              },
                              bodyFont: {
                                size: 12,
                                family: 'Inter, system-ui, sans-serif'
                              },
                              padding: 12,
                              cornerRadius: 8,
                              callbacks: {
                                label: (context) => {
                                  const value = context.raw as number
                                  const sum = (
                                    context.dataset.data as number[]
                                  ).reduce((a, b) => a + b, 0)
                                  const percentage = (
                                    (value / sum) *
                                    100
                                  ).toFixed(1)
                                  return ` ${value} problemas (${percentage}%)`
                                }
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                font: {
                                  size: 11,
                                  family: 'Inter, system-ui, sans-serif',
                                  weight: 500
                                },
                                maxRotation: 45,
                                minRotation: 45
                              }
                            },
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                                display: true
                              },
                              border: {
                                display: false
                              },
                              ticks: {
                                font: {
                                  size: 11,
                                  family: 'Inter, system-ui, sans-serif',
                                  weight: 500
                                },
                                stepSize: 1,
                                padding: 8
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {problemasFiltrados.length > 0 ? (
                problemasFiltrados.map(
                  (problema: ProblemaLocalizacaoType, index: number) => (
                    <div key={problema.decodigo}>
                      <CardRelato
                        ordem={index + 1}
                        buttonsAjustarCancelar={false}
                        problema={problema}
                        onClickAjustarRelato={() => {
                          dispatch(selecionarRelato(problema))
                          CLickLabel('modalAjusteRelato')
                        }}
                        onClickCancelarRelato={() => {
                          CLickLabel('modalConfirmacaoCancelarProblema')
                        }}
                      />
                    </div>
                  )
                )
              ) : (
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <p className="text-gray-700 text-lg">
                    Não há relatos com este status.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <p className="text-gray-700 text-lg">
              {loading
                ? 'Gerando relatório...'
                : 'Selecione as categorias e clique em "Gerar Relatório"'}
            </p>
          </div>
        )}
      </div>
    </BaseLayout>
  )
}
