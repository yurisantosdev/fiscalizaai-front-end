'use client'
import React, { useEffect, use, useState } from 'react'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { findProblema } from '@/store/Problemas'
import {
  FindProblemaType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'

export default function Relato({
  params
}: {
  params: Promise<{ decodigo: string }>
}) {
  const { decodigo } = use(params)

  const [relato, setRelato] = useState<ProblemaLocalizacaoType>()

  useEffect(() => {
    const consultaProblema = async () => {
      const data: FindProblemaType = {
        decodigo
      }
      const response = await findProblema(data)

      if (response != undefined) {
        setRelato(response.problema)
      }
    }

    consultaProblema()
  }, [decodigo])

  return (
    <div className="min-h-screen bg-gray-1500">
      <BaseLayout title={`Relato - ${relato?.categoria.cacategoria}`}>
        <div className="max-w-6xl mx-auto">
          {relato ? (
            <div className="animate-slide-up">
              <CardRelato problema={relato} />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600 col-span-full">
              Nenhum relato localizado
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
