'use client'
import React, { useEffect, use, useState } from 'react'
import BaseLayout from '@/templates/BaseLayout'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import { FeaturesConsultaType } from '@/types/FeaturesType'
import CardFeature from '@/components/CardFeature'
import { findFeature } from '@/store/Features'

export default function Feature({
  params
}: {
  params: Promise<{ ftcodigo: string }>
}) {
  const { ftcodigo } = use(params)
  const dispatch = useDispatch()
  const [feature, setFeature] = useState<FeaturesConsultaType>()

  useEffect(() => {
    const consultaFeature = async () => {
      dispatch(setLoading(true))

      const response = await findFeature(ftcodigo)

      if (response != undefined) {
        setFeature(response.feature)
      }

      dispatch(setLoading(false))
    }

    consultaFeature()
  }, [ftcodigo])

  return (
    <div className="min-h-screen bg-gray-1500">
      <BaseLayout
        title={`Feature${feature != null ? ` - ${feature.fttitulo}` : ''}`}
        ajudaUsuario={false}>
        <div className="max-w-6xl mx-auto">
          {feature ? (
            <div className="animate-slide-up">
              <CardFeature
                completa
                ftcodigo={feature.ftcodigo}
                fttitulo={feature.fttitulo}
                ftdescricao={feature.ftdescricao}
                ftquando={feature.ftquando}
                usuario={feature.usuario}
                fotosFeatures={feature.fotosFeatures}
              />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600 col-span-full">
              Nenhuma feature localizada
            </p>
          )}
        </div>
      </BaseLayout>

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
