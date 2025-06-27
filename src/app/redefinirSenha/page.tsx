'use client'
import React, { useEffect, useState, ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loading/actions'
import { useForm } from 'react-hook-form'
import InputComponent from '@/components/Input'
import { Key, Lock, Eye, EyeSlash } from '@phosphor-icons/react'
import TextRequired from '@/components/TextRequired'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import toast from 'react-hot-toast'
import { RedefinirSenhaType } from '@/types/UsuariosType'
import { redefinirSenha } from '@/store/Usuario'
import BaseLayout from '@/templates/BaseLayout'

export default function RedefinirSenha() {
  const router = useRouter()
  const [typeNovaSenha, setTypeNovaSenha] = useState<'text' | 'password'>(
    'password'
  )
  const [typeConfirmarSenha, setTypeConfirmarSenha] = useState<
    'text' | 'password'
  >('password')
  const [iconNovaSenha, setIconNovaSenha] = useState<ReactNode>(
    <EyeSlash className="p-1" size={30} />
  )
  const [iconConfirmarSenha, setIconConfirmarSenha] = useState<ReactNode>(
    <EyeSlash className="p-1" size={30} />
  )
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors }
  } = useForm<RedefinirSenhaType>({
    defaultValues: {
      codigo: '',
      novaSenha: '',
      confirmarSenha: ''
    }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(false))
  }, [])

  async function onRedefinirSenha(data: RedefinirSenhaType) {
    dispatch(setLoading(true))
    const response = await redefinirSenha(data)

    if (response != undefined) {
      toast.success('Senha redefinida com sucesso!')
      router.push('/')
    } else {
      dispatch(setLoading(false))
    }
  }

  return (
    <BaseLayout
      title="Redefinir Senha"
      description="Enviamos um código de verificação para o e-mail cadastrado. Insira o código abaixo para continuar com a redefinição da sua senha."
      buttonVoltar
      styleBase={false}
      menu={false}
      adicionarItens={false}>
      <div className="w-full max-w-md m-auto overflow-hidden animate-fade-in-up">
        <div className="p-8">
          <div className="space-y-6">
            <InputComponent
              id="codigo"
              type="text"
              placeholder="Digite o código de 6 dígitos"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50 mb-5"
              icon={<Key size={22} className="text-gray-500" />}
              textLabel="Código de Recuperação"
              styleLabel="text-gray-700 font-medium"
              requiredItem
              maxLength={6}
              {...register('codigo', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'O código deve ter 6 dígitos'
                },
                maxLength: {
                  value: 6,
                  message: 'O código deve ter 6 dígitos'
                },
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'Digite apenas números'
                }
              })}
              textError={
                errors.codigo &&
                (errors.codigo.type === 'minLength' ||
                errors.codigo.type === 'maxLength' ? (
                  <span className="text-red-500 text-sm">
                    O código deve ter 6 dígitos
                  </span>
                ) : errors.codigo.type === 'pattern' ? (
                  <span className="text-red-500 text-sm">
                    Digite apenas números
                  </span>
                ) : (
                  <TextRequired />
                ))
              }
              error={errors.codigo}
            />

            <InputComponent
              id="novaSenha"
              type={typeNovaSenha}
              placeholder="Digite sua nova senha"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50 mb-5"
              icon={<Lock size={22} className="text-gray-500" />}
              textLabel="Nova Senha"
              styleLabel="text-gray-700 font-medium"
              requiredItem
              buttonRight={iconNovaSenha}
              onClickButton={() => {
                if (typeNovaSenha === 'password') {
                  setTypeNovaSenha('text')
                  setIconNovaSenha(
                    <Eye
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      size={30}
                    />
                  )
                } else {
                  setTypeNovaSenha('password')
                  setIconNovaSenha(
                    <EyeSlash
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      size={30}
                    />
                  )
                }
              }}
              {...register('novaSenha', { required: true })}
              textError={
                errors.novaSenha &&
                (errors.novaSenha.type === 'minLength' ? (
                  <span className="text-red-500 text-sm">
                    A senha deve ter no mínimo 6 caracteres
                  </span>
                ) : errors.novaSenha.type === 'pattern' ? (
                  <span className="text-red-500 text-sm">
                    A senha deve conter letras e números
                  </span>
                ) : (
                  <TextRequired />
                ))
              }
              error={errors.novaSenha}
            />

            <InputComponent
              id="confirmarSenha"
              type={typeConfirmarSenha}
              placeholder="Confirme sua nova senha"
              className="w-full bg-gray-50 text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-orange-1000/50 mb-5"
              icon={<Lock size={22} className="text-gray-500" />}
              textLabel="Confirmar Senha"
              styleLabel="text-gray-700 font-medium"
              requiredItem
              buttonRight={iconConfirmarSenha}
              onClickButton={() => {
                if (typeConfirmarSenha === 'password') {
                  setTypeConfirmarSenha('text')
                  setIconConfirmarSenha(
                    <Eye
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      size={30}
                    />
                  )
                } else {
                  setTypeConfirmarSenha('password')
                  setIconConfirmarSenha(
                    <EyeSlash
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      size={30}
                    />
                  )
                }
              }}
              {...register('confirmarSenha', {
                required: true,
                validate: (value) =>
                  value === watch('novaSenha') || 'As senhas não coincidem'
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

            <Button
              onClick={handleSubmit(onRedefinirSenha)}
              title="Redefinir Senha"
              className="w-full bg-orange-1000 hover:bg-orange-900 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg font-medium mt-6"
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
