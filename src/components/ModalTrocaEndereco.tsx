import React, { useEffect } from 'react'
import Modal from './Modal'
import { useDispatch, useSelector } from 'react-redux'
import {
  Buildings,
  Check,
  Compass,
  Hash,
  House,
  MapPin,
  MapTrifold,
  Signpost,
  X
} from '@phosphor-icons/react'
import TextRequired from './TextRequired'
import InputComponent from '@/components/Input'
import { validateCEP } from '@/utils/validators'
import { useForm } from 'react-hook-form'
import { TrocarEnderecoUsuarioType } from '@/types/UsuariosType'
import { CLickLabel } from '@/services/clickLabel'
import { Button } from './Button'
import { consultarCEP, formatCEP } from '@/utils/formatters'
import { resetEndereco } from '@/redux/endereco/actions'
import { atualizarEndereco } from '@/store/Usuario'
import toast from 'react-hot-toast'
import { setLoading } from '@/redux/loading/actions'
import { logoutUser } from '@/redux/user/actions'

export default function ModalTrocaEndereco() {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors }
  } = useForm<TrocarEnderecoUsuarioType>({
    defaultValues: {
      edbairro: '',
      edcep: '',
      edcomplemento: '',
      edestado: '',
      edlatitude: '',
      edlongitude: '',
      edmunicipio: '',
      ednumero: '',
      edpontoreferencia: '',
      edrua: '',
      uscodigo: ''
    }
  })
  const loading = useSelector((state: any) => state.loadingReducer.loading)
  const dispatch = useDispatch()
  const cep = watch('edcep')
  const endereco: TrocarEnderecoUsuarioType = useSelector(
    (state: any) => state.enderecoReducer
  )
  async function onTrocarEndereco(data: TrocarEnderecoUsuarioType) {
    dispatch(setLoading(true))
    const response = await atualizarEndereco(data)

    if (response != undefined) {
      toast.success('Endereço atualizado com sucesso!')
      CLickLabel('modalTrocarEndereco')
      dispatch(logoutUser())
    }

    dispatch(setLoading(false))
  }

  useEffect(() => {
    if (endereco && endereco.edcep) {
      setValue('edrua', endereco.edrua)
      setValue('edcep', formatCEP(endereco.edcep))
      setValue('edbairro', endereco.edbairro)
      setValue('edcomplemento', endereco.edcomplemento)
      setValue('ednumero', endereco.ednumero)
      setValue('edpontoreferencia', endereco.edpontoreferencia)
      setValue('edcomplemento', endereco.edcomplemento)
      setValue('uscodigo', endereco.uscodigo)
      setValue('edcodigo', endereco.edcodigo)
    }
  }, [endereco])

  useEffect(() => {
    if (cep) {
      const cepFormatado = formatCEP(cep)
      setValue('edcep', cepFormatado)

      if (validateCEP(cepFormatado)) {
        consultarCEP(cepFormatado).then((data) => {
          if (data) {
            setValue('edrua', data.logradouro)
            setValue('edbairro', data.bairro)
            setValue('edmunicipio', data.localidade)
            setValue('edestado', data.uf)
          }
        })
      }
    }
  }, [cep, setValue])

  return (
    <Modal
      name="Troca de endereço"
      htmlFor="modalTrocarEndereco"
      loading={loading}
      functioReset={() => {
        reset()
      }}>
      <div>
        <div className="space-y-6">
          <h2 className="text-lg text-gray-700 font-semibold mb-4 flex items-center">
            <MapPin size={24} className="text-orange-1000 mr-2" />
            Endereço
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputComponent
              id="edcep"
              type="text"
              placeholder="Informe o CEP"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              icon={<MapPin size={22} className="text-gray-500" />}
              textLabel="CEP"
              styleLabel="text-gray-700 font-medium"
              requiredItem
              maxLength={9}
              {...register('edcep', {
                required: true,
                validate: {
                  validCEP: (value: any) => validateCEP(value) || 'CEP inválido'
                }
              })}
              textError={
                errors.edcep &&
                (errors.edcep.type === 'validCEP' ? (
                  <span className="text-red-500 text-sm">CEP inválido</span>
                ) : (
                  <TextRequired className="mt-1" />
                ))
              }
              error={errors.edcep}
            />

            <InputComponent
              id="edrua"
              type="text"
              placeholder="Informe a rua"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              icon={<House size={22} className="text-gray-500" />}
              textLabel="Rua"
              styleLabel="text-gray-700 font-medium"
              requiredItem
              {...register('edrua', { required: true })}
              textError={errors.edrua && <TextRequired className="mt-1" />}
              error={errors.edrua}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputComponent
              id="ednumero"
              type="text"
              placeholder="Número"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              textLabel="Número"
              styleLabel="text-gray-700 font-medium"
              icon={<Hash size={22} className="text-gray-500" />}
              requiredItem
              {...register('ednumero', { required: true })}
              textError={errors.ednumero && <TextRequired className="mt-1" />}
              error={errors.ednumero}
            />

            <InputComponent
              id="edbairro"
              type="text"
              placeholder="Bairro"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              textLabel="Bairro"
              styleLabel="text-gray-700 font-medium"
              icon={<MapTrifold size={22} className="text-gray-500" />}
              requiredItem
              {...register('edbairro', { required: true })}
              textError={errors.edbairro && <TextRequired className="mt-1" />}
              error={errors.edbairro}
            />

            <InputComponent
              id="edcomplemento"
              type="text"
              placeholder="Complemento"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              textLabel="Complemento"
              styleLabel="text-gray-700 font-medium"
              icon={<Signpost size={22} className="text-gray-500" />}
              {...register('edcomplemento')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputComponent
              id="edmunicipio"
              type="text"
              disabled
              placeholder="Município"
              className="w-full bg-zinc-300 cursor-not-allowed text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              textLabel="Município"
              styleLabel="text-gray-700 font-medium"
              icon={<Buildings size={22} className="text-gray-500" />}
              requiredItem
              {...register('edmunicipio', { required: true })}
              textError={
                errors.edmunicipio && <TextRequired className="mt-1" />
              }
              error={errors.edmunicipio}
            />

            <InputComponent
              id="edestado"
              type="text"
              disabled
              placeholder="Estado"
              className="w-full bg-zinc-300 cursor-not-allowed text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
              textLabel="Estado"
              styleLabel="text-gray-700 font-medium"
              icon={<Compass size={22} className="text-gray-500" />}
              requiredItem
              {...register('edestado', { required: true })}
              textError={errors.edestado && <TextRequired className="mt-1" />}
              error={errors.edestado}
            />
          </div>

          <InputComponent
            id="edpontoreferencia"
            type="text"
            placeholder="Ponto de referência"
            className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50"
            textLabel="Ponto de referência"
            styleLabel="text-gray-700 font-medium"
            icon={<MapPin size={22} className="text-gray-500" />}
            {...register('edpontoreferencia')}
          />
        </div>

        <div className="flex justify-center items-center gap-3 mt-5">
          <Button
            title="Cancelar"
            className="w-full m-auto bg-red-700 hover:bg-red-700/80 active:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            iconLeft={<X size={20} />}
            onClick={() => {
              reset()
              dispatch(resetEndereco())
              CLickLabel('modalTrocarEndereco')
            }}
          />

          <Button
            title="Salvar"
            className="w-full m-auto bg-green-700 hover:bg-green-700/80 active:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            iconLeft={<Check size={20} />}
            onClick={handleSubmit(onTrocarEndereco)}
          />
        </div>
      </div>
    </Modal>
  )
}
