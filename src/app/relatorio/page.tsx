'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState, useRef } from 'react'
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
  ChartBar,
  Files,
  MicrosoftExcelLogo,
  FilePdf,
  ListBullets
} from '@phosphor-icons/react'
import { getCategorias } from '@/store/Categorias'
import { SelectValuesType } from '@/types/GeneralTypes'
import CardRelato from '@/components/CardRelato'
import {
  ExportarRelatorioType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { useDispatch } from 'react-redux'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'
import { CLickLabel } from '@/services/clickLabel'
import toast from 'react-hot-toast'
import { Button, ButtonIcon } from '@/components/Button'
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
import { exportarExcel } from '@/store/Problemas'
import { exibirDataHoraAtual } from '@/services/obterDataHoraAtual'
import { jsPDF } from 'jspdf'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
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
  const chartStatusRef = useRef(null)
  const chartCategoriaRef = useRef(null)
  const [hiddenIndexesStatus, setHiddenIndexesStatus] = useState<number[]>([])
  const [hiddenIndexesCategorias, setHiddenIndexesCategorias] = useState<
    number[]
  >([])

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
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
          size: 15,
          family: 'Inter, system-ui, sans-serif',
          weight: 700
        },
        bodyFont: {
          size: 14,
          family: 'Inter, system-ui, sans-serif'
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const value = context.raw as number
            const sum = (context.dataset.data as number[]).reduce(
              (a, b) => a + b,
              0
            )
            const percentage = ((value / sum) * 100).toFixed(1)
            return ` ${value} (${percentage}%)`
          }
        }
      },
      datalabels: {
        color: '#222',
        font: {
          size: 13,
          weight: 600
        },
        formatter: (value: number, context: any) => {
          const sum = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0
          )
          const percentage = ((value / sum) * 100).toFixed(1)
          return value > 0 ? `${value} (${percentage}%)` : ''
        }
      }
    }
  }

  const toggleSegmentStatus = (index: number) => {
    const chart: any = chartStatusRef.current
    if (!chart) return
    const meta = chart.getDatasetMeta(0)
    const item = meta.data[index]
    if (!item) return
    const isHidden = hiddenIndexesStatus.includes(index)
    if (isHidden) {
      item.hidden = false
      setHiddenIndexesStatus(hiddenIndexesStatus.filter((i) => i !== index))
    } else {
      item.hidden = true
      setHiddenIndexesStatus([...hiddenIndexesStatus, index])
    }
    chart.update()
  }

  const toggleSegmentCategoria = (index: number) => {
    const chart: any = chartCategoriaRef.current
    if (!chart) return
    const meta = chart.getDatasetMeta(0)
    const item = meta.data[index]
    if (!item) return
    const isHidden = hiddenIndexesCategorias.includes(index)
    if (isHidden) {
      item.hidden = false
      setHiddenIndexesCategorias(
        hiddenIndexesCategorias.filter((i) => i !== index)
      )
    } else {
      item.hidden = true
      setHiddenIndexesCategorias([...hiddenIndexesCategorias, index])
    }
    chart.update()
  }

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

  const paletaPasteisSuave = [
    '#B3D8F7', // azul pastel suave
    '#C8F7C5', // verde pastel suave
    '#F7B3B3', // vermelho pastel suave
    '#FFF9B3', // amarelo pastel suave
    '#FFD6B3', // laranja pastel suave
    '#E0C8F7', // roxo pastel suave
    '#F7C8E0', // rosa pastel suave
    '#B3F7F4', // turquesa pastel suave
    '#F0F0F0', // cinza pastel suave
    '#EAD7C8' // marrom pastel suave
  ]

  const categoriasCores = categoriasSelecionadas.map(
    (_, idx) => paletaPasteisSuave[idx % paletaPasteisSuave.length]
  )

  const categoriasData = {
    labels: categoriasSelecionadas.map((catId) => {
      const label = categorias.find((c) => c.value === catId)?.label || ''
      return label
    }),
    datasets: [
      {
        label: 'Problemas por Categoria',
        data: categoriasSelecionadas.map(
          (catId) =>
            problemasFiltrados.filter((p) => p.decategoria === catId).length
        ),
        backgroundColor: categoriasCores,
        borderColor: categoriasCores,
        borderWidth: 2,
        borderRadius: 6,
        maxBarThickness: 50,
        hoverBackgroundColor: categoriasCores
      }
    ]
  }

  async function onExportarExcel() {
    dispatch(setLoading(true))

    const dados: ExportarRelatorioType = {
      dados: problemasFiltrados
    }

    const response = await exportarExcel(dados)

    if (response != undefined) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio-${exibirDataHoraAtual()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }

    dispatch(setLoading(false))
  }

  if (!user.usmaster) {
    return null
  }

  async function exportarPDFStatus() {
    const chart: any = chartStatusRef.current

    if (chart) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = 1920
      tempCanvas.height = 768
      tempCanvas.style.display = 'none'
      document.body.appendChild(tempCanvas)

      const visibleStatusIndexes = statusData.labels
        .map((_, idx) => idx)
        .filter((idx) => !hiddenIndexesStatus.includes(idx))
      const filteredLabels = visibleStatusIndexes.map(
        (idx) => statusData.labels[idx]
      )
      const filteredData = visibleStatusIndexes.map(
        (idx) => statusData.datasets[0].data[idx]
      )
      const filteredColors = visibleStatusIndexes.map(
        (idx) => statusData.datasets[0].backgroundColor[idx]
      )

      const exportOptions = {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 40, right: 40, top: 40, bottom: 40 }
        },
        plugins: {
          legend: {
            position: 'bottom' as const,
            labels: {
              boxWidth: 32,
              boxHeight: 32,
              padding: 18,
              font: {
                size: 22,
                family: 'Inter, system-ui, sans-serif',
                weight: 700
              },
              usePointStyle: true
            }
          },
          datalabels: {
            color: '#222',
            font: {
              size: 22,
              weight: 700
            },
            formatter: (value: number, context: any) => {
              const sum = context.chart.data.datasets[0].data.reduce(
                (a: number, b: number) => a + b,
                0
              )
              const percentage = ((value / sum) * 100).toFixed(1)
              return value > 0 ? `${value} (${percentage}%)` : ''
            }
          }
        },
        animation: false as const
      }

      const chartInstance = new ChartJS(tempCanvas, {
        type: 'pie',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Status',
              data: filteredData,
              backgroundColor: filteredColors,
              borderColor: filteredColors,
              borderWidth: 2,
              hoverBackgroundColor: filteredColors
            }
          ]
        },
        options: exportOptions,
        plugins: [ChartDataLabels]
      })
      await new Promise((r) => setTimeout(r, 100))
      const imgData = tempCanvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1400, 700]
      })
      pdf.setFontSize(32)
      pdf.setTextColor('#0c4ca3')
      pdf.text('Relatório de Distribuição por Status', 1400 / 2, 60, {
        align: 'center'
      })
      pdf.setDrawColor('#0c4ca3')
      pdf.setLineWidth(2)
      pdf.line(60, 80, 1400 - 60, 80)
      pdf.setFontSize(18)
      pdf.setTextColor('#222')
      pdf.text(`Gerado em: ${exibirDataHoraAtual()}`, 1400 - 60, 110, {
        align: 'right'
      })
      pdf.addImage(imgData, 'PNG', 60, 130, 1400 - 120, 700 - 250)
      pdf.setFontSize(16)
      pdf.setTextColor('#555')
      pdf.text(`Relatório gerado por: ${user.usnome}`, 60, 700 - 40, {
        align: 'left'
      })
      pdf.save(`grafico-status-${new Date().toLocaleDateString()}.pdf`)
      chartInstance.destroy()
      document.body.removeChild(tempCanvas)
    }
  }

  async function exportarPDFCategoria() {
    const chart: any = chartCategoriaRef.current

    if (chart) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = 1920
      tempCanvas.height = 768
      tempCanvas.style.display = 'none'
      document.body.appendChild(tempCanvas)

      // Filtra os dados visíveis conforme os segmentos não ocultos
      const visibleCatIndexes = categoriasData.labels
        .map((_, idx) => idx)
        .filter((idx) => !hiddenIndexesCategorias.includes(idx))
      const filteredLabels = visibleCatIndexes.map(
        (idx) => categoriasData.labels[idx]
      )
      const filteredData = visibleCatIndexes.map(
        (idx) => categoriasData.datasets[0].data[idx]
      )
      const filteredColors = visibleCatIndexes.map(
        (idx) => categoriasData.datasets[0].backgroundColor[idx]
      )

      const exportOptions = {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 40, right: 40, top: 40, bottom: 40 }
        },
        plugins: {
          legend: {
            position: 'bottom' as const,
            labels: {
              boxWidth: 32,
              boxHeight: 32,
              padding: 18,
              font: {
                size: 22,
                family: 'Inter, system-ui, sans-serif',
                weight: 700
              },
              usePointStyle: true
            }
          },
          datalabels: {
            color: '#222',
            font: {
              size: 22,
              weight: 700
            },
            formatter: (value: number, context: any) => {
              const sum = context.chart.data.datasets[0].data.reduce(
                (a: number, b: number) => a + b,
                0
              )
              const percentage = ((value / sum) * 100).toFixed(1)
              return value > 0 ? `${value} (${percentage}%)` : ''
            }
          }
        },
        animation: false as const
      }

      const chartInstance = new ChartJS(tempCanvas, {
        type: 'pie',
        data: {
          labels: filteredLabels,
          datasets: [
            {
              label: 'Problemas por Categoria',
              data: filteredData,
              backgroundColor: filteredColors,
              borderColor: filteredColors,
              borderWidth: 2,
              hoverBackgroundColor: filteredColors
            }
          ]
        },
        options: exportOptions,
        plugins: [ChartDataLabels]
      })
      await new Promise((r) => setTimeout(r, 100))
      const imgData = tempCanvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1400, 700]
      })
      // Título
      pdf.setFontSize(32)
      pdf.setTextColor('#0c4ca3') // azul
      pdf.text('Relatório de Relatos por Categoria', 1400 / 2, 60, {
        align: 'center'
      })
      // Linha horizontal
      pdf.setDrawColor('#0c4ca3')
      pdf.setLineWidth(2)
      pdf.line(60, 80, 1400 - 60, 80)
      // Data
      pdf.setFontSize(18)
      pdf.setTextColor('#222')
      pdf.text(`Gerado em: ${exibirDataHoraAtual()}`, 1400 - 60, 110, {
        align: 'right'
      })
      // Gráfico centralizado em alta resolução
      pdf.addImage(imgData, 'PNG', 60, 130, 1400 - 120, 700 - 250)
      // Rodapé
      pdf.setFontSize(16)
      pdf.setTextColor('#555')
      pdf.text(`Relatório gerado por: ${user.usnome}`, 60, 700 - 40, {
        align: 'left'
      })
      pdf.save(`grafico-categoria-${new Date().toLocaleDateString()}.pdf`)
      chartInstance.destroy()
      document.body.removeChild(tempCanvas)
    }
  }

  return (
    <BaseLayout title="Relatório">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {/* Marcar desmarcar todas as categorias */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <FunnelSimple size={20} />
              <h2 className="text-lg font-bold">Filtros</h2>
            </div>
            <Button
              onClick={selecionarTodasCategorias}
              iconLeft={<CheckSquare size={20} />}
              className={`${
                categoriasSelecionadas.length === categorias.length
                  ? 'bg-blue-1000 text-white hover:bg-blue-900'
                  : 'bg-gray-200 text-black hover:bg-blue-1000 hover:text-white'
              } transition-all duration-300 cursor-pointer text-sm`}
              title={
                categoriasSelecionadas.length === categorias.length
                  ? 'Desmarcar Todas'
                  : 'Marcar Todas'
              }
            />
          </div>

          {/* Categorias para filtro */}
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

          {/* Intervalo do relatório */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Calendar size={20} />
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

          {/* Botão gerar relatório */}
          <div className="flex justify-center">
            <Button
              onClick={gerarRelatorio}
              disabled={loading || categoriasSelecionadas.length === 0}
              iconLeft={<ChartLine size={20} />}
              className="bg-blue-1000 hover:bg-blue-900 px-8 py-3 text-md font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              title={loading ? 'Gerando...' : 'Gerar Relatório'}
            />
          </div>
        </div>

        {/* Relatório */}
        {problemas.length > 0 ? (
          <>
            {/* Filtro por status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FunnelSimple size={20} />
                  Filtro por status
                </h2>
              </div>

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

            {/* Exportação */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Files size={20} />
                  Exportação
                </h2>
              </div>

              <div className="tooltip tooltip-bottom w-full" data-tip="Excel">
                <ButtonIcon
                  icon={<MicrosoftExcelLogo size={50} />}
                  onClick={onExportarExcel}
                  className="text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-all duration-300 transform w-full max-h-14"
                />
              </div>
            </div>

            {/* Indicadores */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ChartLine size={20} />
                  Indicadores
                </h2>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex justify-center items-center">
                      <ChartPie size={20} className="text-gray-700" />
                      <h3 className="text-md font-semibold text-gray-700">
                        Distribuição por Status
                      </h3>
                    </div>

                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Exportar PDF">
                      <ButtonIcon
                        className="text-red-600 bg-red-100 hover:bg-red-50 rounded-md transition-all duration-300 transform w-full"
                        icon={<FilePdf size={24} />}
                        onClick={exportarPDFStatus}
                      />
                    </div>
                  </div>

                  {/* Gráfico */}
                  <div className="relative w-full max-w-[700px] mx-auto min-h-[250px] h-[350px] sm:h-[350px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Pie
                        ref={chartStatusRef}
                        data={statusData}
                        options={options}
                      />
                    </div>
                  </div>

                  {/* Legenda Status */}
                  <div className="grid grid-cols-1 gap-2 bg-white p-4 rounded-md shadow-2xl w-full">
                    <h1 className="text-center text-black text-md mb-3">
                      Legenda Status
                    </h1>
                    {statusData.labels.map((label, index) => {
                      const isHidden = hiddenIndexesStatus.includes(index)
                      return (
                        <div
                          key={index}
                          className="tooltip tooltip-top"
                          data-tip={label}>
                          <button
                            onClick={() => toggleSegmentStatus(index)}
                            className={`flex items-center gap-2 cursor-pointer ${
                              isHidden
                                ? 'opacity-40 line-through text-black'
                                : ''
                            }`}>
                            <span
                              className="w-4 h-4 rounded-full shrink-0"
                              style={{
                                backgroundColor: statusData.datasets[0]
                                  .backgroundColor[index] as string
                              }}></span>
                            <p className="text-sm text-gray-700 text-left">
                              {label}
                            </p>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 transform transition-all duration-300 hover:shadow-lg mt-5">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex justify-center items-center">
                      <ChartBar size={20} className="text-gray-700" />
                      <h3 className="text-md font-semibold text-gray-700">
                        Relatos por Categoria
                      </h3>
                    </div>

                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Exportar PDF">
                      <ButtonIcon
                        className="text-red-600 bg-red-100 hover:bg-red-50 rounded-md transition-all duration-300 transform w-full"
                        icon={<FilePdf size={24} />}
                        onClick={exportarPDFCategoria}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Gráfico */}
                    <div className="relative w-full max-w-[700px] mx-auto min-h-[250px] h-[350px]">
                      <Pie
                        ref={chartCategoriaRef}
                        data={categoriasData}
                        options={options}
                      />
                    </div>

                    {/* Legenda Categorias */}
                    <div className="grid grid-cols-1 gap-2 bg-white p-4 rounded-md shadow-2xl w-full">
                      <h1 className="text-center text-black text-md mb-3">
                        Legenda Categorias
                      </h1>
                      {categoriasData.labels.map((label, index) => {
                        const isHidden = hiddenIndexesCategorias.includes(index)
                        return (
                          <div
                            key={index}
                            className="tooltip tooltip-top"
                            data-tip={label}>
                            <button
                              onClick={() => toggleSegmentCategoria(index)}
                              className={`flex items-center gap-2 cursor-pointer ${
                                isHidden
                                  ? 'opacity-40 line-through text-black'
                                  : ''
                              }`}>
                              <span
                                className="w-4 h-4 rounded-full shrink-0"
                                style={{
                                  backgroundColor: categoriasData.datasets[0]
                                    .backgroundColor[index] as string
                                }}></span>
                              <p className="text-sm text-gray-700 text-left">
                                {label}
                              </p>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listagem dos relatos */}
            <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ListBullets size={20} className="text-gray-700" />
                <h3 className="text-md font-semibold text-gray-700">
                  Listagem dos relatos
                </h3>
              </div>

              {problemasFiltrados.length > 0 ? (
                problemasFiltrados.map(
                  (problema: ProblemaLocalizacaoType, index: number) => (
                    <div key={problema.decodigo}>
                      <CardRelato
                        historicoRelato
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
            <p className="text-gray-700 text-md">
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
