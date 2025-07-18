'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { SelectValuesType } from '@/types/GeneralTypes'
import { getCategorias } from '@/store/Categorias'
import BaseLayout from '@/templates/BaseLayout'
import { Button, ButtonIcon } from '@/components/Button'
import { useRouter } from 'next/navigation'
import {
  SquaresFour,
  PencilSimple,
  Plus,
  Check,
  X,
  FunnelSimple,
  WarningCircle
} from '@phosphor-icons/react'
import { resetCategoria, setCategoria } from '@/redux/categoria/actions'
import { CategoriasProblemasType } from '@/types/CategoriasProblemasType'
import { CLickLabel } from '@/services/clickLabel'
import ModalConfirmacaoDesativarCategoria from './_components/ModalConfirmacaoDesativarCategoria'
import CardCategoria from './_components/CardCategoria'

type FiltroStatus = 'todas' | 'ativas' | 'inativas'

export default function Categorias() {
  AuthUser()

  const dispatch = useDispatch()
  const [categorias, setCategorias] = useState<Array<SelectValuesType>>([])
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<
    Array<SelectValuesType>
  >([])
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todas')
  const [atualizar, setAtualizar] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))
      dispatch(resetCategoria())

      const response = await getCategorias()

      if (response != undefined) {
        setCategorias(response.categorias)
        setCategoriasFiltradas(response.categorias)
      }

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [atualizar])

  useEffect(() => {
    const handleAtualizacao = () => {
      setAtualizar((prev) => prev + 1)
    }

    handleAtualizacao()

    window.addEventListener('categoriasAtualizar', handleAtualizacao)

    return () => {
      window.removeEventListener('categoriasAtualizar', handleAtualizacao)
    }
  }, [])

  useEffect(() => {
    const filtrarCategorias = () => {
      switch (filtroStatus) {
        case 'ativas':
          setCategoriasFiltradas(categorias.filter((cat) => cat.caativa))
          break
        case 'inativas':
          setCategoriasFiltradas(categorias.filter((cat) => !cat.caativa))
          break
        default:
          setCategoriasFiltradas(categorias)
      }
    }

    filtrarCategorias()
  }, [filtroStatus, categorias])

  return (
    <div>
      <BaseLayout
        title="Categorias"
        extraComponentRigth={
          <ButtonIcon
            icon={<Plus size={20} className="text-white" />}
            className="bg-green-700 hover:bg-green-800 active:bg-green-700 transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              dispatch(setLoading(true))
              router.push('/categorias/cadastro')
            }}
          />
        }>
        <div className="space-y-6">
          {/* Card de Resumo */}
          <div className="flex justify-center my-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
              <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <SquaresFour size={32} className="text-blue-800 mb-2" />
                <span className="text-2xl font-bold text-blue-800">
                  {categorias.length}
                </span>
                <span className="text-sm text-blue-800">
                  Total de Categorias
                </span>
              </div>
              <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <Check size={32} className="text-green-800 mb-2" />
                <span className="text-2xl font-bold text-green-800">
                  {categorias.filter((cat) => cat.caativa).length}
                </span>
                <span className="text-sm text-green-800">
                  Categorias Ativas
                </span>
              </div>
              <div className="bg-red-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all">
                <X size={32} className="text-red-800 mb-2" />
                <span className="text-2xl font-bold text-red-800">
                  {categorias.filter((cat) => !cat.caativa).length}
                </span>
                <span className="text-sm text-red-800">
                  Categorias Inativas
                </span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-center gap-2 text-gray-700 mb-3">
                <FunnelSimple size={20} />
                <span className="font-medium">Filtrar por:</span>
              </div>

              <div className="flex justify-center items-center w-[40%] m-auto gap-2">
                <button
                  onClick={() => setFiltroStatus('todas')}
                  className={`px-4 py-2 rounded-lg text-sm w-full cursor-pointer font-medium transition-all duration-300 transform hover:scale-105 ${
                    filtroStatus === 'todas'
                      ? 'bg-blue-100 text-blue-700 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <SquaresFour size={18} />
                    <span>Todas</span>
                  </div>
                </button>

                <button
                  onClick={() => setFiltroStatus('ativas')}
                  className={`px-4 py-2 rounded-lg text-sm w-full cursor-pointer font-medium transition-all duration-300 transform hover:scale-105 ${
                    filtroStatus === 'ativas'
                      ? 'bg-green-100 text-green-700 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <Check size={18} />
                    <span>Ativas</span>
                  </div>
                </button>

                <button
                  onClick={() => setFiltroStatus('inativas')}
                  className={`px-4 py-2 rounded-lg text-sm w-full cursor-pointer font-medium transition-all duration-300 transform hover:scale-105 ${
                    filtroStatus === 'inativas'
                      ? 'bg-red-100 text-red-700 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  <div className="flex items-center justify-center gap-2">
                    <X size={18} />
                    <span>Inativas</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map(
                (categoria: SelectValuesType, index: number) => {
                  return (
                    <CardCategoria
                      key={index}
                      functionAtivarDesativar={() => {
                        CLickLabel('modalConfirmarDesativarCategoria')
                        const objCategoria: CategoriasProblemasType = {
                          cacategoria: categoria.label,
                          cadescricao: categoria.description,
                          cacodigo: categoria.value,
                          caativa: categoria.caativa
                        }
                        dispatch(setCategoria(objCategoria))
                      }}
                      functionEditar={() => {
                        const objCategoria: CategoriasProblemasType = {
                          cacategoria: categoria.label,
                          cadescricao: categoria.description,
                          cacodigo: categoria.value,
                          caativa: categoria.caativa
                        }
                        dispatch(setCategoria(objCategoria))
                        router.push('/categorias/cadastro')
                      }}
                      categoria={categoria}
                    />
                  )
                }
              )
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <WarningCircle
                    size={40}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <p className="text-gray-500 text-lg">
                    Nenhuma categoria encontrada!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </BaseLayout>

      <ModalConfirmacaoDesativarCategoria />

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
