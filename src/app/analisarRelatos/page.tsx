'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  AprovarReprovarProblemaType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { aprovarReprovarProblema, getRelatosAnalisar } from '@/store/Problemas'
import toast from 'react-hot-toast'
import CardRelato from '@/components/CardRelato'
import BaseLayout from '@/templates/BaseLayout'
import { exibirDataHoraAtual } from '@/services/obterDataHoraAtual'
import { ChatTeardropText, ListMagnifyingGlass } from '@phosphor-icons/react'
import TextRequired from '@/components/TextRequired'
import InputComponent from '@/components/Input'

export default function AnalisarRelatos() {
  AuthUser()

  const dispatch = useDispatch()
  const [atualizar, setAtualizar] = useState<number>(0)
  const [relatosAnalisar, setRelatosAnalisar] = useState<
    Array<ProblemaLocalizacaoType>
  >([])
  const [motivos, setMotivos] = useState<{ [key: string]: string }>({})
  const [motivosError, setMotivosError] = useState<{ [key: string]: boolean }>(
    {}
  )

  async function onAprovarReprovarProblema(data: AprovarReprovarProblemaType) {
    if (!data.status && !motivos[data.decodigo]) {
      setMotivosError((prev) => ({ ...prev, [data.decodigo]: true }))
      return
    }

    dispatch(setLoading(true))

    const response = await aprovarReprovarProblema(data)

    if (response != undefined) {
      toast.success('Relato revisado com sucesso!')
      dispatch(setLoading(false))
      setAtualizar(atualizar + 1)
      setMotivos((prev) => {
        const newMotivos = { ...prev }
        delete newMotivos[data.decodigo]
        return newMotivos
      })
      setMotivosError((prev) => {
        const newErrors = { ...prev }
        delete newErrors[data.decodigo]
        return newErrors
      })
    }
  }

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))
      const response = await getRelatosAnalisar()
      if (response != undefined) {
        setRelatosAnalisar(response.problemas)
      }
      dispatch(setLoading(false))
    }
    consultarDados()
  }, [atualizar])

  // Card de resumo
  const total = relatosAnalisar.length

  return (
    <BaseLayout title={'Analisar Relatos'}>
      <div className="space-y-6">
        {/* Card de Resumo */}
        <div className="flex justify-center my-6">
          <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition-all max-w-xs w-full">
            <ListMagnifyingGlass size={32} className="text-blue-1000 mb-2" />
            <span className="text-2xl font-bold text-blue-1000">{total}</span>
            <span className="text-sm text-blue-1000">Relatos para análise</span>
          </div>
        </div>

        {/* Lista de Relatos */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-2 md:px-6 py-6">
          {relatosAnalisar.length > 0 ? (
            relatosAnalisar.map(
              (problema: ProblemaLocalizacaoType, index: number) => (
                <div key={index}>
                  <CardRelato
                    problema={problema}
                    aprovarReprovarButtons
                    buttonsAjustarCancelar={false}
                    inputMotivo={
                      <InputComponent
                        styleLabel="text-gray-600"
                        id={`motivo-${problema.decodigo}`}
                        type="text"
                        requiredItem
                        className={
                          motivosError[problema.decodigo] ? 'mb-4' : ''
                        }
                        placeholder="Informe um motivo"
                        onChange={(e) => {
                          setMotivos((prev) => ({
                            ...prev,
                            [problema.decodigo]: e.target.value
                          }))
                          if (e.target.value) {
                            setMotivosError((prev) => ({
                              ...prev,
                              [problema.decodigo]: false
                            }))
                          }
                        }}
                        value={motivos[problema.decodigo] || ''}
                        icon={
                          <ChatTeardropText
                            size={22}
                            className="text-gray-500"
                          />
                        }
                        textLabel="Motivo"
                        textError={
                          motivosError[problema.decodigo] && <TextRequired />
                        }
                        error={motivosError[problema.decodigo]}
                      />
                    }
                    onCLickAprovar={() => {
                      const data: AprovarReprovarProblemaType = {
                        decodigo: problema.decodigo,
                        status: true,
                        motivo: motivos[problema.decodigo] || '',
                        quando: exibirDataHoraAtual()
                      }
                      onAprovarReprovarProblema(data)
                    }}
                    onCLickReprovar={() => {
                      const data: AprovarReprovarProblemaType = {
                        decodigo: problema.decodigo,
                        status: false,
                        motivo: motivos[problema.decodigo] || '',
                        quando: exibirDataHoraAtual()
                      }
                      onAprovarReprovarProblema(data)
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
  )
}
