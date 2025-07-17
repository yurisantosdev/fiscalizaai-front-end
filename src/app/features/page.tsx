'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import BaseLayout from '@/templates/BaseLayout'
import { ButtonIcon } from '@/components/Button'
import { useRouter } from 'next/navigation'
import { Plus, WarningCircle } from '@phosphor-icons/react'
import { resetCategoria } from '@/redux/categoria/actions'
import ModalConfirmacaoDeletar from './_components/ModalConfirmacaoDeletar'
import { FeaturesConsultaType } from '@/types/FeaturesType'
import { findAllFeatures } from '@/store/Features'
import CardFeature from '@/components/CardFeature'

export default function Features() {
  AuthUser()

  const dispatch = useDispatch()
  const [features, setFeatures] = useState<Array<FeaturesConsultaType>>([])
  const [atualizar, setAtualizar] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))
      dispatch(resetCategoria())

      const response = await findAllFeatures()

      if (response != undefined) {
        setFeatures(response.features)
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

    window.addEventListener('featuresAtualizar', handleAtualizacao)

    return () => {
      window.removeEventListener('featuresAtualizar', handleAtualizacao)
    }
  }, [])

  return (
    <div>
      <BaseLayout
        title="Features"
        extraComponentRigth={
          <ButtonIcon
            icon={<Plus size={20} className="text-white" />}
            className="bg-green-700 hover:bg-green-800 active:bg-green-700 transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              dispatch(setLoading(true))
              router.push('/features/cadastro')
            }}
          />
        }>
        <div className="space-y-6">
          {/* Lista de Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.length > 0 ? (
              features.map((feature: FeaturesConsultaType, index: number) => {
                return (
                  <CardFeature
                    key={index}
                    ftcodigo={feature.ftcodigo}
                    fttitulo={feature.fttitulo}
                    ftdescricao={feature.ftdescricao}
                    ftquando={feature.ftquando}
                    usuario={feature.usuario}
                    listagem
                  />
                )
              })
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <WarningCircle
                    size={40}
                    className="text-gray-400 mx-auto mb-2"
                  />
                  <p className="text-gray-500 text-lg">
                    Nenhuma feature cadastrada!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </BaseLayout>

      <ModalConfirmacaoDeletar />

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
