'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { SelectValuesType } from '@/types/GeneralTypes'
import { getCategorias } from '@/store/Categorias'
import BaseLayout from '@/templates/BaseLayout'
import { ButtonIcon } from '@/components/Button'
import { useRouter } from 'next/navigation'
import {
  SquaresFour,
  PencilSimple,
  Plus,
  Check,
  X,
  FunnelSimple
} from '@phosphor-icons/react'
import { resetCategoria, setCategoria } from '@/redux/categoria/actions'
import { CategoriasProblemasType } from '@/types/CategoriasProblemasType'
import { CLickLabel } from '@/services/clickLabel'
import ModalConfirmacaoDesativarCategoria from './_components/ModalConfirmacaoDesativarCategoria'

type FiltroStatus = 'todas' | 'ativas' | 'inativas'

export default function Categorias() {
  AuthUser()

  const dispatch = useDispatch()
  const [categorias, setCategorias] = useState<Array<SelectValuesType>>([])
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Array<SelectValuesType>>([])
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
      }

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [atualizar])

  useEffect(() => {
    const handleAtualizacao = () => {
      setAtualizar(prev => prev + 1)
    }

    window.addEventListener('categoriasAtualizar', handleAtualizacao)
    
    return () => {
      window.removeEventListener('categoriasAtualizar', handleAtualizacao)
    }
  }, [])

  useEffect(() => {
    const filtrarCategorias = () => {
      switch (filtroStatus) {
        case 'ativas':
          setCategoriasFiltradas(categorias.filter(cat => cat.caativa))
          break
        case 'inativas':
          setCategoriasFiltradas(categorias.filter(cat => !cat.caativa))
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
            className="bg-green-700 hover:bg-green-800 active:bg-green-700"
            onClick={() => {
              dispatch(setLoading(true))
              router.push('/categorias/cadastro')
            }}
          />
        }>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FunnelSimple size={20} />
              <span className="font-medium">Filtrar por:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroStatus('todas')}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                  filtroStatus === 'todas'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroStatus('ativas')}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                  filtroStatus === 'ativas'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ativas
              </button>
              <button
                onClick={() => setFiltroStatus('inativas')}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors ${
                  filtroStatus === 'inativas'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inativas
              </button>
            </div>
          </div>

          {categoriasFiltradas.length > 0 ? (
            categoriasFiltradas.map((categoria: SelectValuesType, index: number) => {
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-6 w-[90%]">
                      <div className="w-[5%]">
                        <SquaresFour
                          size={40}
                          weight="fill"
                          className="text-orange-1000"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-700">
                            {categoria.label}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            categoria.caativa 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {categoria.caativa ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 max-w-[90%] break-words">
                          {categoria.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <ButtonIcon
                        onClick={() => {
                          const objCategoria: CategoriasProblemasType = {
                            cacategoria: categoria.label,
                            cadescricao: categoria.description,
                            cacodigo: categoria.value,
                            caativa: categoria.caativa
                          }
                          dispatch(setCategoria(objCategoria))
                          router.push('/categorias/cadastro')
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer mb-3"
                        icon={<PencilSimple size={24} />}
                      />

                      <ButtonIcon
                        onClick={() => {
                          CLickLabel('modalConfirmarDesativarCategoria')
                          const objCategoria: CategoriasProblemasType = {
                            cacategoria: categoria.label,
                            cadescricao: categoria.description,
                            cacodigo: categoria.value,
                            caativa: categoria.caativa
                          }
                          dispatch(setCategoria(objCategoria))
                        }}
                        className={`p-2 ${
                          categoria.caativa 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        } rounded-full transition-colors cursor-pointer`}
                        icon={categoria.caativa ? <X size={24} /> : <Check size={24} />}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              Nenhuma categoria encontrada!
            </p>
          )}
        </div>
      </BaseLayout>

      <ModalConfirmacaoDesativarCategoria />
    </div>
  )
}
