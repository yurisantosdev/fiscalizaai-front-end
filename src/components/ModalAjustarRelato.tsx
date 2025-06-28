import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import toast from 'react-hot-toast'
import InputComponent from './Input'
import InputFotos from './InputFotos'
import TextRequired from './TextRequired'
import Textarea from './Textarea'
import { Button } from './Button'
import Mapa from './Mapa/Mapa'
import MarkerMapa from './Mapa/Marker'
import {
  ChatTeardropText,
  NavigationArrow,
  SquaresFour
} from '@phosphor-icons/react'
import { FormData } from '@/Interfaces/ModalAjudarRelatoInterface'
import { ajustarProblema } from '@/store/Problemas'
import { CLickLabel } from '@/services/clickLabel'
import { ProblemaLocalizacaoType } from '@/types/ProblemasType'

interface ModalAjusteRelatoProps {
  problema: ProblemaLocalizacaoType
}

export default function ModalAjustarRelato({
  problema
}: ModalAjusteRelatoProps) {
  const dispatch = useDispatch()
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [localizacaoAtual, setLocalizacaoAtual] = useState<string>('---')
  const loading = useSelector((state: any) => state.loadingReducer.loading)

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      edpontoreferencia: problema?.localizacao?.edpontoreferencia || '',
      dedescricao: problema?.dedescricao || '',
      fotos:
        problema?.FotosProblemas?.map((foto: any) => ({
          fdfoto: foto.fdfoto
        })) || []
    }
  })

  useEffect(() => {
    const consultarDados = async () => {
      dispatch(setLoading(true))

      setValue(
        'fotos',
        problema?.FotosProblemas?.map((foto: any) => ({
          fdfoto: foto.fdfoto
        })) || []
      )

      if (
        problema.localizacao?.edlatitude &&
        problema.localizacao?.edlongitude
      ) {
        const lat = parseFloat(problema.localizacao.edlatitude)
        const lng = parseFloat(problema.localizacao.edlongitude)
        setPosition([lat, lng])

        atualizarLocalizacao(lat, lng)
      }

      dispatch(setLoading(false))
    }

    consultarDados()
  }, [problema])

  async function atualizarLocalizacao(lat: number, lng: number) {
    try {
      setLocalizacaoAtual('Carregando...')

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
      setValue('edlatitude', lat.toString())
      setValue('edlongitude', lng.toString())
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

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          atualizarLocalizacao(latitude, longitude)
        },
        (error) => {
          toast.error('Erro ao obter localização atual')
        }
      )
    } else {
      toast.error('Geolocalização não suportada')
    }
  }

  async function onAjustarRelatoFunction(data: FormData) {
    if (!problema) {
      return
    }

    dispatch(setLoading(true))

    const dadosAtualizados: any = {
      decodigo: problema.decodigo,
      decategoria: problema.categoria.cacodigo,
      dedescricao: data.dedescricao,
      deusuario: problema.deusuario,
      localizacao: {
        edcodigo: problema.localizacao.edcodigo,
        edlatitude: position[0].toFixed(6),
        edlongitude: position[1].toFixed(6),
        edrua: data.edrua,
        edestado: data.edestado,
        edmunicipio: data.edmunicipio,
        ednumero: data.ednumero,
        edcomplemento: data.edcomplemento,
        edcep: data.edcep,
        edbairro: data.edbairro,
        edpontoreferencia: data.edpontoreferencia
      },
      fotos: data.fotos
    }

    const response = await ajustarProblema(dadosAtualizados)

    if (response != undefined) {
      toast.success('Relato ajustado com sucesso!')
      window.dispatchEvent(new Event('relatoAtualizado'))
      CLickLabel('modalAjusteRelato')
      dispatch(setLoading(false))
    }
  }

  if (!problema) return null

  return (
    <Modal
      htmlFor="modalAjusteRelato"
      name="Ajuste de Relato"
      loading={loading}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-1000 p-4 md:flex md:justify-between md:items-center">
            <div>
              <h2 className="text-white text-lg font-semibold mb-2 flex md:justify-start justify-center items-center gap-2">
                <NavigationArrow size={24} />
                Localização Selecionada
              </h2>
              <p className="text-white/90 text-base break-words md:text-start text-center">
                {localizacaoAtual}
              </p>
            </div>
          </div>

          {position && (
            <div className="md:h-[300px] h-[200px] relative">
              <Mapa
                className="w-full h-full"
                locAtual={true}
                fraseLocalizacaoMapa="Usar minha localização atual"
                position={position}
                onLocationRequest={handleLocationRequest}>
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
        </div>

        <div className="space-y-4">
          <h2 className="text-gray-600 text-lg font-semibold mb-4">
            Detalhes do Problema
          </h2>

          <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-md">
            <SquaresFour size={24} weight="fill" className="text-orange-1000" />
            <div>
              <p className="text-sm font-bold text-gray-500">Categoria</p>
              <p className="text-sm">{problema.categoria.cacategoria}</p>
            </div>
          </div>

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
            className={errors.dedescricao ? 'mb-2' : ''}
            placeholder="Informe uma descrição"
            icon={<ChatTeardropText size={22} className="text-gray-500" />}
            textLabel="Descrição"
            {...register('dedescricao', { required: true })}
            textError={errors.dedescricao && <TextRequired />}
            error={errors.dedescricao}
          />

          <div className="mt-4">
            <InputFotos
              textError={errors.fotos && <TextRequired />}
              onChange={(novasFotos: any) => {
                setValue(
                  'fotos',
                  novasFotos.map((foto: any) => ({ fdfoto: foto })),
                  {
                    shouldValidate: true
                  }
                )
              }}
              value={watch('fotos').map((foto: any) => foto.fdfoto)}
            />
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <Button
              title="Cancelar"
              onClick={() => {
                const modal = document.getElementById('modalAjusteRelato')
                if (modal) {
                  modal.click()
                }
              }}
              className="bg-red-700 hover:bg-red-800 active:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg w-full"
            />
            <Button
              title="Salvar"
              onClick={handleSubmit(onAjustarRelatoFunction)}
              className="bg-green-700 hover:bg-green-800 active:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}
