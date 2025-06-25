'use client'
import React, { useEffect, use, useState } from 'react'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { findProblema } from '@/store/Problemas'
import {
  FindProblemaType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import ModalConfirmacaoCancelarProblema from '@/components/ModalConfirmacaoCancelarProblema'
import ModalAjustarRelato from '@/components/ModalAjustarRelato'
import { CLickLabel } from '@/services/clickLabel'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'

export default function Relato({
  params
}: {
  params: Promise<{ decodigo: string }>
}) {
  const { decodigo } = use(params)
  const dispatch = useDispatch()
  const [relato, setRelato] = useState<ProblemaLocalizacaoType>()
  const [problemaSelecionadoCancelar, setProblemaSelecionadoCancelar] =
    useState<ProblemaLocalizacaoType>()

  useEffect(() => {
    const consultaProblema = async () => {
      dispatch(setLoading(true))
      const data: FindProblemaType = {
        decodigo
      }
      const response = await findProblema(data)

      if (response != undefined) {
        setRelato(response.problema)
      }

      dispatch(setLoading(false))
    }

    consultaProblema()
  }, [decodigo])

  return (
    <div className="min-h-screen bg-gray-1500">
      <BaseLayout title={`Relato - ${relato?.categoria.cacategoria}`}>
        <div className="max-w-6xl mx-auto">
          {relato ? (
            <div className="animate-slide-up">
              <CardRelato
                problema={relato}
                onClickAjustarRelato={() => {
                  dispatch(selecionarRelato(relato))
                  setProblemaSelecionadoCancelar(relato)
                  CLickLabel('modalAjusteRelato')
                }}
                onClickCancelarRelato={() => {
                  CLickLabel('modalConfirmacaoCancelarProblema')
                  setProblemaSelecionadoCancelar(relato)
                }}
              />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600 col-span-full">
              Nenhum relato localizado
            </p>
          )}
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
    </div>
  )
}
