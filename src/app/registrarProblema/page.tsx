'use client'
import { AuthUser } from '@/services/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import InputComponent from '@/components/Input'
import SelectComponent from '@/components/Select'
import InputFotos from '@/components/InputFotos'
import TextRequired from '@/components/TextRequired'
import {
  ChatTeardropText,
  NavigationArrow,
  Question,
  SquaresFour
} from '@phosphor-icons/react'
import { Button } from '@/components/Button'
import { UsuarioConsultaType } from '@/types/UsuariosType'
import {
  ProblemasCriateType,
  RegistrarProblemaType
} from '@/types/ProblemasType'
import { setLoading } from '@/redux/loading/actions'
import 'leaflet/dist/leaflet.css'
import { exibirDataHoraAtual } from '@/services/obterDataHoraAtual'
import { SelectValuesType } from '@/types/GeneralTypes'
import { getCategoriasAtivas } from '@/store/Categorias'
import { registrarProblema } from '@/store/Problemas'
import Mapa from '@/components/Mapa/Mapa'
import MarkerMapa from '@/components/Mapa/Marker'
import { CLickLabel } from '@/services/clickLabel'
import ModalLegendaCategorias from './_components/ModallegendaCategorias'
import Textarea from '@/components/Textarea'
import BaseLayout from '@/templates/BaseLayout'

