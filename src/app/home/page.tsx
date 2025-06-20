'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import DadosUsuario from './_components/DadosUsuario'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import Mapa from '@/components/Mapa/Mapa'
import {
  getMeusRelatos,
  getProblemasLocalizacaoUsuario
} from '@/store/Problemas'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import MarkerMapa from '@/components/Mapa/Marker'
import {
  ConsultaProblemasLocalizacaoUsuarioType,
  ProblemaLocalizacaoType
} from '@/types/ProblemasType'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Plus } from '@phosphor-icons/react'
import BaseLayout from '@/templates/BaseLayout'
import CardRelato from '@/components/CardRelato'
import { CLickLabel } from '@/services/clickLabel'
import { selecionarRelato } from '@/redux/relatoSelecionado/actions'
import ModalConfirmacaoCancelarProblema from '@/components/ModalConfirmacaoCancelarProblema'

export default function HomePage() {
  AuthUser()
  const router = useRouter()
  const [position, setPosition] = useState<[number, number]>([
    -27.1048361, -52.6142228
  ])
  const dispatch = useDispatch()
  const [problemas, setProblemas] = useState<Array<any>>([])
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [meusRelatos, setMeusRelatos] = useState<
    Array<ProblemaLocalizacaoType>
  >([])
  const [filtroStatus, setFiltroStatus] = useState<string>('CORRIGIR')
  const [problemaSelecionadoCancelar, setProblemaSelecionadoCancelar] =
    useState<ProblemaLocalizacaoType>()

  useEffect(() => {
    if (user.uscodigo) {
      dispatch(setLoading(true))

      const consultaDados = async () => {
        const responseProblemasLocalizacao =
          await getProblemasLocalizacaoUsuario({
            uscodigo: user.uscodigo
          })

        if (responseProblemasLocalizacao != undefined) {
          setProblemas(responseProblemasLocalizacao.problemas)
        }

        const obj: ConsultaProblemasLocalizacaoUsuarioType = {
          uscodigo: user.uscodigo
        }

        const responseMeusRelatos = await getMeusRelatos(obj)

        if (responseMeusRelatos != undefined) {
          setMeusRelatos(responseMeusRelatos.problemas)
        }

        dispatch(setLoading(false))
      }

      setPosition([
        user.endereco.municipio.mclatitude,
        user.endereco.municipio.mclongitude
      ])

      consultaDados()
    } else {
      dispatch(setLoading(false))
    }
  }, [user])

  useEffect(() => {
    const handleRelatoAtualizado = async () => {
      if (user.uscodigo) {
        dispatch(setLoading(true))

        const responseProblemasLocalizacao =
          await getProblemasLocalizacaoUsuario({
            uscodigo: user.uscodigo
          })

        if (responseProblemasLocalizacao != undefined) {
          setProblemas(responseProblemasLocalizacao.problemas)
        }

        const obj: ConsultaProblemasLocalizacaoUsuarioType = {
          uscodigo: user.uscodigo
        }

        const responseMeusRelatos = await getMeusRelatos(obj)

        if (responseMeusRelatos != undefined) {
          setMeusRelatos(responseMeusRelatos.problemas)
        }

        dispatch(setLoading(false))
      }
    }

    window.addEventListener('relatoAtualizado', handleRelatoAtualizado)

    return () => {
      window.removeEventListener('relatoAtualizado', handleRelatoAtualizado)
    }
  }, [user.uscodigo])

  const relatosFiltrados = meusRelatos.filter((relato) =>
    filtroStatus === 'TODOS' ? true : relato.destatus === filtroStatus
  )

  return (
    <span>
      <BaseLayout>
        <DadosUsuario />

        {relatosFiltrados.length > 0 && (
          <div className="mt-5 mb-5 max-h-[500px] overflow-x-scroll">
            <div className="space-y-4">
              <div>
                <p className="text-center text-lg font-bold text-gray-600 mb-2">
                  Relatos com necessidade de correção
                </p>
                {relatosFiltrados.map(
                  (relato: ProblemaLocalizacaoType, index: number) => {
                    return (
                      <CardRelato
                        resumido
                        key={index}
                        problema={relato}
                        onClickAjustarRelato={() => {
                          dispatch(selecionarRelato(relato))
                          CLickLabel('modalAjusteRelato')
                        }}
                        onClickCancelarRelato={() => {
                          CLickLabel('modalConfirmacaoCancelarProblema')
                          setProblemaSelecionadoCancelar(relato)
                        }}
                      />
                    )
                  }
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-gray-600 md:text-lg text-md font-semibold text-center mb-3">
            Situações na sua área e contribuições suas
          </h2>

          <div className="w-full mb-2">
            <Button
              title="Registrar Problema"
              iconLeft={<Plus size={20} />}
              onClick={() => router.push('/registrarProblema')}
              className="bg-orange-1000 hover:bg-orange-1000/80 active:bg-orange-1000 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2 w-full"
            />
          </div>

          <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
            <Mapa
              className="w-full h-full"
              locAtual={false}
              position={position}>
              <MarkerMapa
                tipoIcone="Casa"
                childrenPop={
                  <div>
                    <div className="flex justify-start items-center gap-2 mt-2">
                      <span className="font-light text-sm">
                        {user.endereco.edrua},
                      </span>

                      <span className="font-light text-sm">
                        {user.endereco.municipio.mcmunicipio} -
                      </span>

                      <span className="font-light text-sm">
                        {user.endereco.estado.essigla}
                      </span>
                    </div>
                  </div>
                }
                position={[
                  user.localizacaoCasaUsuario.latitude,
                  user.localizacaoCasaUsuario.longitude
                ]}
              />

              {problemas.map(
                (problema: ProblemaLocalizacaoType, index: number) => {
                  return (
                    <div key={index}>
                      <MarkerMapa
                        tipoIcone={problema.categoria.cacategoria}
                        childrenPop={
                          <div>
                            <span className="block font-bold text-lg">
                              {problema.categoria.cacategoria}
                            </span>

                            <span className="font-light text-sm">
                              {problema.categoria.cadescricao}
                            </span>

                            <div className="flex justify-start items-center gap-2 mt-2">
                              <span className="font-light text-sm">
                                {problema.localizacao.edrua},
                              </span>

                              <span className="font-light text-sm">
                                {problema.localizacao.edbairro}
                              </span>
                            </div>
                          </div>
                        }
                        position={[
                          problema.localizacao.edlatitude,
                          problema.localizacao.edlongitude
                        ]}
                      />
                    </div>
                  )
                }
              )}
            </Mapa>
          </div>
        </div>
      </BaseLayout>

      {problemaSelecionadoCancelar && (
        <ModalConfirmacaoCancelarProblema
          decodigo={problemaSelecionadoCancelar.decodigo}
        />
      )}
    </span>
  )
}
