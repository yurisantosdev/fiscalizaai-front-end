'use client'
import React, { useEffect, useState, ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import { useForm } from 'react-hook-form'
import { CriarUsuario, CriarUsuarioType } from '@/types/UsuariosType'
import InputComponent from '@/components/Input'
import {
  User,
  Envelope,
  Lock,
  MapPin,
  House,
  Hash,
  MapTrifold,
  Buildings,
  Signpost,
  Compass,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import TextRequired from '@/components/TextRequired'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { formatCEP, consultarCEP } from '@/utils/formatters'
import {
  validateEmail,
  validateFullName,
  validateCEP
} from '@/utils/validators'
import { criarUsuario } from '@/store/Usuario'
import toast from 'react-hot-toast'
import BaseLayout from '@/templates/BaseLayout'

export default function CadastrarUsuario() {
  const router = useRouter()
  const [typePassword, setTypePassword] = useState<'text' | 'password'>(
    'password'
  )
  const [typeConfirmPassword, setTypeConfirmPassword] = useState<
    'text' | 'password'
  >('password')
  const [iconPassword, setIconPassword] = useState<ReactNode>(
    <EyeSlash className="p-1" size={30} />
  )
  const [iconConfirmPassword, setIconConfirmPassword] = useState<ReactNode>(
    <EyeSlash className="p-1" size={30} />
  )
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CriarUsuarioType>({
    defaultValues: {
      usnome: '',
      usemail: '',
      ussenha: '',
      confirmarSenha: '',
      usendereco: '',
      edrua: '',
      edestado: '',
      edmunicipio: '',
      ednumero: '',
      edcomplemento: '',
      edpontoreferencia: '',
      edcep: '',
      edbairro: '',
      edlatitude: '',
      edlongitude: '',
      edproblema: false
    }
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  const cep = watch('edcep')

  useEffect(() => {
    if (cep) {
      const cepFormatado = formatCEP(cep)
      setValue('edcep', cepFormatado)

      if (validateCEP(cepFormatado)) {
        consultarCEP(cepFormatado).then(data => {
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

  async function onCadastrarUsuario(data: CriarUsuarioType) {
    dispatch(setLoading(true))

    const objCriarUsuario: CriarUsuario = {
      usuario: {
        usnome: data.usnome,
        usemail: data.usemail,
        ussenha: data.ussenha
      },
      endereco: {
        edrua: data.edrua,
        edestado: data.edestado,
        edmunicipio: data.edmunicipio,
        ednumero: data.ednumero,
        edcomplemento: data.edcomplemento,
        edpontoreferencia: data.edpontoreferencia,
        edcep: data.edcep,
        edbairro: data.edbairro,
        edlatitude: data.edlatitude,
        edlongitude: data.edlongitude,
        edproblema: false
      }
    }

    const response = await criarUsuario(objCriarUsuario)

    if (response != undefined) {
      toast.success('Cadastro realizado com sucesso!')
      reset()
      router.push('/')
    } else {
      dispatch(setLoading(false))
    }
  }

  return (
    <BaseLayout
      title=" Criar Nova Conta"
      buttonVoltar
      styleBase={false}
      menu={false}
      adicionarItens={false}
    >
      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h2 className="text-gray-600 text-lg font-semibold mb-4">
          Dados Pessoais
        </h2>

        <InputComponent
          id="usnome"
          type="text"
          placeholder="Informe seu nome"
          className="mb-4"
          icon={<User size={22} className="text-gray-500" />}
          textLabel="Nome completo"
          styleLabel="text-gray-600"
          requiredItem
          {...register('usnome', {
            required: true,
            validate: {
              validName: value => validateFullName(value) || 'Nome inválido'
            }
          })}
          textError={
            errors.usnome &&
            (errors.usnome.type === 'validName' ? (
              <span className="text-red-500 text-sm">Nome inválido</span>
            ) : (
              <TextRequired />
            ))
          }
          error={errors.usnome}
        />

        <InputComponent
          id="usemail"
          type="email"
          placeholder="Informe seu email"
          className="mb-4"
          icon={<Envelope size={22} className="text-gray-500" />}
          textLabel="Email"
          styleLabel="text-gray-600"
          requiredItem
          {...register('usemail', {
            required: true,
            validate: {
              validEmail: value => validateEmail(value) || 'Email inválido'
            }
          })}
          textError={
            errors.usemail &&
            (errors.usemail.type === 'validEmail' ? (
              <span className="text-red-500 text-sm">Email inválido</span>
            ) : (
              <TextRequired />
            ))
          }
          error={errors.usemail}
        />

        <InputComponent
          id="ussenha"
          type={typePassword}
          placeholder="Informe sua senha"
          className="mb-4"
          icon={<Lock size={22} className="text-gray-500" />}
          textLabel="Senha"
          styleLabel="text-gray-600"
          requiredItem
          buttonRight={iconPassword}
          onClickButton={() => {
            if (typePassword === 'password') {
              setTypePassword('text')
              setIconPassword(<Eye className="p-1" size={30} />)
            } else {
              setTypePassword('password')
              setIconPassword(<EyeSlash className="p-1" size={30} />)
            }
          }}
          {...register('ussenha', { required: true })}
          textError={
            errors.ussenha &&
            (errors.ussenha.type === 'validPassword' ? (
              <span className="text-red-500 text-sm">
                A senha deve ter no mínimo 8 caracteres, uma letra maiúscula,
                uma minúscula e um número
              </span>
            ) : (
              <TextRequired />
            ))
          }
          error={errors.ussenha}
        />

        <InputComponent
          id="confirmarSenha"
          type={typeConfirmPassword}
          placeholder="Confirme sua senha"
          className="mb-4"
          icon={<Lock size={22} className="text-gray-500" />}
          textLabel="Confirmar Senha"
          styleLabel="text-gray-600"
          requiredItem
          buttonRight={iconConfirmPassword}
          onClickButton={() => {
            if (typeConfirmPassword === 'password') {
              setTypeConfirmPassword('text')
              setIconConfirmPassword(<Eye className="p-1" size={30} />)
            } else {
              setTypeConfirmPassword('password')
              setIconConfirmPassword(<EyeSlash className="p-1" size={30} />)
            }
          }}
          {...register('confirmarSenha', {
            required: true,
            validate: value =>
              value === watch('ussenha') || 'As senhas não coincidem'
          })}
          textError={
            errors.confirmarSenha &&
            (errors.confirmarSenha.type === 'validate' ? (
              <span className="text-red-500 text-sm">
                As senhas não coincidem
              </span>
            ) : (
              <TextRequired />
            ))
          }
          error={errors.confirmarSenha}
        />
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h2 className="text-gray-600 text-lg font-semibold mb-4">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputComponent
            id="edcep"
            type="text"
            placeholder="Informe o CEP"
            icon={<MapPin size={22} className="text-gray-500" />}
            textLabel="CEP"
            styleLabel="text-gray-600"
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
            icon={<House size={22} className="text-gray-500" />}
            textLabel="Rua"
            styleLabel="text-gray-600"
            requiredItem
            {...register('edrua', { required: true })}
            textError={errors.edrua && <TextRequired className="mt-1" />}
            error={errors.edrua}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputComponent
            id="ednumero"
            type="text"
            placeholder="Número"
            textLabel="Número"
            styleLabel="text-gray-600"
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
            textLabel="Bairro"
            styleLabel="text-gray-600"
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
            textLabel="Complemento"
            styleLabel="text-gray-600"
            icon={<Signpost size={22} className="text-gray-500" />}
            {...register('edcomplemento')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputComponent
            id="edmunicipio"
            type="text"
            placeholder="Município"
            textLabel="Município"
            styleLabel="text-gray-600"
            icon={<Buildings size={22} className="text-gray-500" />}
            requiredItem
            {...register('edmunicipio', { required: true })}
            textError={errors.edmunicipio && <TextRequired className="mt-1" />}
            error={errors.edmunicipio}
          />

          <InputComponent
            id="edestado"
            type="text"
            placeholder="Estado"
            textLabel="Estado"
            styleLabel="text-gray-600"
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
          textLabel="Ponto de referência"
          styleLabel="text-gray-600"
          icon={<MapPin size={22} className="text-gray-500" />}
          {...register('edpontoreferencia')}
        />
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleSubmit(onCadastrarUsuario)}
          title="Criar Conta"
          className="bg-orange-1000 hover:bg-orange-900 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        />
      </div>
    </BaseLayout>
  )
}
