import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from './Button'
import { ArrowRight, X } from '@phosphor-icons/react'
import { Lightbulb, Clock, User } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import { FeaturesConsultaType } from '@/types/FeaturesType'
import { setLoading } from '@/redux/loading/actions'
import { findAllFeatures } from '@/store/Features'
import { useMemo } from 'react'
import CardFeature from './CardFeature'

export default function ModalAjudaUsuario() {
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const [features, setFeatures] = useState<Array<FeaturesConsultaType>>()
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const consultaFeatures = async () => {
      dispatch(setLoading(true))
      const response = await findAllFeatures()
      if (response != undefined) {
        setFeatures(response.features)
      }

      dispatch(setLoading(false))
    }

    consultaFeatures()
  }, [])

  // Filtro de pesquisa
  const featuresFiltradas = useMemo(() => {
    if (!features) return []
    if (!search.trim()) return features
    const s = search.toLowerCase()
    return features.filter(
      (feature) =>
        feature.fttitulo.toLowerCase().includes(s) ||
        feature.ftdescricao.toLowerCase().includes(s) ||
        feature.usuario.usnome.toLowerCase().includes(s) ||
        feature.ftquando.toLowerCase().includes(s)
    )
  }, [features, search])

  return (
    <Modal
      name="Ajuda e informações"
      htmlFor="modalAjudaUsuario"
      descricao="Aqui você encontra um resumo sobre o funcionamento do nosso sistema. Navegue pelas principais funcionalidades, entenda como utilizá-las e tire o máximo proveito da plataforma."
      loading={loading}>
      <div className="mx-auto">
        {/* Barra de pesquisa */}
        {features && features.length > 0 && (
          <div className="mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por título, descrição, usuário ou data..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder:text-black text-black"
            />
          </div>
        )}

        <div className="max-h-[400px] min-h-[200px] overflow-y-auto px-1">
          {featuresFiltradas && featuresFiltradas.length > 0 ? (
            <div>
              {featuresFiltradas.map(
                (feature: FeaturesConsultaType, index: number) => {
                  return (
                    <CardFeature
                      key={index}
                      ftcodigo={feature.ftcodigo}
                      fttitulo={feature.fttitulo}
                      ftdescricao={feature.ftdescricao}
                      ftquando={feature.ftquando}
                      usuario={feature.usuario}
                      fotosFeatures={feature.fotosFeatures}
                    />
                  )
                }
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Nenhuma feature cadastrada
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center gap-3 mt-16">
        <Button
          title="Fechar"
          className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          iconLeft={<X size={20} />}
          onClick={() => {
            CLickLabel('modalAjudaUsuario')
          }}
        />
      </div>
    </Modal>
  )
}
