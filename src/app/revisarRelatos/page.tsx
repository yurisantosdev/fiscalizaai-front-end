'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ConsultaProblemasLocalizacaoUsuarioType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { getRelatosRevisar } from '@/store/Problemas'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { ListMagnifyingGlass } from '@phosphor-icons/react'
import { CLickLabel } from '@/services/clickLabel'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'
import ModalAjustarRelato from '@/components/ModalAjustarRelato'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import ModalConfirmacaoCancelarProblema from '@/components/ModalConfirmacaoCancelarProblema'

export default function RevisarRelatos() {
  AuthUser()

  const dispatch = useDispatch()
  const [atualizar, setAtualizar] = useState<number>(0)
  const [relatosRevisar, setRelatosRevisar] = useState<
    Array<ProblemaLocalizacaoType>
  >([])
  const [problemaSelecionadoCancelar, setProblemaSelecionadoCancelar] =
    useState<ProblemaLocalizacaoType>()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )

  useEffect(() => {
    const handleRelatoAtualizado = async () => {
      if (user.uscodigo) {
        dispatch(setLoading(true))
        const data: ConsultaProblemasLocalizacaoUsuarioType = {
          uscodigo: user.uscodigo
        }

        const response = await getRelatosRevisar(data)

        if (response != undefined) {
          setRelatosRevisar(response.problemas)
        }
        dispatch(setLoading(false))
      }
    }

    handleRelatoAtualizado()

    window.addEventListener('relatoAtualizado', handleRelatoAtualizado)

    return () => {
      window.removeEventListener('relatoAtualizado', handleRelatoAtualizado)
    }
  }, [user.uscodigo, atualizar])

  const total = relatosRevisar.length

  return (
    <>
      <BaseLayout title={'Revisar Relatos'}>
        <div className="space-y-6">
          {/* Card de Resumo */}
          <div className="flex justify-center my-6">
            <div className="bg-red-100 text-red-800 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all max-w-xs w-full">
              <ListMagnifyingGlass size={32} className="text-red-800 mb-2" />
              <span className="text-2xl font-bold text-red-800">{total}</span>
              <span className="text-sm text-red-800">Relatos para revisar</span>
            </div>
          </div>

          {/* Lista de Relatos */}
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-2 md:px-6 py-6">
            {relatosRevisar.length > 0 ? (
              relatosRevisar.map(
                (relato: ProblemaLocalizacaoType, index: number) => (
                  <div key={index} className="animate-slide-up">
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
                )
              )
            ) : (
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <p className="text-gray-700 text-lg">
                  Nenhum relato novo para análise!
                </p>
              </div>
            )}
          </div>
        </div>
      </BaseLayout>

      {problemaSelecionadoCancelar && (
        <ModalAjustarRelato problema={problemaSelecionadoCancelar} />
      )}

      {problemaSelecionadoCancelar && (
        <ModalConfirmacaoCancelarProblema
          decodigo={problemaSelecionadoCancelar.decodigo}
        />
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
    </>
  )
}
