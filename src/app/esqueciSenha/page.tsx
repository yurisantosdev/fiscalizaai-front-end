'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import { useForm } from 'react-hook-form'
import InputComponent from '@/components/Input'
import { Envelope } from '@phosphor-icons/react'
import TextRequired from '@/components/TextRequired'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { validateEmail } from '@/utils/validators'
import toast from 'react-hot-toast'
import { EsqueciSenhaType } from '@/types/UsuariosType'
import { solicitarRecuperacaoSenha } from '@/store/Usuario'
import BaseLayout from '@/templates/BaseLayout'

export default function EsqueciSenha() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<EsqueciSenhaType>({
    defaultValues: {
      email: ''
    }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  async function onEnviarEmail(data: EsqueciSenhaType) {
    dispatch(setLoading(true))
    const response = await solicitarRecuperacaoSenha(data)

    if (response != undefined) {
      toast.success('Email de recuperação enviado com sucesso!')
      router.push('/redefinirSenha')
    } else {
      dispatch(setLoading(false))
    }
  }

  return (
    <BaseLayout
      title="Recuperar Senha"
      buttonVoltar
      styleBase={false}
      menu={false}
      adicionarItens={false}>
      <div className="space-y-6">
        <p className="text-gray-600 text-center mb-6">
          Digite seu email cadastrado para receber as instruções de recuperação
          de senha.
        </p>

        <InputComponent
          id="email"
          type="email"
          placeholder="Informe seu email"
          className="mb-4"
          icon={<Envelope size={22} className="text-gray-500" />}
          textLabel="Email"
          styleLabel="text-gray-600"
          requiredItem
          {...register('email', {
            required: true,
            validate: {
              validEmail: (value) => validateEmail(value) || 'Email inválido'
            }
          })}
          textError={
            errors.email &&
            (errors.email.type === 'validEmail' ? (
              <span className="text-red-500 text-sm">Email inválido</span>
            ) : (
              <TextRequired />
            ))
          }
          error={errors.email}
        />

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit(onEnviarEmail)}
            title="Enviar Email de Recuperação"
            className="bg-orange-1000 hover:bg-orange-900 text-white px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          />
        </div>
      </div>
    </BaseLayout>
  )
}