export default function RegistrarProblema() {
  AuthUser()

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm<RegistrarProblemaType>({
    defaultValues: {
      decategoria: '',
      deusuario: '',
      dedata: '',
      dedescricao: '',
      edbairro: '',
      edcep: '',
      edcomplemento: '',
      edpontoreferencia: '',
      edestado: '',
      edlatitude: '',
      edlongitude: '',
      edmunicipio: '',
      ednumero: '',
      edrua: '',
      fotos: []
    }
  })
  const dispatch = useDispatch()
  const router = useRouter()
  const user: UsuarioConsultaType = useSelector(
    (state: any) => state.userReducer
  )
  const [primeiraOpcao, setPrimeiraOpcao] = useState<boolean>(false)
  const [localizacaoAtual, setLocalizacaoAtual] = useState<string>('---')
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const [position, setPosition] = useState<[number, number]>()
  const [categorias, setCategorias] = useState<Array<SelectValuesType>>([])

  useEffect(() => {
    const consultarDados = async () => {
      setLocalizacaoAtual('Carregando...')
      dispatch(setLoading(true))
      const response = await getCategoriasAtivas()

      if (response != undefined) {
        setCategorias(response.categorias)
      }

      setPosition([
        user.endereco.municipio.mclatitude,
        user.endereco.municipio.mclongitude
      ])

      atualizarLocalizacao(
        user.endereco.municipio.mclatitude,
        user.endereco.municipio.mclongitude
      )

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [])

  useEffect(() => {
    if (position) {
      atualizarLocalizacao(position[0], position[1])
    }
  }, [position])

  async function onRegistrarProblema(data: RegistrarProblemaType) {
    dispatch(setLoading(true))

    if (data.fotos.length <= 0) {
      dispatch(setLoading(false))
      toast('Selecione ao menos 1 foto!')
      return
    }

    if (user.uscodigo) {
      data.deusuario = user.uscodigo
      data.dedata = exibirDataHoraAtual()

      const objSalvarProblema: ProblemasCriateType = {
        endereco: {
          edrua: data.edrua,
          edestado: data.edestado,
          edmunicipio: data.edmunicipio,
          ednumero: data.ednumero,
          edcomplemento: data.edcomplemento,
          edcep: data.edcep,
          edbairro: data.edbairro,
          edlatitude: latitude,
          edlongitude: longitude,
          edproblema: true,
          edpontoreferencia: data.edpontoreferencia
        },
        problemas: {
          decategoria: data.decategoria,
          dedescricao: data.dedescricao,
          delocalizacao: data.delocalizacao,
          dedata: data.dedata,
          deusuario: user.uscodigo
        },
        fotos: data.fotos
      }

      const response: any = await registrarProblema(objSalvarProblema)

      if (response) {
        toast.success('Problema registrado com sucesso!')
        reset()
        router.push('/home')
      } else {
        dispatch(setLoading(false))
      }
    }

    dispatch(setLoading(false))
  }

  async function atualizarLocalizacao(lat: number, lng: number) {
    try {
      setLocalizacaoAtual('Carregando...')
      dispatch(setLoading(true))
      setLatitude(lat.toString())
      setLongitude(lng.toString())
      setValue('edlatitude', lat.toString())
      setValue('edlongitude', lng.toString())

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await response.json()
      const address = data.address

      const rua = address.road || ''
      const letra = address.quarter || address.block || ''
      const numero = address.house_number || 'S/N'
      const bairro = address.suburb || address.neighbourhood || ''
      const cidade = address.city || address.town || address.village || ''
      const estado = address.state_code || address.state || ''
      const cep = address.postcode || ''

      setValue('edbairro', bairro)
      setValue('edrua', rua)
      setValue('edmunicipio', cidade)
      setValue('edestado', estado)
      setValue('ednumero', numero)
      setValue('edlatitude', latitude)
      setValue('edlongitude', longitude)
      setValue('edcep', cep)

      let enderecoFormatado = `${rua}`

      if (letra) {
        enderecoFormatado += ` ${letra}`
        enderecoFormatado += `, ${numero}`
      }
      if (bairro) {
        enderecoFormatado += `, ${bairro}`
      }
      if (cidade) {
        enderecoFormatado += `, ${cidade}`
      }
      if (estado) {
        enderecoFormatado += ` - ${estado}`
      }

      setLocalizacaoAtual(enderecoFormatado || '---')
    } catch (error) {
      toast.error('Erro ao buscar localização')
      setLocalizacaoAtual('---')
    } finally {
      dispatch(setLoading(false))
    }
  }

  function obterDadosLocalizacao() {
    if (!navigator.geolocation) {
      setLocalizacaoAtual('---')
      dispatch(setLoading(false))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          await atualizarLocalizacao(latitude, longitude)
        } catch (error: any) {
          if (error.code === 1) {
            toast.error('Permissão negada para acessar sua localização.')
          } else if (error.code === 2) {
            toast.error(
              'Localização indisponível no momento. Verifique seu GPS ou conexão.'
            )
          } else if (error.code === 3) {
            toast.error(
              'Tempo limite para obter a localização. Tente novamente.'
            )
          } else {
            toast.error('Erro desconhecido ao obter localização.')
          }

          setLocalizacaoAtual('---')
          dispatch(setLoading(false))
        }
      },
      (error) => {
        if (error.code === 1) {
          toast.error('Permissão negada para acessar sua localização.')
        } else if (error.code === 2) {
          toast.error(
            'Localização indisponível no momento. Verifique seu GPS ou conexão.'
          )
        } else if (error.code === 3) {
          toast.error('Tempo limite para obter a localização. Tente novamente.')
        } else {
          toast.error('Erro desconhecido ao obter localização.')
        }

        setLocalizacaoAtual('---')
        dispatch(setLoading(false))
      }
    )
  }

  function cancelarRegistroProblema() {
    setPosition([-27.1048361, -52.6142228])
    reset()
    setPrimeiraOpcao(false)
  }

  return (
    <div>
      <BaseLayout adicionarItens={false}>
        {primeiraOpcao ? (
          <div>
            <div className="mb-3 -mt-5 bg-gray-1200 p-2 rounded-md">
              <p className="text-white text-center mb-3 text-md font-bold">
                Localização selecionada
              </p>
              <p className="text-white text-center text-lg">
                {localizacaoAtual}
              </p>
            </div>

            {position && (
              <div className="md:h-[300px] h-[200px] relative rounded-lg overflow-hidden">
                <Mapa
                  className="w-full h-full"
                  locAtual={true}
                  position={position}>
                  <MarkerMapa
                    position={position}
                    dragedFunction={(e: any) => {
                      const marker = e.target
                      const newPosition: [number, number] = [
                        marker.getLatLng().lat,
                        marker.getLatLng().lng
                      ]
                      setPosition(newPosition)
                      atualizarLocalizacao(
                        marker.getLatLng().lat,
                        marker.getLatLng().lng
                      )
                    }}
                  />
                </Mapa>
              </div>
            )}

            <div className="space-y-4 mt-2">
              <h2 className="text-gray-600 text-lg font-semibold mb-4">
                Detalhes do Problema
              </h2>

              <InputComponent
                styleLabel="text-gray-600"
                id="edpontoreferencia"
                type="text"
                requiredItem
                className={errors.edpontoreferencia ? 'mb-4' : ''}
                placeholder="Informe um ponto de referência"
                icon={<NavigationArrow size={22} className="text-gray-500" />}
                textLabel="Ponto de Referência"
                {...register('edpontoreferencia', { required: true })}
                textError={errors.edpontoreferencia && <TextRequired />}
                error={errors.edpontoreferencia}
              />

              <Textarea
                styleLabel="text-gray-600"
                id="dedescricao"
                requiredItem
                className={errors.dedescricao ? 'mb-0' : ''}
                placeholder="Informe uma descrição"
                icon={<ChatTeardropText size={22} className="text-gray-500" />}
                textLabel="Descrição"
                {...register('dedescricao', { required: true })}
                textError={errors.dedescricao && <TextRequired />}
                error={errors.dedescricao}
              />

              <SelectComponent
                styleLabel="text-gray-600"
                id="decategoria"
                textLabel="Categoria"
                options={categorias}
                requiredItem
                className={errors.decategoria ? 'mb-4' : ''}
                icon={<SquaresFour size={22} className="text-gray-500" />}
                iconRight={<Question size={22} className="text-gray-500" />}
                iconRightFuntion={() => {
                  CLickLabel('modalLegendaCategorias')
                }}
                {...register('decategoria', { required: true })}
                textError={errors.decategoria && <TextRequired />}
                error={errors.decategoria}
              />

              <div className="mt-4 md:pb-0 pb-32">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-gray-700 font-medium mb-3">
                    Fotos do Problema
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Adicione fotos que mostrem claramente o problema.
                    Recomendamos pelo menos 3 fotos de diferentes ângulos.
                  </p>
                  <InputFotos
                    error={!!errors.fotos}
                    textError={errors.fotos && <TextRequired />}
                    onChange={(novasFotos) => {
                      setValue('fotos', novasFotos, { shouldValidate: true })
                    }}
                    value={watch('fotos')}
                  />
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-md p-4 md:relative md:border-none md:p-0">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
                  <Button
                    title="Cancelar"
                    onClick={cancelarRegistroProblema}
                    className="bg-gray-200 hover:bg-gray-100 active:bg-gray-100 text-gray-700 px-8 py-3 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md w-full md:w-1/2"
                  />
                  <Button
                    title="Salvar Relato"
                    onClick={handleSubmit(onRegistrarProblema)}
                    className="bg-green-700 hover:bg-green-800 active:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md w-full md:w-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-md">
              <h2 className="text-gray-600 text-lg font-semibold mb-6 text-center">
                Você está no local do problema?
              </h2>

              <div className="flex justify-center items-center gap-4">
                <Button
                  title="Sim"
                  onClick={() => {
                    setPrimeiraOpcao(true)
                    dispatch(setLoading(true))
                    obterDadosLocalizacao()
                  }}
                  className="bg-green-700 hover:bg-green-800 active:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                />
                <Button
                  title="Não"
                  onClick={() => {
                    setPrimeiraOpcao(true)
                  }}
                  className="bg-red-700 hover:bg-red-800 active:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </BaseLayout>
      <ModalLegendaCategorias categorias={categorias} />
    </div>
  )
}
